import React from "react"
import { Link } from "react-router-dom"
import Button from "react-md/lib/Buttons/Button"

const Signup = () => (
  <Link to="/signup">
    <Button flat key="singup" label="Registrarse" />
  </Link>
)

const Login = () => (
  <Link to="/signin">
    <Button className="login-btn" key="login" raised primary label="Login" />
  </Link>
)

export default [<Signup key="signup" />, <Login key="login" />]
