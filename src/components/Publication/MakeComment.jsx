import React from "react"
import rootRef from "../../libs/db"
import TextField from 'react-md/lib/TextFields';
import UserAvatar from '../UserAvatar'
import CardText from "react-md/lib/Cards/CardText"
import CardActions from "react-md/lib/Cards/CardActions"
import Button from "react-md/lib/Buttons"
import firebase from "firebase"
import "./Comment.scss"

class MakeComment extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      user: { name: "", lastname: "", id: 1 },
      showingActions: false,
      text: ""
    }
  }

  componentDidMount = () => this.getUser(this.props.user.uid)

  componentWillReceiveProps = nextProps => this.getUser(nextProps.user.uid)

  getUser = user => {
    rootRef
      .child("users")
      .child(user)
      .on("value", snap => this.setState({ user: snap.val() }))
  }

  showActions = () => {
    this.setState({showingActions: true})
  }

  handleChange = value => {
    this.setState({
      text: value
    })
  }

  publishComment = () => {
    if(this.state.text === ""){ 
      return
    }


    let date = firebase.database.ServerValue.TIMESTAMP
    let text = this.state.text
    let user = this.props.user.uid
    console.log(this.props.path)

    rootRef
        .child("comments/".concat(this.props.path))
        .push(
            { date, text, user },
            () => this.clean()
        )
    }

  clean = () => {
    this.setState({ showingActions: false, text: "" })
  }

  render = () => (
    <div>
    <CardText className="comments">
        <comment>
            <div className="user">
                <UserAvatar url={this.state.user.photoURL} />
            </div>
            <section>
                <TextField
                    block
                    id="makeCommentField"
                    placeholder="Añadir un comentario..."
                    rows={1}
                    value={this.state.text}
                    inputStyle={{fontSize: 16}}
                    onClick={this.showActions}
                    onChange={this.handleChange}
                />
            </section>
        </comment>
    </CardText>
    {this.state.showingActions && 
        <CardActions key="actions">
            <Button 
                className="md-btn--dialog md-cell--right"
                flat 
                secondary 
                style={{fontSize: 16}}
                label="Publicar"
                onClick={this.publishComment} />
        </CardActions>}
    </div>
  )
}

export default MakeComment
