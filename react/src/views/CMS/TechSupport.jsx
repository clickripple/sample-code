import React, { Component } from "react";
import { connect } from "react-redux";
import GridContainer from "components/Grid/GridContainer.js";
import {
    ToastsContainer,
    ToastsStore,
    ToastsContainerPosition
  } from "react-toasts";
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import Table from "components/Table/Table.js";
import Typography from "@material-ui/core/Typography";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import { getTechSupport } from "./../../actions/user";
import Button from "@material-ui/core/Button";
import { Dialog, DialogContent, DialogTitle } from "@material-ui/core";
 

class TechSupport extends Component {
  constructor(props) {
      super(props);
      this.state = {
          show_dialog: false,
          supports: [],
          page: 0,
          rowsPerPage: 10,
          count :0,
          current_support: {}
      }
  }

  componentDidMount(){
      this.props.getTechSupport();
  }

  handleChange = (name, data) => {
    if(name === "view"){
        this.setState({ show_dialog: true, current_support: data });
    }
  }

  handleChangePage = (event, newPage) => {
    this.setState({ page: newPage })
  }

  handleChangeRowsPerPage = (event) => {
    this.setState({ rowsPerPage: parseInt(event.target.value, 10) })
    this.setState({ page: 0 })
  };

  UNSAFE_componentWillReceiveProps(newProps) {
    if("supports" in newProps){
      let { supports } = newProps;
      let sup_data = [];
      let i = 1;
      if (supports && supports.status === 200) {
        const support_data = supports.data;
        let count = support_data.length
        support_data.map(data => {
          let arr = { view: data };
          sup_data.push([i++, data.email, data.issueTitle, data.issueType, data.message, arr]);
        });
        this.setState({ 
          supports : sup_data, 
          count
        });
      }
    }

  }

    render(){
        let { page, rowsPerPage, supports, count,show_dialog, current_support } = this.state;
        return (
          <div>
          <GridContainer>
              
            <ToastsContainer
              store={ToastsStore}
              position={ToastsContainerPosition.TOP_RIGHT}
            />
            <GridItem xs={12} sm={12} md={12}>
                <Button 
                color="primary" 
                onClick={() => this.props.history.push('/problems')}
                variant="contained">
                    Add Issue
                </Button>
            </GridItem>
            <GridItem xs={12} sm={12} md={12}>
              <Card>
                  <CardHeader color="primary">
                    <Typography variant="h5" className='header_platform'>Technician Support
                    </Typography>
                  </CardHeader>
                <CardBody>
                <Table
                  customClass='table_class_width'
                  tableHeaderColor="primary"
                  tableHead={["Serial No", "Email", "Issue Title","Issue Type",'Message','Action']}
                  tableData={supports}
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
          onClose={() => this.setState({show_dialog: false})}
          >
              <DialogTitle>Support Details</DialogTitle>
              <DialogContent>
                  <table>
                      <tr>
                          <th className="pr-3">Technician email:  </th>
                          <td>{current_support.email}</td>
                      </tr>
                      <tr>
                          <th>Issue type:  </th>
                          <td>{current_support.issueType}</td>
                      </tr>
                      <tr>
                          <th>Issue Title:  </th>
                          <td>{current_support.issueTitle}</td>
                      </tr>
                      <tr>
                          <th>Message:  </th>
                          <td>{current_support.message}</td>
                      </tr>
                  </table>
              </DialogContent>
          </Dialog>
          </div>
        )
    }
}

const mapStateToProps = store => {
  return {
    supports: store.user.supports
  }
}
  
const mapDispatchToProps = dispatch => {
    return {
        getTechSupport: () => dispatch(getTechSupport())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TechSupport);