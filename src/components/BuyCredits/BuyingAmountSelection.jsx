// @flow

import React from "react"
import Card from 'react-md/lib/Cards/Card';
import CardTitle from 'react-md/lib/Cards/CardTitle';
import Media from 'react-md/lib/Media';
import "./BuyCredits.scss"
import firebase from "firebase"
import { app } from "../../libs/db.js"

import rootRef from "../../libs/db"

var cost = 0

const database = firebase.database();

const Amount = ({ purchase, nextStep }) => {
    return(
      <div onClick={() => nextStep(purchase)}>
        <Card raise className="md-block-centered">
          <Media>
            <img role="presentation" allowFullScreen src="https://unsplash.it/40/40?random&time=${new Date().getTime()}" />
          </Media>
          <CardTitle 
            title={purchase.creditsAmount.toString().concat(" Creditos")} 
            subtitle={"$".concat(purchase.cost.toString())} />
        </Card>
      </div>
    )}


const getCost = () => {
  database.ref('/transferences/Buy').on(
    "value",
    snap  =>{
      setCost(snap.val().price)
    })
}

const setCost = ( price ) => (
  cost = price
)

const purchase = (creditsAmount, cost) => ({
  creditsAmount,
  cost
})

const getAmounts = () => {
  let purchaseValues = [1, 5, 10, 25, 50, 100]
  getCost()
  console.log(cost)
  return purchaseValues.map(value => purchase(value, (cost * value)))
  }


const makeList = (amounts, nextStep) =>
    amounts.map(purchase => <Amount key= {purchase.creditsAmount} purchase={purchase} nextStep={nextStep}/>)


const BuyingAmountSelection = ({nextStep}) => (
  <Card>
    <CardTitle 
      title="Selecciona un paquete de creditos"
    />
    <list> {makeList(getAmounts(), nextStep)}</list>
  </Card>
)

export default BuyingAmountSelection