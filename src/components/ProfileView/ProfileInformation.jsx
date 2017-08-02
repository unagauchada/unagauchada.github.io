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
import Button from "react-md/lib/Buttons"
import Qualification from "./Qualification"
import Divider from "react-md/lib/Dividers";
import { userSelector } from "../../redux/getters"
import { connect } from "react-redux"

@connect(state => ({ currentUser: userSelector(state) }))
export default class ProfileInformation extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      user: { name: "", lastname: "", photo: "", credits: null, qualification: null },
      currentUser: {admin: false},
      states: [{ name: "loading", value: "1" }],
      archievements: null,
      showQualifications: false,
      qualifications: null
    }
  }

  componentDidMount = () => {
    this.getStates()
    this.getArchievements()
    this.getQualifications(this.props.user)
    this.getUser(this.props.user)
    this.getCurrentUser(this.props.currentUser.uid)
  }

  getCurrentUser = user => {
    rootRef
      .child("users")
      .child(user)
      .on("value", snap => this.setState({ currentUser: snap.val() }))
  }

  getScore = () =>{
    let score = this.state.archievements
      .find(archievement => ((this.state.user.qualification <= archievement.lt)))
    return score? score.name : this.state.archievements.slice(-1)[0].name
  }

  getArchievements = () => {
    rootRef.child("scores").on("value", snap =>
      this.setState({
        archievements: _.map(
          snap.val(),
          (archievement, name) =>
            ({
                  ...archievement,
                  name
                })
        ).sort((x,y) => x.lt-y.lt)
      })
    )      
  }

  getQualifications = user => {
    rootRef.child("qualifications").child(user).on("value", snap => {
      this.setState({
        qualifications: _.map(snap.val(), (qualification, id) => ({ ...qualification, id }))
      });
    });
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
    this.getStates()
    this.getArchievements()
    this.getQualifications(nextProps.user)
    this.getUser(nextProps.user)
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
            {(this.props.user === this.props.currentUser.uid || this.state.currentUser.admin) &&
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
            }
            <Card
                style={{ width: "45%" }}
                className="md-block-centered md-cell--top"
                >
                    {this.state.qualifications && this.state.qualifications.length>0 &&
                    <CardTitle
                        title="Calificaciones">
                        {this.state.showQualifications &&
                        <Button
                            className="md-cell--right"
                            tooltipLabel="view"
                            tooltipPosition="top"
                            icon
                            onClick={() => this.setState({showQualifications: !this.state.showQualifications})}
                        >
                            arrow_drop_up
                        </Button> || 
                        <Button
                            className="md-cell--right"
                            tooltipLabel="view"
                            tooltipPosition="top"
                            icon
                            onClick={() => this.setState({showQualifications: !this.state.showQualifications})}
                        >
                            arrow_drop_down
                        </Button>
                        }
                    </CardTitle>
                    }
                    <CardText>
                        {  this.state.archievements && 
                            <h2 className="md-display-3 display-override md-text-center">
                            {this.getScore()}
                            </h2>
                        }
                        {  this.state.user.qualification &&
                            <h4 className="md-display-1 display-override md-text-center">{this.state.user.qualification + ' puntos'}</h4>
                        }
                    </CardText>    
                    {this.state.showQualifications && this.state.qualifications.length>0 &&
                    <section>
                        <Divider />
                        <CardText className="comments">
                            <ul className="md-list">
                                {console.log(this.state.qualifications)}
                                {this.state.qualifications.map(qualification => {
                                return (
                                    <li className="md-list-tile" key={qualification.id}>
                                    <Qualification
                                        qualification={qualification}
                                    />
                                    </li>
                                );
                                })}
                            </ul>
                        </CardText>
                    </section>
                    }
            </Card>

        <Button label="achievements" primary onClick={() => console.log(this.state.archievements.map(x=>x.name))}/>
       </div>
    )
  }
}
