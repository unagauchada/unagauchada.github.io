import React from "react"
import _ from "lodash"
import { connect } from "react-redux"
import Button from "react-md/lib/Buttons/Button"
import Chip from 'react-md/lib/Chips';
import Dialog from "react-md/lib/Dialogs"
import Snackbar from "react-md/lib/Snackbars";
import Divider from 'react-md/lib/Dividers';
import rootRef from "../../libs/db"
import Publication from "./Publication"
import SelectField from 'react-md/lib/SelectFields';
import FontIcon from "react-md/lib/FontIcons"
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
    this.setState({searchText: this.props.searchText})
  }

  isSearching = () => {
    return (
      this.searchCat == "default" ||
      this.searchLoc == "default" || 
      this.searchText == "default")
  }
  componentWillReceiveProps = nextProps => {
    this.getCredits(nextProps)
    this.setState({searchText: nextProps.searchText})
  }

  openCatDialog = () => this.setState({ catVisible: true })

  closeCatDialog = () => this.setState({ catVisible: false })

  catChange = (value, index, event) => {
    this.setState({ searchCat: value })
    this.closeCatDialog()
  }

  getCatDialog = () => {
    return(
      <Dialog
          id="publicationDialog"
          visible={this.state.catVisible}
          title="Seleccione Categoria"
          onHide={this.closeCatDialog}
        >
        <SelectField
            id="category"
            label="Seleccione una categoria"
            itemLabel="name"
            itemValue="value"
            value={this.state.searchCat}
            menuItems={this.state.categories}
            onChange={this.catChange}
          />          
        </Dialog>
    )  
  }

  categoryChip = () => {
    return  this.state.searchCat == "default"? "":
     <Chip label={this.state.categories.find((x)=> {return x.value == this.state.searchCat}).name}
      onClick={()=> {this.setState({searchCat: "default"})}}
      removable
      />
  }

  openLocDialog = () => this.setState({ locVisible: true })

  closeLocDialog = () => this.setState({ locVisible: false })

  locChange = (value, index, event) => {
    this.setState({ searchLoc: value })
    this.closeLocDialog()
  }

  getLocDialog = () => {
    return(
      <Dialog
          id="locationDialog"
          visible={this.state.locVisible}
          title="Seleccione Ubicacion"
          onHide={this.closeLocDialog}
          className=""
        >
          <SelectField
            id="state"
            label="Seleccione un Lugar"
            itemLabel="name"
            itemValue="value"
            value={this.state.state}
            menuItems={this.state.states}
            onChange={this.locChange}
            className="md-cell stretch"
          />
        </Dialog>
    )  
  }

  locationChip = () => {
    return  this.state.searchLoc == "default"? "":
     <Chip label={this.state.states.find((x)=> {return x.value == this.state.searchLoc}).name}
      onClick={()=> {this.setState({searchLoc: "default"})}}
      removable
      />
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

    if (props.user != null) {
      uid = props.user.uid.toString() // The user's ID, unique to the Firebase project. Do NOT use
      // this value to authenticate with your backend server, if
      // you have one. Use User.getToken() instead.
    }

    console.log(uid)
    return uid
  }

  searchFilter = (x) =>{
    return( 
      ( x.title.toLowerCase().includes(this.state.searchText.toLowerCase() ) ) && 
      ( this.state.searchLoc == "default" || x.state == this.state.searchLoc ) && 
      ( this.state.searchCat == "default" || x.category == this.state.searchCat )
    )
  }

  searchSort = (a, b) => {
    if (this.isSearching()){
      return b.user.score - a.user.score
    }
    else{
      return b.submissions - a.submissions
    }
  }

  searchHeader = () =>{
  return (
    <div>
      <h2> {"Resultados para: " + this.state.searchText+"\t"} 
      <Button
        flat
        disabled={this.state.searchLoc != "default"} 
        label="Seleccionar Ubicacion" 
        onClick={this.openLocDialog}
      />
      <Button
        flat
        disabled={this.state.searchCat != "default"}
        label="Seleccionar Categoria"
        onClick={this.openCatDialog}
       />
      </h2>
      <Divider />
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
      {this.state.searchText !== ""? this.searchHeader() : ""}
      {this.getLocDialog()}
      {this.getCatDialog()}      
      <div className="chip-list">
        {this.locationChip()}
        {this.categoryChip()}
      </div>
      <publications>
        {this.state.publications
          .filter((x) => { return x.end > new Date(); })
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
