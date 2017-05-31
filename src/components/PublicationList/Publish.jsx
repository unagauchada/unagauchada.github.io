import React from "react"
import { connect } from "react-redux"
import Avatar from "react-md/lib/Avatars"
import FontIcon from "react-md/lib/FontIcons"
import Button from "react-md/lib/Buttons/Button"
import TextField from "react-md/lib/TextFields"
import DatePicker from "react-md/lib/Pickers/DatePickerContainer"

import { userSelector } from "../../redux/getters"
import rootRef from "../../libs/db"

@connect(state => ({ user: userSelector(state) }))
class Publish extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      title: "",
      category: 1,
      state: 1,
      text: ""
    }
  }

  submit = () => {
    let { title, category, state, text } = this.state
    let user = this.props.user.uid
    rootRef
      .child("publications")
      .push({ title, category, state, text, user },() => this.clean())
    rootRef
      .child("users/" + this.getUserId().toString() + "/credits")
      .once(
        "value",
        snap => 
            rootRef
                .child("users/" + this.getUserId().toString() + "/credits")
                .set(snap.val() - 1))    
  }

  cancel = () => this.clean()

  clean = () => {
    this.setState({ title: "", category: 1, state: 1, text: "" })
    this.props.handleClose()
  }

  handleChange = property => value => this.setState({ [property]: value })

  render = () => (
    <section className="dialog md-grid">
      <section className="header md-cell md-cell--2 md-cell--middle md-text-center ">
        <Avatar icon={<FontIcon>person</FontIcon>} />
      </section>
      <TextField
        id="floatingTitle"
        label="Title"
        customSize="title"
        size={10}
        className="md-cell md-cell--10 md-cell--middle"
        value={this.state.title}
        onChange={this.handleChange('title')}
      />
      <TextField
        block
        paddedBlock
        id="body"
        placeholder="Descripción"
        rows={4}
        maxLength={240}
        value={this.state.text}
        onChange={this.handleChange('text')}
      />

      <section className="md-cell md-cell--12">
        <Button icon>insert_photo</Button>
        <Button icon>place</Button>
        <Button icon>insert_chart</Button>
      </section>
      <section className="footer md-cell md-cell--12 md-text-right">
        <Button flat label="Cancelar" onClick={this.cancel} />
        <Button raised primary label="Publicar!" onClick={this.submit} />
      </section>
    </section>
  )
}

export default Publish