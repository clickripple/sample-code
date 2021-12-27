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
import { CSVLink, CSVDownload } from "react-csv";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import ShowReport from "./ShowReport";
import { reports, add_codes, block_code, searchBookingApi } from "../../actions/user";

import {
  ToastsContainer,
  ToastsStore,
  ToastsContainerPosition
} from "react-toasts";
let addFlag = false;
export class Reports extends Component {
  constructor(props) {
    super(props);

    this.state = {
      bookings: [],
      reports:[],
      bookings_flag: false,
      bookings: [["Shobhit","Iphone 11","Accepted", 200]],
      all_techs:[],
      technicianId: null,
      bookings_count: 0,
      bookings_page: 0,
      page: 0,
      count: 0,
      rowsPerPage: 10,
      techName: null,
      techEarning: null,
      techJob: null,
      techRating: null
    };
  }
  async componentDidMount() {
    const ab = await this.props.reports();
    const technicians = ab.value.data;
    if (technicians && technicians.status === 200) {
      let pins = [];
      let count = technicians.techs.length
      let all_techs = technicians.techs;
      technicians.techs.map(data => {
        let arr = { view: data };
        pins.push([data.name, data.rejected, data.completed_count,data.sum, data.avgRating,arr]);
        return null;
      });
      this.setState({ reports: pins, count, all_techs });
    }
  }
  handleChange = (name, data) => {
    this.setState({
      technicianId: data.id,
      bookings_flag: true,
      bookings_count : data.bookings.length,
      bookings: data.bookings,
      techName: data.name,
      techEarning: data.sum,
      techJob: data.completed_count,
      techRating: data.avgRating
    });
  };

  handleChangePage = (event, newPage) => {
    this.setState({ page: newPage })
  }

  handleChangePageBooking = (event, newPage) => {
    this.setState({ bookings_page: newPage })
  }

  handleChangeRowsPerPage = (event) => {
    this.setState({ rowsPerPage: parseInt(event.target.value, 10) })
    this.setState({ page: 0 })
  };

  handleFormChange = (e, name) => {
    this.setState({ [name]: e.target.value });
  };
  
  handleClose = (e, action) => {
      this.setState({
        bookings_flag: false,
      });
  };

  render() {
    let exportData=[["Serial No.","Technician", "Rejected Jobs", "Completed Jobs", "Revenue", "Rating"]];
    const { reports, bookings, bookings_count,bookings_page, bookings_flag, count, page, rowsPerPage } = this.state;
    let i = 1;
    for(let data of reports){
      exportData.push([i,data[0], data[1], data[2],data[3], data[4]]);
      i++;
    }
    return (
      <div>
      {!bookings_flag ? <GridContainer>
        <ToastsContainer
          store={ToastsStore}
          position={ToastsContainerPosition.TOP_RIGHT}
        />
        <CSVLink filename={"blackpatch-reports.csv"} data={exportData}>Export CSV</CSVLink>

        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="primary">
            <Typography variant="h5" className='header_platform'>Reports
          
            </Typography>
            </CardHeader> 
            <CardBody>
                <Table
                  customClass='table_class_width'
                  tableHeaderColor="primary"
                  tableHead={["Technician", "Rejected Jobs", "Completed Jobs", "Revenue", "Rating", "Actions"]}
                  tableData={reports}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  count={count}
                  handleChange={this.handleChange}
                  handleChangePage={this.handleChangePage}
                  handleChangeRowsPerPage={this.handleChangeRowsPerPage}
                />
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer> : null}
      {bookings_flag ? <ShowReport
        onClose={e => { this.handleClose(e);}}
        techName={this.state.techName}
        techEarning={this.state.techEarning}
        techJob={this.state.techJob}
        techRating={this.state.techRating}
        technician={this.state.technicianId}
      /> : null}
      {/* <Dialog
          open={bookings_flag}
          onClose={e => {
            this.handleClose(e);
          }}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">
          Bookings
          </DialogTitle>
          <DialogContent>
          <Table
                  customClass='table_class_width'
                  tableHeaderColor="primary"
                  tableHead={["User", "Modal", "Status", "Amount"]}
                  tableData={bookings}
                  rowsPerPage={rowsPerPage}
                  page={bookings_page}
                  count={bookings_count}
                  handleChange={this.handleChange}
                  handleChangePage={this.handleChangePageBooking}
                  handleChangeRowsPerPage={this.handleChangeRowsPerPage}
                />
          </DialogContent>
        
      
        </Dialog> */}

      </div>
    );
  }
}

const mapStateToProps = store => {
  return {
    reports: store.user.reports
  };
};

const mapDispatchToProps = dispatch => {
  return {
    reports: params => dispatch(reports(params)),
    add_codes: params => dispatch(add_codes(params)),
    block_code: params => dispatch(block_code(params))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Reports);
