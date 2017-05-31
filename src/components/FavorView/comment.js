import React from "react"
import Media from "react-md/lib/Media"
import Avatar from "react-md/lib/Avatars"
import Button from "react-md/lib/Buttons"
import rootRef from "../../libs/db"
import { HashRouter as Link } from "react-router-dom"
import firebase from "firebase";
import List from 'react-md/lib/Lists/List';
import ListItem from 'react-md/lib/Lists/ListItem';


class Comment extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }


  render = () => (
    <ListItem
      leftAvatar={<Avatar
            src={`https://unsplash.it/40/40?random&time=${new Date().getTime()}`}
            role="presentation"
          />}
      primaryText={this.props.question.text}
      secondaryText={this.props.question.response.text}
    />
    
    
  )
}


export default Comment


/*
<Card style={{ maxWidth: 400 }} className="md-block-centered">
      <CardTitle
        avatar={
          <Avatar
            src={`https://unsplash.it/40/40?random&time=${new Date().getTime()}`}
            role="presentation"
          />
        }
        title={this.props.asker}
        subtitle={this.props.question.text}
      />
      <CardText>
        <p>{this.props.question.response.text}</p>
      </CardText>
      <Media>
        <img
          src={`https://unsplash.it/350/150/?random&time=${new Date().getTime()}`}
          role="presentation"
        />
      </Media>
      <CardActions>      
      </CardActions>
    </Card>
*/