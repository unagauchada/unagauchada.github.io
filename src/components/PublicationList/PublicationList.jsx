import React from "react"
import _ from "lodash"
import { connect } from "react-redux"
import Button from "react-md/lib/Buttons/Button"
import Dialog from "react-md/lib/Dialogs"
import Snackbar from "react-md/lib/Snackbars";
import Divider from 'react-md/lib/Dividers';
import rootRef from "../../libs/db"
import Publication from "./Publication"
import Publish from "./Publish"
import { userSelector } from "../../redux/getters"
import "./PublicationList.scss"



const publicationCost = 1

@connect(state => ({ user: userSelector(state) }))
class PublicationList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      searchText: "",
      searchLoc: "default",
      searchCat: "default",

      categories: [],
      publications: [],
      visible: false,
      catVisible:false,
      locVisible:false,
      credits: 0,
      toasts: [],
      autohide: true
    }
  }

  _addToast = (text, action) => {
    const toasts = this.state.toasts.slice()
    toasts.push({ text, action })

    this.setState({ toasts })
  }

  _removeToast = () => {
    const [, ...toasts] = this.state.toasts
    this.setState({ toasts })
  }

  toastFailure = () => {
    this._addToast("No posee suficiente credito")
  }

  componentDidMount = () => {
    this.getPublications()
    this.getStates()
    this.getCategories()
    this.getUsers()
    this.getCredits(this.props)
  }

  getStates = () => {
    rootRef.child("states").on("value", snap =>
      this.setState({
        states: _.map(snap.val(), (state, value) => ({ ...state, value })).sort(
          (a, b) => (a.name.toUpperCase() < b.name.toUpperCase() ? -1 : 1)
        )
      })
    )
  }

  getUsers = () =>{
    rootRef.child("users").on("value", snap =>
      this.setState({
        users: _.map(snap.val(), (user, id) => ({
          ...user,
          id
        }))
      })
    )
  }


  getCategories = () => {
    rootRef.child("categories").on("value", snap =>
      this.setState({
        categories: _.map(snap.val(), (category, value) => ({ ...category, value})).sort(
          (a, b) => (a.name.toUpperCase() < b.name.toUpperCase() ? -1 : 1)
        )
      })
    )
  }

  componentWillMount = () => {
    this.setState({
      searchText: this.props.searchText,
      searchLoc: this.props.searchLoc,
      searchCat: this.props.searchCat
    })
  }

      

  componentWillReceiveProps = (nextProps, nextContext) => {
    console.log(nextProps)
    this.getCredits(nextProps)
    this.setState({searchText: nextProps.searchText})
  }



  openDialog = () => this.setState({ visible: true })

  closeDialog = () => this.setState({ visible: false })

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

  getUserId = props => {
    var uid

    if (props.user !== null) {
      uid = props.user.uid.toString() // The user's ID, unique to the Firebase project. Do NOT use
      // this value to authenticate with your backend server, if
      // you have one. Use User.getToken() instead.
    }

    console.log(uid)
    return uid
  }

  searchFilter = (x) =>{
    return(
      ( (x.text + x.title).toLowerCase().includes(this.state.searchText.toLowerCase() ) ) && 
      ( this.state.searchLoc === "default" || this.state.searchLoc === "" || x.state === this.state.searchLoc ) && 
      ( this.state.searchCat === "default" || this.state.searchCat === "" || x.category === this.state.searchCat )
    )
  }

  searchSort = (a, b) => {
    if ((this.state.searchCat !== "default", this.state.searchCat !== "") ||
        (this.state.searchLoc !== "default", this.state.searchLoc !== "") || 
        this.state.searchText !== ""
      ){
      return this.state.users.find( x =>  x.id === b.user).qualification 
      - this.state.users.find( x =>  x.id === a.user).qualification
    }
    else{
      return b.submissions - a.submissions
    }
  }
  getCategory = (category) => {
    return this.state.categories.find((x) => { return x.value === category}).name
  }

  searchHeader = () =>{
  return (
    <div>
      <h2> 
      {
        (
          (this.state.searchCat !== "default" && this.state.searchCat !== "") ||
          (this.state.searchLoc !== "default" && this.state.searchLoc !== "") || 
          this.state.searchText !== ""
        )?"Favores":"" 
      }
      {this.state.searchText !== ""? " que contienen: " + this.state.searchText : ""}
      </h2>
      {
        (
          (this.state.searchCat !== "default" && this.state.searchCat !== "") ||
          (this.state.searchLoc !== "default" && this.state.searchLoc !== "") || 
          this.state.searchText !== ""
        )?<Divider/>:"" 
      }
    </div>
      )
  }

  getCredits = props => {
    rootRef
      .child("users/" + this.getUserId(props) + "/credits")
      .on("value", snap => {
        console.log(snap.val())
        this.setState({ credits: snap.val() })
      })
  }

  getButton = () => {
    let shadowed = this.state.credits && this.state.credits >= publicationCost
    if (this.props.user && !shadowed) {
      return (
        <add>
          <Button
            className="add-publication"
            floating
            secondary
            onClick={this.toastFailure}
          >
            money_off
          </Button>
        </add>
      )
    } else if (this.props.user) {
      return (
        <add>
          <Button
            className="add-publication"
            floating
            primary
            onClick={this.openDialog}
          >
            create
          </Button>
          <Dialog
            id="publishDialog"
            visible={this.state.visible}
            onHide={this.closeDialog}
            className="googleDialog"
          >
            <Publish handleClose={this.closeDialog} />
          </Dialog>
        </add>
      )
    }
  }

  render = () => {
    let publishButton = this.getButton()
    return (
      <div>
      {this.searchHeader()}  
      <publications>
        {this.state.publications
          .filter((x) => { return x.end > new Date() && ! x.gaucho })
          .filter(this.searchFilter)
          .sort(this.searchSort)
          .map(
            publication =>
              publication &&
              <Publication key={publication.id} publication={publication} />
          )}
        {publishButton}
        <Snackbar {...this.state} onDismiss={this._removeToast} />
      </publications>
      </div>
    )
  }
}

export default PublicationList
