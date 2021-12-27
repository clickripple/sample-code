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
import AddIcon from "@material-ui/icons/Add";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import { personList, blockPerson, deletePerson, addPerson, editPerson, viewPerson, searchApi } from "../../actions/user";
import { toaster } from "../../helper/Toaster";
import ViewPersonPage from "./ViewPersonPage";
import AddEditPage from "./AddEditPage";
import TextField from "@material-ui/core/TextField";
import { API_URL } from "../../config";
import {
  ToastsContainer,
  ToastsStore,
  ToastsContainerPosition
} from "react-toasts";

let block_flag = false;
let add_flag = false;
export class TechnicianPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      technicians: [],
      role: "technician",
      person_id: "",
      detail_page: false,
      add_page: false,
      edit_page: false,
      selected_person: {},
      person_data: {
        username: "",
        phone: "",
        email: "",
        address: "",
        profile_pic: "",
        referal_code: "",
        gender: "",
        dob: "",
        zip: ""
      },
      page: 0,
      count: 0,
      rowsPerPage: 10
    };
  }
  componentDidMount() {
    this.props.personList('technician');
  }

  UNSAFE_componentWillReceiveProps(newProps) {
    const { person_list, block_response, person_data, add_response } = newProps;
    if (person_list && person_list.status === 200) {
      let technicians = [];
      let count = person_list.count
      person_list.users.map(data => {
        let arr = {};
        if (data.isActive) {
          arr = { view: data, edit: data, block: data, delete: data };
        } else {
          arr = { view: data, edit: data, unblock: data, delete: data };
        }
        technicians.push([data.username, data.phone, data.email, data.address, arr]);
        return null;
      });
      this.setState({ technicians, count });
    }
    if (block_response && block_response.status === 200 && block_flag) {
      this.props.personList("technician");
      toaster("success", block_response.message);
      block_flag = false;
    } else if (block_response && block_response.status === 404) {
      toaster("error", block_response.message);
    }
    if (person_data && person_data.status === 200) {
      this.setState({ person_data: person_data.user, selected_person: person_data });
    } else if (person_data && person_data.status === 500) {
      toaster("error", person_data.message);
    }
    if (add_response && add_response.status === 200 && add_flag) {
      toaster("success", add_response.message);
      this.setState({
        detail_page: false,
        add_page: false,
        edit_page: false
      })
      this.props.personList('technician');
      add_flag = false;
    } else if (add_response && add_response.status === 500 && add_flag) {
      toaster("error", add_response.message);
      add_flag = false;
    }
  }
  backPage = () => {
    this.setState({
      detail_page: false,
      add_page: false,
      edit_page: false,
      person_data: {
        username: "",
        phone: "",
        email: "",
        address: "",
        profile_pic: "",
        referal_code: "",
        gender: "",
        dob: "",
        zip: ""
      }
    });
  };
  handleEditChange = (e, name) => {
    var person_data = this.state.person_data
    if (name === "phone" && /^[0-9]{0,10}$/.test(e.target.value) === false) {
      return;
    } else if (name === "email" && /^[0-9A-Za-z@_.-]{0,100}$/.test(e.target.value) === false) {
      return;
    } else if (name === "zip" && /^[0-9]{0,6}$/.test(e.target.value) === false) {
      return;
    }
    if (name === 'address') {
      person_data[name] = e.description
      this.setState({ person_data })
    } else {
      person_data[name] = e.target.value
      this.setState({ person_data })
    }
  }

  handleChange = (name, data) => {
    if (name === "view") {
      this.setState({ detail_page: true, edit_page: false, add_page: false });
      let params = {
        id: data.id,
        role: "technician"
      };
      this.props.viewPerson(params);
    } else if (name === "block") {
      let params = {
        id: data.id,
        isActive: false
      };
      this.props.blockPerson(params, "technician");
      block_flag = true;
    } else if (name === "unblock") {
      let params = {
        id: data.id,
        isActive: true
      };
      this.props.blockPerson(params, "technician");
      block_flag = true;
    } else if (name === "delete") {
      if(window.confirm("Are you sure you want to delete this technician?")){
        let params = {
          id: data.id
        }
        this.props.deletePerson(params, "technician");
        this.props.personList('technician');
      }
    } 
    else if (name === 'add') {
      this.setState({ add_page: true });
    } else if (name === 'edit') {
      this.setState({
        edit_page: true, person_data: {
          username: data.username,
          phone: data.phone,
          email: data.email,
          address: data.address,
          profile_pic: data.profile_pic,
          referal_code: data.referal_code,
          gender: data.gender,
          dob: data.dob,
          zip: data.zip,
          id: data.id
        }
      });
    }
  };
  submitData = (e, name) => {
    const { person_data } = this.state
    const { username, email, address, phone, gender, dob, zip, id } = person_data
    if (username === '' || email === "" || address === '' || phone === "" || gender === "" || dob === "" || zip === "") {
      toaster('error', 'Please select all the fields')
    } else {
      let params = {
        username: username,
        email: email,
        address: address,
        phone: phone,
        gender: gender,
        dob: dob,
        zip: zip,
        id: id
      };
      if (name === 'add') {
        this.props.addPerson(params, "technician")
      } else {
        this.props.editPerson(params, "technician");
      }
      add_flag = true
    }
  }
  handleChangePage = (event, newPage) => {
    this.setState({ page: newPage })
  }
  handleChangeRowsPerPage = (event) => {
    this.setState({ rowsPerPage: parseInt(event.target.value, 10) })
    this.setState({ page: 0 })
  };
  handleSearchChange = (e) => {
    if ((e.target.value).length > 0) {
      let params = {
        role: 'technician',
        query: e.target.value
      }
      this.props.searchApi(params)
    } else {
      this.props.personList('technician');
    }
  }

  saveAsExcel = () => {
    let excel_link = API_URL + '/cms/export_technician?query=excel'

    const link = document.createElement("a");
    link.href = excel_link;

    link.setAttribute("download", "file.pdf");

    document.body.appendChild(link);
    link.click();
  }
  saveAsCsv = () => {
    let excel_link = API_URL + '/cms/export_technician?query=csv'

    const link = document.createElement("a");
    link.href = excel_link;

    link.setAttribute("download", "file.pdf");

    document.body.appendChild(link);
    link.click();
  }
  render() {
    const { technicians, detail_page, add_page, edit_page, count, page, rowsPerPage } = this.state;
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
            {(!detail_page && (!add_page && !edit_page)) ? (
              <CardHeader color="primary" className='header_platform'>
                <Typography variant="h5">Technician
              <Tooltip title="Add" className='icon_boundry'>
                    <IconButton
                      edge="end"
                      aria-label="edit"
                      onClick={e =>
                        this.handleChange("add")
                      }
                    >
                      <AddIcon />
                    </IconButton>
                  </Tooltip>
                </Typography>
              </CardHeader>
            ) : (
                <CardHeader color="primary">
                  <Typography variant="h5" className='header_platform'>Technician profile
                <Tooltip title="Back" className='icon_boundry'>
                      <IconButton
                        edge="end"
                        aria-label="back"
                        onClick={e => this.backPage(e)}
                      >
                        <SubdirectoryArrowLeftIcon />
                      </IconButton>
                    </Tooltip>
                    {/* {!edit_page && <Tooltip title="Edit" className='icon_boundry'>
                      <IconButton
                        edge="end"
                        aria-label="back"
                        onClick={e => this.editPage(e)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>} */}
                  </Typography>
                </CardHeader>
              )}
            <CardBody>
              {(!detail_page && (!add_page && !edit_page)) && (
                <Table
                  customClass='table_class_width'
                  tableHeaderColor="primary"
                  tableHead={["Name", "Phone", "Email", "Address", "Actions"]}
                  tableData={technicians}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  count={count}
                  handleChange={this.handleChange}
                  handleChangePage={this.handleChangePage}
                  handleChangeRowsPerPage={this.handleChangeRowsPerPage}
                />
              )}
              {(detail_page && (!add_page || !edit_page)) && (
                <ViewPersonPage state={this.state} handleEditChange={this.handleEditChange} backPage={this.backPage} />
              )}
              {(!detail_page && (add_page || edit_page)) && (
                <AddEditPage state={this.state} handleEditChange={this.handleEditChange} backPage={this.backPage} submitData={this.submitData} />
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
    person_list: store.user.person_list,
    block_response: store.user.block_response,
    person_data: store.user.person_data,
    add_response: store.user.add_response
  };
};

const mapDispatchToProps = dispatch => {
  return {
    personList: params => dispatch(personList(params)),
    blockPerson: (params, role) => dispatch(blockPerson(params, role)),
    deletePerson: (params, role) => dispatch(deletePerson(params, role)),
    addPerson: (params, role) => dispatch(addPerson(params, role)),
    editPerson: (params, role) => dispatch(editPerson(params, role)),
    viewPerson: params => dispatch(viewPerson(params)),
    searchApi: params => dispatch(searchApi(params))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TechnicianPage);
