import React from "react"
import Paper from "react-md/lib/Papers"
import Button from "react-md/lib/Buttons/Button"
import TextField from "react-md/lib/TextFields"
import firebase from "firebase"
import { app } from "../../libs/db.js"

import "./Login.scss"

class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = { email: "", password: "", error: null }
  }

  handleChange = property => value => {
    this.setState({
      [property]: value
    })
  }

  loginUser = () => {
    firebase
      .auth(app)
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then( user => this.props.history.push("/"))
      .catch(error => this.setState({ error }))
  }

  render = () => (
    <login>
      <Paper zDepth={2}>
        <header>Ingresar al sistema</header>
        <section>
          { this.state.error ? <error>{this.state.error.message}</error> : null}
          <TextField
            id="email"
            label="Email"
            fullWidth={true}
            value={this.state.email}
            onChange={this.handleChange("email")}
          />
          <TextField
            id="password"
            label="Contraseña"
            type="password"
            fullWidth={true}
            value={this.state.password}
            onChange={this.handleChange("password")}
          />
          {" "}
        </section>
        <footer>
          <Button raised label="Aceptar" primary onClick={this.loginUser} />
        </footer>
      </Paper>
    </login>
  )
}

export default Login
