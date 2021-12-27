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
import { bookings, searchBookingApi } from "../../actions/user";
import ViewBookingDetails from "./ViewBookingDetails";
import TextField from "@material-ui/core/TextField";
import { API_URL } from "../../config";
import {
  ToastsContainer,
  ToastsStore,
  ToastsContainerPosition
} from "react-toasts";

export class BookingPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      bookings: [],
      complete_booking_data: [],
      person_id: "",
      detail_page: false,
      booking_details: [],
      page: 0,
      count: 0,
      rowsPerPage: 10
    };
  }
  componentDidMount() {
    this.props.bookings();
  }

  UNSAFE_componentWillReceiveProps(newProps) {
    const { booking_data } = newProps;
    if (booking_data && booking_data.status === 200) {
      let bookings = [];
      let count = booking_data.count
      let complete_booking_data = booking_data.booking_history
      let i = 0;
      booking_data.booking_history.map(data => {
        let arr = { view: data };
        bookings.push(["BK000"+i,data.user.username, data.technician ? data.technician.username : "Not Accepted", data.modelName, data.dateTime, data.status, arr]);
        i++;
        return null;
      });
      this.setState({ bookings, count, complete_booking_data });
    }
  }
  backPage = () => {
    this.setState({ detail_page: false });
  };
  handleChange = (name, data) => {
    let complete_booking_data = this.state.complete_booking_data
    let booking_details = this.state.book_details
    let b_data = complete_booking_data.find(item => item.id === data.id)
    booking_details = b_data
    this.setState({ booking_details, detail_page: true })
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
  
  saveAsExcel = () => {
    let excel_link = API_URL + '/cms/export_booking?query=excel'

    const link = document.createElement("a");
    link.href = excel_link;

    link.setAttribute("download", "file.pdf");

    document.body.appendChild(link);
    link.click();
  }
  saveAsCsv = () => {
    let excel_link = API_URL + '/cms/export_booking?query=csv'

    const link = document.createElement("a");
    link.href = excel_link;

    link.setAttribute("download", "file.pdf");

    document.body.appendChild(link);
    link.click();
  }

  render() {
    const { bookings, detail_page, count, page, rowsPerPage } = this.state;
    return (
      <GridContainer>
        <ToastsContainer
          store={ToastsStore}
          position={ToastsContainerPosition.TOP_RIGHT}
        />
        <GridItem xs={12} sm={12} md={12}>
          {!detail_page && (
            <div className='parent_search_export'>
              <div className='right'>
                <TextField id="standard-search" label="Search field" type="search" onChange={e => this.handleSearchChange(e)} />
              </div>
              <div className='left'>
                Export as:
                <img src='/images/excel.svg' alt='excel' onClick={e => this.saveAsExcel(e)} className='excel_icon' />
                <img src='/images/csv.svg' alt='csv' onClick={e => this.saveAsCsv(e)} className='csv_icon' />
              </div>
            </div>
          )}
          <Card>
            {!detail_page ? (
              <CardHeader color="primary">
                <Typography variant="h5" className='header_platform'>Bookings</Typography>
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
              {!detail_page ? (
                <Table
                  customClass='table_class_width'
                  tableHeaderColor="primary"
                  tableHead={["Id","User", "Technician", "Model", "Submission Date", "Status", "Actions"]}
                  tableData={bookings}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  count={count}
                  handleChange={this.handleChange}
                  handleChangePage={this.handleChangePage}
                  handleChangeRowsPerPage={this.handleChangeRowsPerPage}
                />
              ) : (
                  <ViewBookingDetails detail={this.state.booking_details} />
                )}
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    );
  }
}
const mapStateToProps = store => {
  return {
    booking_data: store.user.booking_data
  };
};

const mapDispatchToProps = dispatch => {
  return {
    bookings: params => dispatch(bookings(params)),
    searchBookingApi: params => dispatch(searchBookingApi(params))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BookingPage);
