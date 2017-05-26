// @flow
import React from "react"
import firebase from "firebase"
import { HashRouter as Router, Route } from "react-router-dom"
import { connect } from "react-redux"
import Toolbar from "react-md/lib/Toolbars"
import Button from "react-md/lib/Buttons/Button"
import TextField from "react-md/lib/TextFields"
import FontIcon from "react-md/lib/FontIcons"
import { app as fbApp } from "../../libs/db"
import { userSelector } from "../../redux/getters"
import { updateUser } from "../../redux/actions"
import Signup from "../Signup"
import Login from "../Login"
import "./App.scss"

const actions = user =>
  user === null
    ? [
        <Button
          className="login-btn"
          key="login"
          raised
          primary
          label="Login"
        />
      ]
    : [  
        <Button
          className="login-btn"
          key="login"
          raised
          primary
          label="Logout"
        /> ] 

const nav = <Button key="nav" icon>menu</Button>

const mapStateToProps = state => ({
  user: userSelector(state)
})

const mapDispatchToProps = {
  updateUser
}

@connect(mapStateToProps, mapDispatchToProps)
class App extends React.Component {
  componentWillMount() {
    firebase.auth(fbApp).onAuthStateChanged(user => this.props.updateUser(user))
  }

  render = () =>{ 
  console.log(this.props.user)
  return (
    <app>
      <Toolbar
        zDepth={1}
        colored
        title={
          <h2>
            Una<span>Gauchada</span>
          </h2>
        }
        actions={actions(this.props.user)}
        nav={nav}
      >
        <section>Explorar</section>
        <TextField
          id="iconLeftPhone"
          block
          placeholder="Buscar"
          leftIcon={<FontIcon>search</FontIcon>}
          size={10}
          className="md-title--toolbar md-cell--middle toolbar-text"
          inputClassName="md-text-field--toolbar"
        />
      </Toolbar>
      <Router>
        <div>
          <Route path="/signup" component={Signup} />
          <Route path="/signin" component={Login} />
        </div>
      </Router>
    </app>
  )}
}

export default App
