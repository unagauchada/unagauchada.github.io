/* global Plotly */
// Plot.js
import React from 'react';

class Plot extends React.Component {
  drawPlot = () => {
    Plotly.newPlot(this.props.id, [{
      x: this.props.xData,
      y: this.props.yData,
      type: this.props.type
    }], {
      margin: {
        t: 0, r: 0, l: 30
      },
      xaxis: {
        gridcolor: 'transparent'
      }
    }, {
      displayModeBar: false
    });
    document.getElementById(this.props.id).on('plotly_click', this.props.onPlotClick);
  }

  componentDidMount() {
    this.drawPlot();
  }

  componentDidUpdate() {
    this.drawPlot();
  }

  render() {
    return (
      <div id={this.props.id}></div>
    );
  }
}

export default Plot;
