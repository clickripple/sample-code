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
import SubdirectoryArrowLeftIcon from "@material-ui/icons/SubdirectoryArrowLeft";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import AddIcon from "@material-ui/icons/Add";
import { getNewsletter, deleteNews } from "./../../actions/user";
import AddNewsletter from "./AddNewsletter";
import EditNewsletter from "./EditNewsletter";
import { toaster } from "./../../helper/Toaster";
 

class NewsLetter extends Component {
  constructor(props) {
      super(props);
      this.state = {
          current_page: "list",
          current_news: {},
          newsletter: [],
          page: 0,
          rowsPerPage: 10,
          count :0,
          current_href : ""
      }
      this.redirectRef = React.createRef();
  }

  componentDidMount(){
      this.props.getNewsletter();
  }

  handleChange = (name, data) => {
    if(name === "edit"){
      this.setState({
        current_news: data,
        current_page: "edit"
      })
    }
    if(name === "delete"){
      if(window.confirm("Are you sure you want to delete this news?")){
        let req = {
          id: data.id
        }
        this.props.deleteNews(req).then(res => {
          if(res.value.data.status === 200){
            toaster('success',res.value.data.message);
            this.props.getNewsletter();  
          }
        });
      }
    }
    if(name === "view"){
      let href = `https://server.blackpatch.app/mobile/api/wizard/newsletter?id=${data.id}`;
      this.setState({ current_href : href});
      this.redirectRef.current.href = href
      this.redirectRef.current.click();
    }
  }

  handleChangePage = (event, newPage) => {
    this.setState({ page: newPage })
  }

  handleChangeRowsPerPage = (event) => {
    this.setState({ rowsPerPage: parseInt(event.target.value, 10) })
    this.setState({ page: 0 })
  };

  setList = (message) => {
    this.setState({current_page: "list"});
      this.props.getNewsletter();
  }

  UNSAFE_componentWillReceiveProps(newProps) {
    
    if("newsletter" in newProps){
      let { newsletter } = newProps;
      let news_data = [];
      let i = 1;
      if (newsletter && newsletter.status === 200) {
        const newsletter_data = newsletter.data;
        let count = newsletter_data.length
        newsletter_data.map(data => {
          let arr = { view: data, edit: data, delete: data };
          news_data.push([i++, data.title, data.createdAt, arr]);
        });
        this.setState({ 
          newsletter : news_data, 
          count
        });
      }
    }

  }

    render(){
        let { current_page, current_href, page, rowsPerPage, newsletter, count, current_news } = this.state;
        return (
          <div>
            <a href={current_href} target="_blank" ref={this.redirectRef} className="d-none"></a>
            {current_page === "list" && 
          <GridContainer>
            <ToastsContainer
              store={ToastsStore}
              position={ToastsContainerPosition.TOP_RIGHT}
            />
          
            <GridItem xs={12} sm={12} md={12}>
              <Card>
                  <CardHeader color="primary">
                    <Typography variant="h5" className='header_platform'>Newsletter
                    <Tooltip title="Add" className='icon_boundry'>
                        <IconButton
                          edge="end"
                          aria-label="edit"
                          onClick={e => this.setState({
                            current_page: "add"
                          })}
                        >
                          <AddIcon />
                        </IconButton>
                      </Tooltip>
                    </Typography>
                  </CardHeader>
                <CardBody>
                <Table
                  customClass='table_class_width'
                  tableHeaderColor="primary"
                  tableHead={["Serial No", "Title", "Create Date","Actions"]}
                  tableData={newsletter}
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
          </GridContainer>}
          {current_page === "add" && 
            <AddNewsletter setList={(message) => this.setList(message)} />
          }
          {current_page === "edit" && 
            <EditNewsletter 
              setList={(message) => this.setList(message)} 
              news={current_news} 
            />
          }
          </div>

        )
    }
}

const mapStateToProps = store => {
  return {
    newsletter: store.user.newsletter,
    delete_news_response: store.user.delete_news_response
  }
}
  
const mapDispatchToProps = dispatch => {
    return {
        getNewsletter: () => dispatch(getNewsletter()),
        deleteNews: data => dispatch(deleteNews(data))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(NewsLetter);