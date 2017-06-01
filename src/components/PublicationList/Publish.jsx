import React from "react"
import { connect } from "react-redux"
import Avatar from "react-md/lib/Avatars"
import FontIcon from "react-md/lib/FontIcons"
import Button from "react-md/lib/Buttons/Button"
import TextField from "react-md/lib/TextFields"
import SelectField from 'react-md/lib/SelectFields';
import Snackbar from 'react-md/lib/Snackbars';

import { userSelector } from "../../redux/getters"
import rootRef, { storageRef } from "../../libs/db"
import ImageUpload from './ImageUpload';
import firebase from "firebase"

const stateItems = [{
  name: "La Plata",
  value: 1
},{
  name: "otro",
  value: 2
}]

const categoryItems = [{
  name: "Entretenimiento",
  value: 1
},{
  name: "Otros",
  value: 2
}]

const duration = 15
const thisDate = new Date()

@connect(state => ({ user: userSelector(state) }))
class Publish extends React.Component {
  constructor(props) {
    super(props)


    this.state = {
      toasts: [],
      autohide: true,
      title: "",
      category: 0,
      state: 0,
      submissions: 0,
      text: "",
      end: thisDate.setDate(thisDate.getDate() + duration),
      image: {url: "", file: null}
    }
  }

  componentWillUpdate =(nextProps, nextState)=> {
    const { toasts } = nextState;
    const [toast] = toasts;
    if (this.state.toasts === toasts || !toast) {
      return;
    }

    const autohide = toast.action !== 'Retry';
    this.setState({ autohide });
  }

  addToast = (text, action)=> {
    const toasts = this.state.toasts.slice();
    toasts.push({ text, action });

    this.setState({ toasts });
  }

  removeToast=() =>{
    const [, ...toasts] = this.state.toasts;
    this.setState({ toasts });
  }

  toastError=(error)=> {
    this.addToast('Campo '+ error +' incompleto');
  }


  getUserId = () => {
    var uid;

    if (this.props.user != null) {
        uid = this.props.user.uid;  // The user's ID, unique to the Firebase project. Do NOT use
                        // this value to authenticate with your backend server, if
                        // you have one. Use User.getToken() instead.
    }

    return uid
  }

  submit = () => {
    if(this.state.title == ""){ 
      this.toastError('titulo')
      return
    }
    if(this.state.text == ""){ 
      this.toastError('descripcion')
      return
    }
    if(this.state.category == 0){ 
      this.toastError('categoria')
      return
    }
    if(this.state.state == 0){ 
      this.toastError('lugar')
      return
    }

    let { title, category, state, submissions, text, end } = this.state
    let imageURL = ""
    let user = this.props.user.uid
    let key = rootRef
                .child("publications")
                .push({ title, category, state, submissions, text, end, imageURL, user },() => this.clean()).key

    console.log(this.state.image.file)
    console.log(key)
    //image uploading to Firebase
    let uploadTask = storageRef
                        .child('publications/'.concat(key))
                        .put(this.state.image.file);

    uploadTask.on('state_changed', function(snapshot){
      // Observe state change events such as progress, pause, and resume
      // See below for more detail
    }, function(error) {
      // Handle unsuccessful uploads
    }, () => {
      // Handle successful uploads on complete
      // For instance, get the download URL: https://firebasestorage.googleapis.com/...
      this.state.image.url = uploadTask.snapshot.downloadURL;
      
      console.log(this.state.image.url)
      rootRef
        .child("publications/".concat(key).concat("/imageURL"))
        .set(this.state.image.url)

      rootRef
        .child("users/" + this.getUserId().toString() + "/credits")
        .once(
          "value",
          snap => 
              rootRef
                  .child("users/" + this.getUserId().toString() + "/credits")
                  .set(snap.val() - 1))    
      });
}

  cancel = () => this.clean()

  clean = () => {
    this.setState({ title: "", category: 1, state: 1, text: "" })
    this.props.handleClose()
  }

  _handleStateChange = (value, index, event) => { // eslint-disable-line no-unused-vars
    this.setState({ state: value, error: false });
  };

  _handleCategoryChange = (value, index, event) => { // eslint-disable-line no-unused-vars
    this.setState({ category: value });
  };

  handleChange = property => value => this.setState({ [property]: value })

  setImage = (image) => {
    let state = this.state
    state.image.file = image
    this.setState(state)
  }

  render = () => {
    let placepicker = null
    return(
    <section className="dialog md-grid">
      <section className="header md-cell md-cell--2 md-cell--middle md-text-center ">
        <Avatar icon={<FontIcon>person</FontIcon>} />
      </section>
      <TextField
        id="floatingTitle"
        label="Title"
        customSize="title"
        required
        size={10}
        className="md-cell md-cell--10 md-cell--middle"
        value={this.state.title}
        errorText={"debe ingresar un titulo"}
        onChange={this.handleChange('title')}
      />
      <TextField
        block
        paddedBlock
        id="body"
        required
        placeholder="Descripción"
        rows={4}
        value={this.state.text}
        errorText={"debe ingresar una descripcion"}
        onChange={this.handleChange('text')}
      />

      <section className="md-cell md-cell--12">
        <SelectField
          primary
          id="state"
          label="Lugar"
          itemLabel="name"
          itemValue="value"
          value={this.state.state}
          menuItems={stateItems}
          onChange={this._handleStateChange}
          required
          errorText="Debes seleccionar un lugar para el favor"
          className="md-cell"
          leftIcon={<FontIcon>place</FontIcon>}
        />
        <SelectField
          primary
          id="category"
          label="Categoria"
          itemLabel="name"
          itemValue="value"
          value={this.state.category}
          menuItems={categoryItems}
          onChange={this._handleCategoryChange}
          required
          errorText="Debes seleccionar una categoria para el favor"
          className="md-cell"
        />
        <ImageUpload setImage={this.setImage}/>
      </section>
      <section className="footer md-cell md-cell--12 md-text-right">
        <Button flat label="Cancelar" onClick={this.cancel} />
        <Button raised primary label="Publicar!" onClick={this.submit} />
      </section>
      <Snackbar {...this.state} onDismiss={this.removeToast} />
   </section>
  )}
}

export default Publish