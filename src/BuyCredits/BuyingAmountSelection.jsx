// @flow

import React from "react"
import Paper from 'react-md/lib/Papers';
import Button from "react-md/lib/Buttons"
import "./BuyCredits.scss"
import Divider from 'react-md/lib/Dividers';

const Amount = ({ amount }) => {
    console.log(amount.description)
    return(
    <div className="paper-container md-block-centered">
        <Paper
            zDepth={1}
            raiseOnHover= {true}
        >
            <h1>{amount.value}</h1>
            <p>{amount.description}</p>
            <Divider/>
            <h2 className= "md-block-centered">{amount.cost}</h2>
        </Paper>        
    </div>
)}

const amount = (value, cost, description) => ({
  value,
  cost,
  description
})

const amounts = [
  amount(
    5,
    "$50",
    "rata"
  ),
  amount(
    10,
    "$90",
    "no tan rata"
  ),
  amount(
    20,
    "$170",
    "bien ahi"
  ),
  amount(
    50,
    "$425",
    "¿¿cuanta ayuda necesitas??"
  )
]

const makeList = amounts =>
  amounts.map(amount => <Amount key= {amount.value} amount={amount} />)

const BuyingAmountSelection = () => <list> {makeList(amounts)}</list>

export default BuyingAmountSelection