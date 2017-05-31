// @flow

import React, {PureComponent} from "react"
import Card from 'react-md/lib/Cards/Card';
import CardTitle from 'react-md/lib/Cards/CardTitle';
import Media from 'react-md/lib/Media';
import "./BuyCredits.scss"
import firebase from "firebase"
import { app } from "../../libs/db.js"

import rootRef from "../../libs/db"

const Amount = ({ purchase, nextStep }) => {
    return(
      <div onClick={() => nextStep(purchase)}>
        <Card raise className="md-block-centered">
          <Media>
            <img role="presentation" allowFullScreen src="https://unsplash.it/40/40?random&time=${new Date().getTime()}" />
          </Media>
          <CardTitle 
            title={purchase.creditsAmount.toString().concat(" Creditos")} 
            subtitle={"$".concat(purchase.cost.toString())}/>
        </Card>
      </div>
    )}

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
    <list> {this.makeList()}</list>
  </Card>
)
}