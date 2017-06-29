import React, { PureComponent } from 'react';
import { Redirect} from 'react-router-dom';
import Card from 'react-md/lib/Cards/Card';
import CardTitle from 'react-md/lib/Cards/CardTitle';
import CardText from "react-md/lib/Cards/CardText"
import CardActions from "react-md/lib/Cards/CardActions"
import Media from 'react-md/lib/Media';
import Button from "react-md/lib/Buttons"
import "./BuyCredits.scss"

export default class BuyingMethodSelector extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
        accepted: false
    }
  }

  render = () => 
      (
        <Card id="purchase-card">
          { this.state.accepted && <Redirect to="/"/> }
            <CardTitle
                title="Recibo"
                subtitle="Compra de creditos exitosa"  
            />
            <CardText>
                <p>{this.props.purchase.creditsAmount.toString().concat(" Creditos")}</p>
                <p>{"$".concat(this.props.purchase.cost.toString())}</p>
            </CardText>
            <CardActions> 
                <Button 
                    raised 
                    label={"Aceptar"} 
                    primary 
                    className="md-btn--dialog md-cell--right"
                    onClick={ (e) => this.setState({accepted: true})}
                    />
            </CardActions>
        </Card>
    )
}