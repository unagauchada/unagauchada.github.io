import React from "react"
import rootRef from "../../libs/db"
import TextField from 'react-md/lib/TextFields';
import UserAvatar from '../UserAvatar'
import CardText from "react-md/lib/Cards/CardText"
import CardActions from "react-md/lib/Cards/CardActions"
import Button from "react-md/lib/Buttons"
import "./Comment.scss"

class MakeComment extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      user: { name: "", lastname: "", id: 1 }
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

  render = () => (
    <div>
    <CardText className="comments">
        <ul className="md-list">
            <li className="md-list-tile">
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
                            inputStyle={{fontSize: 16}}
                        />
                    </section>
                </comment>
            </li>
        </ul>
    </CardText>
    <CardActions key="actions">
        <Button 
            className="md-btn--dialog md-cell--right"
            flat 
            secondary 
            style={{fontSize: 16}}
            label="Publicar" />
    </CardActions>
    </div>
  )
}

export default MakeComment
