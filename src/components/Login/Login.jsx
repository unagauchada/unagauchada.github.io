import React from "react"
import Paper from "react-md/lib/Papers"
import Button from "react-md/lib/Buttons/Button"
import TextField from "react-md/lib/TextFields"
import { Link, Switch, Route } from 'react-router-dom'
import firebase from "firebase"
import { app } from "../../libs/db.js"
import Identify from './Identify'

import "./Login.scss"

class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = { email: "", password: "", error: null }
  }

  handleChange = property => value => {
    this.setState({
      [property]: value,
      error: null
    })
  }

  loginUser = () => {
    firebase
      .auth(app)
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then( user => this.props.history.push("/"))
      .catch(error => this.setState({ error }))
  }

  getUserError = () => {
    if(!this.state.error){
      return null;
    }

    switch (this.state.error.code) {
      case 'auth/user-not-found':
        return 'No existe el Usuario'
      case 'auth/user-disabled':
        return 'El usuario no esta habilitado'
      case 'auth/invalid-email':
        return 'Email inválido'
      default:
        return null;
    }
  }

  keyPress = (e) => {
    if(e.keyCode == 13){
        this.loginUser()
    }
  }

  render = () => (
    <login>
      <Paper zDepth={2}>
        <header>Ingresar al sistema</header>
        <section>
          <TextField
            id="email"
            label="Email"
            fullWidth={true}
            value={this.state.email}
            onChange={this.handleChange("email")}
            error={ (this.state.error) && ( ['auth/user-not-found', 'auth/user-disabled', 'auth/invalid-email'].indexOf(this.state.error.code) > -1) }
            errorText={this.getUserError()}
            onKeyDown={this.keyPress}
          />
          <TextField
            id="password"
            label="Contraseña"
            type="password"
            fullWidth={true}
            value={this.state.password}
            onChange={this.handleChange("password")}
            error={(this.state.error) && (this.state.error.code ==='auth/wrong-password')}
            errorText={"Contraseña incorrecta"}
            onKeyDown={this.keyPress}
          />
        </section>
        <footer>
          <Button raised label="Aceptar" primary onClick={this.loginUser} />
        </footer>
      </Paper>
      <span className="resetPass"><Link to="/signin/identify">Olvidé mi contraseña</Link></span>
    </login>
  )
}

export default () => (
  <Switch>
    <Route exact path="/signin" component={Login}/>
    <Route path="/signin/identify" component={Identify}/>
  </Switch>
)
