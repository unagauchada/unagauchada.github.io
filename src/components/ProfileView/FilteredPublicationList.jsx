import React from "react"
import _ from "lodash"
import { connect } from "react-redux"
import Button from "react-md/lib/Buttons/Button"
import Dialog from "react-md/lib/Dialogs"
import Snackbar from "react-md/lib/Snackbars"

import rootRef from "../../libs/db"
import Publication from "../PublicationList/Publication"
import { userSelector } from "../../redux/getters"
import "../PublicationList/PublicationList.scss"

const publicationCost = 1

@connect(state => ({ user: userSelector(state) }))
class PublicationList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      publications: [],
      visible: false,
      credits: 0,
      toasts: [],
      autohide: true
    }
  }

  _addToast = (text, action) => {
    const toasts = this.state.toasts.slice()
    toasts.push({ text, action })

    this.setState({ toasts })
  }

  _removeToast = () => {
    const [, ...toasts] = this.state.toasts
    this.setState({ toasts })
  }

  toastFailure = () => {
    this._addToast("No posee suficiente credito")
  }

  componentDidMount = () => {
    this.getPublications()
  }

  componentWillReceiveProps = nextProps => {
    this.getCredits(nextProps)
  }

  openDialog = () => this.setState({ visible: true })

  closeDialog = () => this.setState({ visible: false })

  getPublications = () =>
    rootRef.child("publications").on("value", snap => {
      this.setState({
        publications: _.map(
          snap.val(),
          (publication, id) =>
            publication
              ? {
                  ...publication,
                  id
                }
              : null
        )
      })
    })

  getUserId = props => {
    var uid

    if (props.user != null) {
      uid = props.user.uid.toString() // The user's ID, unique to the Firebase project. Do NOT use
      // this value to authenticate with your backend server, if
      // you have one. Use User.getToken() instead.
    }

    console.log(uid)
    return uid
  }

  getCredits = props => {
    rootRef
      .child("users/" + this.getUserId(props) + "/credits")
      .on("value", snap => {
        console.log(snap.val())
        this.setState({ credits: snap.val() })
      })
  }

  render = () => {
    return (
      <publications>
        {this.state.publications
          .filter(this.props.filter)
          .sort(function(a, b) {
            return b.submissions - a.submissions
          })
          .map(
            publication =>
              publication &&
              <Publication key={publication.id} publication={publication} />
          )}
      </publications>
    )
  }
}

export default PublicationList