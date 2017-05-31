import React from "react"
import firebase from "firebase"
import Card from "react-md/lib/Cards/Card"
import CardTitle from "react-md/lib/Cards/CardTitle"
import CardActions from "react-md/lib/Cards/CardActions"
import CardText from "react-md/lib/Cards/CardText"
import Media, { MediaOverlay } from "react-md/lib/Media"
import Avatar from "react-md/lib/Avatars"
import Button from "react-md/lib/Buttons"

import rootRef from "../../libs/db"

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
    <Card style={{ maxWidth: 400 }} className="md-block-centered">
      <CardTitle
        avatar={
          <Avatar
            src={`https://unsplash.it/40/40?random&time=${new Date().getTime()}`}
            role="presentation"
          />
        }
        title={this.state.user.name}
        subtitle={this.state.state.name}
      />
      <Media>
        <img
          src={`https://unsplash.it/350/150/?random&time=${new Date().getTime()}`}
          role="presentation"
        />
        <MediaOverlay>
                <CardTitle title={this.props.publication.title} />
              </MediaOverlay>
      </Media>
      <CardActions>
          { firebase.auth().currentUser?
            <a href={"#/favor/"+this.props.publication.id} >
              <Button flat label="Ver"   />
            </a> 
           : "" }      
      </CardActions>
    </Card>
  )
}

export default Publication
