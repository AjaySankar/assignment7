import React from "react"
import ReactDOM from "react-dom"
import "./index.css"
// eslint-disable-next-line no-unused-vars
import $ from "jquery"
// eslint-disable-next-line no-unused-vars
import Popper from "popper.js"
import "bootstrap/dist/css/bootstrap.min.css"
import { BrowserRouter } from "react-router-dom"
import App from "./App"

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById("root")
)
