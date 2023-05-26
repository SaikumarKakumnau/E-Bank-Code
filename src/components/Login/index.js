import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'

import './index.css'

class Login extends Component {
  state = {userId: '', pin: '', showError: false, errorMsg: ''}

  OnChangeUserId = event => {
    this.setState({userId: event.target.value})
  }

  OnChangePin = event => {
    this.setState({pin: event.target.value})
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    history.replace('/')
  }

  onSubmitFailure = errorMsg => {
    this.setState({showError: true, errorMsg})
  }

  onSubmitForm = async event => {
    event.preventDefault()

    const {userId, pin} = this.state
    const userDetails = {user_id: userId, pin}

    const url = 'https://apis.ccbp.in/ebank/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }

    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  renderLoginUserField = () => {
    const {userId} = this.state

    return (
      <>
        <label htmlFor="user" className="label-element">
          User ID
        </label>
        <input
          type="text"
          className="input-element"
          id="user"
          placeholder="Enter User ID"
          value={userId}
          onChange={this.OnChangeUserId}
        />
      </>
    )
  }

  renderLoginPinField = () => {
    const {pin} = this.state

    return (
      <>
        <label htmlFor="pin" className="label-element">
          PIN
        </label>
        <input
          type="password"
          className="input-element"
          id="pin"
          placeholder="Enter PIN"
          value={pin}
          onChange={this.OnChangePin}
        />
      </>
    )
  }

  render() {
    const {showError, errorMsg} = this.state

    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="login-bg-container">
        <div className="login-responsive-container">
          <div className="image-container">
            <img
              src="https://assets.ccbp.in/frontend/react-js/ebank-login-img.png"
              alt="website login"
              className="login-image"
            />
          </div>
          <div className="login-form-container">
            <form className="form-container" onSubmit={this.onSubmitForm}>
              <h1 className="form-heading">Welcome Back!</h1>
              {this.renderLoginUserField()}
              {this.renderLoginPinField()}
              <button type="submit" className="sub-button">
                Login
              </button>
              {showError ? <p className="error-msg">{errorMsg}</p> : null}
            </form>
          </div>
        </div>
      </div>
    )
  }
}

export default Login
