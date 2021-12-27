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
import Typography from "@material-ui/core/Typography";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import SubdirectoryArrowLeftIcon from "@material-ui/icons/SubdirectoryArrowLeft";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import { editNews } from "./../../actions/user";
import TextField from "@material-ui/core/TextField";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import Button from "@material-ui/core/Button";

class EditNewsLetter extends Component {
    constructor(props) {
        super(props);
        console.log(props.news)
        this.state = {
            news_id: props.news.id,
            form: {
                title: {
                    value: props.news.title,
                    invalid: false,
                    message: ''
                },
                description: {
                    value: props.news.description,
                    invalid: false,
                    message: ''
                },
            }            
        }
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        let { edit_news_response} = newProps;
        if(edit_news_response.status === 200){
            this.props.setList(edit_news_response.message);
        }
    }

    changeValue = (e) => {
        let form = {...this.state}.form;
        form[e.target.name].value = e.target.value;
        form[e.target.name].invalid = false;
        this.setState({ form })
    }

    setDescription = (val) => {
        let form = {...this.state}.form;
        form.description.value = val;
        form.description.invalid = false;
        this.setState({ form })
    }

    editNews = () => {
        let form = {...this.state}.form;
        let formInvalid = false;
        for(let v of Object.keys(form)){
            if(!form[v].value) { 
                form[v].invalid = true;
                formInvalid = true;
            }
        }
        this.setState({ form });
        if(formInvalid) return;

        let data = {
            title: form.title.value,
            description: form.description.value
        }

        this.props.editNews(data);

    }

    render(){
        let { form } = this.state;
        return (
        <GridContainer>
            <ToastsContainer
              store={ToastsStore}
              position={ToastsContainerPosition.TOP_RIGHT}
            />
            <GridItem xs={12} sm={12} md={12}>
              <Card>
                  <CardHeader color="primary">
                    <Typography variant="h5" className='header_platform'>Edit news
                    <Tooltip title="Add" className='icon_boundry'>
                        <IconButton
                          edge="end"
                          aria-label="edit"
                          onClick={this.props.setList}
                        >
                          <SubdirectoryArrowLeftIcon />
                        </IconButton>
                      </Tooltip>
                    </Typography>
                  </CardHeader>
                <CardBody>
                    <TextField
                      margin="dense"
                      id="title"
                      name="title"
                      label="Title"
                      type="text"
                      value={form.title.value}
                      fullWidth
                      error={form.title.invalid}
                      helperText={form.title.message}
                      onChange={this.changeValue}
                    />
                    <div className="my-4"></div>
                    <CKEditor
                        editor={ ClassicEditor }
                        data={form.description.value}
                        onChange={ ( event, editor ) => {
                            const data = editor.getData();
                            this.setDescription(data);
                        } }
                    />
                    {form.description.invalid && <p className="text-danger">Description can't be empty</p>}
                </CardBody>
                <CardFooter>

                  <Button onClick={this.editNews} color="primary" variant="contained">
                    Submit
                  </Button>
                </CardFooter>
              </Card>
            </GridItem>
          </GridContainer>
        )
    }
}
  
const mapStateToProps = store => {
    return {
        edit_news_response: store.user.edit_news_response
    }
}

const mapDispatchToProps = dispatch => {
    return {
        editNews: data => dispatch(editNews(data))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditNewsLetter);

