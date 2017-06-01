import React, { PureComponent } from 'react';
import CardReactFormContainer from 'card-react';
import Card from 'react-md/lib/Cards/Card';
import CardTitle from 'react-md/lib/Cards/CardTitle';
import Media from 'react-md/lib/Media';
import CardActions from "react-md/lib/Cards/CardActions"
import Button from "react-md/lib/Buttons"
import firebase from "firebase"
import rootRef, { app } from "../../libs/db"
import Snackbar from 'react-md/lib/Snackbars';

import "./card.scss"
import "./BuyCredits.scss"

import { connect } from "react-redux"
import { userSelector } from "../../redux/getters"

@connect(state => ({
  user: userSelector(state)
}))
export default class BuyingMethodSelector extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
        name: "",
        number: 0,
        date: 0,
        cvc: 0,
        toasts: [],
        autohide: true,
    }
  }

  componentWillUpdate = (nextProps, nextState) =>{
    const { toasts } = nextState;
    const [toast] = toasts;
    if (this.state.toasts === toasts || !toast) {
      return;
    }

    const autohide = toast.action !== 'Retry';
    this.setState({ autohide });
  }

  addToast=(text, action)=> {
    const toasts = this.state.toasts.slice();
    toasts.push({ text, action });

    this.setState({ toasts });
  }

  removeToast = () => {
    const [, ...toasts] = this.state.toasts;
    this.setState({ toasts });
  }

  toastError = () => {
    this._addToast('Transaccion fallida, intente de nuevo');
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

  writeNewCredits =() => {
    // A credits entry.
    let CreditsData = {
        price: this.props.purchase.cost,
        type : "Buy",    
        value: this.props.purchase.creditsAmount
    };

    rootRef
      .child("credits/" + this.getUserId().toString())
      .push(CreditsData)

    }

  updateCredits = () => {
    rootRef
      .child("users/" + this.getUserId().toString() + "/credits")
      .once(
        "value",
        snap => 
            rootRef
                .child("users/" + this.getUserId().toString() + "/credits")
                .set(snap.val() + this.props.purchase.creditsAmount))    
  }

  purchaseCredits = () => {
    console.log("purchaseCredits")
    if(this.state.cvc != 1234){
        this.writeNewCredits()
        this.updateCredits(this.props.purchase.creditsAmount)
        this.props.nextStep()
    }else{
        this.toastError()
    }
  }

  setName = (name) =>{
      this.setState({name})
  }

  setNumber = (number) =>{
      this.setState({number})
  }

  setDate = (date) =>{
      this.setState({date})
  }

  setCvc = (cvc) =>{
        console.log(cvc)
      this.setState({cvc})
  }

  render = () => {

      return(
        <Card id="purchase-card">
            <CardTitle
                title={this.props.purchase.creditsAmount.toString().concat(" Creditos")}
                subtitle={"$".concat(this.props.purchase.cost.toString())}  
            />
            <div id="card-wrapper"></div>
            <CardReactFormContainer
                
                // the id of the container element where you want to render the card element.
                // the card component can be rendered anywhere (doesn't have to be in ReactCardFormContainer).
                container="card-wrapper" // required
                
                // an object contain the form inputs names.
                // every input must have a unique name prop.
                formInputsNames={
                    {
                    number: 'CCnumber', // optional — default "number"
                    expiry: 'CCexpiry',// optional — default "expiry"
                    cvc: 'CCcvc', // optional — default "cvc"
                    name: 'CCname' // optional - default "name"
                    }
                }
                
                // initial values to render in the card element
                /*initialValues={
                    {
                    number: '•••• •••• •••• ••••', // optional — default •••• •••• •••• ••••
                    cvc: '•••', // optional — default •••
                    expiry: '••/••', // optional — default ••/••
                    name: {displayName} // optional — default FULL NAME
                    }
                }*/
                
                // the class name attribute to add to the input field and the corresponding part of the card element,
                // when the input is valid/invalid.
                classes={
                    {
                    valid: 'valid-input', // optional — default 'jp-card-valid'
                    invalid: 'invalid-input' // optional — default 'jp-card-invalid'
                    }
                }
                
                // specify whether you want to format the form inputs or not
                formatting={true} // optional - default true
                >
                
                <form>
                    <input placeholder="Full name" type="text" name="CCname" onchange={this.setName}/>
                    <input placeholder="Card number" type="text" name="CCnumber" onchange={this.setNumber}/>
                    <input placeholder="MM/YY" type="text" name="CCexpiry" onchange={this.setDate}/>
                    <input placeholder="CVC" type="text" name="CCcvc" onchange={this.setCvc}/>
                </form>
                
            </CardReactFormContainer>
    
            <CardActions>
                <Button 
                    raised
                    label="Cancelar" 
                    secondary
                    className="md-btn--dialog"
                    onClick={ () => this.cancel() } />                    

                <Button 
                    raised 
                    label={"Pagar ".concat("$".concat(this.props.purchase.cost.toString()))} 
                    primary 
                    className="md-btn--dialog md-cell--right"
                    onClick={ () => this.purchaseCredits() } />
            </CardActions>
         <Snackbar {...this.state} onDismiss={this.removeToast} />
       </Card>
    )}
}