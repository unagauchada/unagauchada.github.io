import React from "react"
import firebase from "firebase"
import Card from "react-md/lib/Cards/Card"
import CardTitle from "react-md/lib/Cards/CardTitle"
import CardText from "react-md/lib/Cards/CardText"
import CardActions from "react-md/lib/Cards/CardActions"
import Media, { MediaOverlay } from "react-md/lib/Media"
import Button from "react-md/lib/Buttons"
import CompanyLogo from "../../assets/logo.png"
import rootRef from "../../libs/db"
import UserAvatar from "../UserAvatar"

class Publication extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      user: { name: "", lastname: "" },
      category: { name: "" },
      state: { name: "" }
    }
  }

  componentDidMount = () => this.fetchAll(this.props.publication)

  componentWillReceiveProps = nextProps => this.fetchAll(nextProps.publication)

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

  render = () => (
    <Card
      style={{ maxWidth: 400 }}
      className="md-block-centered md-cell--top "
      expanderTooltipLabel="Expandir descripcion!"
    >
      <CardTitle
        avatar={<UserAvatar url={this.state.user.photoURL} />}
        title={this.state.user.name}
        subtitle={this.state.state.name}
      />
      <Media>
        <img
          src={
            this.props.publication.imageURL &&
              this.props.publication.imageURL != ""
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
          <a href={"#/favor/" + this.props.publication.id}>
            <Button flat secondary label="Ver" />
          </a>
        </CardActions>
      ]}
    </Card>
  )
}

export default Publication
