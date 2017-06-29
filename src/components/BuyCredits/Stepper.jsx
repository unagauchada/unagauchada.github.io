import React, { PureComponent } from 'react';
import BuyingMethodSelection from './BuyingMethodSelection';
import BuyingAmountSelection from './BuyingAmountSelection';
import PurchaseFinished from "./PurchaseFinished"

const step = ( title, content ) => ({title, content})

export default class Stepper extends PureComponent {


  constructor(props) {
    super(props);

    this.state = { index: 0, purchase: null }
  }

  nextStep = ( purchase ) => {
    let index = this.state.index
    console.log(purchase)
    if(purchase){
        this.setState({ purchase })
    }
    if (index < this.steps.length){
        index += 1
        this.setState({index})
        console.log("next step")
    }
  }

  steps = [
    step(
        "Seleccionar creditos a comprar",
        (purchase) => <BuyingAmountSelection nextStep={this.nextStep}/>
    ),
    step(
        "Informacion de facturacion",
        (purchase) => <BuyingMethodSelection nextStep={this.nextStep} purchase={purchase}/>
    ),
    step(
        "Pedido completado",
        (purchase) => <PurchaseFinished purchase={purchase}/>
    )
  ]

  render = () => (
    <div className="card-container">
        { this.steps[this.state.index].content(this.state.purchase) }
    </div>
  )
}