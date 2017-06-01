// @flow
import React from "react"
import firebase from "firebase"
import { HashRouter as Router, Route, Link, Switch } from "react-router-dom"
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
import Home from "../Home"
import BuyCredits from "../BuyCredits"
import FavorView from "../Publication"
import actionCreator from "../ToolbarActions"
import MainPage from "../MainPage"
import "./App.scss"

const nav = <Button key="nav" icon>menu</Button>

const mapStateToProps = state => ({
  user: userSelector(state)
})

const mapDispatchToProps = {
  updateUser
}

const Error404 = () => (
  <MainPage>
    <h1 className="md-display-4">Error 404</h1>
    <div className="md-display-2">Página no encontrada</div>
  </MainPage>
)

@connect(mapStateToProps, mapDispatchToProps)
class App extends React.Component {
  componentWillMount() {
    firebase.auth(fbApp).onAuthStateChanged(user => this.props.updateUser(user))
  }

  render = () => (
    <Router>
      <app>
        <Toolbar
          zDepth={1}
          colored
          title={
            <h2>
              <Link to="/">Una<span>Gauchada</span></Link>
            </h2>
          }
          actions={actionCreator(this.props.user)}
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
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/signup" component={Signup} />
          <Route path="/signin" component={Login} />
          <Route path="/buy" component={this.props.user ? BuyCredits : Login} />
          <Route path="/publication/:favorID"  component={this.props.user ? FavorView : Login } />
          <Route path="*" component={Error404} />
        </Switch>
      </app>
    </Router>
  )
}

export default App
