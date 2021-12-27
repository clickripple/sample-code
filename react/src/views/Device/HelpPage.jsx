import React, { Component } from "react";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import AddIcon from "@material-ui/icons/Add";
import SubdirectoryArrowLeftIcon from '@material-ui/icons/SubdirectoryArrowLeft';
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Tooltip from "@material-ui/core/Tooltip";
import {
  ToastsContainer,
  ToastsStore,
  ToastsContainerPosition
} from "react-toasts";
import { toaster } from "../../helper/Toaster";

import {
  helpDataList,
  addEditHelpData,
  deleteHelpData
} from "../../actions/login";
import HelpAddEdit from "./HelpAddEdit";

const styles = {
  cardCategoryWhite: {
    "&,& a,& a:hover,& a:focus": {
      color: "rgba(255,255,255,.62)",
      margin: "0",
      fontSize: "14px",
      marginTop: "0",
      marginBottom: "0"
    },
    "& a,& a:hover,& a:focus": {
      color: "#FFFFFF"
    }
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: "#777",
      fontSize: "65%",
      fontWeight: "400",
      lineHeight: "1"
    }
  }
};

const classes = makeStyles(styles);
let editFlag = false;
let deleteFlag = false;
let addFlag = false;
export class HelpPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      help_data: [],
      brand_id: this.props.state && this.props.state.brand_id,
      add_edit_data: [{ phone: "", email: "", address: "", website: "" }],
      edit_flag: false,
      delete_flag: false,
      add_flag: false,
      add_edit: 0
    };
  }
  componentDidMount() {
    this.props.helpDataList(this.state.brand_id);
  }

  UNSAFE_componentWillReceiveProps(newProps) {
    const {
      help_data_list,
      add_help_response,
      edit_help_response,
      delete_help_response
    } = newProps;

    if (
      help_data_list &&
      help_data_list.helpdata &&
      help_data_list.status === 200
    ) {
      if (
        help_data_list &&
        help_data_list.helpdata &&
        help_data_list.helpdata.help_data !== null
      ) {
        this.setState({
          help_data:
            help_data_list &&
            help_data_list.helpdata &&
            help_data_list.helpdata.help_data
        });
      }
    }

    if (add_help_response && add_help_response.status === 200 && addFlag) {
      this.props.helpDataList(this.state.brand_id);
      addFlag = false;
      this.setState({ add_flag: false });
      toaster("success", add_help_response.message);
    } else if (
      add_help_response &&
      add_help_response.status === 404 &&
      addFlag
    ) {
      toaster("error", add_help_response.message);
    }
    if (edit_help_response && edit_help_response.status === 200 && editFlag) {
      this.props.helpDataList(this.state.brand_id);
      editFlag = false;
      this.setState({ edit_flag: false });
      toaster("success", edit_help_response.message);
    } else if (
      edit_help_response &&
      edit_help_response.status === 404 &&
      editFlag
    ) {
      editFlag = false;
      toaster("error", edit_help_response.message);
    }

    if (
      delete_help_response &&
      delete_help_response.status === 200 &&
      deleteFlag
    ) {
      this.props.helpDataList(this.state.brand_id);
      deleteFlag = false;
      this.setState({ delete_flag: false });
      toaster("success", delete_help_response.message);
      this.props.backPage()
    } else if (
      delete_help_response &&
      delete_help_response.status === 404 &&
      deleteFlag
    ) {
      toaster("error", delete_help_response.message);
      deleteFlag = false;
    }
  }

  handleChange = (e, name, index) => {
    let add_edit_data = this.state.add_edit_data;
    let reg = /^[0-9]{0,10}$/;
    if (name === "phone" && reg.test(e.target.value) === false) {
      return;
    }

    add_edit_data[index][name] = e.target.value;
    this.setState({ add_edit_data });
  };


  addHelp = (e, name, data) => {
    if (name === "add") {
      let add_edit_data = this.state.add_edit_data;
      add_edit_data.push({ phone: "", email: "", address: "", website: "" });
      this.setState({ add_edit_data });
    } else if (name === "delete") {
      let add_edit_data = this.state.add_edit_data;

      add_edit_data.splice(data, 1)
      this.setState({ add_edit_data });
    }
  };

  backHelp = () => {
    this.setState({ add_flag: false, edit_flag: false });
  };
  handleActions = (e, action, item) => {
    if (action === "edit") {
      this.setState({
        edit_flag: true,
        add_edit_data: item,
        add_edit: 2
      });
    } else if (action === "delete") {
      this.setState({
        delete_flag: true
      });
    } else if (action === "add") {
      this.setState({
        add_flag: true,
        add_edit: 1,
        add_edit_data: [{ phone: "", email: "", address: "", website: "" }]
      });
    }
  };

  handleClose = (e, action) => {
    if (action === "add") {
      this.setState({
        add_flag: false,
        add_edit: 0,
        add_edit_data: [{ phone: "", email: "", address: "", website: "" }]
      });
    } else if (action === "edit") {
      this.setState({
        edit_flag: false,
        add_edit: 0,
        add_edit_data: [{ phone: "", email: "", address: "", website: "" }]
      });
    } else if (action === "delete") {
      this.setState({
        delete_flag: false
      });
    }
  };

  submitData = (e, action) => {
    const { brand_id, add_edit_data } = this.state;
    if (action === "add") {
      let phone_flag = add_edit_data.filter(o => o.phone === "");
      let email_flag = add_edit_data.filter(o => o.email === "");
      let address_flag = add_edit_data.filter(o => o.address === "");
      let email_format_flag = add_edit_data.filter(
        o =>
          o.email !== "" &&
          !o.email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,3})$/i)
      );
      let phone_format_flag = add_edit_data.filter(
        o => o.phone !== "" && !/^[0-9]{10}$/.test(o.phone)
      );

      if (phone_flag.length !== 0) {
        toaster("error", "Please fill phone number.");
        return;
      } else if (email_flag.length !== 0) {
        toaster("error", "Please fill email address.");
        return;
      } else if (address_flag.length !== 0) {
        toaster("error", "Please fill address.");
        return;
      } else if (phone_format_flag.length !== 0) {
        return toaster("error", "Mobile number must be of 10 digits.");
      } else if (email_format_flag.length !== 0) {
        return toaster("error", "Email should be in proper format.");
      }

      let params = {
        brandId: brand_id,
        help_data: add_edit_data
      };
      this.props.addEditHelpData(params, "add");
      addFlag = true;
    } else if (action === "edit") {
      let phone_flag = add_edit_data.filter(o => o.phone === "");
      let email_flag = add_edit_data.filter(o => o.email === "");
      let address_flag = add_edit_data.filter(o => o.address === "");
      let email_format_flag = add_edit_data.filter(
        o =>
          o.email !== "" &&
          !o.email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,3})$/i)
      );
      let phone_format_flag = add_edit_data.filter(
        o => o.phone !== "" && !/^[0-9]{10}$/.test(o.phone)
      );

      if (phone_flag.length !== 0) {
        toaster("error", "Please fill phone number.");
        return;
      } else if (email_flag.length !== 0) {
        toaster("error", "Please fill email address.");
        return;
      } else if (address_flag.length !== 0) {
        toaster("error", "Please fill address.");
        return;
      } else if (phone_format_flag.length !== 0) {
        return toaster("error", "Mobile number must be of 10 digits.");
      } else if (email_format_flag.length !== 0) {
        return toaster("error", "Email should be in proper format.");
      }

      let params = {
        brandId: brand_id,
        help_data: add_edit_data
      };
      this.props.addEditHelpData(params, "edit");
      editFlag = true;
    } else if (action === "delete") {
      let params = {
        brandId: brand_id
      };
      this.props.deleteHelpData(params);
      deleteFlag = true;
    }
  };
  render() {
    const {
      help_data,
      edit_flag,
      delete_flag,
      add_flag
    } = this.state;
    return (
      <div>
        <ToastsContainer
          store={ToastsStore}
          position={ToastsContainerPosition.TOP_RIGHT}
        />
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="primary">
                {!add_flag && !edit_flag ? (
                  <Typography variant="h5" className='header_platform'>
                    Help Center
                    <Tooltip title="Back" className='icon_boundry'>
                      <IconButton
                        edge="end"
                        aria-label="back"
                        onClick={e => this.props.backPage()}
                      >
                        <SubdirectoryArrowLeftIcon />
                      </IconButton>
                    </Tooltip>
                    {help_data.length === 0 ? (
                      <Tooltip title="Back" className='icon_boundry'>
                        <IconButton
                          edge="end"
                          aria-label="edit"
                          onClick={e => this.handleActions(e, "add")}
                        >
                          <AddIcon />
                        </IconButton>
                      </Tooltip>
                    ) : (
                        <React.Fragment>
                          <Tooltip title="Delete" className='icon_boundry'>
                            <IconButton
                              edge="end"
                              aria-label="delete"
                              onClick={e => this.handleActions(e, "delete")}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit" className='icon_boundry'>
                            <IconButton
                              edge="end"
                              aria-label="edit"
                              onClick={e => this.handleActions(e, "edit", help_data)}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                        </React.Fragment>
                      )}
                  </Typography>
                ) : (
                    <Typography variant="h5" className='header_platform'>
                      Add Help Data
                      <Tooltip title="Back" className='icon_boundry'>
                        <IconButton
                          edge="end"
                          aria-label="back"
                          onClick={e => this.backHelp(e)}
                        >
                          <SubdirectoryArrowLeftIcon />
                        </IconButton>
                      </Tooltip>
                    </Typography>
                  )}
              </CardHeader>
              <CardBody>

                {!add_flag && !edit_flag ? (
                  <div className={classes.demo}>
                    {help_data.map((data, index) => {
                      return (
                        <Card>
                          <CardBody>
                            <TextField
                              margin="dense"
                              id="name"
                              label={"Phone " + (index + 1)}
                              type="text"
                              value={data.phone}
                              fullWidth
                              InputProps={{
                                readOnly: true,
                              }}
                            />
                            <TextField
                              margin="dense"
                              id="name"
                              label={"Email " + (index + 1)}
                              type="text"
                              value={data.email}
                              fullWidth
                              InputProps={{
                                readOnly: true,
                              }}
                            />
                            <TextField
                              margin="dense"
                              id="name"
                              label={"Address " + (index + 1)}
                              type="text"
                              value={data.address}
                              fullWidth
                              InputProps={{
                                readOnly: true,
                              }}
                            />
                            <TextField
                              margin="dense"
                              id="name"
                              label={"Website " + (index + 1)}
                              type="text"
                              value={data.website}
                              fullWidth
                              InputProps={{
                                readOnly: true,
                              }}
                            />
                          </CardBody>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                    <HelpAddEdit
                      state={this.state}
                      addHelp={this.addHelp}
                      backHelp={this.backHelp}
                      handleChange={this.handleChange}
                      submitData={this.submitData}
                    />
                  )}
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>

        <Dialog
          open={delete_flag}
          onClose={e => this.handleClose(e, "delete")}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Delete Help Data</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you want to delete this Help Data?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={e => this.handleClose(e, "delete")}
              variant="contained"
            >
              Cancel
            </Button>
            <Button onClick={e => this.submitData(e, "delete")} color="secondary" variant="contained">
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </div >
    );
  }
}
const mapStateToProps = store => {
  return {
    help_data_list: store.login.help_data_list,
    add_help_response: store.login.add_help_response,
    edit_help_response: store.login.edit_help_response,
    delete_help_response: store.login.delete_help_response
  };
};

const mapDispatchToProps = dispatch => {
  return {
    helpDataList: params => dispatch(helpDataList(params)),
    addEditHelpData: (params, method) =>
      dispatch(addEditHelpData(params, method)),
    deleteHelpData: params => dispatch(deleteHelpData(params))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(HelpPage);
