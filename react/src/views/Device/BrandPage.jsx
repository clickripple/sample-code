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
import ContactSupportIcon from '@material-ui/icons/ContactSupport';
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
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import {
  ToastsContainer,
  ToastsStore,
  ToastsContainerPosition
} from "react-toasts";
import { toaster } from "../../helper/Toaster";
import {
  platformList,
  brandList,
  addEditBrand,
  deleteBrand
} from "../../actions/device";
import HelpPage from "./HelpPage";
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
  },
  formControl: {
    // margin: theme.spacing(1),
    // minWidth: 120,
  }
};

const classes = makeStyles(styles);
let editFlag = false;
let deleteFlag = false;
let addFlag = false;
export class BrandPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      brands: [],
      en_name: "",
      es_name: "",
      brand_id: "",
      edit_id: "",
      edit_flag: false,
      delete_flag: false,
      delete_id: "",
      add_flag: false,
      add_edit: 0,
      selected_platform: "",
      action_platform: "",
      platforms: [],
      toggleFlag: false
    };
  }
  componentDidMount() {
    this.props.platformList();
    this.props.brandList(this.state.selected_platform);
  }

  UNSAFE_componentWillReceiveProps(newProps) {
    const {
      platform_list,
      brand_list,
      add_response,
      edit_response,
      delete_response
    } = newProps;

    if (platform_list && platform_list.status === 200) {
      this.setState({ platforms: platform_list.platforms });
    }

    if (brand_list && brand_list.status === 200) {
      this.setState({ brands: brand_list.brands });
    }

    if (add_response && add_response.status === 200 && addFlag) {
      this.props.brandList(this.state.selected_platform);
      addFlag = false;
      this.setState({ add_flag: false });
      toaster("success", add_response.message);
    } else if (add_response && add_response.status === 404 && addFlag) {
      addFlag = false;
      toaster("error", add_response.message);
    }
    if (edit_response && edit_response.status === 200 && editFlag) {
      this.props.brandList(this.state.selected_platform);
      editFlag = false;
      this.setState({ edit_flag: false });
      toaster("success", edit_response.message);
    } else if (edit_response && edit_response.status === 404 && editFlag) {
      editFlag = false;
      toaster("error", edit_response.message);
    }

    if (delete_response && delete_response.status === 200 && deleteFlag) {
      this.props.brandList(this.state.selected_platform);
      deleteFlag = false;
      this.setState({ delete_flag: false });
      toaster("success", delete_response.message);
    } else if (
      delete_response &&
      delete_response.status === 404 &&
      deleteFlag
    ) {
      deleteFlag = false;
      toaster("error", delete_response.message);
    }
  }

  handleChange = (e, name) => {
    this.setState({ [name]: e.target.value });
  };
  handleActions = (e, action, item) => {
    if (action === "get") {
      this.setState({ [item]: e.target.value });
      this.props.brandList(e.target.value);
    } else if (action === "edit") {
      this.setState({
        edit_id: item.id,
        edit_flag: true,
        action_platform: item.platformId,
        en_name: item.en_name,
        es_name: item.es_name,
        add_edit: 2
      });
    } else if (action === "delete") {
      this.setState({
        delete_id: item.id,
        delete_flag: true
      });
    } else if (action === "add") {
      this.setState({
        add_flag: true,
        action_platform: "",
        add_edit: 1,
        en_name: "",
        es_name: ""
      });
    } else if (action === "help") {
      this.setState({ brand_id: item.id, toggleFlag: true });
    }
  };

  backPage = () => {
    this.setState({ brand_id: '', toggleFlag: false });
  }

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
    const { edit_id, en_name, es_name, delete_id, action_platform } = this.state;
    if (action === "add") {
      if (action_platform === "") {
        return toaster("error", "Please Select Platform.");
      } else if (en_name === "" || es_name === "") {
        return toaster("error", "Please Fill Brand Name");
      }
      let params = {
        en_name: en_name,
        es_name: es_name,
        platformId: action_platform,
        data_order: 4
      };
      this.props.addEditBrand(params, "add");
      addFlag = true;
    } else if (action === "edit") {
      if (action_platform === "") {
        return toaster("error", "Please Select Platform.");
      } else if (en_name === "" || es_name === "") {
        return toaster("error", "Please Fill Brand Name");
      }
      let params = {
        id: edit_id,
        en_name: en_name,
        es_name: es_name,
        platformId: action_platform
      };
      this.props.addEditBrand(params, "edit");
      editFlag = true;
    } else if (action === "delete") {
      let params = {
        id: delete_id
      };
      this.props.deleteBrand(params);
      deleteFlag = true;
    }
  };
  render() {
    const {
      brands,
      edit_flag,
      delete_flag,
      add_flag,
      add_edit,
      en_name,
      es_name,
      selected_platform,
      action_platform,
      platforms,
      toggleFlag
    } = this.state;
    return (
      <div>
        <ToastsContainer
          store={ToastsStore}
          position={ToastsContainerPosition.TOP_RIGHT}
        />
        {!toggleFlag ? (
          <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
              <Card>
                <CardHeader color="primary">
                  <Typography variant="h5" className='header_platform'>
                    Brand
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
                  <FormControl className={classes.formControl}>
                    <InputLabel id="demo-simple-select-label">
                      Platform
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={selected_platform}
                      onChange={e =>
                        this.handleActions(e, "get", "selected_platform")
                      }
                    >
                      <MenuItem value="">None</MenuItem>
                      {platforms.map(item => {
                        return <MenuItem value={item.id}>{`${item.en_name}, ${item.es_name}`}</MenuItem>;
                      })}
                    </Select>
                  </FormControl>
                  <div className={classes.demo}>
                    <List dense="false">
                      {brands.map(item => {
                        return (
                          <ListItem>
                            {/* <ListItemAvatar>
                              <Avatar>
                                <img src={item.icon} />
                              </Avatar>
                            </ListItemAvatar> */}
                            <ListItemText primary={`${item.en_name}, ${item.es_name}`} />
                            <ListItemSecondaryAction>
                              <Tooltip title="Technician Help Section">
                                <IconButton
                                  edge="end"
                                  aria-label="help"
                                  className='help_icon_device'
                                  onClick={e =>
                                    this.handleActions(e, "help", item)
                                  }
                                >
                                  <ContactSupportIcon />
                                </IconButton>
                              </Tooltip>
                              {/* <IconButton
                                edge="end"
                                aria-label="view"
                                onClick={e =>
                                  this.handleActions(e, "view", item)
                                }
                              >
                                <PageviewIcon />
                              </IconButton> */}
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
        ) : (
            <HelpPage state={this.state} backPage={this.backPage} />
          )}

        <Dialog
          open={(add_edit === 1 && add_flag) || (add_edit === 2 && edit_flag)}
          onClose={e => {
            (add_edit === 1 && this.handleClose(e, "add")) ||
              (add_edit === 2 && this.handleClose(e, "edit"));
          }}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">
            {(add_edit === 1 && "Add") || (add_edit === 2 && "Edit")} brand
          </DialogTitle>
          <DialogContent>
            <FormControl className={classes.formControl}>
              <InputLabel id="demo-simple-select-label">Platform</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={action_platform}
                onChange={e => this.handleChange(e, "action_platform")}
              >
                <MenuItem value="">None</MenuItem>
                {platforms.map(item => {
                  return <MenuItem value={item.id}>{`${item.en_name}, ${item.es_name}`}</MenuItem>;
                })}
              </Select>
            </FormControl>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="brand name"
              type="text"
              value={en_name}
              fullWidth
              onChange={e => this.handleChange(e, "en_name")}
            />
            <TextField
              margin="dense"
              id="name"
              label="Nombre de la marca"
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
          <DialogTitle id="form-dialog-title">Delete brand</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you want to delete this brand? Because the associated Models will be deleted.
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
    brand_list: store.device.brand_list,
    add_response: store.device.add_response,
    edit_response: store.device.edit_response,
    delete_response: store.device.delete_response
  };
};

const mapDispatchToProps = dispatch => {
  return {
    platformList: () => dispatch(platformList()),
    brandList: params => dispatch(brandList(params)),
    addEditBrand: (params, method) => dispatch(addEditBrand(params, method)),
    deleteBrand: params => dispatch(deleteBrand(params))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BrandPage);
