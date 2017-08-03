// @flow
import _ from "lodash"
import React from "react"
import firebase from "firebase"
import { Redirect } from "react-router"
import { HashRouter as Router, Route, Link, Switch } from "react-router-dom"
import { connect } from "react-redux"
import Toolbar from "react-md/lib/Toolbars"
import Dialog from "react-md/lib/Dialogs"
import TextField from "react-md/lib/TextFields"
import Button from "react-md/lib/Buttons/Button"
import { app as fbApp } from "../../libs/db"
import { userSelector } from "../../redux/getters"
import { updateUser } from "../../redux/actions"
import SelectField from "react-md/lib/SelectFields"
import Signup from "../Signup"
import Login from "../Login"
import Home from "../Home"
import BuyCredits from "../BuyCredits"
import FavorView from "../Publication"
import ProfileView from "../ProfileView"
import actionCreator from "../ToolbarActions"
import ChangePassword from "../ChangePassword/ChangePassword"
import MainPage from "../MainPage"
import rootRef from "../../libs/db"
import Statistics from "../Statistics"
import "./App.scss"

const nav = (
  <Button key="nav" icon>
    menu
  </Button>
)

const mapStateToProps = state => ({
  user: userSelector(state)
})

const mapDispatchToProps = {
  updateUser
}

const Error404 = () =>
  <MainPage>
    <h1 className="md-display-4">Error 404</h1>
    <div className="md-display-2">Página no encontrada</div>
  </MainPage>

const Error403 = () =>
  <MainPage>
    <h1 className="md-display-4">Error 403</h1>
    <div className="md-display-2">Acceso denegado</div>
  </MainPage>

@connect(mapStateToProps, mapDispatchToProps)
class App extends React.Component {
  constructor() {
    super()
    this.state = {
      searchText: "",
      user: { admin: false },
      searchLoc: "",
      blocked: false,
      deleted: false,
      searchCat: "",
      text: "",
      showButtons: false,
      shouldRedir: false,
      locVisible: false,
      catVisible: false
    }
  }

  componentWillMount() {
    firebase.auth(fbApp).onAuthStateChanged(user => {
      this.getUser(user)
      this.props.updateUser(user)
    })
    this.getStates()
    this.getCategories()
  }

  componentDidMount = () => {
    this.getBlocked(firebase)
    firebase.auth(fbApp).onAuthStateChanged(user => this.props.updateUser(user))
    this.getDeleted(firebase)
  }

  getUser = user => {
    rootRef
      .child("users")
      .child(user.uid)
      .on("value", snap => this.setState({ user: snap.val() }))
  }

  componentWillReceiveProps = nextProps => {
    this.getBlocked(firebase)
    this.getDeleted(firebase)
  }

  getStates = () => {
    rootRef.child("states").on("value", snap =>
      this.setState({
        states: _.map(snap.val(), (state, value) => ({ ...state, value }))
          .sort(
            (a, b) => (a.name.toUpperCase() < b.name.toUpperCase() ? -1 : 1)
          )
          .concat({ name: "Todas", value: "default" })
      })
    )
  }

  getBlocked = fb => {
    console.log("getBlocked")
    if (fb.auth().currentUser) {
      console.log("uid: " + fb.auth().currentUser.uid)
      rootRef
        .child("users")
        .child(fb.auth().currentUser.uid)
        .child("blocked")
        .on("value", snap => {
          console.log("snapback: " + snap.val())
          if (snap.val() == true) {
            this.openBlocked()
            fb.auth().signOut()
          }
        })
    }
  }

  openBlocked = () => {
    this.setState({ blocked: true })
  }

  closeBlocked = () => {
    this.setState({ blocked: false })
  }

  getBlockedDialog = () => {
    return (
      <Dialog
        id="blockDialog"
        visible={this.state.blocked}
        title="Cuenta bloqueada"
        onHide={this.closeDialog}
        modal
        actions={[
          {
            onClick: this.closeBlocked,
            primary: true,
            label: "Aceptar"
          }
        ]}
      >
        <p id="speedBoostDescription" className="md-color--secondary-text">
          Tu cuenta a sido bloqueada por la administracion de UnaGauchada hasta
          nuevo aviso.
        </p>
      </Dialog>
    )
  }

  getDeleted = fb => {
    console.log("getDeleted")
    if (fb.auth().currentUser) {
      console.log("uid: " + fb.auth().currentUser.uid)
      rootRef
        .child("users")
        .child(fb.auth().currentUser.uid)
        .child("deleted")
        .on("value", snap => {
          console.log("snapback: " + snap.val())
          if (snap.val() == true) {
            this.openDeleted()
            fb.auth().signOut()
          }
        })
    }
  }

  openDeleted = () => {
    this.setState({ deleted: true })
  }

  closeDeleted = () => {
    this.setState({ deleted: false })
  }

