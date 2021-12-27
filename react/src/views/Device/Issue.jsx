import React, { Component } from "react";
import AWS from "aws-sdk";
import { connect } from "react-redux";
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
import SubdirectoryArrowLeftIcon from "@material-ui/icons/SubdirectoryArrowLeft";
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
import { issueList, addEditIssue, deleteIssue } from "../../actions/device";
import Actions from "./Actions";

const config = {
  bucketName: "blackpatchadmin",
  dirName: "media" /* optional */,
  region: "us-east-1",
  accessKeyId: "AKIAYERD463SBLKWXFZH",
  secretAccessKey: "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",
  s3Url: "https://blackpatchadmin.s3.amazonaws.com/" /* optional */
};
let s3 = new AWS.S3(config);

let editFlag = false;
let deleteFlag = false;
let addFlag = false;
export class Issue extends Component {
  constructor(props) {
    super(props);

    this.state = {
      issues: [],
      image: [],
      view_image: [],
      issue_array: [],
      model_id: this.props.state && this.props.state.model_id,
      edit_flag: false,
      delete_flag: false,
      add_flag: false,
      add_edit: 0
    };
  }
  componentWillMount() {
    this.props.issueList(this.state.model_id);
  }

  UNSAFE_componentWillReceiveProps(newProps) {
    const {
      issue_list,
      add_response,
      edit_response,
      delete_response
    } = newProps;

    if (issue_list && issue_list.status === 200) {
      if (issue_list.issues !== null) {
        this.setState({ issues: issue_list.issues });
      }
    }

    if (add_response && add_response.status === 200 && addFlag) {
      this.props.issueList(this.state.model_id);
      addFlag = false;
      this.setState({ add_flag: false });
      toaster("success", add_response.message);
    } else if (add_response && add_response.status === 404 && addFlag) {
      addFlag = false;
      toaster("error", add_response.message);
    }
    if (edit_response && edit_response.status === 200 && editFlag) {
      this.props.issueList(this.state.model_id);
      editFlag = false;
      this.setState({ edit_flag: false });
      toaster("success", edit_response.message);
    } else if (edit_response && edit_response.status === 404 && editFlag) {
      editFlag = false;
      toaster("error", edit_response.message);
    }

    if (delete_response && delete_response.status === 200 && deleteFlag) {
      this.props.issueList(this.state.model_id);
      deleteFlag = false;
      this.setState({ delete_flag: false });
      toaster("success", delete_response.message);
      this.props.backPage();
    } else if (
      delete_response &&
      delete_response.status === 404 &&
      deleteFlag
    ) {
      deleteFlag = false;
      toaster("error", delete_response.message);
    }
  }
  removeImage = (e, index) => {
    let image = this.state.image
    let view_image = this.state.view_image
    image.splice(index, 1)
    view_image.splice(index, 1)
    this.setState({ image, view_image })
  }

  handleChange = (e, name, type) => {
    if (name === "view_image") {
      let image = this.state.image
      let view_image = this.state.view_image
      image.push(e.target.files[0])
      view_image.push(URL.createObjectURL(e.target.files[0]))
      return this.setState({
        image,
        view_image
      });
    }

    let issue_array = this.state.issue_array;
    if (type === "en_issue") {
      issue_array[name].en_issue = e.target.value;
    } else if (type === "es_issue") {
      issue_array[name].es_issue = e.target.value;
    } else if (type === "value") {
      if (/^[0-9]{0,5}$/.test(e.target.value)) {
        issue_array[name].price = e.target.value;
      } else {
        return;
      }
    }
    // issue_array[name] = e.target.value;
    this.setState({ issue_array });
  };

  backIssue = () => {
    this.setState({ add_flag: false, edit_flag: false });
  };

  addIssue = (e, name, data) => {
    if (name === "add") {
      let issue_array = this.state.issue_array;
      issue_array.push({ en_issue: "", es_issue: "", price: "" });
      this.setState({ issue_array });
    } else if (name === "delete") {
      let issue_array = this.state.issue_array;
      issue_array.splice(data, 1)
      this.setState({ issue_array });
    }
  };
  handleActions = (e, action, item) => {
    if (action === "edit") {
      let issue_list = []
      item.en_issue_list.map((data, index) => {
        return (
          issue_list.push({ en_issue: data.issue, es_issue: item.es_issue_list[index].issue, price: data.price })
        )
      })
      this.setState({
        edit_flag: true,
        add_edit: 2,
        image: [item.en_image, item.es_image],
        view_image: [item.en_image, item.es_image],
        issue_array: issue_list
      });
    } else if (action === "delete") {
      this.setState({
        delete_flag: true,
        image: [item.en_image, item.es_image],
        view_image: [item.en_image, item.es_image]
      });
    } else if (action === "add") {
      this.setState({
        add_flag: true,
        add_edit: 1,
        image: [],
        view_image: [],
        issue_array: [{ en_issue: "", es_issue: "", price: "" }]
      });
    }
  };

