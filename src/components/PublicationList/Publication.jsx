import React from "react"
import _ from "lodash"
import firebase from "firebase"
import { Link } from "react-router-dom"
import Card from "react-md/lib/Cards/Card"
import CardTitle from "react-md/lib/Cards/CardTitle"
import CardText from "react-md/lib/Cards/CardText"
import CardActions from "react-md/lib/Cards/CardActions"
import Media, { MediaOverlay } from "react-md/lib/Media"
import Button from "react-md/lib/Buttons"
import CompanyLogo from "../../assets/logo.png"
import rootRef from "../../libs/db"
import UserAvatar from "../UserAvatar"
import Dialog from "react-md/lib/Dialogs"

class Publication extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      user: { name: "", lastname: "" },
      category: { name: "" },
      state: { name: "" }
    }
  }

  componentDidMount() {
    this.fetchAll(this.props.publication)
  }

  componentWillReceiveProps(nextProps) {
    this.fetchAll(nextProps.publication)
  }

  fetchAll = publication => {
    this.getState(publication)
    this.getCategory(publication)
    this.getUser(publication)
  }

  getState = publication =>
    rootRef
      .child("states")
      .child(publication.state)
      .on("value", snap => this.setState({ state: snap.val() }))

  getCategory = publication =>
    rootRef
      .child("categories")
      .child(publication.category)
      .on("value", snap => this.setState({ category: snap.val() }))

  getUser = publication =>
    rootRef
      .child("users")
      .child(publication.user)
      .on("value", snap => this.setState({ user: snap.val() }))

  block = () => {
    let { id, user, title, gaucho } = this.props.publication
    rootRef.child("publications").child(id).child("blocked").set(true)
    rootRef
      .child("users")
      .child(user)
      .update({
        message: `Se ha bloqueado su publicación ${title} luego de haber sido reportada`
      })
      .catch(e => console.error(e))
    if (gaucho && gaucho !== "") {
      rootRef.child("users").child(gaucho).update({
        message: `Se ha bloqueado la publicación ${title}, de la que usted era gaucho`
      })
    }
    rootRef
      .child("submissions")
      .child(id)
      .once("value")
      .then(snap => snap.val())
      .then(submissions => {
        _.forEach(submissions, (submittion, submitter) => {
          if (submitter && submitter !== gaucho) {
            rootRef.child("users").child(submitter).update({
              message: `Se ha bloqueado la publicación ${title}, de la que usted estaba postulado`
            })
          }
        })
      })
    this.closeDialog
  }

  openDialog = () => this.setState({blockDialogVisible: true})

  closeDialog = () => this.setState({blockDialogVisible: false})

  render = () =>
    <Card
      style={{ maxWidth: 400 }}
      className="md-block-centered md-cell--top "
      expanderTooltipLabel="Expandir descripcion!"
    >
      <CardTitle
        avatar={
          <Link
            to={ 
              this.state.user.deleted ||
              (firebase.auth().currentUser &&
              "/profile/" + this.props.publication.user)
            }
          >
            <UserAvatar url={this.state.user.photoURL} />
          </Link>
        }
        title={this.state.user.name}
        subtitle={this.state.state.name}
      />
      <Media>
        <img
          src={
            this.props.publication.imageURL &&
            this.props.publication.imageURL !== ""
              ? this.props.publication.imageURL
              : CompanyLogo
          }
          role="presentation"
        />
        <MediaOverlay>
          <CardTitle title={this.props.publication.title} />
        </MediaOverlay>
      </Media>
      {firebase.auth().currentUser && [
        <CardText key="descr" className="descr">
          {this.props.publication.text}
        </CardText>,
        <CardActions key="actions">
          <Link to={"/publication/" + this.props.publication.id}>
            {firebase.auth().currentUser.uid === this.props.publication.user
              ? <Button raised secondary label="Ver" />
              : <Button flat secondary label="Ver" />}
          </Link>
          {this.props.canReport &&
            <Button
              raised
              primary
              label="Bloquear"
              disabled={this.props.publication.blocked}
              onClick={this.openDialog}
            />}
        </CardActions>
      ]}
      <Dialog
          visible={this.state.blockDialogVisible}
          title="Bloquear publicacion"
          onHide={this.closeDialog}
          modal
          actions={[{
            onClick: this.block,
            primary: true,
            label: 'Aceptar',
          },{
            onClick: this.closeDialog,
            primary: false,
            label: 'Cancelar',
          }]}
        >
          <p id="" className="md-color--secondary-text">
            Estas seguro que deseas bloquear el favor {this.props.publication.title}?
          </p>
          <p> El bloqueo es <i> irreversible. </i> </p>
      </Dialog>
    </Card>
}

export default Publication
