import React, { PureComponent } from "react"
import _ from "lodash"
import { connect } from "react-redux"
import List from 'react-md/lib/Lists/List';
import ListItem from 'react-md/lib/Lists/ListItem';
import Card from "react-md/lib/Cards/Card"
import CardTitle from "react-md/lib/Cards/CardTitle"
import CardActions from "react-md/lib/Cards/CardActions"
import CardText from "react-md/lib/Cards/CardText"
import Media from "react-md/lib/Media"
import Button from "react-md/lib/Buttons/Button"
import FontIcon from "react-md/lib/FontIcons"
import MainPage from "../MainPage"
import { userSelector } from "../../redux/getters"
import UserAvatar from "../UserAvatar"
import CompanyLogo from "../../assets/logo.png"
import rootRef from "../../libs/db"
import "./ProfileView.scss"

export default class ProfileInformation extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      user: { name: "", lastname: "", photo: "", credits: "" },
      states: [{ name: "loading", value: "1" }]
    }
  }

  componentDidMount = () => {
    this.getStates()
    this.getUser(this.props.user.uid)
  }

  getStates = () => {
    rootRef.child("states").on("value", snap =>
      this.setState({
        states: _.map(snap.val(), (state, value) => ({ ...state, value })).sort(
          (a, b) => (a.name.toUpperCase() < b.name.toUpperCase() ? -1 : 1)
        )
      })
    )
  }

  componentWillReceiveProps = nextProps => {
    this.getUser(nextProps.user.uid)
  }

  getUser = user => {
    rootRef
      .child("users")
      .child(user)
      .on("value", snap => this.setState({ user: snap.val() }))
  }

  getInformation = () => {
    console.log(this.state.states)
    return(
        <List>
            {this.state.user.birthday && 
            <ListItem
                primaryText="Cumpleaños"
                secondaryText={this.state.user.birthday}
                rightAvatar={<FontIcon>create</FontIcon>}
            />}
            {this.state.user.city && 
            <ListItem
                primaryText="Localidad"
                secondaryText={
                    this.state.states.find(
                        state => state.value === this.state.user.city).name}
                rightAvatar={<FontIcon>create</FontIcon>}
            />}
            {this.state.user.phone && 
            <ListItem
                primaryText="Telefono"
                secondaryText={this.state.user.phone}
                rightAvatar={<FontIcon>create</FontIcon>}
            />}
        </List>
    )
  }

  render = () => {
    return (
       <div style={{ width: "100%" }} className="information">
            <Card
                style={{ width: "45%" }}
                className="md-block-centered md-cell--top"
                >
                    <CardTitle
                        title="Cumpleaños, localidad y más"/>
                    <CardText>
                        {this.getInformation()}
                    </CardText>    
            </Card>
            <Card
                style={{ width: "45%" }}
                className="md-block-centered md-cell--top"
                >
                    <CardTitle
                        title="Creditos"/>
                    <CardText>
                        {this.state.user.credits == 1 &&
                        <h2 className="md-display-3 display-override">{this.state.user.credits + " Credito"}</h2>}            
                        {this.state.user.credits != 1 &&
                        <h2 className="md-display-3 display-override">{this.state.user.credits + " Creditos"}</h2>}            
                    </CardText>    
            </Card>
            <Card
                style={{ width: "45%" }}
                className="md-block-centered md-cell--top"
                >
                    <CardTitle
                        title="Calificaciones"/>
                    <CardText>
                    </CardText>    
            </Card>
       </div>
    )
  }
}
