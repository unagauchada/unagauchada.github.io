// @flow

import React from 'react';
import BuyingMethodSelection from './BuyingMethodSelection';
import BuyingAmountSelection from './BuyingAmountSelection';
import Stepper from './Stepper'

const step = ( title, content ) => ({title, content})

class BuyCredits extends React.Component{

  render() {
    const steps = [
        step(
            "Seleccionar pago",
            <BuyingAmountSelection/>
        ),
        step(
            "Informacion de facturacion",
            <BuyingMethodSelection/>
        ),
        step(
            "Confirmar los datos",
            null
        ),
        step(
            "Pedido completado",
            null
        )
    ]

    return (

        <Stepper steps= { steps }/>
            
    );
  }
}

export default BuyCredits