  getDeletedDialog = () => {
    return (
      <Dialog
        visible={this.state.deleted}
        title="Cuenta Eliminada"
        onHide={this.closeDialog}
        modal
        actions={[
          {
            onClick: this.closeDeleted,
            primary: true,
            label: "Aceptar"
          }
        ]}
      >
        <p id="speedBoostDescription" className="md-color--secondary-text">
          Tu cuenta a sido cerrada definitivamente por la administracion de
          UnaGauchada.
        </p>
      </Dialog>
    )
  }

  getCategories = () => {
    rootRef.child("categories").on("value", snap =>
      this.setState({
        categories: _.map(snap.val(), (category, value) => ({
          ...category,
          value
        }))
          .sort(
            (a, b) => (a.name.toUpperCase() < b.name.toUpperCase() ? -1 : 1)
          )
          .concat({ name: "Todas", value: "default" })
      })
    )
  }

  handleClear() {}

  handleChange = value => {
    if (value) {
      this.setState({
        searchText: value
      })
    }
  }

  showButtons = () => this.setState({ showButtons: true })

  hideButtons = () => this.setState({ showButtons: false })

  handleSelection = value => {}

  redir = () => {
    this.setState({ shouldRedir: false })
    return <Redirect to="/" />
  }

  handleChange = value => {
    this.setState({ text: value })
  }

  handleSearch = () => {
    if (
      this.state.searchText ||
      this.state.text ||
      this.state.searchCat ||
      this.state.searchLoc
    ) {
      this.setState({
        searchText: this.state.text,
        shouldRedir: true
      })
    }
  }
  locChange = (value, index, event) => {
    this.setState({ searchLoc: value })
  }

  catChange = (value, index, event) => {
    this.setState({ searchCat: value })
  }

  render = () =>
    <form
      onSubmit={e => {
        e.preventDefault()
        this.handleSearch()
      }}
    >
      <Router>
        <app>
          {this.getBlockedDialog()}
          {this.getDeletedDialog()}
          <Toolbar
            zDepth={1}
            colored
            title={
              <h2>
                <Link
                  to="/"
                  onClick={() => {
                    this.setState({
                      showButtons: false,
                      searchText: "",
                      searchLoc: "",
                      searchCat: ""
                    })
                  }}
                >
                  Una<span>Gauchada</span>
                </Link>
              </h2>
            }
            actions={actionCreator(this.props.user)}
            nav={nav}
          >
            {this.state.shouldRedir ? this.redir() : ""}
            <section>Explorar</section>
            <div className="md-cell--middle">
              <TextField
                id="iconLeftPhone"
                block
                data={[]}
                placeholder="Buscar por contenido"
                leftIcon={
                  <Button icon onClick={this.handleSearch}>
                    search
                  </Button>
                }
                onChange={this.handleChange}
                onFocus={this.showButtons}
                size={10}
                className="md-title--toolbar md-cell--middle toolbar-text"
                inputClassName="md-text-field--toolbar"
              />
            </div>

            <div className="md-cell">
              {this.state.showButtons
                ? <SelectField
                    toolbar
                    id="state"
                    placeholder="Ubicacion"
                    itemLabel="name"
                    itemValue="value"
                    value={this.state.searchLoc}
                    menuItems={this.state.states}
                    onChange={this.locChange}
                    position={SelectField.Positions.BELOW}
                    className="md-cell--2-offset"
                  />
                : ""}
              {this.state.showButtons
                ? <SelectField
                    toolbar
                    id="category"
                    placeholder="Categoria"
                    itemLabel="name"
                    itemValue="value"
                    value={this.state.searchCat}
                    menuItems={this.state.categories}
                    onChange={this.catChange}
                    position={SelectField.Positions.BELOW}
                    className="md-cell--1-offset"
                  />
                : ""}
            </div>
          </Toolbar>
          <Switch>
            <Route
              exact
              path="/"
              component={() =>
                <Home
                  searchText={this.state.searchText}
                  searchLoc={this.state.searchLoc}
                  searchCat={this.state.searchCat}
                />}
            />
            <Route path="/signup" component={Signup} />
            <Route path="/signin" component={Login} />
            <Route
              path="/buy"
              component={this.props.user ? BuyCredits : Login}
            />
            <Route
              path="/publication/:favorID"
              component={this.props.user ? FavorView : Login}
            />
            <Route
              path="/profile/:userID"
              component={this.props.user ? ProfileView : Login}
            />
            <Route
              path="/changePassword"
              component={this.props.user ? ChangePassword : Login}
            />
            <Route
              path="/statistics"
              component={
                this.props.user
                  ? (this.state.user.admin && Statistics) || Error403
                  : Login
              }
            />
            <Route path="*" component={Error404} />
          </Switch>
        </app>
      </Router>
    </form>
}

export default App
