import React from "react"
import ReactDOM from "react-dom"
import { Provider } from 'react-redux'
import WebFont from "webfontloader"
import App from "./components/App"
import store from "./redux/configureStore"

WebFont.load({
  google: {
    families: [
      "Roboto:200,300,600",
      "Material Icons",
      "Product Sans:200,300,600"
    ]
  }
})

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
)
