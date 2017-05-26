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
    firebase
      .auth(app)
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then(user => {
        user.updateProfile({
          displayName: `${this.state.name} ${this.state.lastname[0].toUpperCase()}.`
        })
        return user
      })
      .then(user => rootRef.child('users').child(user.uid).set({ name, lastname, city, birthdate, phone  }))
      .then(() => this.setState({ done: true }))
      .catch(error => this.setState({ error }))
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
  render = () => (
    <signup>
      {this.state.done && <Redirect to="/" />}
      <Paper zDepth={2}>
        <header>Registrarse al sistema</header>
        <section className="md-grid">
          {this.state.error &&
            <div className="error">{this.state.error.message}</div>}
          <div className="md-cell md-cell--12">
            <TextField
              id="email"
              label="Email"
              fullWidth={true}
              value={this.state.email}
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
              onChange={this.handleChange("password")}
            />
          </div>
          <div className="md-cell md-cell--6">
            <TextField
              id="name"
              label="Nombre"
              fullWidth={true}
              value={this.state.name}
              onChange={this.handleChange("name")}
            />
          </div>
          <div className="md-cell md-cell--6">
            <TextField
              id="lastname"
              label="Apellido"
              fullWidth={true}
              value={this.state.lastname}
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
              onChange={this.handleChange("city")}
            />
          </div>
          <div className="md-cell md-cell--6">
            <TextField
              id="cell"
              label="Teléfono"
              fullWidth={true}
              value={this.state.phone}
              onChange={this.handleChange("phone")}
            />
          </div>
          <div className="md-cell md-cell--6">
            <DatePicker
              id="birthdate"
              label="Cumpleaños"
              fullWidth={true}
              value={this.state.birthdate}
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
