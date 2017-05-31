import React, { PureComponent } from 'react';
import _ from 'lodash';
import Media from 'react-md/lib/Media/Media';
import MediaOverlay from 'react-md/lib/Media/MediaOverlay';
import Button from 'react-md/lib/Buttons/Button';
import rootRef from "../../libs/db";
import firebase from "firebase";
import Divider from 'react-md/lib/Dividers';
import Subheader from 'react-md/lib/Subheaders';
import Comment from './comment';
import List from 'react-md/lib/Lists/List';




export default class NuView extends PureComponent {

	 constructor(props) {
    super(props)
    this.state = {
      user : ['4/09/1996','La Plata', 'Pierobon', 'Matias', '221-666-7777'],
    	publication : [],
    	category : "",
    	comments: [],
    	submissions: [],
    	curUser: ""    	
    }
  }


  fetchRest = (publication) => {
    this.getUser(publication.user)
    this.getCategory(publication.category)
  }

  getPublication = (publication) =>{
    rootRef
    .child('publications')
    .child(publication)
    .on('value',snap => ( this.setState(({ publication: snap.val()}), this.fetchRest(snap.val())) ) );
    }

  getUser = (user) =>{
  	rootRef
  		.child('users')
  		.child(user)
  		.on('value',snap => ( this.setState( { user: snap.val()})));
  }

  getCategory = (category) =>{
  	rootRef
  		.child('categories')
  		.child(category)
  		.on('value',snap => ( this.setState( { category: snap.val().name})));
  }

  getComments = (publication) =>{
  	rootRef
  		.child('comments')
  		.child(publication)
  		.on('value',snap => ( this.setState( { comments: _.map(snap.val(), (comment,id) => ({...comment, id}))}, console.log(this.state.comments)) ) );
  }


  getSubmissions = (publication) =>{
  	rootRef
  		.child('submissions')
  		.child(publication)
  		.on('value',snap => ( this.setState( { submissions: snap.val()}) ) );
  }


  componentDidMount = () => {this.getPublication(this.props.match.params.favorID)
  	this.getComments(this.props.match.params.favorID)	
  	this.getSubmissions(this.props.match.params.favorID)	
  	this.setState({ curUser : firebase.auth().currentUser })
  }
  
  componentWillReceiveProps = nextProps => {this.getPublication( nextProps.match.params.favorID)
  	this.getComments(nextProps.match.params.favorID)
  	this.getSubmissions(nextProps.match.params.favorID)
  	this.setState({ curUser : firebase.auth().currentUser })
  }
  


	render = () =>(

		<div className="md-grid ">

			<div className="md-cell--2 md-cell--1-offset">
        <Media aspectRatio="4-3">
        	<img src={`https://unsplash.it/350/150/?random&time=${new Date().getTime()}`} role="presentation" />
            <MediaOverlay>
            </MediaOverlay>
        </Media>
        <h1>{this.state.user.name+" "+this.state.user.lastname}</h1>
        <h6>{this.state.user.birtdate}</h6>
        {this.state.user.location}

        {	(this.state.curUser != null ) && (
        		this.state.curUser.uid  === this.state.publication.user?
        		<Button flat label="Ver mis Gauchadas"/>
        		: "")
        }	
			</div>

			<div className="md-cell--5 md-cell--1-offset">
				<form className="divider-example-container">
      		<h1> {this.state.publication.title} </h1>
      		<p>Fecha de creacion |  {this.state.category} | 
      		{this.state.publication.submissions===1?this.state.publication.submissions+" Postulado": this.state.publication.submissions+" Postulados"} </p> 

      		<Divider className="md-divider-border md-divider-border--POSITION" />
      		
      		<Media aspectRatio="16-9">
        		<img src={`https://unsplash.it/400/175/?random&time=${new Date().getTime()}`} role="presentation" />
            	<MediaOverlay>
            	</MediaOverlay>
        	</Media>

        	<h5>{this.state.publication.text}</h5>
        	<Divider className="md-divider-border md-divider-border--POSITION" />
        	
        	
        		<Button flat label="Comentar"/> 
        		<Button flat label="Postularse"  /> 
      		
      		<Divider />
      		<h2>Preguntas</h2>
          { this.state.comments.lenght}  
      		  <List className="md-cell md-paper md-paper--2">
      			 {this.state.comments.slice(1).map(publication => publication && <Comment question={publication} />) }
      		  </List>
          
    		</form>
			</div>


		</div>



		)


}