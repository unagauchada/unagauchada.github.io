// @flow

import React from "react"
import { Redirect } from "react-router-dom"
import _ from "lodash"
import Paper from "react-md/lib/Papers"
import Button from "react-md/lib/Buttons/Button"
import TextField from "react-md/lib/TextFields"
import SelectField from "react-md/lib/SelectFields"
import DatePicker from "react-md/lib/Pickers/DatePickerContainer"
import firebase from "firebase"
import rootRef, { app } from "../../libs/db"
import "./Signup.scss"

type State = {
  email: string,
  password: string,
  name: string,
  lastname: string,
  phone: string,
  city: any,
  birthdate: Date,
  error: any,
  done: boolean,
  stateItems: Array<{ name: string, id: any }>
}
type Props = { match: any }

class Singup extends React.Component {
  state: State

  constructor(props: Props) {
    super(props)
    this.state = {
      email: "",
      password: "",
      name: "",
      lastname: "",
      city: null,
      phone: "",
      birthdate: new Date(),
      error: false,
      done: false,
      stateItems: [{ name: " loading ", id: -1 }]
    }
  }

  handleChange = (property: string) => (value: string) => {
    this.setState({
      [property]: value
    })
  }

  createUser = () => {
    let { name, lastname, city, birthdate, phone } = this.state

    if (name.trim() === "") {
      return this.setState({ error: { code: "validate/name" } })
    }

    if (lastname.trim() === "") {
      return this.setState({ error: { code: "validate/lastname" } })
    }

    if (!city || city === -1) {
      return this.setState({ error: { code: "validate/city" } })
    }

    if (phone.trim().length < 5 || phone.trim().length > 20) {
      return this.setState({ error: { code: "validate/phone" } })
    }

    firebase
      .auth(app)
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then(user => {
        user.updateProfile({
          displayName: `${this.state.name} ${this.state.lastname[0].toUpperCase()}.`
        })
        return user
      })
      .then(user =>{
        rootRef.child('credits').child(user.uid).push({ date: new Date(), type: 'Initial', price: 0, value: 1 })
        rootRef
          .child("users")
          .child(user.uid)
          .set({ name, lastname, city, birthdate, phone, credits: 1 })
        return user;
      })
      .then( user => user.sendEmailVerification() )
      .then(() => this.setState({ done: true }))
      .catch(error => {
        console.log(error)
        this.setState({ error })
    })
  }

  componentDidMount() {
    this.getStates()
  }

  getStates = () => {
    rootRef.child("states").on(
      "value",
      snap => {
        this.setState({
          stateItems: _.map(snap.val(), (state, id) => ({ ...state, id }))
        })
      },
      err => console.error(err)
    )
  }

  getUserError = () => {
    if(!this.state.error){
      return null;
    }

    switch (this.state.error.code) {
      case 'auth/email-already-in-use':
        return 'Cuenta de email ya registrada'
      case 'auth/invalid-email':
        return 'Email inválido'
      default:
        return null;
    }
  }

  render = () => (
    <signup>
      {this.state.done && <Redirect to="/" />}
      <Paper zDepth={2}>
        <header>Registrarse al sistema</header>
        <section className="md-grid">
          <div className="md-cell md-cell--12">
            <TextField
              id="email"
              label="Email"
              fullWidth={true}
              value={this.state.email}
              error={
                this.state.error &&
                  [
                    "auth/email-already-in-use",
                    "auth/invalid-email"
                  ].indexOf(this.state.error.code) > -1
              }
              errorText={this.getUserError()}
              onChange={this.handleChange("email")}
            />
          </div>
          <div className="md-cell md-cell--12">
            <TextField
              id="password"
              label="Contraseña"
              type="password"
              fullWidth={true}
              value={this.state.password}
              error={
                this.state.error &&
                  this.state.error.code === "auth/weak-password"
              }
              errorText={"La contraseña debe tener al menos 6 caracteres"}
              onChange={this.handleChange("password")}
            />
          </div>
          <div className="md-cell md-cell--6">
            <TextField
              id="name"
              label="Nombre"
              fullWidth={true}
              value={this.state.name}
              error={
                this.state.error && this.state.error.code === "validate/name"
              }
              errorText={"Nombre incorrecto"}
              onChange={this.handleChange("name")}
            />
          </div>
          <div className="md-cell md-cell--6">
            <TextField
              id="lastname"
              label="Apellido"
              fullWidth={true}
              value={this.state.lastname}
              error={
                this.state.error &&
                  this.state.error.code === "validate/lastname"
              }
              errorText={"Apellido incorrecto"}
              onChange={this.handleChange("lastname")}
            />
          </div>
          <div className="md-cell md-cell--12">
            <SelectField
              id="city"
              menuItems={this.state.stateItems}
              label="Ciudad"
              fullWidth={true}
              itemLabel="name"
              itemValue="id"
              value={this.state.city}
              error={
                this.state.error && this.state.error.code === "validate/city"
              }
              errorText={"Seleccione una ciudad válida"}
              onChange={this.handleChange("city")}
            />
          </div>
          <div className="md-cell md-cell--6">
            <TextField
              id="cell"
              label="Teléfono"
              fullWidth={true}
              value={this.state.phone}
              error={
                this.state.error && this.state.error.code === "validate/phone"
              }
              errorText={"Teléfono inválido"}
              onChange={this.handleChange("phone")}
            />
          </div>
          <div className="md-cell md-cell--6">
            <DatePicker
              id="birthdate"
              label="Cumpleaños"
              fullWidth={true}
              value={this.state.birthdate}
              maxDate={new Date()}
              onChange={this.handleChange("birthdate")}
            />
          </div>
        </section>
        <footer>
          <Button raised label="Aceptar" primary onClick={this.createUser} />
        </footer>
      </Paper>
    </signup>
  )
}

export default Singup
