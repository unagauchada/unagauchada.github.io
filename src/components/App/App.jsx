// @flow
import React from "react"
import firebase from "firebase"
import { Redirect } from 'react-router'
import { HashRouter as Router, Route, Link, Switch } from "react-router-dom"
import { connect } from "react-redux"
import Toolbar from "react-md/lib/Toolbars"
import Button from "react-md/lib/Buttons/Button"
import FontIcon from "react-md/lib/FontIcons"
import { app as fbApp } from "../../libs/db"
import { userSelector } from "../../redux/getters"
import { updateUser } from "../../redux/actions"
import Divider from 'react-md/lib/Dividers'
import Signup from "../Signup"
import Login from "../Login"
import Home from "../Home"
import BuyCredits from "../BuyCredits"
import FavorView from "../Publication"
import actionCreator from "../ToolbarActions"
import MainPage from "../MainPage"

import Autocomplete from 'react-md/lib/Autocompletes';
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
  constructor() {
        super();
        this.state = {
            searchText: "",
            shouldRedir: false
        };
    }

  componentWillMount() {
    firebase.auth(fbApp).onAuthStateChanged(user => this.props.updateUser(user))
  }

   handleClear() {
    
  }

  handleChange= value =>{
    if (value) {
      this.setState({
        searchText: value
      });   
  }
  }

  handleSelection = value => {
    
  }

  redir = () => {
    this.setState({shouldRedir: false})
    return <Redirect to="/" />
  }

  handleSearch = () => {
      this.setState({
        shouldRedir: true
      })      
  }

  render = () => (
    <form  onSubmit={(e) => {e.preventDefault(); this.handleSearch(); }}>
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

          {this.state.shouldRedir? this.redir() : ""}
          <section>Explorar</section>
          <div className="md-cell--middle">
          <Autocomplete
              id="iconLeftPhone"
              block
              data={[]}
              placeholder="Buscar"
              leftIcon={<Button icon onClick={this.handleSearch}>search</Button>}
              onChange={this.handleChange}
              size={10}
              className="md-title--toolbar md-cell--middle toolbar-text"
              inputClassName="md-text-field--toolbar"
            />
          </div>
        </Toolbar>
        <Switch>
          <Route exact path="/" component={() => <Home searchText={this.state.searchText} />} />
          <Route path="/signup" component={Signup} />
          <Route path="/signin" component={Login} />
          <Route path="/buy" component={this.props.user ? BuyCredits : Login} />
          <Route path="/publication/:favorID"  component={this.props.user ? FavorView : Login } />
          <Route path="*" component={Error404} />
        </Switch> 
      </app>
    </Router>
    </form>
  )
}

export default App
