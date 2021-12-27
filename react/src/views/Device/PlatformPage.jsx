import React, { Component } from "react";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import AddIcon from "@material-ui/icons/Add";
import Tooltip from "@material-ui/core/Tooltip";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

import {
  ToastsContainer,
  ToastsStore,
  ToastsContainerPosition
} from "react-toasts";
import { toaster } from "../../helper/Toaster";

import {
  platformList,
  addEditPlatform,
  deletePlatform
} from "../../actions/device";

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
export class PlatformPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      platforms: [],
      en_name: "",
      es_name: "",
      edit_id: "",
      edit_flag: false,
      delete_flag: false,
      delete_id: "",
      add_flag: false,
      add_edit: 0
    };
  }
  componentDidMount() {
    this.props.platformList();
  }

  UNSAFE_componentWillReceiveProps(newProps) {
    const {
      platform_list,
      add_response,
      edit_response,
      delete_response
    } = newProps;
    if (platform_list && platform_list.status === 200) {
      this.setState({ platforms: platform_list.platforms });
    }

    if (add_response && add_response.status === 200 && addFlag) {
      this.props.platformList();
      addFlag = false;
      this.setState({ add_flag: false });
      toaster("success", add_response.message);
    } else if (add_response && add_response.status === 404 && addFlag) {
      toaster("error", add_response.message);
    }
    if (edit_response && edit_response.status === 200 && editFlag) {
      this.props.platformList();
      editFlag = false;
      this.setState({ edit_flag: false });
      toaster("success", edit_response.message);
    } else if (edit_response && edit_response.status === 404 && editFlag) {
      editFlag = false;
      toaster("error", edit_response.message);
    }

    if (delete_response && delete_response.status === 200 && deleteFlag) {
      this.props.platformList();
      deleteFlag = false;
      this.setState({ delete_flag: false });
      toaster("success", delete_response.message);
    } else if (
      delete_response &&
      delete_response.status === 404 &&
      deleteFlag
    ) {
      toaster("error", delete_response.message);
      deleteFlag = false;
    }
  }

  handleChange = (e, name) => {
    this.setState({ [name]: e.target.value });
  };
  handleActions = (e, action, item) => {
    if (action === "edit") {
      this.setState({
        edit_id: item.id,
        edit_flag: true,
        add_edit: 2,
        en_name: item.en_name,
        es_name: item.es_name
      });
    } else if (action === "delete") {
      this.setState({
        delete_id: item.id,
        delete_flag: true
      });
    } else if (action === "add") {
      this.setState({
        add_flag: true,
        add_edit: 1,
        en_name: '',
        es_name: ''
      });
    }
  };

  handleClose = (e, action) => {
    if (action === "add") {
      this.setState({
        add_flag: false,
        add_edit: 0
      });
    } else if (action === "edit") {
      this.setState({
        edit_id: "",
        edit_flag: false,
        add_edit: 0
      });
    } else if (action === "delete") {
      this.setState({
        delete_id: "",
        delete_flag: false
      });
    }
  };

  submitData = (e, action) => {
    const { edit_id, en_name, es_name, delete_id } = this.state;
    if (action === "add") {
      if (en_name !== "" && es_name !== "") {
        let params = {
          en_name: en_name,
          es_name: es_name
        };
        this.props.addEditPlatform(params, "add");
        addFlag = true;
      } else {
        toaster("error", "Please fill platform name");
      }
    } else if (action === "edit") {
      if (en_name !== "" && es_name !== "") {
        let params = {
          id: edit_id,
          en_name: en_name,
          es_name: es_name
        };
        this.props.addEditPlatform(params, "edit");
        editFlag = true;
      } else {
        toaster("error", "Please fill platform name");
      }
    } else if (action === "delete") {
      let params = {
        id: delete_id
      };
      this.props.deletePlatform(params);
      deleteFlag = true;
    }
  };
  render() {
    const {
      platforms,
      edit_flag,
      delete_flag,
      add_flag,
      add_edit,
      en_name,
      es_name
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
                <Typography variant="h5" className='header_platform'>
                  Platform
                  <Tooltip title="Add" className='icon_boundry'>
                    <IconButton
                      edge="end"
                      aria-label="edit"
                      onClick={e => this.handleActions(e, "add")}
                    >
                      <AddIcon />
                    </IconButton>
                  </Tooltip>
                </Typography>
              </CardHeader>
              <CardBody>
                <div className={classes.demo}>
                  <List dense="false">
                    {platforms.map(item => {
                      return (
                        <ListItem>
                          {/* <ListItemAvatar>
                            <Avatar>
                              <img src={item.icon} />
                            </Avatar>
                          </ListItemAvatar> */}
                          <ListItemText primary={`${item.en_name}, ${item.es_name}`} />
                          <ListItemSecondaryAction>
                            <Tooltip title="Edit">
                              <IconButton
                                edge="end"
                                aria-label="edit"
                                className='edit_icon_device'
                                onClick={e =>
                                  this.handleActions(e, "edit", item)
                                }
                              >
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton
                                edge="end"
                                aria-label="delete"
                                className='delete_icon_device'
                                onClick={e =>
                                  this.handleActions(e, "delete", item)
                                }
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </ListItemSecondaryAction>
                        </ListItem>
                      );
                    })}
                  </List>
                </div>
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
        <Dialog
          open={(add_edit === 1 && add_flag) || (add_edit === 2 && edit_flag)}
          onClose={e => {
            (add_edit === 1 && this.handleClose(e, "add")) ||
              (add_edit === 2 && this.handleClose(e, "edit"));
          }}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">
            {(add_edit === 1 && "Add") || (add_edit === 2 && "Edit")} Platform
          </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Platform name"
              type="text"
              value={en_name}
              fullWidth
              onChange={e => this.handleChange(e, "en_name")}
            />
          </DialogContent>
          <DialogContent>
            <TextField
              margin="dense"
              id="name"
              label="Nombre de la plataforma"
              type="text"
              value={es_name}
              fullWidth
              onChange={e => this.handleChange(e, "es_name")}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={e => {
                (add_edit === 1 && this.handleClose(e, "add")) ||
                  (add_edit === 2 && this.handleClose(e, "edit"));
              }}
              variant="contained"

            >
              Cancel
            </Button>
            <Button
              onClick={e => {
                (add_edit === 1 && this.submitData(e, "add")) ||
                  (add_edit === 2 && this.submitData(e, "edit"));
              }}
              color="primary"
              variant="contained"
            >
              Submit
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={delete_flag}
          onClose={e => this.handleClose(e, "delete")}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Delete Platform</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you want to delete this Platform? Because the associated Brands and
              Models will also be deleted.
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
      </div>
    );
  }
}
const mapStateToProps = store => {
  return {
    platform_list: store.device.platform_list,
    add_response: store.device.add_response,
    edit_response: store.device.edit_response,
    delete_response: store.device.delete_response
  };
};

const mapDispatchToProps = dispatch => {
  return {
    platformList: () => dispatch(platformList()),
    addEditPlatform: (params, method) =>
      dispatch(addEditPlatform(params, method)),
    deletePlatform: params => dispatch(deletePlatform(params))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PlatformPage);
