import React from "react"
import rootRef from "../../libs/db"
import ListItem from "react-md/lib/Lists/ListItem"
import MenuButton from "react-md/lib/Menus/MenuButton"
import UserAvatar from '../UserAvatar'
import MakeComment from './MakeComment'
import "./Comment.scss"

class Comment extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      user: { name: "", lastname: "", id: 1 },
      showReplyBox: false
    }
  }

  componentDidMount = () => this.getUser(this.props.comment.user)

  componentWillReceiveProps = nextProps => this.getUser(nextProps.comment.user)

  getUser = user => {
    rootRef
      .child("users")
      .child(user)
      .on("value", snap => this.setState({ user: snap.val() }))
  }

  showReplyBox = () => {
    this.setState({showReplyBox: true})
  }

  makeOwnerMenu = () =>
    this.props.canReplay && !this.props.comment.response
      ? [<ListItem key="replay" primaryText="Responder" onClick={this.showReplyBox} />]
      : []

  delete = () => {
    rootRef
        .child("comments/" + this.props.publicationId + "/" + this.props.comment.id)
        .remove()
  }

  makePublisherMenu = () =>
    this.props.user &&
      this.props.user.uid === this.props.comment.user &&
      !this.props.comment.response
      ? [
          <ListItem key="edit" primaryText="Modificar" />,
          <ListItem key="delete" primaryText="Eliminar" onClick={this.delete}/>
        ]
      : []

  makeMenu = () => [...this.makeOwnerMenu(), ...this.makePublisherMenu()]

  render = () => (
    <comment>
      {this.makeMenu().length > 0 &&
        <MenuButton
          id={`comment-menu-${this.props.comment.id}`}
          icon
          buttonChildren="more_vert"
          className="menu-example md-cell md-cell--right"
        >
          {this.makeMenu()}
        </MenuButton>}
      <div className="user">
        <UserAvatar url={this.state.user.photoURL} />
      </div>
      <section>
        <h3>
          <div>{this.state.user.lastname}, {this.state.user.name}</div>

        </h3>
        {this.props.comment.text}
        {this.state.showReplyBox && !this.props.comment.response &&
          <MakeComment 
            user={this.props.user} 
            path={this.props.publicationId + "/" + this.props.comment.id + "/response"}/>
        }
        {this.props.comment.response &&
          <Comment
            comment={Object.values(this.props.comment.response)[0]}
            canReplay={false}
            user={this.props.user}
          />}
      </section>
    </comment>
  )
}

export default Comment
