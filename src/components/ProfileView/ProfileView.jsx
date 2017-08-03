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
import { Redirect } from "react-router-dom"

@connect(state => ({ user: userSelector(state) }))
class ProfileView extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      deleted: false,
      adminblockVisible:false,
      adminDeleteVisible:false,
      adminEditVisible: false,
      submissions:[],
      publications:[],
      currentUser: { name: "", lastname: "", photo: "" },
      user: { name: "", lastname: "", photo: "" },
    }
  }

  componentDidMount = () => {
    this.getUser(this.props.location.pathname.substring(9))
    this.getCurrentUser(this.props.user.uid)
    this.getPublications()
    this.getSubmissions()
  }

  componentWillReceiveProps = nextProps => {
    this.getUser(nextProps.location.pathname.substring(9))
    this.getCurrentUser(nextProps.user.uid)
    this.getPublications()
    this.getSubmissions()
  }

  getSubmissions = () =>{
    rootRef
      .child("submissions")
      .on("value",
        (snap => this.setState ({
          submissions: _.map(snap.val(), (submission,id) => ({...submission,id}) )
        }))
      )
  }

  getPublications = () =>{
    rootRef
      .child("publications")
      .on("value",
        (snap => this.setState ({
          publications: _.map(snap.val(), (publication,id) => ({...publication,id}) )
            .filter(pub => pub.user == this.props.location.pathname.substring(9))
        }))
      )
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
      .on("value", snap => this.setState({ user: snap.val(), deleted: snap.val().deleted }))
  }
  
    blockUser = () => {
    rootRef
      .child("users")
      .child(this.props.location.pathname.substring(9))
      .child("blocked")
      .set(true)
    this.closeBlockDialog()
  }


  despostularse = publication => {
    rootRef
      .child(
        "submissions/" + publication + "/" + this.props.location.pathname.substring(9)
      )
      .remove();
    rootRef
      .child("publications/" + publication)
      .transaction(pub => {
        pub.submissions--;
        return pub;
      });
  };

  deleteUser = () =>{
    this.deleteSubmissions()
    rootRef
      .child("users")
      .child(this.props.location.pathname.substring(9))
      .child("blocked")
      .set(false)
    rootRef
      .child("users")
      .child(this.props.location.pathname.substring(9))
      .child("deleted")
      .set(true)
    this.state.publications.map(this.cancelPublication)
    this.closeAdminDeleteDialog
    this.setState({deleted: true})

  }

   cancelPublication = pub => {
   console.log(pub.title + " canceled")
    if(pub.gaucho){
      this.notifyGaucho(pub.gaucho, "El favor " + pub.title + " al que habias sido asignado como gaucho ha sido removido, ya que su creador fue eliminado.")
    }    
    rootRef
      .child("publications/" + pub.id)
      .child("canceled")
      .set(true)
    rootRef
      .child("submissions/" + pub.uid).remove()
  }

  notifyGaucho = (gaucho, message) => { 
    rootRef
      .child('users')
      .child(gaucho).child("message")
      .set(message)     
  }

  deleteSubmissions = () => {
    let subs =(this.state.submissions.filter(sub => sub[this.props.location.pathname.substring(9)]).map(x=> x.id) )
    console.log(subs)
    subs.map(this.despostularse)

  }

  openAdminDeleteDialog = () => this.setState({ adminDeleteVisible: true })
   

  closeAdminDeleteDialog = () => this.setState({ adminDeleteVisible: false })

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
        { this.state.deleted && <Redirect to="/" />}
        <Card
            style={{ width: "100%", maxWidth: 1024 }}
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
                      onClick={this.openAdminDeleteDialog}
                  >
                      delete
                  </Button>
                </section>
                }
                <Dialog
                  id="adminEditionDialog"
                  aria-label="admin edition dialog"
                  visible={this.state.adminEditVisible}
                  onHide={this.closeAdminEditDialog}
                  className="googleDialog"
                >
                  <AdminEdit handleClose={this.closeAdminEditDialog} user={this.state.user} uid={this.props.location.pathname.substring(9)}/>
                </Dialog>
                <Dialog
                  id="editionDialog"
                  aria-label="edition dialgo"
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
                <Dialog
                    visible={this.state.adminDeleteVisible}
                    title="Eliminar Usuario"
                    onHide={this.closeDialog}
                    modal
                    actions={[{
                      onClick: this.deleteUser,
                      primary: true,
                      label: 'Aceptar',
                    },{
                      onClick: this.closeAdminDeleteDialog,
                      primary: false,
                      label: 'Cancelar',
                    }]}
                  >
                    <p id="" className="md-color--secondary-text">
                      Estas seguro que deseas eliminar a {this.state.user.name + " " + this.state.user.lastname}?
                    </p>
                    <p> Eliminar a un usuario es <i> irreversible. </i> </p>
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
