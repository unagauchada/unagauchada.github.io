// @flow
import React from "react"
import firebase from 'firebase'
import { HashRouter as Router, Route } from "react-router-dom"
import Toolbar from "react-md/lib/Toolbars"
import Paper from "react-md/lib/Papers"
import Button from "react-md/lib/Buttons/Button"
import TextField from "react-md/lib/TextFields"
import FontIcon from "react-md/lib/FontIcons"
import { app as fbApp } from "../../libs/db"
import "./App.scss"

const actions = [
  <Button className="login-btn" key="login" raised primary label="Login" />
]

const nav = <Button key="nav" icon>menu</Button>

class App extends React.Component {

  componentWillMount(){
    firebase.auth(fbApp).onAuthStateChanged( user => console.log(user) )
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
      <Router>
        <div>
        </div>
      </Router>
    </app>
  )
}

export default App
