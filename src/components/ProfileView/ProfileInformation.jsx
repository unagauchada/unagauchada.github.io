import React, { PureComponent } from "react"
import _ from "lodash"
import List from 'react-md/lib/Lists/List';
import ListItem from 'react-md/lib/Lists/ListItem';
import Card from "react-md/lib/Cards/Card"
import CardTitle from "react-md/lib/Cards/CardTitle"
import CardText from "react-md/lib/Cards/CardText"
import FontIcon from "react-md/lib/FontIcons"
import rootRef from "../../libs/db"
import "./ProfileView.scss"

export default class ProfileInformation extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      user: { name: "", lastname: "", photo: "", credits: null, qualification: null },
      states: [{ name: "loading", value: "1" }],
      archievements: null
    }
  }

  componentDidMount = () => {
    this.getStates()
    this.getArchievements()
    this.getUser(this.props.user.uid)
  }

  getArchievements = () => {
    rootRef.child("⁠⁠⁠achievements").on("value", snap =>
      this.setState({
        archievements: _.map(
          snap.val(),
          (archievement, name) =>
            ({
                  ...archievement,
                  name
                })
        )
      })
    )      
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
    return(
        <List>
            {this.state.user.birthdate && 
            <ListItem
                primaryText="Cumpleaños"
                secondaryText={this.state.user.birthdate}
            />}
            {this.state.user.city && 
            <ListItem
                primaryText="Localidad"
                secondaryText={
                    this.state.states.find(
                        state => state.value === this.state.user.city).name}
            />}
            {this.state.user.phone && 
            <ListItem
                primaryText="Telefono"
                secondaryText={this.state.user.phone}
            />}
        </List>
    )
  }

  renderCredits = () => {
    if (this.state.user.credits === 1){ 
        return <h2 className="md-display-3 display-override md-text-center">{this.state.user.credits + " Credito"}</h2>
    }else{
        return <h2 className="md-display-3 display-override md-text-center">{this.state.user.credits + " Creditos"}</h2>}         
  }

  render = () => {
      if(!this.state.user) return;
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
                        {this.state.user.credits && this.renderCredits()}
                    </CardText>    
            </Card>
            <Card
                style={{ width: "45%" }}
                className="md-block-centered md-cell--top"
                >
                    <CardTitle
                        title="Calificaciones"/>
                    <CardText>
                        {  this.state.archievements && 
                            <h2 className="md-display-3 display-override md-text-center">{this.state.archievements.find(archievement => (archievement.gt <= this.state.user.qualification && (this.state.user.qualification <= archievement.lt))).name}</h2>
                        }
                        {  this.state.user.qualification &&
                            <h4 className="md-display-1 display-override md-text-center">{this.state.user.qualification + ' puntos'}</h4>
                        }
                    </CardText>    
            </Card>
       </div>
    )
  }
}
