import React, { PureComponent } from 'react';
import CardReactFormContainer from 'card-react';
import Card from 'react-md/lib/Cards/Card';
import CardTitle from 'react-md/lib/Cards/CardTitle';
import CardActions from "react-md/lib/Cards/CardActions"
import Media from 'react-md/lib/Media';
import Button from "react-md/lib/Buttons"
import firebase from "firebase"
import rootRef, { app } from "../../libs/db"

import "./card.scss"
import "./BuyCredits.scss"

const database = firebase.database();
const user = firebase.auth().currentUser;

export default class BuyingMethodSelector extends PureComponent {
  constructor(props) {
    super(props);

  }

  getUserDisplayName = () => {
    var displayName;

    if (user != null) {
        displayName = `${user.name} ${user.lastname[0].toUpperCase()}`;
    }

    return displayName      
  }

  getUserId = () => {
    var uid;

    if (user != null) {
        uid = user.uid;  // The user's ID, unique to the Firebase project. Do NOT use
                        // this value to authenticate with your backend server, if
                        // you have one. Use User.getToken() instead.
    }

    return uid
  }

  writeNewCredits(price, value) {
    var userId = this.getUserId()
    
    // A credits entry.
    var CreditsData = {
        price: price,
        value: value,
        type : "Buy"    };

    // Get a key for a new credits.
    var newCreditsKey = database.ref().child('credits/' + userId).push().key;

    // Write the new credits' data.
    var updates = {};
    updates['credits/' + userId + '/' + newCreditsKey] = CreditsData;

    return database.ref().update(updates);
    }


  purchaseCredits = (purchase) => {
    this.writeNewCredits(purchase.cost, purchase.creditsAmount)
    this.props.nextStep(this.props.purchase)
  }

  render = () => {
      let displayName = this.getUserDisplayName()
      console.log(user)

      return(
        <Card id="purchase-card">
            <Media>
                <img role="presentation" src="https://unsplash.it/40/40?random&time=${new Date().getTime()}" />
            </Media>            
            <CardTitle
                title={this.props.purchase.creditsAmount.toString().concat(" Creditos")}
                subtitle={"$".concat(this.props.purchase.cost.toString())}  
            />
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
                initialValues={
                    {
/*                    number: '•••• •••• •••• ••••', // optional — default •••• •••• •••• ••••
                    cvc: '•••', // optional — default •••
                    expiry: '••/••', // optional — default ••/••
*/                  name: {displayName} // optional — default FULL NAME
                    }
                }
                
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
                    <input placeholder="Full name" type="text" name="CCname" />
                    <input placeholder="Card number" type="text" name="CCnumber" />
                    <input placeholder="MM/YY" type="text" name="CCexpiry" />
                    <input placeholder="CVC" type="text" name="CCcvc" />
                </form>
                
            </CardReactFormContainer>
    
            <div id="card-wrapper"></div>
            <CardActions>
                <Button 
                    raised
                    label="Cancelar" 
                    secondary
                    className="md-btn--dialog"
                />
                <Button 
                    raised 
                    label={"Pagar ".concat("$".concat(this.props.purchase.cost.toString()))} 
                    primary 
                    className="md-btn--dialog md-cell--right"
                    onClick={ () => this.props.nextStep(this.props.purchase) } />
            </CardActions>
        </Card>
    )}
}