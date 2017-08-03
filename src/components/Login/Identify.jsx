import React from "react"
import firebase from "firebase"
import { Link } from 'react-router-dom'
import Paper from "react-md/lib/Papers"
import Button from "react-md/lib/Buttons/Button"
import TextField from "react-md/lib/TextFields"
import { app } from "../../libs/db"

class Identify extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      error: null,
      email: "",
      next: false
    }
  }

  handleChange = property => value => {
    this.setState({
      [property]: value,
      error: null
    })
  }

  getUserError = () => {
    if (!this.state.error) {
      return null
    }

    switch (this.state.error.code) {
      case "auth/user-not-found":
        return "No existe el Usuario"
      case "auth/invalid-email":
        return "Email inválido"
      default:
        return this.state.error.message
    }
  }

  keyPress = () => this.setState({ error: null })

  sendReset = () =>
    firebase
      .auth(app)
      .sendPasswordResetEmail(this.state.email)
      .then(_ => this.setState({ next: true, error: null }))
      .catch(error => this.setState({ error }))

  getMailForm = () =>
    <div>
      <section>
        <TextField
          id="email"
          label="Email"
          fullWidth={true}
          value={this.state.email}
          onChange={this.handleChange("email")}
          error={
            this.state.error &&
            ["auth/user-not-found", "auth/invalid-email"].indexOf(
              this.state.error.code
            ) > -1
          }
          errorText={this.getUserError()}
          onKeyDown={this.keyPress}
        />
      </section>
      <footer>
        <Button raised label="Aceptar" primary onClick={this.sendReset} />
      </footer>
    </div>

  getConfirmationForm = () =>
    <div>
      <section>
        Ingrese a su direccion mail para terminar el cambio de contraseña.
      </section>
      <footer>
        <Link to="/signin"><Button raised label="Aceptar" primary /></Link>
      </footer>
    </div>

  render = () =>
    <login>
      <Paper zDepth={2}>
        <header>Recuperar Contraseña</header>
        {!this.state.next ? this.getMailForm() : this.getConfirmationForm()}
      </Paper>
    </login>
}

export default Identify
