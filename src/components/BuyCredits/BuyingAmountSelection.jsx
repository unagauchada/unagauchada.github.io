// @flow

import React, {PureComponent} from "react"
import Card from 'react-md/lib/Cards/Card';
import CardTitle from 'react-md/lib/Cards/CardTitle';
import CardText from 'react-md/lib/Cards/CardText';
import Media from 'react-md/lib/Media';
import Divider from 'react-md/lib/Dividers';
import "./BuyCredits.scss"
import firebase from "firebase"
import { app } from "../../libs/db.js"
import FontIcon from 'react-md/lib/FontIcons';
import CardActions from "react-md/lib/Cards/CardActions"
import Button from "react-md/lib/Buttons"

import rootRef from "../../libs/db"

const Amount = ({ purchase, nextStep }) => (
    purchase.cost != 0 && (
        <div>
          <Card raised className="md-block-centered">
            <CardTitle
              title={purchase.creditsAmount.toString().concat(" Creditos")}/> 
            <Divider/>
            <CardText>
              <h2 className="md-display-3 display-override">{"$" + (purchase.cost.toString())}</h2>            
            </CardText>
            <CardActions>
                <Button 
                    raised 
                    label="comprar" 
                    primary 
                    className="md-btn--dialog md-cell--right"
                    onClick={ () => nextStep(purchase) } />
            </CardActions>
        </Card>
        </div>
    ))

const purchase = (creditsAmount, cost) => ({
    creditsAmount,
    cost
  })

export default class BuyingAmountSelection extends PureComponent {

  constructor(props){
    super(props)

    this.state={
      purchaseValues: [1, 5, 10], 
      cost: null
    }
  }

  componentDidMount = () => {
    this.getCost()
  }

  getCost = () => {
    rootRef.child('/transferences/Buy').on(
      "value",
      snap  =>{
        this.setState({cost: snap.val().price})
      })
  }

  getAmounts = () => this.state.purchaseValues.map(value => purchase(value, (this.state.cost * value)))
  
  makeList = () =>
    this.getAmounts().map(purchase => <Amount key= {purchase.creditsAmount} purchase={purchase} nextStep={this.props.nextStep}/>)


  render = () => (
  <Card>
    <CardTitle 
      title="Selecciona un paquete de creditos"
    />
    <list id="plans-list"> {this.makeList()}</list>
  </Card>
)
}