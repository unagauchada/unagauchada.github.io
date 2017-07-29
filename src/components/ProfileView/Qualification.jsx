import React from "react"
import rootRef from "../../libs/db"
import UserAvatar from '../UserAvatar'
import "./qualification.scss"
import Button from "react-md/lib/Buttons"
import { Link } from "react-router-dom"

class Qualification extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      user: { name: "", lastname: "", id: 1 },
    }
  }

  componentDidMount = () => this.getUser(this.props.qualification.gaucho)

  componentWillReceiveProps = nextProps => this.getUser(nextProps.qualification.gaucho)

  getUser = user => {
    rootRef
      .child("users")
      .child(user)
      .on("value", snap => this.setState({ user: snap.val() }))
  }

  showQualificationValue = () => {
      switch(this.props.qualification.value){
        case -1:
            return <Button secondary icon >sentiment_very_dissatisfied</Button>;
        case 0:
            return <Button icon >sentiment_neutral</Button>
        case 1:
            return <Button primary icon >sentiment_very_satisfied</Button>
        default:
            return;
      }
  }

  render = () => (
    <div className="qualification">
      <div className="user">
        <Link to={"/profile/"+this.props.qualification.gaucho}>
        <UserAvatar url={this.state.user.photoURL} />
        </Link>
      </div>
      <section>
        <h3>
          <div>{this.state.user.lastname}, {this.state.user.name}</div>
        </h3>
        {this.props.qualification.comment}
      </section>
      {this.showQualificationValue()}
    </div>
  )
}

export default Qualification
