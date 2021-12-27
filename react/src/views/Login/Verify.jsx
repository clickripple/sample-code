import React, { Component } from "react";
import { verifyUser } from "../../actions/login";
import { connect } from "react-redux";
// import Cryptr from "cryptr";
import { toaster } from "../../helper/Toaster";
import {
  ToastsContainer,
  ToastsStore,
  ToastsContainerPosition
} from "react-toasts";
import CircularProgress from "@material-ui/core/CircularProgress";
import CheckIcon from '@material-ui/icons/Check';
import CancelIcon from '@material-ui/icons/Close';
export class Verify extends Component {
  constructor(props) {
    super(props);

    this.state = {
      show_flag: 0
    };
  }

  componentWillMount() {
    let token = window.location.search.split("?refresh_token=")[1];
    this.props.verifyUser(token);
  }
  UNSAFE_componentWillReceiveProps(newProps) {
    const { verify_response } = newProps;
    if (verify_response.status === true) {
      //   toaster("success", verify_response.message);
      this.setState({ show_flag: 1 });
    } else if (verify_response.status === false) {
      toaster("error", verify_response.message);
      this.setState({ show_flag: 1 });
    } else if (verify_response.err) {
      // toaster("error", verify_response.err && verify_response.err.message);
      this.setState({ show_flag: 2 });
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
    const { show_flag } = this.state;
    return (
      <div className="verify-full">
        <ToastsContainer
          store={ToastsStore}
          position={ToastsContainerPosition.TOP_RIGHT}
        />
        {show_flag === 0 && (
          <div class="loader-text-sec">
            <CircularProgress className='loader_class'/>
            <div class="loader-text">
              <h2> Wait ....... </h2>
              <h2> Your Account is Verifying </h2>
            </div>
          </div>
        )}
        {show_flag === 1 && (
          <div class="loader-text-sec">
            <div class="tick" >
              <CheckIcon className='tick_icon'/>
            </div>
            <div class="loader-text">
              <h2> Your Account has been Verified </h2>
            </div>
          </div>
        )}
        {show_flag === 2 && (
          <div class="loader-text-sec">
            <div class="tick" >
              <CancelIcon className='tick_icon'/>
            </div>
            <div class="loader-text">
              <h2> Your token has expired, Please try again </h2>
            </div>
          </div>
        )}
      </div>
    );
  }
}
const mapStateToProps = store => {
  return {
    verify_response: store.login.verify_response
  };
};

const mapDispatchToProps = dispatch => {
  return {
    verifyUser: params => dispatch(verifyUser(params))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Verify);
