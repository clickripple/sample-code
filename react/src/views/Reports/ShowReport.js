import React, { Component } from "react";
import Table from "components/Table/Table.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/Add";
import SubdirectoryArrowLeftIcon from "@material-ui/icons/SubdirectoryArrowLeft";
import { showReport } from "../../actions/user";
import { connect } from "react-redux";
import moment from "moment";
import { CSVLink, CSVDownload } from "react-csv";

export class ShowReport extends Component {
    
    
    constructor(props) {
      super(props);
  
      this.state = {
        bookings: [[]],
        bookings_count: 0,
        bookings_page: 0,
        page: 0,
        count: 0,
        all_bookings: null,
        rowsPerPage: 10
      };
    }

    async componentDidMount() {
        const params = {
            technician : this.props.technician
        }
        const ab = await this.props.showReport(params);
        const bookings = ab.value.data;
        if (bookings && bookings.status === 200) {
            let books = [];
            let count = bookings.completed.length
            let all_bookings = bookings.completed;
            console.log(bookings.completed);
            bookings.completed.map(data => {
                let issue = JSON.parse(data.issue);
                let price = data.afterDiscount_amount + " $";
                // let date = moment(data.dateTime).format("ll");
                // let cDate = moment(data.EndRepair_date).format("ll");

              books.push([data.modelName, issue, price, data.dateTime,data.EndRepair_date,data.rating,data.feedback]);
              return null;
            });
            this.setState({ bookings: books, count, all_bookings });
          }
    }

    handleChangePage = (event, newPage) => {
        this.setState({ page: newPage })
    }

    handleChangeRowsPerPage = (event) => {
        this.setState({ rowsPerPage: parseInt(event.target.value, 10) })
        this.setState({ page: 0 })
      };
    render() {
        let exportData=[["Serial No.","Device", "Issue", "Price", "Booking date","Completed date","Rating"]];
        const {bookings,page,count,rowsPerPage} = this.state;
        let i = 1;
        for(let data of bookings){
            exportData.push([i,data[0], data[1], data[2],data[3], data[4],data[5]]);
            i++;
        }
        return (
            <div>
                <GridContainer>
                    <GridItem xs={12} sm={12} md={12}>
                        <CSVLink filename={"blackpatch-technician.csv"} data={exportData}>Export CSV</CSVLink>

                        <Card>
                            <CardBody>
                                <p><strong>Technician Name</strong> - {this.props.techName} </p>
                                <p>Total Earnings - {this.props.techEarning}</p>
                                <p>Job Completed - {this.props.techJob}</p>
                                <p>Overall Ratings - {this.props.techRating} </p>
                            </CardBody>
                        </Card>
                        <Card>
                            <CardHeader color="primary">
                                <Typography variant="h5" className='header_platform'>Completed Bookings
                                    <Tooltip title="Add" className='icon_boundry'>
                                        <IconButton
                                            edge="end"
                                            aria-label="edit"
                                            onClick={this.props.onClose}
                                        >
                                            <SubdirectoryArrowLeftIcon />
                                        </IconButton>
                                    </Tooltip>
                                </Typography>
                            </CardHeader> 
                        <CardBody>
                            <Table
                                customClass='table_class_width'
                                tableHeaderColor="primary"
                                tableHead={["Device", "Issue", "Price", "Booking date","Completed date","Rating","Feedback"]}
                                tableData={bookings}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                count={count}
                                // handleChange={this.handleChange}
                                handleChangePage={this.handleChangePage}
                                handleChangeRowsPerPage={this.handleChangeRowsPerPage}
                            />
                        </CardBody>
                        </Card>
                    </GridItem>
                </GridContainer>
            </div>
        );
    }

}

const mapDispatchToProps = dispatch => {
    return {
        showReport: params => dispatch(showReport(params)),
    };
};
  
export default connect(null, mapDispatchToProps)(ShowReport);
