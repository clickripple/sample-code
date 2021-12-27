import React, { Component } from "react";
import { connect } from "react-redux";
import GridContainer from "components/Grid/GridContainer.js";
import {
  ToastsContainer,
  ToastsStore,
  ToastsContainerPosition,
} from "react-toasts";
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import Table from "components/Table/Table.js";
import Typography from "@material-ui/core/Typography";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import SubdirectoryArrowLeftIcon from "@material-ui/icons/SubdirectoryArrowLeft";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import AddIcon from "@material-ui/icons/Add";
import { getProblems, addProblem, updateProblem, deleteProb } from "./../../actions/user";
import { toaster } from "./../../helper/Toaster";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import VerifyDelete from "./../../helper/VerifyDelete";
import MenuItem from '@material-ui/core/MenuItem';

class Problems extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_dialog: false,
      mode: "add",
      current_problem: {},
      problems: [],
      page: 0,
      rowsPerPage: 10,
      count: 0,
      current_href: "",
      delete_dialog: false,
      form: {
          title: {
              value: "",
              invalid: false,
              message: ""
          },
          type: {
            value: "",
            invalid: false,
            message: ""
        }
      }
    };
    this.redirectRef = React.createRef();
  }

  componentDidMount() {
    this.props.getProblems();
  }

  setMode = (mode) => {
      this.setState({
          show_dialog: true,
          mode: mode
      })
  }

  closeDialog = () => {
    let form = {...this.state.form};
    form.title.value = '';
    form.type.value = '';
    let mode = "list";
    this.setState({show_dialog: false , form, mode  });
  }

  deleteProb = () => {
    let state = {...this.state};
    let req = {
      id: state.current_problem.id,
    };
    this.props.deleteProb(req).then((res) => {
      if (res.value.data.status === 200) {
        toaster("success", res.value.data.message);
        this.setState({ delete_dialog: false });
        this.props.getProblems();
      }
    });
  }


  handleChange = (name, data) => {
    if (name === "edit") {
      let form = {...this.state.form};
      form.title.value = data.title;
      form.type.value = data.type;

      this.setState({
        current_problem: data,
        show_dialog: true,
        mode: "edit",
        form
      });
    }
    if (name === "delete") {
      console.log(data);
      this.setState({
        delete_dialog: true,
        current_problem: data
      })
    }
    
  };

  handleChangePage = (event, newPage) => {
    this.setState({ page: newPage });
  };

  handleChangeRowsPerPage = (event) => {
    this.setState({ rowsPerPage: parseInt(event.target.value, 10) });
    this.setState({ page: 0 });
  };

  handleFormChange = (e) => {
      let form = {...this.state.form};
      let name = e.target.name;
      form[name].value = e.target.value;
      form[name].invalid = false;
      form[name].message = "";
      this.setState({ form })
  }

  submitForm = async () => {
    let form = {...this.state.form};
    let formInvalid = false;
    for(let v of Object.keys(form)){
      if(!form[v].value) { 
          form[v].invalid = true;
          formInvalid = true;
          form[v].message = this.getFirstLetter(v) + " is required!";
      }
    }
    if(formInvalid){
      this.setState({ form }); return;
    }
    const data = {
      title: form.title.value,
      type: form.type.value,
      id : ""
    }
    let response;
    if(this.state.mode === "add"){
      response = await this.props.addProblem(data);
    }else{
      data.id = this.state.current_problem.id;
      response = await this.props.updateProblem(data);
    }
    if(response.value.data.status === 200){
      form.title.value = "";
      form.type.value = "";
      this.setState({ show_dialog: false })
      this.props.getProblems();
    }
  }

  getFirstLetter = (letter) => {
    return letter.charAt(0).toUpperCase() + letter.slice(1);
  }

  setList = (message) => {
    this.setState({ current_page: "list" });
    this.props.getNewsletter();
  };

  UNSAFE_componentWillReceiveProps(newProps) {
      if ("problems" in newProps) {
      let { problems } = newProps;
      const problems_data = [];
      let i = 1;
      if (problems && problems.status === 200) {
        const prob_data = problems.data;
        let count = prob_data.length;
        prob_data.map((data) => {
          let arr = { delete: data,  edit: data,};
          problems_data.push([i++, data.title, data.type, arr]);
        });
        this.setState({
            problems: problems_data,
            count,
        });
      }
    }
  }

  render() {
    let {
      show_dialog,
      current_href,
      page,
      rowsPerPage,
      problems,
      count,
      mode,
      form,
      delete_dialog,
    } = this.state;

    const type_data = [
        {
          value: '',
          label: 'Please select a type',
        },
        {
          value: 'Client',
          label: 'Client',
        },
        {
          value: 'Service',
          label: 'Service',
        },
        {
          value: 'Payment',
          label: 'Payment',
        }
      ];
    return (
      <div>
        <a
          href={current_href}
          target="_blank"
          ref={this.redirectRef}
          className="d-none"
        ></a>
        <GridContainer>
          <ToastsContainer
            store={ToastsStore}
            position={ToastsContainerPosition.TOP_RIGHT}
          />

          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="primary">
                <Typography variant="h5" className="header_platform">
                  Problems
                  <Tooltip title="Add" className="icon_boundry">
                    <IconButton
                      edge="end"
                      aria-label="edit"
                      onClick={() =>this.setMode('add')}
                    >
                      <AddIcon />
                    </IconButton>
                  </Tooltip>
                </Typography>
              </CardHeader>
              <CardBody>
                <Table
                  customClass="table_class_width"
                  tableHeaderColor="primary"
                  tableHead={["Serial No", "Title", "Type", "Actions"]}
                  tableData={problems}
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
        </GridContainer>
        <Dialog
            open={show_dialog}
            onClose={this.closeDialog}
        >
            <DialogTitle id="form-dialog-title">
                {this.getFirstLetter(mode)} Problem
            </DialogTitle>
            <DialogContent>
                <TextField
                autoFocus
                margin="dense"
                name="type"
                label="Type"
                select
                fullWidth
                value={form.type.value}
                onChange={this.handleFormChange}
                error={form.type.invalid}
                helperText={form.type.message}
                >
                    {type_data.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>
            </DialogContent>

            <DialogContent>
                <TextField
                margin="dense"
                name="title"
                label="Title"
                type="text"
                value={form.title.value}
                fullWidth
                onChange={this.handleFormChange}
                error={form.title.invalid}
                helperText={form.title.message}
                />
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={this.closeDialog}
                    variant="contained"
                >
                Cancel
                </Button>
                <Button
                onClick={this.submitForm}
                color="primary"
                variant="contained"
                >
              Submit
            </Button>
          </DialogActions>
        </Dialog>
        <VerifyDelete
          show={delete_dialog}
          onClose={()=>this.setState({delete_dialog: false})}
          delete={this.deleteProb}
        ></VerifyDelete>
      </div>
    );
  }
}

const mapStateToProps = (store) => {
  return {
    problems: store.user.problems
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getProblems: () => dispatch(getProblems()),
    addProblem: (data) => dispatch(addProblem(data)),
    updateProblem: (data) => dispatch(updateProblem(data)),
    deleteProb: (data) => dispatch(deleteProb(data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Problems);
