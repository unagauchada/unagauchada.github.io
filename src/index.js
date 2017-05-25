import React from 'react';
import ReactDOM from 'react-dom';
import WebFont from "webfontloader"
import App from "./components/App"

WebFont.load({
  google: {
    families: ["Roboto:200,300,600", "Material Icons", "Product Sans:200,300,600"]
  }
})

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
