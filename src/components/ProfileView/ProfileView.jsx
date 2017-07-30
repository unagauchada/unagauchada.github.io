import React, { PureComponent } from "react"
import _ from "lodash"
import Card from "react-md/lib/Cards/Card"
import CardActions from "react-md/lib/Cards/CardActions"
import CardText from "react-md/lib/Cards/CardText"
import Button from "react-md/lib/Buttons/Button"
import FontIcon from "react-md/lib/FontIcons"
import MainPage from "../MainPage"
import { connect } from "react-redux"
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

      currentUser: { name: "", lastname: "", photo: "" },
      user: { name: "", lastname: "", photo: "" },
    }
  }

  componentDidMount = () => {
    this.getUser(this.props.location.pathname.substring(9))
    this.getCurrentUser(this.props.user.uid)
  }

  componentWillReceiveProps = nextProps => {
    this.getUser(nextProps.location.pathname.substring(9))
    this.getCurrentUser(nextProps.user.uid)
  }

  getCurrentUser = user => {
    rootRef
      .child("users")
      .child(user)
      .on("value", snap => this.setState({ currentUser: snap.val() }))
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
      return  <Avatar className="bigAvatar" style={{fontSize: 100, height: 100, width: 100 }} src={this.state.user.photoURL} role="presentation" />
    }else return <Avatar style={{fontSize: 100, height: 100, width: 100 }} icon={<FontIcon style={{fontSize: 100, height: 100, width: 100 }}>person</FontIcon>} role="presentation" />
  }

/*
   El administrador podra ver todos los datos del usuario.
   Tambien podra acceder a funcionalidades extra como eliminacion, bloqueo y modificacion.
*/
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
                {this.props.location.pathname.substring(9) === this.props.user.uid &&
                <Button
                    className="md-cell--right title-element"
                    flat
                    label="Editar perfil"
                    onClick={this.openDialog}
                >
                    create
                </Button>
                || this.state.currentUser.admin &&
                <section className="md-cell--right">
                  <Button
                      className="md-cell--right title-element"
                      flat
                      icon
                      tooltipLabel="Modificar"
                      tooltipPosition="top"                      
                  >
                      create
                  </Button>
                  <Button
                      className="md-cell--right title-element"
                      flat
                      icon
                      tooltipLabel="Bloquear"
                      tooltipPosition="top"
                  >
                      block
                  </Button>
                  <Button
                      className="md-cell--right title-element"
                      flat
                      icon
                      tooltipLabel="Eliminar"
                      tooltipPosition="top"
                  >
                      delete
                  </Button>
                </section>
                }
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
                <ProfileMenu user={this.props.location.pathname.substring(9)}/>
            </CardText>
        </Card>
      </MainPage>
    )
  }
}
export default ProfileView