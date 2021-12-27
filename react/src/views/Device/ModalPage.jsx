import React, { Component } from "react";
import AWS from "aws-sdk";
import { connect } from "react-redux";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import AddIcon from "@material-ui/icons/Add";
import ReportProblemIcon from "@material-ui/icons/ReportProblem";
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
import TablePagination from '@material-ui/core/TablePagination';
import Issue from "./Issue";
import PropTypes from "prop-types";
import moment from 'moment'
import {
  ToastsContainer,
  ToastsStore,
  ToastsContainerPosition
} from "react-toasts";
import { toaster } from "../../helper/Toaster";
import {
  platformList,
  brandList,
  modelList,
  addEditModel,
  deleteModel,
  searchModelApi
} from "../../actions/device";
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import Popover from "@material-ui/core/Popover";

const config = {
  bucketName: "blackpatchadmin",
  dirName: "media" /* optional */,
  region: "us-east-1",
  accessKeyId: "AKIAYERD463SBLKWXFZH",
  secretAccessKey: "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",
  s3Url: "https://blackpatchadmin.s3.amazonaws.com/" /* optional */
};
let s3 = new AWS.S3(config);
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
const useStyles1 = makeStyles((theme) => ({
  root: {
    flexShrink: 0,
    marginLeft: theme.spacing(2.5),
  },
}));
function TablePaginationActions(props) {
  const classes = useStyles1();
  const theme = useTheme();
  const { count, page, rowsPerPage, onChangePage } = props;

  const handleFirstPageButtonClick = (event) => {
    onChangePage(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onChangePage(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onChangePage(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <div className={classes.root}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </div>
  );
}
TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

export class modelPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      models: [],
      current_model: "",
      model_id: "",
      en_name: "",
      es_name: "",
      image: "",
      show_image: "",
      edit_id: "",
      edit_flag: false,
      delete_flag: false,
      delete_data: "",
      add_flag: false,
      add_edit: 0,
      selected_platform: "",
      selected_brand: "",
      action_platform: "",
      action_brand: "",
      platforms: [],
      brands: [],
      toggleFlag: false,
      page: 0,
      count: 0,
      rowsPerPage: 10,
      colors: [],
      anchorEl: null,
      currentColor: "#000"
    };
    this.colorSel = React.createRef();
  }
  componentDidMount() {
    this.props.platformList();
    let params = {
      platformId: this.state.selected_platform,
      brandId: this.state.selected_brand
    };
    this.props.modelList(params);
  }

  changeColor = (e) => {
    this.setState({
      currentColor: e.target.value
    });
  }

  chooseColor = () => {
    let state = {...this.state};
    let colors = state.colors;
    colors.push(state.currentColor);
    this.setState({ colors , anchorEl: null });
  }

  removeColor = (index) => {
    let colors = {...this.state}.colors;
    colors.splice(index, 1);
    this.setState({
      colors
    })
  }

  handleClick = (event) => {
    this.setState({
      anchorEl: event.currentTarget
    })
  };

  handleClosePopover = () => {
    this.setState({
      anchorEl: null
    })
  }

  UNSAFE_componentWillReceiveProps(newProps) {
    const {
      platform_list,
      brand_list,
      model_list,
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
    if (model_list && model_list.status === 200) {
      let count = model_list.count
      this.setState({ models: model_list.models, count });
    }

    if (add_response && add_response.status === 200 && addFlag) {
      let params = {
        platformId: this.state.selected_platform,
        brandId: this.state.selected_brand
      };
      this.props.modelList(params);
      addFlag = false;
      this.setState({
        add_flag: false,
        selected_platform: "",
        selected_brand: ""
      });
      toaster("success", add_response.message);
    } else if (add_response && add_response.status === 404 && addFlag) {
      addFlag = false;
      toaster("error", add_response.message);
    }
    if (edit_response && edit_response.status === 200 && editFlag) {
      let params = {
        platformId: this.state.selected_platform,
        brandId: this.state.selected_brand
      };
      this.props.modelList(params);
      editFlag = false;
      this.setState({ edit_flag: false });
      toaster("success", edit_response.message);
    } else if (edit_response && edit_response.status === 200 && editFlag) {
      editFlag = false;
      toaster("error", edit_response.message);
    }

    if (delete_response && delete_response.status === 200 && deleteFlag) {
      let params = {
        platformId: this.state.selected_platform,
        brandId: this.state.selected_brand
      };
      this.props.modelList(params);
      deleteFlag = false;
      this.setState({ delete_flag: false });
    }
  }

  handleChange = (e, name) => {
    if (name === "action_platform") {
      if (e.target.value !== "") {
        this.props.brandList(e.target.value);
      } else {
        this.setState({ action_brand: "", brands: [] });
      }
    }
    if (name === "show_image") {
      return this.setState({
        image: e.target.files[0],
        show_image: URL.createObjectURL(e.target.files[0])
      });
    }

    this.setState({ [name]: e.target.value });
  };
  handleChangePage = (event, newPage) => {
    this.setState({ page: newPage })
  }
  handleChangeRowsPerPage = (event) => {
    this.setState({ rowsPerPage: parseInt(event.target.value, 10) })
    this.setState({ page: 0 })
  };
  handleActions = (e, action, item, index) => {
    if (action === "get" && item === "selected_platform") {
      if (e.target.value !== "") {
        this.props.brandList(e.target.value);
        let params = {
          platformId: e.target.value,
          brandId: ""
        };
        this.props.modelList(params);
      } else {
        let params = {
          platformId: e.target.value,
          brandId: ""
        };
        this.props.modelList(params);
        this.setState({ selected_brand: "", brands: [], models: [] });
      }
      this.setState({ [item]: e.target.value });
    } else if (action === "get" && item === "selected_brand") {
      let params = {
        platformId: this.state.selected_platform,
        brandId: e.target.value
      };
      this.props.modelList(params);
      this.setState({ [item]: e.target.value });
    } else if (action === "edit") {
      this.props.brandList(item.brand.platformId);
      this.setState({
        edit_id: item.id,
        brands: [],
        edit_flag: true,
        en_name: item.en_name,
        es_name: item.es_name,
        image: item.image,
        show_image: item.image,
        current_model: item.image,
        add_edit: 2,
        action_platform: item.brand.platformId,
        action_brand: item.brandId,
        colors : item.colors ? item.colors.split(','): []
      });
    } else if (action === "delete") {
      this.setState({
        delete_data: item,
        delete_flag: true
      });
    } else if (action === "add") {
      this.setState({
        add_flag: true,
        brands: [],
        add_edit: 1,
        en_name: "",
        es_name: "",
        image: "",
        show_image: "",
        current_model: `Model${item}`,
        action_platform: "",
        action_brand: ""
      });
    } else if (action === "view") {
      this.setState({ model_id: item.id, toggleFlag: true });
    }
  };

  backPage = () => {
    this.setState({ model_id: "", toggleFlag: false });
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
        delete_data: "",
        delete_flag: false
      });
    }
  };

  submitData = (e, action) => {
    const {
      edit_id,
      en_name,
      es_name,
      image,
      current_model,
      delete_data,
      action_platform,
      action_brand,
      colors
    } = this.state;
    if (action === "add") {
      if (action_platform === "") {
        return toaster("error", "Please Select Platform.");
      } else if (action_brand === "") {
        return toaster("error", "Please Select Brand.");
      } 
      else if (image === "") {
        return toaster("error", "Please upload image");
      } 
      else if (en_name === "" || es_name === "") {
        return toaster("error", "Please Fill Model Name");
      } else if (colors.length === 0) {
        return toaster("error", "Pick at least one color");
      }
      var date_create = moment().format('YYYY-MM-DD H:m:ss.SS')
      let params = {
        ACL: "public-read",
        ServerSideEncryption: "AES256",
        Body: image,
        Bucket: "blackpatchadmin",
        Key: `media/model/${date_create}`
      };

      s3.putObject(params, (err, data) => {
        if (err) {
          toaster("error", err.stack);
        } else {
          let params = {
            en_name: en_name,
            es_name: es_name,
            image: `https://blackpatchadmin.s3.amazonaws.com/media/model/${date_create}`,
            brandId: action_brand,
            colors: colors.toString()
          };
          this.props.addEditModel(params, "add");
          addFlag = true;
          this.setState({ colors : [] })
        }
      });
    } else if (action === "edit") {
      if (action_platform === "") {
        return toaster("error", "Please Select Platform.");
      } else if (action_brand === "") {
        return toaster("error", "Please Select Brand.");
      } else if (image === "") {
        return toaster("error", "Please upload image");
      } else if (en_name === "" || es_name === "") {
        return toaster("error", "Please Fill Model Name");
      } else if (colors.length === 0) {
        return toaster("error", "Pick at least one color");
      }

      let params = {
        ACL: "public-read",
        ServerSideEncryption: "AES256",
        Body: image,
        Bucket: "blackpatchadmin",
        Key: current_model.split(".com/")[1]
      };

      if (image[0] !== undefined) {
        let params = {
          id: edit_id,
          en_name: en_name,
          es_name: es_name,
          image: image,
          brandId: action_brand,
          colors: colors.toString()
        };
        this.props.addEditModel(params, "edit");
        editFlag = true;
      } else {
        s3.putObject(params, (err, data) => {
          if (err) {
            toaster("error", err.stack);
          } else {
            let params = {
              id: edit_id,
              en_name: en_name,
              es_name: es_name,
              image: `https://blackpatchadmin.s3.amazonaws.com/${current_model.split(".com/")[1]}`,
              brandId: action_brand,
              colors: colors.toString()
            };
            this.props.addEditModel(params, "edit");

            editFlag = true;
          }
        });
      }
    } else if (action === "delete") {
      let params = {
        Bucket: "blackpatchadmin",
        Key: delete_data.image.split(".com/")[1]
      };
      s3.deleteObject(params, (err, data) => {
        if (err) {
          toaster("error", err.stack);
        } else {
          let params = {
            id: delete_data.id
          };
          this.props.deleteModel(params);
          deleteFlag = true;
        }
      });
    }
  };
  handleChangePage = (event, newPage) => {
    this.setState({ page: newPage })
  }
  handleChangeRowsPerPage = (event) => {
    this.setState({ rowsPerPage: parseInt(event.target.value, 10) })
    this.setState({ page: 0 })
  };
  handleSearchChange = (e) => {
    if ((e.target.value).length > 0) {
      this.props.searchModelApi(e.target.value)
    } else {
      let params = {
        platformId: this.state.selected_platform,
        brandId: this.state.selected_brand
      };
      this.props.modelList(params);
    }
  }
  render() {
    const {
      platforms,
      brands,
      models,
      edit_flag,
      delete_flag,
      add_flag,
      add_edit,
      en_name,
      es_name,
      action_platform,
      action_brand,
      selected_brand,
      selected_platform,
      toggleFlag,
      count,
      page,
      rowsPerPage,
      anchorEl,
      colors
    } = this.state;

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    return (
      <div>
        <ToastsContainer
          store={ToastsStore}
          position={ToastsContainerPosition.TOP_RIGHT}
        />
        {!toggleFlag ? (
          <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
              <TextField id="standard-search" label="Search field" type="search" onChange={e => this.handleSearchChange(e)} />
              <Card>
                <CardHeader color="primary">
                  <Typography variant="h5" className='header_platform'>
                    Model
                    <Tooltip title="Add" className='icon_boundry'>
                      <IconButton
                        edge="end"
                        aria-label="edit"
                        onClick={e =>
                          this.handleActions(e, "add", models.length)
                        }
                      >
                        <AddIcon />
                      </IconButton>
                    </Tooltip>
                  </Typography>
                </CardHeader>
                <CardBody>
                  <GridContainer>
                    <GridItem >
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
                            return (
                              <MenuItem value={item.id}>{`${item.en_name}, ${item.es_name}`}</MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl>
                    </GridItem>
                    <GridItem >
                      <FormControl className={classes.formControl}>
                        <InputLabel id="demo-simple-select-label">
                          Brand
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={selected_brand}
                          onChange={e =>
                            this.handleActions(e, "get", "selected_brand")
                          }
                        >
                          <MenuItem value="">None</MenuItem>
                          {brands.map(item => {
                            return (
                              <MenuItem value={item.id}>{`${item.en_name}, ${item.es_name}`}</MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl>
                    </GridItem>
                  </GridContainer>
                  <div className={classes.demo}>
                    <List dense="false">
                      {(rowsPerPage > 0
                        ? models.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        : models
                      ).map((item, index) => {
                        return (
                          <ListItem>
                            <ListItemAvatar>
                              <Avatar>
                                <img class="modal_img" alt='modal_image' src={item.image} />
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={`${item.en_name}, ${item.es_name}`} />
                            <ListItemSecondaryAction>
                              <Tooltip title="Issue Section">
                                <IconButton
                                  edge="end"
                                  aria-label="view"
                                  className='issue_icon_device'
                                  onClick={e =>
                                    this.handleActions(e, "view", item)
                                  }
                                >
                                  <ReportProblemIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Edit">
                                <IconButton
                                  edge="end"
                                  aria-label="edit"
                                  className='edit_icon_device'
                                  onClick={e =>
                                    this.handleActions(e, "edit", item, index)
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
                      <TablePagination
                        rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}

                        count={count}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        SelectProps={{
                          inputProps: { 'aria-label': 'rows per page' },
                          native: true,
                        }}
                        onChangePage={this.handleChangePage}
                        onChangeRowsPerPage={this.handleChangeRowsPerPage}
                        ActionsComponent={TablePaginationActions}
                      />
                    </List>

                  </div>
                </CardBody>
              </Card>
            </GridItem>
          </GridContainer>
        ) : (
            <Issue state={this.state} backPage={this.backPage} />
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
            {(add_edit === 1 && "Add") || (add_edit === 2 && "Edit")} model
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
            <FormControl className={classes.formControl}>
              <InputLabel id="demo-simple-select-label">Brand</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={action_brand}
                onChange={e => this.handleChange(e, "action_brand")}
              >
                <MenuItem value="">None</MenuItem>
                {brands.map(item => {
                  return <MenuItem value={item.id}>{`${item.en_name}, ${item.es_name}`}</MenuItem>;
                })}
              </Select>
            </FormControl>
            <img class="modal_img" alt='modal_image' src={this.state.show_image} />
            <TextField
              autoFocus
              margin="dense"
              id="show_image"
              label="show_image"
              type="file"
              // value={show_image}
              fullWidth
              onChange={e => this.handleChange(e, "show_image")}
            />
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Model Name"
              type="text"
              value={en_name}
              fullWidth
              onChange={e => this.handleChange(e, "en_name")}
            />
            <TextField
              margin="dense"
              id="name"
              label="Nombre modal"
              type="text"
              value={es_name}
              fullWidth
              onChange={e => this.handleChange(e, "es_name")}
            />
            <div>
              <p>Colors</p>
              <div className="d-flex flex-row">
                {colors.map((color,index) => 
                  <div 
                  className="color_box mr-2" 
                  style={{backgroundColor: color}}
                  onClick={() => this.removeColor(index)}
                  >
                  </div>
                )}
                <div className="color_box add" onClick={this.handleClick}>+</div>
                <Popover
                  id={id}
                  open={open}
                  anchorEl={anchorEl}
                  onClose={this.handleClose}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                >
                  <div className="m-3">
                    <p>Pick a color</p>
                    <div>
                    <TextField
                        margin="dense"
                        id="name"
                        label="Color"
                        type="color"
                        onChange={this.changeColor}
                      />
                    </div>
                  <Button onClick={this.chooseColor}>Ok</Button>
                  <Button onClick={this.handleClosePopover}>Cancel</Button>
                  </div>
                </Popover>
              
              </div>
            </div>
            

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
          <DialogTitle id="form-dialog-title">Delete model</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you want to delete this model?
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
    model_list: store.device.model_list,
    add_response: store.device.add_response,
    edit_response: store.device.edit_response,
    delete_response: store.device.delete_response
  };
};

const mapDispatchToProps = dispatch => {
  return {
    platformList: () => dispatch(platformList()),
    brandList: params => dispatch(brandList(params)),
    modelList: params => dispatch(modelList(params)),
    addEditModel: (params, method) => dispatch(addEditModel(params, method)),
    deleteModel: params => dispatch(deleteModel(params)),
    searchModelApi: params => dispatch(searchModelApi(params))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(modelPage);
