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
import "./App.scss"

const actions = [
  <Button className="login-btn" key="login" raised primary label="Login" />
]

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

  render = () => (
    <app>
      <Toolbar
        zDepth={1}
        colored
        title={
          <h2>
            Una<span>Gauchada</span>
          </h2>
        }
        actions={actions}
        nav={nav}
      >
        <caption>Explorar</caption>
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
      { this.props.user ? this.props.user.email : 'null'}
      <Router>
        <div />
      </Router>
    </app>
  )
}

export default App
