import React, { PureComponent } from "react"
import firebase from "firebase"
import _ from "lodash"
import { connect } from "react-redux"
import Card from "react-md/lib/Cards/Card"
import CardTitle from "react-md/lib/Cards/CardTitle"
import CardActions from "react-md/lib/Cards/CardActions"
import CardText from "react-md/lib/Cards/CardText"
import Media from "react-md/lib/Media"
import Button from "react-md/lib/Buttons/Button"
import FontIcon from "react-md/lib/FontIcons"
import rootRef from "../../libs/db"
import Comment from "./Comment"
import MainPage from "../MainPage"
import { userSelector } from "../../redux/getters"
import UserAvatar from "../UserAvatar"
import "./Publication.scss"
import MakeComment from "./MakeComment"
import Dialog from 'react-md/lib/Dialogs'
import List from 'react-md/lib/Lists/List'
import ListItem from 'react-md/lib/Lists/ListItem'
import Divider from "react-md/lib/Dividers"

@connect(state => ({ user: userSelector(state) }))
class Publication extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      user: { name: "", lastname: "", photo: "" },
      publication: null,
      postulados:[],
      visible: false,
      category: "",
      comments: [],
      state: "",
      submissions: []
    }
  }

  fetchRest = publication => {
    this.getUser(publication.user)
    this.getCategory(publication.category)
    this.getState(publication.state)
  }

  getPublication = publication => {
    rootRef
      .child("publications")
      .child(publication)
      .on("value", snap =>
        this.setState({ publication: snap.val() }, this.fetchRest(snap.val()))
      )
  }

  getUser = user => {
    rootRef
      .child("users")
      .child(user)
      .on("value", snap => this.setState({ user: snap.val() }))
  }

  getCategory = category => {
    rootRef
      .child("categories")
      .child(category)
      .on("value", snap => this.setState({ category: snap.val().name }))
  }

  getState = state => {
    rootRef
      .child("states")
      .child(state)
      .on("value", snap => this.setState({ state: snap.val().name }))
  }

  getComments = publication => {
    rootRef.child("comments").child(publication).on("value", snap => {
      this.setState({
        comments: _.map(snap.val(), (comment, id) => ({ ...comment, id }))
      })
    })
  }

  getUsuariosPostulados = () =>{
    rootRef.child("users").on("value", snap =>
      this.setState({
        postulados: _.map(snap.val(), (postulado, user) => ({
          ...postulado,
          user
        }))
      })
    )
  }

  getSubmissions = publication => {
    rootRef.child("submissions").child(publication).on("value", snap =>
      this.setState({
        submissions: _.map(snap.val(), (submission, user) => ({
          ...submission,
          user
        }))
      })
    )
  }

  getPublicationId = publication => {
    this.setState({ publicationId: publication })
  }

  componentDidMount = () => {
    this.getUsuariosPostulados()
    this.getPublication(this.props.match.params.favorID)
    this.getPublicationId(this.props.match.params.favorID)
    this.getComments(this.props.match.params.favorID)
    this.getSubmissions(this.props.match.params.favorID)
  }

  componentWillReceiveProps = nextProps => {
    this.getUsuariosPostulados()
    this.getPublication(nextProps.match.params.favorID)
    this.getPublicationId(nextProps.match.params.favorID)
    this.getComments(nextProps.match.params.favorID)
    this.getSubmissions(nextProps.match.params.favorID)
}

  openDialog = () => {
    this.setState({ visible: true });
  };

  closeDialog = () => {
    this.setState({ visible: false });
  };

  getPostuladosDialog = () =>{
    return (
      <Dialog
          id="simpleDialogExample"
          visible={this.state.visible}
          title={"Postulados"}
          onHide={this.closeDialog}
      >
        <List>
          {
            (this.state.postulados)
              .filter((x)=> {return (this.state.submissions.map((y)=> {return y.user})).includes(x.user)})
              .map((x) => {
                return( 
                  <ListItem 
                    primaryText={x.name+" "+x.lastname}
                    leftAvatar={<UserAvatar url={x.photoURL} />} 
                  />
                )
              })
          }
        </List>
      </Dialog>

    )
  }

  getPostulados = () =>
    this.state.publication.submissions === 1
      ? this.state.publication.submissions + " Postulado"
      : (this.state.publication.submissions || 0) + " Postulados"

  postularse = () => {
    rootRef
      .child("submissions/" + this.state.publicationId + "/" + this.props.user.uid)
      .child("date").set(firebase.database.ServerValue.TIMESTAMP)
    
    rootRef
      .child("publications/" + this.state.publicationId)
      .transaction(
        function(publication){
          publication.submissions++
          return publication
        }
      )
  }

  render = () => {
    return (
      <MainPage>
        {this.state.publication &&
          <Card
            style={{ width: "100%", maxWidth: 600 }}
            className="md-block-centered publication-view"
          >
            <CardTitle
              avatar={<UserAvatar url={this.state.user.photoURL} />}
              title={`${this.state.user.lastname}, ${this.state.user.name}`}
              subtitle={
                <a href="#/">
                  Categoria
                  {" "}
                  <FontIcon>chevron_right</FontIcon>
                  {" "}
                  {this.state.category}
                </a>
              }
            >
              <div className="md-card-title--title-block md-cell--right">
                <FontIcon>access_time</FontIcon> {" "}
                {(new Date(this.state.publication.end || new Date()))
                  .toLocaleDateString("es-AR", {
                    weekday: "long",
                    year: "numeric",
                    month: "short",
                    day: "numeric"
                  })}
              </div>
            </CardTitle>
            <CardTitle
              title={this.state.publication.title}
              subtitle={
                <a href="#/"><FontIcon>place</FontIcon> {this.state.state} </a>
              }
            />
            { this.state.publication.imageURL && this.state.publication.imageURL !== "" &&
            <Media>
              <img
                src={this.state.publication.imageURL}
                role="presentation"
              />
            </Media>}
            <CardText>
              {this.state.publication.text.split("\n").map(function(item, key) {
                return (
                  <p key={key}>
                    {item}
                  </p>
                )
              })}
            </CardText>
            <CardActions>
              <Button
                raised
                label={this.getPostulados()}
                tooltipPosition="top"
                tooltipLabel={
                  (this.state.publication.user !== this.props.user.uid || null)
                  || this.state.publication.submissions < 1                
                  ?null:"Ver Postulados"
                }
                disabled={
                  (this.state.publication.user !== this.props.user.uid || null)
                  || this.state.publication.submissions < 1
                }
                onClick={() => {this.openDialog()}}
              />
              {this.getPostuladosDialog()}
              {this.props.user.uid === this.state.publication.user
                ? <div className="md-cell--right">
                    <Button
                      tooltipLabel="Mis Gauchadas"
                      tooltipPosition="top"
                      icon
                    >
                      apps
                    </Button>
                    <Button
                      tooltipLabel="Editar"
                      tooltipPosition="top"
                      icon
                      disabled
                    >
                      create
                    </Button>
                    <Button
                      tooltipLabel="Eliminar"
                      tooltipPosition="top"
                      icon
                      disabled
                    >
                      delete
                    </Button>
                  </div>
                : <div className="md-cell--right">
                    <Button tooltipLabel="Preguntar" tooltipPosition="top" icon>
                      comment
                    </Button>
                    {this.state.submissions.find(
                      submission => submission.user === this.props.user.uid
                    )
                      ? <Button
                          tooltipLabel="Despostularme"
                          tooltipPosition="top"
                          icon
                        >
                          thumb_down
                        </Button>
                      : <Button
                          tooltipLabel="Postularme!"
                          tooltipPosition="top"
                          onClick={this.postularse}
                          primary
                          icon
                        >
                          thumb_up
                        </Button>}
                  </div>}
            </CardActions>
            <CardText className="comments">
              <ul className="md-list">
                {this.state.comments.map(comment => {
                  console.log(comment)
                  return (
                    <li className="md-list-tile" key={comment.id}>
                      <Comment
                        comment={comment}
                        canReplay={
                          this.props.user.uid === this.state.publication.user
                        }
                        user={this.props.user}
                        publicationId={this.state.publicationId}
                      />
                    </li>
                  )
                })}
              </ul>
            </CardText>
            <Divider/>
            {this.props.user.uid !== this.state.publication.user &&
              <MakeComment user={this.props.user} path={this.state.publicationId}/>}
          </Card>}
      </MainPage>
    )
  }
}
export default Publication
