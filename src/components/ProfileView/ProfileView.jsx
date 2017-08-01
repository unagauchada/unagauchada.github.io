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
import AdminEdit from "./AdminEdit"
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
      adminblockVisible:false,
      adminEditVisible: false,

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
  
    blockUser = () => {
    rootRef
      .child("users")
      .child(this.props.location.pathname.substring(9))
      .child("blocked")
      .set(true)
    this.closeBlockDialog()
  }

  unlockUser = () => {
    rootRef
      .child("users")
      .child(this.props.location.pathname.substring(9))
      .child("blocked")
      .set(false)
  }

  blockButton = () => {
    console.log("blockButton")
    return(
      ( this.props.location.pathname.substring(9) != this.state.currentUser.uid)?
        (
          (this.state.user.blocked)?
           <Button
              className="md-cell--right title-element"
              flat
              tooltipLabel="Desbloquear usuario"
              tooltipPosition="top"
              onClick={this.unlockUser}
            >
              <FontIcon class="material-icons"> block</FontIcon>
            </Button> 
      
                :
                  <Button
                    className="md-cell--right title-element"
                    flat
                    tooltipLabel="Bloquear usuario"
                    tooltipPosition="top"
                    onClick={this.openBlockDialog}
                    primary
                  >
                    <FontIcon class="material-icons"> block</FontIcon>
                </Button>
        ):""
    )


  }

  openDialog = () => this.setState({ visible: true })

  closeDialog = () => this.setState({ visible: false })

  openAdminEditDialog = () => this.setState({ adminEditVisible: true })

  closeAdminEditDialog = () => this.setState({ adminEditVisible: false })

  openBlockDialog = () => this.setState({ adminBlockVisible: true })

  closeBlockDialog = () => this.setState({ adminBlockVisible: false })

  blockDialog = () =>{
    return(
      <Dialog
          visible={this.state.adminBlockVisible}
          title="Bloquear Usuario"
          onHide={this.closeDialog}
          modal
          actions={[{
            onClick: this.blockUser,
            primary: true,
            label: 'Aceptar',
          },{
            onClick: this.closeBlockDialog,
            primary: false,
            label: 'Cancelar',
          }]}
        >
          <p id="" className="md-color--secondary-text">
            Estas seguro que deseas bloquear a {this.state.user.name + " " + this.state.user.lastname}?
          </p>
      </Dialog>
    )
  }

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
                      onClick={this.openAdminEditDialog}      
                  >
                      create
                  </Button>
                    {this.blockButton()}
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
                  id="adminEditionDialog"
                  visible={this.state.adminEditVisible}
                  onHide={this.closeAdminEditDialog}
                  className="googleDialog"
                >
                  <AdminEdit handleClose={this.closeAdminEditDialog} user={this.state.user} uid={this.props.location.pathname.substring(9)}/>
                </Dialog>
                <Dialog
                  id="editionDialog"
                  visible={this.state.visible}
                  onHide={this.closeDialog}
                  className="googleDialog"
                >
                  <Edit handleClose={this.closeDialog} user={this.state.user}/>
                </Dialog>
                <Dialog
                    visible={this.state.adminBlockVisible}
                    title="Bloquear Usuario"
                    onHide={this.closeDialog}
                    modal
                    actions={[{
                      onClick: this.blockUser,
                      primary: true,
                      label: 'Aceptar',
                    },{
                      onClick: this.closeBlockDialog,
                      primary: false,
                      label: 'Cancelar',
                    }]}
                  >
                    <p id="" className="md-color--secondary-text">
                      Estas seguro que deseas bloquear a {this.state.user.name + " " + this.state.user.lastname}?
                    </p>
                </Dialog>
            </CardActions>
            <CardText>
                <ProfileMenu user={this.props.location.pathname.substring(9)}/>
            </CardText>
        </Card>
        {this.blockDialog}
      </MainPage>
    )
  }
}
export default ProfileView
