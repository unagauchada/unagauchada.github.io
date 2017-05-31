import React from "react"
import _ from "lodash"
import Button from "react-md/lib/Buttons/Button"

import rootRef from "../../libs/db"
import Publication from "./Publication"
import "./PublicationList.scss"

class PublicationList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      publications: []
    }
  }

  componentDidMount = () => this.getPublications()

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
      <Button className="add-publication" floating primary>create</Button>
    </publications>
  )
}

export default PublicationList
