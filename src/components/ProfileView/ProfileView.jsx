import React, { PureComponent } from "react"
import _ from "lodash"
import { connect } from "react-redux"
import Card from "react-md/lib/Cards/Card"
import CardActions from "react-md/lib/Cards/CardActions"
import CardText from "react-md/lib/Cards/CardText"
import Button from "react-md/lib/Buttons/Button"
import FontIcon from "react-md/lib/FontIcons"
import MainPage from "../MainPage"
import { userSelector } from "../../redux/getters"
import ProfileMenu from "./ProfileMenu"
import Edit from "./Edit"
import rootRef from "../../libs/db"
import "./ProfileView.scss"
import Avatar from "react-md/lib/Avatars"
import Dialog from "react-md/lib/Dialogs"

@connect(state => ({ user: userSelector(state) }))
class ProfileView extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,

      user: { name: "", lastname: "", photo: "" },
    }
  }

  componentDidMount = () => {
    this.getUser(this.props.user.uid)
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

  openDialog = () => this.setState({ visible: true })

  closeDialog = () => this.setState({ visible: false })

  renderImage = () => {
    if (this.state.user.photoURL && this.state.user.photoURL !== ""){ 
      return  <Avatar style={{fontSize: 100, height: 100, width: 100 }} src={this.state.user.photoURL} role="presentation" />
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
                    onClick={this.openDialog}
                >
                    create
                </Button>
                <Dialog
                  id="editionDialog"
                  visible={this.state.visible}
                  onHide={this.closeDialog}
                  className="googleDialog"
                >
                  <Edit handleClose={this.closeDialog} user={this.state.user}/>
                </Dialog>
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