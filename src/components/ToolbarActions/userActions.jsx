import React from "react"
import firebase from 'firebase'
import { Link, Redirect } from "react-router-dom"
import { connect } from "react-redux"
import ListItem from "react-md/lib/Lists/ListItem"
import Divider from 'react-md/lib/Dividers';
import MenuButton from "react-md/lib/Menus/MenuButton"
import Avatar from "react-md/lib/Avatars"
import FontIcon from "react-md/lib/FontIcons"

import { userSelector } from "../../redux/getters"
import { app } from '../../libs/db'

@connect(state => ({
  user: userSelector(state)
}))
class UserProfile extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      profile: {
        name: "",
        lastname: "",
        city: "",
        phone: "",
        birthdate: new Date(),
        out: false
      }
    }
  }

  signout = () => firebase.auth(app).signOut().then( () => this.setState({ out: true }) )

  render = () => (
      <user>
          { this.state.out && <Redirect to="/" />}
    <MenuButton
      id="button-menu"
      label={ this.props.user.displayName }
      flat
      buttonChildren={
        <Avatar icon={<FontIcon>person</FontIcon>} />
      }
      className="menu-example"
    >
      <ListItem primaryText="Mi Perfil" leftIcon={<FontIcon>settings</FontIcon>} />
      <Divider />
      <ListItem primaryText="Salir" leftIcon={<FontIcon>exit_to_app</FontIcon>} onClick={this.signout} />
    </MenuButton>
    </user>
  )
}

export default [<UserProfile key="user" />]
