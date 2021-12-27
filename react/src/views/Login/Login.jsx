import React, { Component } from "react";
import { loginAdmin } from "../../actions/login";
import { connect } from "react-redux";
// import Cryptr from "cryptr";
import { toaster } from "../../helper/Toaster";
import {
  ToastsContainer,
  ToastsStore,
  ToastsContainerPosition
} from "react-toasts";
// import { cryptr_key } from "../../config";
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
// const cryptr = new Cryptr(cryptr_key);
export class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      password_show: false
    };
  }
  UNSAFE_componentWillReceiveProps(newProps) {
    const { login_response } = newProps;
    if (login_response && login_response.status === 200) {
      localStorage.setItem("jorge_token", login_response.accessToken);
      this.props.history.push("/dashboard");
      toaster("success", login_response.message);
    } else if (login_response && login_response.status === 404) {
      toaster("error", login_response.message);
    }
  }
  handleChange = (e, name) => {
    this.setState({ [name]: e.target.value });
  };

  onKeyPress = e => {
    if (e.key === "Enter") {
      this.submitData();
    }
  };

  submitData = () => {
    const { email, password } = this.state;
    //used to send password in encrypted form

    if (email !== "" && password !== "") {
      //   const encryptedString = cryptr.encrypt(password);
      let params = {
        email: email,
        // password: cryptr.encrypt(password)
        password: password
      };
      this.props.loginAdmin(params);
    } else {
      toaster("error", "Please fill all the fields.");
    }
  };
  render() {
    const { email, password, password_show } = this.state;
    return (
      <div className="full-bg">
        <ToastsContainer
          store={ToastsStore}
          position={ToastsContainerPosition.TOP_RIGHT}
        />
        <img src="images/bg.png" alt="logo" />
        <div className="login_page">
          <h2>Log In</h2>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="Enter email"
              name="email"
              value={email}
              autoComplete="new-password"
              onChange={e => this.handleChange(e, "email")}
            />
          </div>
          <div className="form-group">
            <label htmlFor="pwd">Password:</label>
            <div className='password_wrap'>
              <input
                type={password_show ? "text" : "password"}
                className="form-control"
                id="pwd"
                placeholder="Enter password"
                name="password"
                value={password}
                autoComplete="new-password"
                onChange={e => this.handleChange(e, "password")}
                onKeyPress={this.onKeyPress}
              />
              {password_show ? (
                <VisibilityIcon onClick={() => this.setState({ password_show: false })} />
              ) : (
                  <VisibilityOffIcon
                    onClick={() => this.setState({ password_show: true })}
                  />
                )}
            </div>
          </div>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => this.submitData()}
          >
            Submit
          </button>
        </div>
      </div>
    );
  }
}
const mapStateToProps = store => {
  return {
    login_response: store.login.login_response
  };
};

const mapDispatchToProps = dispatch => {
  return {
    loginAdmin: params => dispatch(loginAdmin(params))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
