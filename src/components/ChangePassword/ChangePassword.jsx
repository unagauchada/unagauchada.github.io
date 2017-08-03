import React from "react"
import firebase from "firebase"
import { connect } from "react-redux"
import Paper from "react-md/lib/Papers"
import Button from "react-md/lib/Buttons/Button"
import TextField from "react-md/lib/TextFields"
import { userSelector } from "../../redux/getters"

import MainPage from "../MainPage"
import UserAvatar from "../UserAvatar"
import { app } from "../../libs/db.js"
import "./ChangePassword.scss"

@connect(state => ({ user: userSelector(state) }))
class ChangePassword extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      password: "",
      newPassword: "",
      error: null,
      next: true
    }
  }

  handleChange = property => value => {
    this.setState({
      [property]: value,
      error: null
    })
  }

  next = () => (this.state.next ? this.reSubmit() : this.doChange())

  reSubmit = () => {
    let credential = firebase.auth.EmailAuthProvider.credential(
      this.props.user.email,
      this.state.password
    )
    this.props.user
      .reauthenticateWithCredential(credential)
      .then(_ =>
        this.setState({
          next: false,
          error: null,
          password: "",
          newPassword: ""
        })
      )
      .catch(error => this.setState({ error }))
  }

  doChange = () => {
    if (this.state.newPassword.length < 6) {
      this.setState({ error: { code: "auth/weak-password" } })
      return
    }
    this.props.user
      .updatePassword(this.state.newPassword)
      .then(this.props.history.push("/"))
      .catch(error => this.setState({ error }))
  }

  getError = () => {
    if (!this.state.error) {
      return null
    }

    switch (this.state.error.code) {
      case "auth/user-not-found":
        return "No existe el Usuario"
      case "auth/user-disabled":
        return "El usuario no esta habilitado"
      case "auth/user-mismatch":
        return "Las credenciales no corresponden a este usuario"

      case "auth/weak-password":
        return "La contraseña debe tener al menos 6 caractéres"
      case "auth/wrong-password":
        return "Contraseña incorrecta"

      case "auth/requires-recent-login":
        return "El tiempo para esta transacción expiró."

      case "auth/invalid-credential":
        return "Credenciales inválidas"
      case "auth/invalid-email":
        return "Dirección de email inválida"
      case "auth/invalid-verification-code":
        return "Código de verificación inválido"
      case "auth/invalid-verification-id":
        return "Id de verificación inválido"
      default:
        return this.state.error.message
    }
  }

  render = () => {
    return (
      <MainPage>
        <Paper z-depth={2} className="changePassword">
          <h1>
            {this.props.user.displayName}
          </h1>
          <div className="bar">
            <UserAvatar url={this.props.user.photoURL} />
            <span>
              {this.props.user.email}
            </span>
          </div>

          {this.state.next
            ? <div>
                <p>Debes verificar tu identidad para poder continuar</p>
                <TextField
                  id="password"
                  label="Contraseña"
                  type="password"
                  fullWidth={true}
                  value={this.state.password}
                  onChange={this.handleChange("password")}
                  error={this.state.error}
                  errorText={this.getError()}
                />
              </div>
            : <div>
                <h3>Ingrese la nueva Contraseña</h3>
                <TextField
                  id="newPassword"
                  label="Contraseña Nueva"
                  type="password"
                  fullWidth={true}
                  value={this.state.newPassword}
                  onChange={this.handleChange("newPassword")}
                  error={this.state.error}
                  errorText={this.getError()}
                />
              </div>}

          <footer>
            <Button raised label="Aceptar" primary onClick={this.next} />
          </footer>
        </Paper>
      </MainPage>
    )
  }
}

export default ChangePassword
