import React from "react"
import _ from "lodash"
import { connect } from "react-redux"
import rootRef from "../../libs/db"
import Publication from "../PublicationList/Publication"
import { userSelector } from "../../redux/getters"
import "../PublicationList/PublicationList.scss"

@connect(state => ({ user: userSelector(state) }))
class PublicationList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      publications: []
    }
  }

  componentDidMount = () => {
    this.getPublications()
  }

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
              <Publication
                canReport={this.props.canReport}
                key={publication.id}
                publication={publication}
              />
          )}
      </publications>
    )
  }
}

export default PublicationList
