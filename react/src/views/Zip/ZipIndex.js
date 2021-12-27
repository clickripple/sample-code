import React, { Component } from "react";
import { connect } from "react-redux";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Table from "components/Table/Table.js";
import Card from "components/Card/Card.js";
import Typography from "@material-ui/core/Typography";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import SubdirectoryArrowLeftIcon from "@material-ui/icons/SubdirectoryArrowLeft";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import AddIcon from "@material-ui/icons/Add";
import Button from "@material-ui/core/Button";
import { toaster } from "../../helper/Toaster";
import axios from "axios";
import { axiosConfig } from "../../config";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import { codes, add_codes, block_code, searchBookingApi } from "../../actions/user";
import ViewBookingDetails from "../User/ViewBookingDetails";
import TextField from "@material-ui/core/TextField";
import { API_URL } from "../../config";
import {
  ToastsContainer,
  ToastsStore,
  ToastsContainerPosition
} from "react-toasts";
let addFlag = false;
export class ZipIndex extends Component {
  constructor(props) {
    super(props);

    this.state = {
      bookings: [],
      pincodes:[],
      all_pincodes:[],
      complete_booking_data: [],
      person_id: "",
      detail_page: false,
      booking_details: [],
      page: 0,
      count: 0,
      rowsPerPage: 10,
      add_flag: false,
      add_edit: 0,
      edit_id: "",
      edit_flag: false,
      code: "",
      country: ""
    };
  }
  async componentDidMount() {
    const ab = await this.props.codes();
    const pincodes = ab.value.data;
    if (pincodes && pincodes.status === 200) {
      let pins = [];
      let count = pincodes.count
      let all_pincodes = pincodes.pincodes;
      let i = 1;
      pincodes.pincodes.map(data => {
        let arr = { view: data, edit: data, block: data };
        pins.push([i, data.code, data.country, arr]);
        i++;
        return null;
      });
      this.setState({ pincodes: pins, count, all_pincodes });
    }
  }
  submitData = (e, action) => {
    const { code, country } = this.state;
    if (action === "add") {
      if (code !== "" && country !== "") {
        let params = {
          code: code,
          country: country,
          activated:1
        };
        axios.post(`${API_URL}/admin/pincode`, params).then(res=>{
          let pincodes = [...this.state.pincodes];
          let data = res.data.pincode;
          data.sno = pincodes.length+1;
          let arr = { view: data, edit: data, block: data };

          pincodes.push([pincodes.length+1, data.code, data.country, arr]);
          this.setState({ pincodes : pincodes});
        });
        
        addFlag = true;
        this.setState({ code: "", country: "",add_flag: false,
        add_edit: 0 });

      } else {
        toaster("error", "Please fill zip name");
      }
    }
  };
  UNSAFE_componentWillReceiveProps(newProps) {
    // const { pincodes } = newProps;
    // const booking_data = pincodes;
    console.log(newProps);
    // if (pincodes && pincodes.status === 200) {
    //   let bookings = [];
    //   let count = booking_data.count
    //   let complete_booking_data = booking_data.booking_history
    //   booking_data.booking_history.map(data => {
    //     let arr = { view: data };
    //     bookings.push([data.id, data.modelName, data.dateTime, data.status, arr]);
    //     return null;
    //   });
    //   this.setState({ bookings, count, complete_booking_data });
    // }
  }
  backPage = () => {
    this.setState({ detail_page: false });
  };

  handleChange = (name, data,third) => {
    let params = null;
    if (name === "block") {
      if(window.confirm("Are you sure you want to delete this pincode?")){
        params = {
          id: data.id,
          activated: false
        }
        axios.delete(`${API_URL}/admin/pincode?id=${data.id}`).then(
          res =>{
            if(res.status === 200){
              let pincodes = [...this.state.pincodes];
              let index = pincodes.findIndex(i=> i[0] == third);
              // console.log(index);
              let pins = pincodes.filter((value, i, arr) => i != index);
              this.setState({
                pincodes: pins
              })
            }
          },
        );
      }
    }
  };

  handleFormChange = (e, name) => {
    this.setState({ [name]: e.target.value });
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
      this.props.searchBookingApi(e.target.value)
    } else {
      this.props.bookings();
    }
  }
  handleActions = (e,type) => {
    if(type === "add"){
      this.setState({
        add_flag: true,
        add_edit: 1
      });
    }
    
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

  render() {
    const { pincodes, detail_page, code, country, add_flag, add_edit, edit_id, edit_flag, count, page, rowsPerPage } = this.state;
    return (
      <div>
      <GridContainer>
        <ToastsContainer
          store={ToastsStore}
          position={ToastsContainerPosition.TOP_RIGHT}
        />
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            {!detail_page ? (
              <CardHeader color="primary">
                <Typography variant="h5" className='header_platform'>Available Zip Codes
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
            ) : (
                <CardHeader color="primary">
                  <Typography variant="h5" className='header_platform'>Booking Details
                                    <Tooltip title="Back" className='icon_boundry'>
                      <IconButton
                        edge="end"
                        aria-label="back"
                        onClick={e => this.backPage(e)}
                      >
                        <SubdirectoryArrowLeftIcon />
                      </IconButton>
                    </Tooltip>
                  </Typography>
                </CardHeader>
              )}
            <CardBody>
                <Table
                  customClass='table_class_width'
                  tableHeaderColor="primary"
                  tableHead={["Serial No", "Code", "Country","Actions"]}
                  tableData={pincodes}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  count={count}
                  handleChange={this.handleChange}
                  handleChangePage={this.handleChangePage}
                  handleChangeRowsPerPage={this.handleChangeRowsPerPage}
                  hideEdit={true}
                  hideView={true}
                  tipText={true}
                />
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
            {(add_edit === 1 && "Add") || (add_edit === 2 && "Edit")} Zip Code
          </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="code"
              label="Code"
              type="text"
              value={code}
              fullWidth
              onChange={e => this.handleFormChange(e, "code")}
            />
          </DialogContent>
          <DialogContent>
            <TextField
              margin="dense"
              id="country"
              label="Country"
              type="text"
              value={country}
              fullWidth
              onChange={e => this.handleFormChange(e, "country")}
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
      </div>
    );
  }
}
const mapStateToProps = store => {
  return {
    pincodes: store.user.pincodes,
    add_pincode : store.user.pincodes
  };
};

const mapDispatchToProps = dispatch => {
  return {
    codes: params => dispatch(codes(params)),
    add_codes: params => dispatch(add_codes(params)),
    block_code: params => dispatch(block_code(params))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ZipIndex);
