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
import DatePicker from 'react-md/lib/Pickers/DatePickerContainer';
import "./ProfileView.scss"

const duration = 15
const today = new Date();

import { connect } from "react-redux"
import { userSelector } from "../../redux/getters"

@connect(state => ({ currentUser: userSelector(state) }))
class Edit extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      state: 0,
      stateChanged: false,
      birthdate: new Date(),
      birthdateChanged: false,
      phone: "",
      phoneChanged: false,
      image: { url: "", file: null },
      imageChanged: false,
      states: [{ name: "loading", value: "1" }]
    }
  }

  componentDidMount = () => {
    this.setStates()
    this.initializeUserData(this.props.user)
  }

  initializeUserData = user => {
    user.birthdate && 
      this.setState({birthdate: this.props.user.birthdate})
    user.city && 
      this.setState({state: this.props.user.city})
    user.phone && 
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
    let { state, birthdate, phone } = this.state
    let imageURL = ""
    let user = this.props.currentUser.uid
    if(this.state.birthdateChanged){
      console.log("birthdate changed")
      rootRef
        .child("users/".concat(user).concat("/birthdate"))
        .set(birthdate)      
    }
    if(this.state.stateChanged){
      console.log("state changed")
      rootRef
        .child("users/".concat(user).concat("/city"))
        .set(state)      
    }
    if(this.state.phoneChanged){
      console.log("phone changed")
      rootRef
        .child("users/".concat(user).concat("/phone"))
        .set(phone)      
    }
    if(this.state.imageChanged){
      console.log("photo changed")
      let uploadTask = storageRef
        .child("users/" + user)
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
            .child("users/".concat(user).concat("/photoURL"))
            .set(this.state.image.url)

        }
      )
    }
    this.clean()
  }

  cancel = () => this.clean()

  clean = () => {
    this.setState({  category: 1, state: 1, text: "" })
    this.props.handleClose()
  }

  _handleStateChange = (value, index, event) => { // eslint-disable-line no-unused-vars
    this.setState({ state: value, error: false });
    this.setState({ stateChanged: true})
  };
  
  _handleStateChange = (value, index, event) => {
    this.setState({ state: value })
    this.setState({ stateChanged: true})
  }

  handlePhoneChange =  (value) => {
    this.setState({ phone: value })
    this.setState({ phoneChanged: true})
  }
  
  handleBirthdateChange =  (value) => {
    this.setState({ birthdate: value })
    this.setState({ birthdateChanged: true})
  }

  setImage = image => {
    let state = this.state
    state.image.file = image
    state.imageChanged = true
    this.setState(state)
  }

  render = () => {
    return(
    <section className="dialog md-grid">
      <section className="header md-cell md-cell--12 md-cell--middle md-text-center ">
        <PhotoEdit setImage={this.setImage} photoURL={this.props.user.photoURL}/>
      </section>
      <section className="md-cell md-cell--12">
        <TextField
          id="phone"
          type="tel"
          label="Telefono"
          leftIcon={<FontIcon>phone</FontIcon>}
          className="md-cell"
          value={this.state.phone}
          onChange={this.handlePhoneChange}
        />
        <SelectField
          primary
          id="state"
          label="Localidad"
          itemLabel="name"
          itemValue="value"
          value={this.state.state}
          menuItems={this.state.states}
          onChange={this._handleStateChange}
          className="md-cell"
          leftIcon={<FontIcon>place</FontIcon>}
        />
        <div className="md-grid" style={{ padding: 0 }}>
          <DatePicker
            id="datePicker"
            label="Fecha de nacimiento"
            value={this.state.birthdate}
            onChange={this.handleBirthdateChange}
            maxDate={new Date()}
            defaultCalendarMode="year"
            fullWidth={false}
            inline
            className="md-cell datePicker"
          />
        </div>
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
