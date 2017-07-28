import React, { PureComponent } from "react"
import _ from "lodash"
import { connect } from "react-redux"
import Card from "react-md/lib/Cards/Card"
import CardActions from "react-md/lib/Cards/CardActions"
import CardText from "react-md/lib/Cards/CardText"
import Media from "react-md/lib/Media"
import Button from "react-md/lib/Buttons/Button"
import FontIcon from "react-md/lib/FontIcons"
import MainPage from "../MainPage"
import { userSelector } from "../../redux/getters"
import ProfileMenu from "./ProfileMenu"
import rootRef from "../../libs/db"
import "./ProfileView.scss"
import Avatar from "react-md/lib/Avatars"

@connect(state => ({ user: userSelector(state) }))
class ProfileView extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      user: { name: "", lastname: "", photo: "" },
    }
  }

  componentDidMount = () => {
    this.getUser(this.props.location.pathname.substring(9))
  }

  componentWillReceiveProps = nextProps => {
    this.getUser(nextProps.location.pathname.substring(9))
  }

  getUser = user => {
    rootRef
      .child("users")
      .child(user)
      .on("value", snap => this.setState({ user: snap.val() }))
  }

  renderImage = () => {
    if (this.state.user.photoURL && this.state.user.photoURL !== ""){ 
      return  <div className="md-cell md-cell--2-tablet md-cell--3-desktop">
                <Media aspectRatio="4-3">
                  <img
                      src={this.state.user.photoURL}
                      role="presentation"
                  />
                </Media>
              </div>
    }else return <Avatar style={{fontSize: 100, height: 100, width: 100 }} icon={<FontIcon style={{fontSize: 100, height: 100, width: 100 }}>person</FontIcon>} role="presentation" />
  }

  render = () => {
    return (
      <MainPage>
        <Card
            style={{ width: "100%", maxWidth: 800 }}
            className="md-block-centered profile-view"
          >
            <CardActions>
                  {this.renderImage()}
                <h1 className="title-element">{`${this.state.user.lastname}, ${this.state.user.name}`}</h1>
                <Button
                    className="md-cell--right title-element"
                    flat
                    label="Editar perfil"
                >
                    create
                </Button>
            </CardActions>
            <CardText>
                <ProfileMenu user={this.props.location.pathname.substring(9)}/>
            </CardText>
        </Card>
      </MainPage>
    )
  }
}
export default ProfileView