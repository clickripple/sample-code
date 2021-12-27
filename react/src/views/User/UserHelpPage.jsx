import React, { Component } from "react";
import { connect } from "react-redux";
import TextField from "@material-ui/core/TextField";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Table from "components/Table/Table.js";
import Card from "components/Card/Card.js";
import Typography from "@material-ui/core/Typography";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import SubdirectoryArrowLeftIcon from "@material-ui/icons/SubdirectoryArrowLeft";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import { userHelpData, helpStatus, helpSearchApi } from "../../actions/user";
import { toaster } from "../../helper/Toaster";
import UserHelpEditPage from "./UserHelpEditPage";
import ViewHelpPage from "./ViewHelpPage";
import { API_URL } from "../../config";
import {
  ToastsContainer,
  ToastsStore,
  ToastsContainerPosition
} from "react-toasts";

let edit_flag = false;
export class UserHelpPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user_data: [],
      edit_page: false,
      edit_id: "",
      edit_mail: "",
      subject: "",
      message: "",
      view_page: false,
      view_data: {},
      closed: 0,
      page: 0,
      count: 0,
      rowsPerPage: 10
    };
  }
  componentDidMount() {
    this.props.userHelpData();
  }

  UNSAFE_componentWillReceiveProps(newProps) {
    const { user_help_data, status_response } = newProps;
    if (user_help_data && user_help_data.status === 200) {
      let user_data = [];
      let count = user_help_data.count
      let closed = this.state.closed
      user_help_data.support.map(data => {
        let arr = !data.status ? { view: data, edit: data } : { view: data };
        let status = !data.status ? "Pending" : "Resolved";
        closed = !data.status ? closed : closed + 1
        if(data.user){
          user_data.push([
            data.user.username,
            data.user.email,
            data.subject,
            status,
            arr
          ]);
        }

        return null;
      });
      this.setState({ user_data, count, closed });
    }
    if (status_response && status_response.status === 200 && edit_flag) {
      this.props.userHelpData();
      toaster("success", status_response.message);
      this.setState({ edit_page: false });
      edit_flag = false;
    } else if (status_response && status_response.status === 404 && edit_flag) {
      toaster("error", status_response.message);
      edit_flag = false;
    }
  }
  backPage = () => {
    this.setState({ view_page: false, edit_page: false, subject: "", message: "" });
  };
  handleChange = (name, data) => {
    if (name === "view") {
      this.setState({ view_page: true, view_data: data });
    } else if (name === "edit") {
      this.setState({
        edit_page: true,
        subject: "",
        message: "",
        edit_id: data.id,
        edit_mail: data.user.email
      });
    } else {
      this.setState({ [data]: name.target.value });
    }
  };

  submitData = () => {
    const { subject, message, edit_id, edit_mail } = this.state;
    if (subject === '' || message === '') {
      return toaster('error', "Please fill all the fields")
    } else {
      let params = {
        id: edit_id,
        subject: subject,
        message: message,
        email: edit_mail
      };
      this.props.helpStatus(params);
      edit_flag = true;
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
      this.props.helpSearchApi(e.target.value)
    } else {
      this.props.userHelpData();
    }
  }
  saveAsExcel = () => {
    let excel_link = API_URL + '/support/export_support?query=excel'

    const link = document.createElement("a");
    link.href = excel_link;

    link.setAttribute("download", "file.pdf");

    document.body.appendChild(link);
    link.click();
  }
  saveAsCsv = () => {
    let excel_link = API_URL + '/support/export_support?query=csv'

    const link = document.createElement("a");
    link.href = excel_link;

    link.setAttribute("download", "file.pdf");

    document.body.appendChild(link);
    link.click();
  }
  render() {
    const { user_data, edit_page, view_page, closed, count, page, rowsPerPage, detail_page } = this.state;
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
          <div className='helpCountData'>
            <span>Count: {count}</span>
            <span>Closed: {closed}</span>
          </div>
          <Card>
            <CardHeader color="primary">
              <Typography variant="h5" className='header_platform'>
                {(!view_page && !edit_page) && 'User Support'}
                {(edit_page) && 'Feedback Response'}
                {(view_page) && 'View Issues'}
                {(view_page || edit_page) && (
                  <Tooltip title="Back" className='icon_boundry'>
                    <IconButton
                      edge="end"
                      aria-label="back"
                      onClick={e => this.backPage(e)}
                    >
                      <SubdirectoryArrowLeftIcon />
                    </IconButton>
                  </Tooltip>

                )}
              </Typography>
            </CardHeader>

            <CardBody>
              {!edit_page && !view_page && (
                <Table
                  tableHeaderColor="primary"
                  tableHead={[
                    "User Name",
                    "User Email",
                    "Issue",
                    "Status",
                    "Actions"
                  ]}
                  tableData={user_data}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  count={count}
                  handleChange={this.handleChange}
                  handleChangePage={this.handleChangePage}
                  handleChangeRowsPerPage={this.handleChangeRowsPerPage}
                />
              )}{" "}
              {edit_page && !view_page && (
                <UserHelpEditPage
                  state={this.state}
                  handleChange={this.handleChange}
                  submitData={this.submitData}
                  backPage={this.backPage}
                />
              )}
              {!edit_page && view_page && <ViewHelpPage state={this.state} />}
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    );
  }
}
const mapStateToProps = store => {
  return {
    user_help_data: store.user.user_help_data,
    status_response: store.user.status_response
  };
};

const mapDispatchToProps = dispatch => {
  return {
    userHelpData: params => dispatch(userHelpData(params)),
    helpStatus: params => dispatch(helpStatus(params)),
    helpSearchApi: params => dispatch(helpSearchApi(params))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserHelpPage);
