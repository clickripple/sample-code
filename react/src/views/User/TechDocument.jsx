import React from 'react';
import { connect } from "react-redux";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import { viewPerson, uploadDocument,docStatus } from "../../actions/user";
import TextField from "@material-ui/core/TextField";
import EditIcon from "@material-ui/icons/Edit";
import { IMG_PATH } from "../../config";
import { Dialog, DialogContent } from "@material-ui/core";
import Button from "@material-ui/core/Button";

class TechDocument extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            documents: {},
            doc_status: "",
            openImgDialog : false,
            openEditDialog : false,
            currentImage: "",
            preview: "",
            preview_error: false,
            preview_message: "",
            uploader: {
                image: null,
                type: "",
                id: props.id
            }
        }
    }

    updateImage = () => {
        let uploader = {...this.state}.uploader;
        if(!uploader.image){
            this.setState({
                preview_error: true,
                preview_message: "Pick image first"
            });
            return;
        }
        const formData = new FormData();
        formData.append("doc_type", uploader.type);
        formData.append("doc", uploader.image);
        formData.append("id", this.props.id);
        this.props.uploadDocument(formData).then(res => {
            if(res.value.data.status){
                let params = {
                    role: "tech",
                    id: this.props.id
                }
                this.props.viewPerson(params);
                this.setState({
                    openEditDialog: false,
                    preview: ""
                })
            }
        })
    }

    componentDidMount(){
    }

    openImage = (doc) => {
        this.setState({
            openImgDialog: true,
            currentImage: doc
        })
    }

    uploadImage = (event) => {
        if (event.target.files && event.target.files[0]) {
            let uploader = {...this.state}.uploader;
            uploader.image = event.target.files[0];
            this.setState({
                preview: URL.createObjectURL(event.target.files[0]),
                uploader,
                preview_error: false
            })
        }
    }

    openEditImage = (img) => {
        let uploader = {...this.state}.uploader;
        uploader.type = img 
        this.setState({
            openEditDialog: true,
            currentImage: this.state.documents[img],
            uploader
        })
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        const { person_data } = newProps;
        if(person_data.status === 200){
            let { actual_photo, address_doc, id_doc, other_doc, reference_doc, secure_doc } = person_data.user;
            let documents = {
                actual_photo: actual_photo ? actual_photo:  "user.jpg", 
                address_doc: address_doc ? address_doc:  "user.jpg",
                id_doc: id_doc ? id_doc:  "user.jpg",
                other_doc: other_doc ? other_doc:  "user.jpg",
                reference_doc: reference_doc ? reference_doc:  "user.jpg",
                secure_doc: secure_doc ? secure_doc:  "user.jpg"
            }
            this.setState({ documents, doc_status: person_data.user.doc_status });
        }
    }
    changeDocStatus =(status) => {
        const data = {
            id: this.props.id,
            status
        }
        this.props.docStatus(data)
        .then(res => {
            if(res.value.data.status === 200){
                let params = {
                    role: "tech",
                    id: this.props.id
                }
                this.props.viewPerson(params);
            }
        })
    }

    render(){
        let { 
            documents, 
            openImgDialog, 
            currentImage,
            openEditDialog,
            preview,
            preview_error,
            preview_message,
            doc_status
        } = this.state;
        return (
            <>
            <GridContainer>
                <GridItem  xs={12} sm={12} md={12}>
                <h3>Documents</h3>
                </GridItem>
                
                {[
                'id_doc',
                'actual_photo',
                'address_doc',
                'reference_doc',
                'secure_doc',
                'other_doc'].map(doc => 
                    <GridItem xs={4} sm={4} md={4}>
                <span onClick={() => this.openEditImage(doc)} className="edit_icon doc_icon"><EditIcon /></span>

                <img 
                    src={IMG_PATH + documents[doc]} 
                    className="img_doc"
                    onClick={() => this.openImage(documents[doc])} 
                />
                <h5 className="text-center">{doc}</h5>
                </GridItem>)}
              
          </GridContainer>
          {doc_status != "accepted" &&
          <div className="d-flex justify-content-center bd-highlight mb-3">
            <div className="p-2">
              <Button onClick={() => this.changeDocStatus('accepted')} variant="contained" color="primary" className="mr-2">
                Accept
              </Button>
            </div>
            <div className="p-2">
              <Button onClick={() => this.changeDocStatus('rejected')} color="error" variant="contained">
                Reject
              </Button>
            </div>
          </div>}
          
          <div className="d-flex justify-content-center bd-highlight mb-3">
            <div className="p-2">
              Technician Document Status - {doc_status ? doc_status.toUpperCase() : null}
            </div>
          </div>
            <Dialog fullWidth open={openImgDialog} maxWidth="lg">
                <DialogContent align={'center'}>
                <span className="cross_img" onClick={() => this.setState({ openImgDialog: false})}>X</span>
                <div className="imageWrapper">
                    <img className="" src={IMG_PATH + currentImage} />
                </div>
                </DialogContent>
            </Dialog>
            
            <Dialog open={openEditDialog} >
            <DialogContent align={'center'} className="m-3">
              <span className="cross_img cross_img2" onClick={() => this.setState({ openEditDialog: false})}>X</span>
              <GridContainer>
                <GridItem lg={6} sm={6} xl={6}>
                  <h5>Original Document</h5>
                  <img className="img-fluid" src={IMG_PATH + currentImage} />
                </GridItem>
                <GridItem lg={6} sm={6} xl={6}>
                  <h5>Upload another</h5>
                  <TextField
                      type="file"
                      name="imageChange"
                      onChange={e => this.uploadImage(e)}
                      error={preview_error}
                      helperText={preview_message}
                  />
                  
                  <img className="img-fluid" src={preview} />
                  <div className="my-3">
                    <Button variant="contained" className="mr-2">
                      Cancel
                    </Button>
                    <Button onClick={this.updateImage} color="primary" variant="contained">
                      Submit 
                    </Button>
                  </div>
                </GridItem>
              </GridContainer>
            </DialogContent>
          </Dialog>
          </>

        )
    }
}
const mapStateToProps = store => {
    return {
        person_data: store.user.person_data
    };
  };
  
  const mapDispatchToProps = dispatch => {
    return {
        viewPerson: params => dispatch(viewPerson(params)),
        uploadDocument: params => dispatch(uploadDocument(params)),
        docStatus: params => dispatch(docStatus(params)),

    };
  };
  
export default connect(mapStateToProps, mapDispatchToProps)(TechDocument)