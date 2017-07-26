import React from "react"
import _ from "lodash"
import Button from "react-md/lib/Buttons/Button"
import TextField from "react-md/lib/TextFields"
import SelectField from 'react-md/lib/SelectFields';
import Snackbar from 'react-md/lib/Snackbars';
import rootRef, { storageRef } from "../../libs/db"
import UserAvatar from "../UserAvatar"
import PhotoEdit from "./PhotoEdit"
import FontIcon from "react-md/lib/FontIcons"
import Avatar from "react-md/lib/Avatars"
import PropTypes from 'prop-types';

const duration = 15
const thisDate = new Date()

class Edit extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      toasts: [],
      autohide: true,
      state: 0,
      birthdate: "",
      phone: "",
      image: { url: "", file: null },
      states: [{ name: "loading", value: "1" }]
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

  removeToast= () =>{
    const [, ...toasts] = this.state.toasts;
    this.setState({ toasts });
  }

  toastError=(error)=> {
    this.addToast('Campo '+ error +' incompleto');
  }

  componentDidMount = () => {
    this.setStates()
    this.initializeUserData()
  }

  initializeUserData = () => {
    this.props.user.birthdate && 
      this.setState({bithdate: this.props.user.birthdate})
    this.props.user.city && 
      this.setState({state: this.props.user.city})
    this.props.user.phone && 
      this.setState({phone: this.props.user.phone})
  }

  setStates = () => {
    rootRef.child("states").on("value", snap =>
      this.setState({
        states: _.map(snap.val(), (state, value) => ({ ...state, value })).sort(
          (a, b) => (a.name.toUpperCase() < b.name.toUpperCase() ? -1 : 1)
        )
      })
    )
  }

  submit = () => {
    let { phone, category, state, submissions, text, end } = this.state
    let imageURL = ""
    let user = this.props.user.uid
    let key = rootRef
      .child("publications")
      .push(
        { category, state, submissions, text, end, imageURL, user },
        () =>{ 
        rootRef
          .child("users/" + user + "/credits")
          .once("value", snap =>
            rootRef
              .child("users/" + user + "/credits")
              .set(snap.val() - 1)
          )
          this.clean()
        }
      ).key

    let uploadTask = storageRef
      .child("publications/".concat(key))
      .put(this.state.image.file)

    uploadTask.on(
      "state_changed",
      function(snapshot) {},
      function(error) {
        console.error(error)
      },
      () => {
        let image = { ...this.state.image, url: uploadTask.snapshot.downloadURL}
        this.setState({ image })

        rootRef
          .child("publications/".concat(key).concat("/imageURL"))
          .set(this.state.image.url)

      }
    )
  }

  cancel = () => this.clean()

  clean = () => {
    this.setState({  category: 1, state: 1, text: "" })
    this.props.handleClose()
  }

  _handleStateChange = (value, index, event) => { // eslint-disable-line no-unused-vars
    this.setState({ state: value, error: false });
  };
  
  _handleStateChange = (value, index, event) => {
    this.setState({ state: value })
  }

  _handleCategoryChange = (value, index, event) => {
    this.setState({ category: value })
  }

  handleChange = property => value => this.setState({ [property]: value })

  setImage = image => {
    let state = this.state
    state.image.file = image
    this.setState(state)
  }

  render = () => {
    return(
    <section className="dialog md-grid">
      <section className="header md-cell md-cell--12 md-cell--middle md-text-center ">
        <PhotoEdit setImage={this.setImage} user={this.props.user}/>
      </section>
      <section className="md-cell md-cell--12">
        <TextField
          id="phone"
          type="tel"
          label="Telefono"
          className="md-cell"
          value={this.state.phone}
          onChange={this.handleChange('phone')}
        />
        <SelectField
          primary
          id="state"
          label="Lugar"
          itemLabel="name"
          itemValue="value"
          value={this.state.state}
          menuItems={this.state.states}
          onChange={this._handleStateChange}
          className="md-cell"
          leftIcon={<FontIcon>place</FontIcon>}
        />
      </section>
      <section className="footer md-cell md-cell--12 md-text-right">
        <Button flat label="Cancelar" onClick={this.cancel} />
        <Button raised primary label="Aceptar" onClick={this.submit} />
      </section>
      <Snackbar {...this.state} onDismiss={this.removeToast} />
      </section>
  )}
    
  }


export default Edit
