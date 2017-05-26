import React, { PureComponent } from 'react';
import Button from "react-md/lib/Buttons"
import ProgressSteps from "react-progress-steps"

export default class Stepper extends PureComponent {

  constructor(props) {
    super(props);

    this.state = { index: 0 }
  }

  nextStep = () => {
      let index = this.state.index
      if (this.state.index < this.props.steps.length){
        index = index + 1
        this.setState({index})
      }else{

      }
  }

  render = () => (
    <div>
        <ProgressSteps steps={ this.props.steps.length } current={ this.state.index +1 } />
        { this.props.steps[this.state.index].content }
        <Button raised label="Aceptar" primary onClick={this.nextStep} />
    </div>
  )
}