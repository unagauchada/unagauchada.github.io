import React from "react"
import _ from "lodash"
import { connect } from "react-redux"
import FontIcon from "react-md/lib/FontIcons"
import Button from "react-md/lib/Buttons/Button"
import TextField from "react-md/lib/TextFields"
import SelectField from "react-md/lib/SelectFields"

import { userSelector } from "../../redux/getters"
import rootRef, { storageRef } from "../../libs/db"
import UserAvatar from "../UserAvatar"
import ImageUpload from "./ImageUpload"
import firebase from "firebase"

const duration = 15
const thisDate = new Date()

@connect(state => ({ user: userSelector(state) }))
class Publish extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      title: "",
      category: 1,
      state: 1,
      submissions: 0,
      text: "",
      end: thisDate.setDate(thisDate.getDate() + duration),
      image: { url: "", file: null },
      categories: [{ name: "loading", value: "1" }],
      states: [{ name: "loading", value: "1" }]
    }
  }

  componentDidMount = () => {
    rootRef.child("states").on("value", snap =>
      this.setState({
        states: _.map(snap.val(), (state, value) => ({ ...state, value })).sort(
          (a, b) => (a.name.toUpperCase() < b.name.toUpperCase() ? -1 : 1)
        )
      })
    )
    rootRef.child("categories").on("value", snap =>
      this.setState({
        categories: _.map(snap.val(), (category, value) => ({
          ...category,
          value
        })).sort(
          (a, b) => (a.name.toUpperCase() < b.name.toUpperCase() ? -1 : 1)
        )
      })
    )
  }

  getUserId = () => {
    var uid

    if (this.props.user != null) {
      uid = this.props.user.uid
    }

    return uid
  }

  submit = () => {
    let { title, category, state, submissions, text, end } = this.state
    let imageURL = ""
    let user = this.props.user.uid
    let key = rootRef
      .child("publications")
      .push(
        { title, category, state, submissions, text, end, imageURL, user },
        () => this.clean()
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
        this.state.image.url = uploadTask.snapshot.downloadURL

        rootRef
          .child("publications/".concat(key).concat("/imageURL"))
          .set(this.state.image.url)

        rootRef
          .child("users/" + this.getUserId().toString() + "/credits")
          .once("value", snap =>
            rootRef
              .child("users/" + this.getUserId().toString() + "/credits")
              .set(snap.val() - 1)
          )
      }
    )
  }

  cancel = () => this.clean()

  clean = () => {
    this.setState({ title: "", category: 1, state: 1, text: "" })
    this.props.handleClose()
  }

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
    let placepicker = null
    return (
      <section className="dialog md-grid">
        <section className="header md-cell md-cell--2 md-cell--middle md-text-center ">
          <UserAvatar url={this.props.user.photoURL} />
        </section>
        <TextField
          id="floatingTitle"
          label="Title"
          customSize="title"
          size={10}
          className="md-cell md-cell--10 md-cell--middle"
          value={this.state.title}
          onChange={this.handleChange("title")}
        />
        <TextField
          block
          paddedBlock
          id="body"
          placeholder="Descripción"
          rows={4}
          value={this.state.text}
          onChange={this.handleChange("text")}
        />

        <section className="md-cell md-cell--12">
          <SelectField
            primary
            id="state"
            label="Lugar"
            itemLabel="name"
            itemValue="value"
            value={this.state.state}
            menuItems={this.state.states}
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
            menuItems={this.state.categories}
            onChange={this._handleCategoryChange}
            required
            errorText="Debes seleccionar una categoria para el favor"
            className="md-cell"
          />
          <ImageUpload setImage={this.setImage} />
        </section>
        <section className="footer md-cell md-cell--12 md-text-right">
          <Button flat label="Cancelar" onClick={this.cancel} />
          <Button raised primary label="Publicar!" onClick={this.submit} />
        </section>
      </section>
    )
  }
}

export default Publish