  handleClose = (e, action) => {
    if (action === "delete") {
      this.setState({
        delete_flag: false
      });
    }
  };

  submitData = (e, action) => {
    const { image, issue_array, model_id } = this.state;
    if (action === "add") {
      if (image.length < 2) {
        return toaster("error", "Please Select Image.");
      } else if (issue_array.length === 1 && issue_array[0] === "") {
        return toaster("error", "Please add atleast one issue");
      }
      let data_flag = issue_array.some(
        data => data.en_issue === "" || data.es_issue === "" || data.price === ""
      );
      if (data_flag) {
        return toaster("error", "Please fill all the fields");
      }
      let en_issue_list = []
      let es_issue_list = []
      issue_array.map(data => {
        en_issue_list.push({ issue: data.en_issue, price: data.price })
        es_issue_list.push({ issue: data.es_issue, price: data.price })
        return null;
      })

      var params = {
        ACL: "public-read",
        ServerSideEncryption: "AES256",
        Body: image[0],
        Bucket: "blackpatchadmin",
        Key: `media/issue/${model_id}/0`
      };
      s3.putObject(params, (err, data) => {
        if (err) {
          toaster("error", err.stack);
        } else {
          var params = {
            ACL: "public-read",
            ServerSideEncryption: "AES256",
            Body: image[1],
            Bucket: "blackpatchadmin",
            Key: `media/issue/${model_id}/1`
          };
          s3.putObject(params, (err, data) => {
            if (err) {
              toaster("error", err.stack);
            } else {
              let params = {
                en_image: `https://blackpatchadmin.s3.amazonaws.com/media/issue/${model_id}/0`,
                es_image: `https://blackpatchadmin.s3.amazonaws.com/media/issue/${model_id}/1`,
                en_issue_list: en_issue_list,
                es_issue_list: es_issue_list,
                modelId: model_id
              };
              this.props.addEditIssue(params, "add");
              addFlag = true;
            }
          });
        }
      });

    } else if (action === "edit") {
      if (image.length < 2) {
        return toaster("error", "Please Select Image.");
      } else if (issue_array.length === 0) {
        return toaster("error", "Please add atleast one issue");
      }
      let data_flag = issue_array.some(
        data => data.en_issue === "" || data.es_issue === "" || data.price === ""
      );
      if (data_flag) {
        return toaster("error", "Please fill all the fields");
      }
      let en_issue_list = []
      let es_issue_list = []
      issue_array.map(data => {
        en_issue_list.push({ issue: data.en_issue, price: data.price })
        es_issue_list.push({ issue: data.es_issue, price: data.price })
        return null;
      })
      if (image[0][0] !== undefined && image[1][0] !== undefined) {
        let params = {
          en_image: image[0],
          es_image: image[1],
          en_issue_list: en_issue_list,
          es_issue_list: es_issue_list,
          modelId: model_id
        };
        this.props.addEditIssue(params, "edit");
        editFlag = true;
      } else if (image[0][0] !== undefined && image[1][0] === undefined) {
        let params = {
          ACL: "public-read",
          ServerSideEncryption: "AES256",
          Body: image[1],
          Bucket: "blackpatchadmin",
          Key: `media/issue/${model_id}/1`
        };
        s3.putObject(params, (err, data) => {
          if (err) {
            toaster("error", err.stack);
          } else {
            let params = {
              en_image: image[0],
              es_image: `https://blackpatchadmin.s3.amazonaws.com/media/issue/${model_id}/1`,
              en_issue_list: en_issue_list,
              es_issue_list: es_issue_list,
              modelId: model_id
            };
            this.props.addEditIssue(params, "edit");
            editFlag = true;
          }
        });
      } else if (image[0][0] === undefined && image[1][0] !== undefined) {
        let params = {
          ACL: "public-read",
          ServerSideEncryption: "AES256",
          Body: image[1],
          Bucket: "blackpatchadmin",
          Key: `media/issue/${model_id}/0`
        };
        s3.putObject(params, (err, data) => {
          if (err) {
            toaster("error", err.stack);
          } else {
            let params = {
              en_image: `https://blackpatchadmin.s3.amazonaws.com/media/issue/${model_id}/0`,
              es_image: image[1],
              en_issue_list: en_issue_list,
              es_issue_list: es_issue_list,
              modelId: model_id
            };
            this.props.addEditIssue(params, "edit");
            editFlag = true;
          }
        });
      } else {
        let params = {
          ACL: "public-read",
          ServerSideEncryption: "AES256",
          Body: image[0],
          Bucket: "blackpatchadmin",
          Key: `media/issue/${model_id}/0`
        };
        s3.putObject(params, (err, data) => {
          if (err) {
            toaster("error", err.stack);
          } else {
            let params = {
              ACL: "public-read",
              ServerSideEncryption: "AES256",
              Body: image[1],
              Bucket: "blackpatchadmin",
              Key: `media/issue/${model_id}/1`
            };
            s3.putObject(params, (err, data) => {
              if (err) {
                toaster("error", err.stack);
              } else {
                let params = {
                  en_image: `https://blackpatchadmin.s3.amazonaws.com/media/issue/${model_id}/0`,
                  es_image: `https://blackpatchadmin.s3.amazonaws.com/media/issue/${model_id}/1`,
                  en_issue_list: en_issue_list,
                  es_issue_list: es_issue_list,
                  modelId: model_id
                };
                this.props.addEditIssue(params, "edit");
                editFlag = true;
              }
            });
          }
        });
      }
    } else if (action === "delete") {
      let params = {
        Bucket: "blackpatchadmin",
        Key: image.split(".com/")[1]
      };
      s3.deleteObject(params, (err, data) => {
        if (err) {
          toaster("error", err.stack);
        } else {
          let params = {
            modelId: model_id
          };
          this.props.deleteIssue(params);
        }
      });
    }
  };
  render() {
    const { issues, edit_flag, add_flag, delete_flag } = this.state;
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
                    Issues
                    <Tooltip title="Back" className='icon_boundry'>
                      <IconButton
                        edge="end"
                        aria-label="back"
                        onClick={e => this.props.backPage()}
                      >
                        <SubdirectoryArrowLeftIcon />
                      </IconButton>
                    </Tooltip>
                    {issues.length !== 0 && (
                      <Tooltip title="Delete" className='icon_boundry'>
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={e => this.handleActions(e, "delete", issues)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                    {issues.length === 0 ? (
                      <Tooltip title="Add" className='icon_boundry'>
                        <IconButton
                          edge="end"
                          aria-label="add"
                          onClick={e => this.handleActions(e, "add")}
                        >
                          <AddIcon />
                        </IconButton>
                      </Tooltip>
                    ) : (
                        <Tooltip title="Edit" className='icon_boundry'>
                          <IconButton
                            edge="end"
                            aria-label="edit"
                            onClick={e => this.handleActions(e, "edit", issues)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                  </Typography>
                ) : (
                    <Typography variant="h5" className='header_platform'>
                      Add Issues
                      <Tooltip title="Back" className='icon_boundry'>
                        <IconButton
                          edge="end"
                          aria-label="back"
                          onClick={e => this.backIssue(e)}
                        >
                          <SubdirectoryArrowLeftIcon />
                        </IconButton>
                      </Tooltip>
                    </Typography>
                  )}
              </CardHeader>
              <CardBody>
                {!add_flag && !edit_flag ? (
                  <div>
                    <div className='issue_images'>
                      {issues.en_image && <img src={issues.en_image} alt='issue_image' className="issue_img1" />}
                      {issues.es_image && <img src={issues.es_image} alt='issue_image' className="issue_img2" />}
                    </div>
                    {issues.en_issue_list &&
                      issues.en_issue_list.map((data, index) => {
                        return (
                          <Card>
                            <CardBody>
                              <TextField
                                margin="dense"
                                id="name"
                                label={"Issue " + (index + 1)}
                                type="text"
                                value={data.issue}
                                fullWidth
                                disabled
                              />
                              <TextField
                                margin="dense"
                                id="name"
                                label={"Problema " + (index + 1)}
                                type="text"
                                value={issues.es_issue_list[index].issue}
                                fullWidth
                                disabled
                              />
                              <TextField
                                margin="dense"
                                id="name"
                                label={"Price " + (index + 1)}
                                type="text"
                                value={data.price}
                                fullWidth
                                disabled
                              />
                            </CardBody>
                          </Card>
                        );
                      })}
                  </div>
                ) : (
                    <Actions
                      state={this.state}
                      handleChange={this.handleChange}
                      removeImage={this.removeImage}
                      addIssue={this.addIssue}
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
          <DialogTitle id="form-dialog-title">Delete Issue</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you want to delete these Issues?
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
    issue_list: store.device.issue_list,
    add_response: store.device.add_response,
    edit_response: store.device.edit_response,
    delete_response: store.device.delete_response
  };
};

const mapDispatchToProps = dispatch => {
  return {
    issueList: params => dispatch(issueList(params)),
    addEditIssue: (params, method) => dispatch(addEditIssue(params, method)),
    deleteIssue: params => dispatch(deleteIssue(params))
    // brandList: params => dispatch(brandList(params))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Issue);
