import React, { Component } from "react";
import { connect } from "react-redux";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Table from "components/Table/Table.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import Typography from "@material-ui/core/Typography";
import SubdirectoryArrowLeftIcon from "@material-ui/icons/SubdirectoryArrowLeft";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import FilterListIcon from "@material-ui/icons/FilterList";
import DateRangePicker from "react-daterange-picker";
import "react-daterange-picker/dist/css/react-calendar.css";
import moment from "moment";
import {
  technicianPaymentList,
  technicianPaymentData,
  searchPaymentApi,
  viewPaymentHistory,
} from "../../actions/user";
import TextField from "@material-ui/core/TextField";
import { API_URL } from "../../config";
import { toaster } from "../../helper/Toaster";
import {
  ToastsContainer,
  ToastsStore,
  ToastsContainerPosition,
} from "react-toasts";
import ViewPaymentPage from "./ViewPaymentPage";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
let pay_flag = false;
const filterFields = [
  { name: "action", label: "Action" },
  { name: "date", label: "Date" },
];
const flagFields = [
  { name: "paid", label: "Paid" },
  { name: "unpaid", label: "Unpaid" },
];
export class PaymentPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      detail_page: false,
      pay_data: [],
      pay_amount: "",
      technicianId: "",
      payment_mode: "",
      total_amount: "",
      date: "",
      after_discount: "",
      due_amount: "",
      model_flag: false,
      payment_flag: false,
      page: 0,
      count: 0,
      rowsPerPage: 10,
      payment_history: {},
      drawOpen: false,
      selected_filter: "",
      selected_flag: "",
      start_date: moment(),
      end_date: moment(),
      datePickerIsOpen: false,
    };
  }

  componentDidMount() {
    this.props.technicianPaymentList();
  }

  UNSAFE_componentWillReceiveProps(newProps) {
    const {
      technician_payment_response,
      technician_payment,
      payment_history,
    } = newProps;
    if (payment_history && payment_history.status === 200) {
      this.setState({ payment_history: payment_history.data });
    } else if (payment_history && payment_history.status === 500) {
      toaster("error", payment_history.message);
    }
    if (
      technician_payment_response &&
      technician_payment_response.status === 200
    ) {
      let pay_data = [];
      let count = technician_payment_response.count;
      let arr ={}
      technician_payment_response.paymentHistory.map((data) => {
       
        arr =data.afterDiscountamount - data.totalPaidAmount !== 0
            ? { view: data, pay: data }
            : { view: data, paid: "" };
        pay_data.push([
          data.technician.username,
          data.technician.email,
          data.technician.phone,
          data.totalAmount,
          data.afterDiscountamount,
          data.afterDiscountamount - data.totalPaidAmount,
          data.totalPaidAmount,
          arr,
        ]);
        return null;
      });
      this.setState({ pay_data, count });
    }
    if (technician_payment && technician_payment.status === 200 && pay_flag) {
      toaster("success", technician_payment.message);
      this.setState({
        model_flag: false,
        payment_mode: "",
        total_amount: "",
        date: "",
        after_discount: "",
        due_amount: "",
        pay_amount: "",
      });
      pay_flag = false;
      this.props.technicianPaymentList();
    }
  }
  handleClose = () => {
    this.setState({ model_flag: false });
  };
  handleChange = (name, data) => {
    if (name === "view") {
      this.setState({ detail_page: true });
      let params = {
        id: data.id,
        role: "user",
      };
      this.props.viewPaymentHistory(params);
    } else if (name === "pay") {
      this.setState({
        model_flag: true,
        technicianId: data.technicianId,
        total_amount: data.totalAmount,
        after_discount: data.afterDiscountamount,
        due_amount: data.afterDiscountamount - data.totalPaidAmount,
      });
    } else if (data === "pay_amount") {
      if (name.target.value > this.state.due_amount) {
        return toaster("error", "Amount can't be greater than total price");
      }
      this.setState({ [data]: name.target.value });
    } else if (data === "payment_mode") {
      this.setState({ [data]: name.target.value });
    } else if (data === "date") {
      this.setState({ [data]: name.target.value });
    }
  };
  submitData = () => {
    const {
      pay_amount,
      technicianId,
      payment_mode,
      total_amount,
      date,
      after_discount,
    } = this.state;
    if (
      pay_amount === "" ||
      technicianId === "" ||
      payment_mode === "" ||
      total_amount === "" ||
      date === "" ||
      after_discount === ""
    ) {
      return toaster("error", "Please fill all the fields");
    } else {
      let params = {
        pay_amount: pay_amount,
        technicianId: technicianId,
        payment_mode: payment_mode,
        total_amount: total_amount,
        date: date,
        after_discount: after_discount,
      };
      this.props.technicianPaymentData(params);
      pay_flag = true;
    }
  };
  handleChangePage = (event, newPage) => {
    this.setState({ page: newPage });
  };
  handleChangeRowsPerPage = (event) => {
    this.setState({ rowsPerPage: parseInt(event.target.value, 10) });
    this.setState({ page: 0 });
  };
  handleSearchChange = (e) => {
    if (e.target.value.length > 0) {
      this.props.searchPaymentApi(e.target.value);
    } else {
      this.props.technicianPaymentList();
    }
  };

  saveAsExcel = () => {
    let excel_link = API_URL + "/cms/export_payment?query=excel";

    const link = document.createElement("a");
    link.href = excel_link;

    link.setAttribute("download", "file.pdf");

    document.body.appendChild(link);
    link.click();
  };
  saveAsCsv = () => {
    let excel_link = API_URL + "/cms/export_payment?query=csv";

    const link = document.createElement("a");
    link.href = excel_link;

    link.setAttribute("download", "file.pdf");

    document.body.appendChild(link);
    link.click();
  };

  backPage = () => {
    this.setState({
      detail_page: false,
      payment_history: {},
    });
  };

  handleActions = (e, name) => {
    if (name === "selected_date") {
      this.setState({ datePickerIsOpen: !this.state.datePickerIsOpen });
    } else if (name === "selected_dates") {
      this.setState({ start_date: e.start, end_date: e.end, datePickerIsOpen: false });
    } else {
      this.setState({ [name]: e.target.value });
    }
  };

  toggleDrawer = () => {
    this.setState({ drawOpen: !this.state.drawOpen });
  };
  list = (anchor) => (
    <span>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={this.state.selected_filter}
        onChange={(e) => this.handleActions(e, "selected_filter")}
      >
        <MenuItem value="">None</MenuItem>
        {filterFields.map((item) => {
          return <MenuItem value={item.name}>{item.label}</MenuItem>;
        })}
      </Select>
      {this.state.selected_filter === "action" && (
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={this.state.selected_flag}
          onChange={(e) => this.handleActions(e, "selected_flag")}
        >
          <MenuItem value="">None</MenuItem>
          {flagFields.map((item) => {
            return <MenuItem value={item.name}>{item.label}</MenuItem>;
          })}
        </Select>
      )}
      {this.state.selected_filter === "date" && (
        <>
          <div onClick={(e) => this.handleActions(e, "selected_date")}>
            <span>
              {this.state.start_date &&
                this.state.start_date.format("YYYY-MM-DD")}
              -{this.state.end_date && this.state.end_date.format("YYYY-MM-DD")}
            </span>
          </div>
          {this.state.datePickerIsOpen && (
            <DateRangePicker
              value={moment.range(this.state.start_date, this.state.end_date)}
              maximumDate={moment()}
              onSelect={(e) => this.handleActions(e, "selected_dates")}
              singleDateRange={true}
            />
          )}
        </>
      )}
    </span>
  );

  render() {
    const {
      pay_data,
      pay_amount,
      model_flag,
      payment_mode,
      total_amount,
      date,
      after_discount,
      count,
      page,
      rowsPerPage,
      due_amount,
      detail_page,
      drawOpen,
    } = this.state;
    return (
      <div>
        {/* <Drawer
          anchor="right"
          open={drawOpen}
          onClose={() => this.toggleDrawer(false)}
        >
          {this.list("left")}
        </Drawer> */}
        <GridContainer>
          <ToastsContainer
            store={ToastsStore}
            position={ToastsContainerPosition.TOP_RIGHT}
          />

          <GridItem xs={12} sm={12} md={12}>
            {!detail_page && (
              <div className="parent_search_export">
                <div className="right">
                  <TextField
                    id="standard-search"
                    label="Search field"
                    type="search"
                    onChange={(e) => this.handleSearchChange(e)}
                  />
                  <FilterListIcon onClick={() => this.toggleDrawer()} />
                  {drawOpen && this.list("left")}
                </div>
                <div className="left">
                  Export as:
                  <img
                    src="/images/excel.svg"
                    alt="excel"
                    onClick={(e) => this.saveAsExcel(e)}
                    className="excel_icon"
                  />
                  <img
                    src="/images/csv.svg"
                    alt="csv"
                    onClick={(e) => this.saveAsCsv(e)}
                    className="csv_icon"
                  />
                </div>
              </div>
            )}
            <Card>
              {!detail_page ? (
                <CardHeader color="primary">
                  <Typography variant="h5" className="header_platform">
                    Payment
                  </Typography>
                </CardHeader>
              ) : (
                <CardHeader color="primary">
                  <Typography variant="h5" className="header_platform">
                    Payment History
                    <Tooltip title="Back" className="icon_boundry">
                      <IconButton
                        edge="end"
                        aria-label="back"
                        onClick={(e) => this.backPage(e)}
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
                    tableHeaderColor="primary"
                    tableHead={[
                      "Name",
                      "Email",
                      "Phone",
                      "Total Amount",
                      "Commisioned Amount",
                      "Due Amount",
                      "Paid Amount",
                      "Actions",
                    ]}
                    tableData={pay_data}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    count={count}
                    handleChange={this.handleChange}
                    handleChangePage={this.handleChangePage}
                    handleChangeRowsPerPage={this.handleChangeRowsPerPage}
                  />
                ) : (
                  <ViewPaymentPage
                    state={this.state}
                    backPage={this.backPage}
                  />
                )}
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
        <Dialog
          open={model_flag}
          onClose={(e) => this.handleClose(e)}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Payment Details</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Total Technician Amount"
              type="text"
              value={total_amount}
              fullWidth
              disabled
            />
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Amount With Discounted Margin"
              type="text"
              value={after_discount}
              fullWidth
              disabled
            />
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Amount to be paid"
              type="text"
              value={due_amount}
              fullWidth
              disabled
            />
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Paid Amount"
              type="text"
              value={pay_amount}
              fullWidth
              onChange={(e) => this.handleChange(e, "pay_amount")}
            />
            <TextField
              margin="dense"
              id="name"
              label="Payment Mode"
              type="text"
              value={payment_mode}
              fullWidth
              onChange={(e) => this.handleChange(e, "payment_mode")}
            />
            <TextField
              margin="dense"
              id="name"
              label="Submission Date"
              type="date"
              value={date}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(e) => this.handleChange(e, "date")}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={(e) => this.handleClose(e)} variant="contained">
              Cancel
            </Button>
            <Button
              onClick={(e) => this.submitData(e)}
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
const mapStateToProps = (store) => {
  return {
    technician_payment_response: store.user.technician_payment_response,
    technician_payment: store.user.technician_payment,
    payment_history: store.user.payment_history,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    technicianPaymentList: () => dispatch(technicianPaymentList()),
    technicianPaymentData: (params) => dispatch(technicianPaymentData(params)),
    searchPaymentApi: (searchBookingApi) =>
      dispatch(searchPaymentApi(searchBookingApi)),
    viewPaymentHistory: (searchBookingApi) =>
      dispatch(viewPaymentHistory(searchBookingApi)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PaymentPage);
