import React from "react"
import _ from "lodash"
import { connect } from "react-redux"
import Button from "react-md/lib/Buttons/Button"
import Dialog from "react-md/lib/Dialogs"

import rootRef from "../../libs/db"
import Publication from "./Publication"
import Publish from './Publish'
import { userSelector } from "../../redux/getters"
import "./PublicationList.scss"

@connect(state => ({ user: userSelector(state) }))
class PublicationList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      publications: [],
      visible: false
    }
  }

  componentDidMount = () => this.getPublications()

  openDialog = () => this.setState({ visible: true })

  closeDialog = () => this.setState({ visible: false })

  getPublications = () =>
    rootRef.child("publications").on("value", snap => {
      console.log(snap.val())
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

  render = () => (
    <publications>
      {this.state.publications.sort((function(a, b){return b.submissions - a.submissions})).map(
        publication =>
          publication &&
          <Publication key={publication.id} publication={publication} />
      )}
      { this.props.user !== null && (<add><Button
        className="add-publication"
        floating
        primary
        onClick={this.openDialog}
      >
        create
      </Button>
      <Dialog
        id="publishDialog"
        visible={this.state.visible}
        onHide={this.closeDialog}
        className="googleDialog"
      >
        <Publish handleClose={this.closeDialog} />
      </Dialog></add>) }
    </publications>
  )
}

export default PublicationList
