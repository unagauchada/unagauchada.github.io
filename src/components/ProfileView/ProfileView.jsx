import React, { PureComponent } from "react"
import _ from "lodash"
import { connect } from "react-redux"
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
import Tabs from 'react-md/lib/Tabs/Tabs';
import Tab from 'react-md/lib/Tabs/Tab';
import TabsContainer from 'react-md/lib/Tabs/TabsContainer';
import CSSTransitionGroup from 'react-addons-css-transition-group';
import ProfileMenu from "./ProfileMenu"
import "./ProfileView.scss"

@connect(state => ({ user: userSelector(state) }))
class ProfileView extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      user: { name: "", lastname: "", photo: "" },
    }
  }

  render = () => {
    return (
      <MainPage>
        <Card
            style={{ width: "100%", maxWidth: 800 }}
            className="md-block-centered profile-view"
          >
            <CardActions>
                <div className="md-cell md-cell--2-tablet md-cell--3-desktop">
                    <Media aspectRatio="4-3">
                        <img
                            src={
                                this.props.user.photoURL &&
                                this.props.user.photoURL != ""
                                ? this.props.user.photoURL
                                : CompanyLogo
                            }
                            role="presentation"
                        />
                    </Media>
                </div>
                <h1 className="title-element">{this.props.user.displayName}</h1>
                <Button
                    className="md-cell--right title-element"
                    flat
                    label="Editar perfil"
                >
                    create
                </Button>
            </CardActions>
            <CardText>
                <ProfileMenu/>
            </CardText>
        </Card>
      </MainPage>
    )
  }
}
export default ProfileView