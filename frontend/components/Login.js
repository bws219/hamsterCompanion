import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { connect } from 'react-redux';
import './styles/login.css';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loginError: ''
    };
  }

  submit(e) {
    e.preventDefault();
    axios.post('/api/login', {
      username: e.target.username.value,
      password: e.target.password.value
    }).then(resp => {
      if (resp.data) this.props.login();
    }).catch((err) => {
      console.log(err);
      this.setState({
        loginError: `Incorrect username/password combination`
      });
    });
  }

  render() {
    return (
      <div id="login-container">
        <div id="mouse-login-btn"><img src={`http://weclipart.com/gimg/A0F8CD424E369A2C/cute-mouse-silhouette.png`}/></div>
        <form className="col form" onSubmit={e => this.submit(e)}>
          <h3>Login</h3>
          <input type="text" name="username" placeholder="Username" />
          <input type="password" name="password" placeholder="Password" />
          <input type="submit" />
          <p className="error-msg">{this.state.loginError ? `Error: ${this.state.loginError}` : ''}</p>
        </form>
        <Link to="/" id="register-btn">Register</Link>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  login: () => dispatch({ type: 'LOGIN' })
});

export default connect(null, mapDispatchToProps)(Login);
