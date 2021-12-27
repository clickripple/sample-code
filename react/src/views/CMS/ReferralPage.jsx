import React, { Component } from "react";
import { connect } from "react-redux";
import AWS from "aws-sdk";
import Button from "@material-ui/core/Button";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import GridContainer from "components/Grid/GridContainer.js";
import { IMG_PATH } from "../../config";

import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import EditIcon from "@material-ui/icons/Edit";
import AddIcon from "@material-ui/icons/Add";
import InputAdornment from '@material-ui/core/InputAdornment';
import DialogActions from "@material-ui/core/DialogActions";
import { toaster } from "../../helper/Toaster";
import moment from 'moment';
import Table from "components/Table/Table.js";
import SubdirectoryArrowLeftIcon from "@material-ui/icons/SubdirectoryArrowLeft";
import GridItem from "components/Grid/GridItem.js";

import {
  ToastsContainer,
  ToastsStore,
  ToastsContainerPosition
} from "react-toasts";
import { postReferral, getReferral, updatePromo } from "../../actions/login";
import { 
  addAvailableAreaImage, 
  deleteAvailableAreaImage, 
  addDiscountCode, 
  updateStatus,
  deleteCode,
  updateDiscountCode
 } from "../../actions/device";
const config = {
  bucketName: "",
  dirName: "" /* optional */,
  region: "",
  accessKeyId: "",
  secretAccessKey: "",
  s3Url: "" /* optional */
};
let s3 = new AWS.S3(config);
let addEditFlag = false;
export class ReferralPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      settings_data: {},
      referral_amount: "",
      referral_id: "",
      discount_margin: '',
      image1: "",
      image2: "",
      image3: "",
      image4: "",
      image5: "",
      edit_flag: false,
      edit_image: false,
      show_image: null,
      video_file: "",
      video_poster: "",
      promo_table: "list",
      discount_list: [],
      page: 0,
      count: 0,
      rowsPerPage: 5,
      promo_text_en: {
        value: "",
        invalid: false,
        message: ""
      },
      promo_text_es: {
        value: "",
        invalid: false,
        message: ""
      },
      single_discount: {
        id: null,
        code: {
          value:null,
          error: false,
          message: ""
        },
        discount: {
          value:null,
          error: false,
          message: ""
        }
      }
    };
  }

  componentWillMount() {
    this.props.getReferral();
  }

  handleChangePage = (event, newPage) => {
    this.setState({ page: newPage })
  }

  handleChangeRowsPerPage = (event) => {
    this.setState({ rowsPerPage: parseInt(event.target.value, 10) })
    this.setState({ page: 0 })
  };

  addDiscountChange(e,name){
    var single_discount = {...this.state.single_discount}
    single_discount[name].error = false;
    single_discount[name].message = "";
    single_discount[name].value = e.target.value
    this.setState({ single_discount })
  }

  addDiscount(type = null){
    var single_discount = {...this.state.single_discount}
    if(!single_discount.code.value){
      single_discount.code.error = true;
      single_discount.code.message = "Code name field is required";
      this.setState({ single_discount })
      return;
    }
    if(!single_discount.discount.value){
      single_discount.discount.error = true;
      single_discount.discount.message = "Discount field is required";
      this.setState({ single_discount })
      return;
    }
    if(single_discount.discount.value < 0){
      single_discount.discount.error = true;
      single_discount.discount.message = "Discount percent should be more than 0";
      this.setState({ single_discount })
      return;
    }
    if(single_discount.discount.value > 100){
      single_discount.discount.error = true;
      single_discount.discount.message = "Discount percent should be less than 100";
      this.setState({ single_discount })
      return;
    }
    const data = {
      id: single_discount.id,
      code: single_discount.code.value,
      discount: single_discount.discount.value
    }
    if(!type){
      this.props.addDiscountCode(data).then(res => {
        this.props.getReferral();
        this.setState( {promo_table: "list" })
      });
    }else{
      this.props.updateDiscountCode(data).then(res => {
        this.props.getReferral();
        this.setState( {promo_table: "list" })
      });
    }
  }

  UNSAFE_componentWillReceiveProps(newProps) {
    const { referral_response, get_referral } = newProps;
    if (referral_response && referral_response.status === true && addEditFlag) {
      toaster("success", referral_response.message);
      this.props.getReferral();
      this.setState({ edit_flag: false })
      addEditFlag = false;
    } else if (
      referral_response &&
      referral_response.status === false &&
      addEditFlag
    ) {
      toaster("error", referral_response.message);
      addEditFlag = false;
    }


    if (get_referral) {

    let discount_list = [];
    if(get_referral.referal){
      var i = 1;
      get_referral.referal.discounts  .map(d => {
        let arr = {
          status: d,
          edit: d,
          delete: d
        }
        discount_list.push([i++,d.code,d.discount_percent,arr])
      })
    }
    let promo_en = { value : get_referral.referal && get_referral.referal.promo_text_en}
    let promo_es = { value : get_referral.referal && get_referral.referal.promo_text_es}
      this.setState({
        referral_amount: get_referral.referal && get_referral.referal.amount,
        discount_margin: get_referral.referal && get_referral.referal.discount,
        referral_id: get_referral.referal && get_referral.referal.id,
        settings_data: get_referral.referal,
        discount_list: get_referral.referal && get_referral.referal.discount,
        image1: get_referral.referal && get_referral.referal.images.image1,
        image2: get_referral.referal && get_referral.referal.images.image2,
        image3: get_referral.referal && get_referral.referal.images.image3,
        image4: get_referral.referal && get_referral.referal.images.image4,
        image5: get_referral.referal && get_referral.referal.images.image5,
        video_poster: get_referral.referal && get_referral.referal.images.video,
        discount_list: discount_list,
        count: discount_list.length,
        promo_text_en: promo_en,
        promo_text_es: promo_es,

      });

    } else {
      toaster("error", get_referral.message);
    }
  }

  handleChange = (e, name, type= null) => {
    if( name === "promo_text_en"){
      let promo = {...this.state}.promo_text_en;
      promo.value = e.target.value;
      promo.invalid = false;
      this.setState({ promo_text_en : promo });
    }
    if( name === "promo_text_es"){
      let promo = {...this.state}.promo_text_es;
      promo.value = e.target.value;
      promo.invalid = false;
      this.setState({ promo_text_es : promo });
    }
    if (name === "referral_amount" || name === 'discount_margin') {
      if (/^[0-9]{0,4}$/.test(e.target.value) === false) {
        return;
      }
      this.setState({ [name]: e.target.value });
    } else if (name === "edit") {
      this.setState({ edit_flag: true });
    } else if (name === "cancel") {
      let val = this.state.settings_data
      this.setState({ edit_flag: false, referral_amount: val.amount, discount_margin: val.discount });
    }
    if(name === "edit_image"){
      this.setState({ edit_image: true });
    }
    if(name === "cancel_image"){
      this.setState({ edit_image: false });
    }
    if(name === "image"){
      let st = {...this.state};
      st.image = e.target.files[0];
      st[type] = URL.createObjectURL(e.target.files[0]);
      this.setState(st);

      this.submitImage(e.target.files[0],type);
      return true;
    }

    if(name === "del_image"){
      let state = {...this.state};
      state[type] = "/images/user.jpg";
      this.setState(state);
      let data = {
        type: type
      }
      this.props.deleteAvailableAreaImage(data);
    }

    if(name === "video"){
      this.setState({
        video_file: e.target.files[0]
      });

    }
    if(name === "add_promo"){
      this.setState({promo_table : "add" })
    }
    if(name === "list_promo"){
      this.setState({promo_table : "list" })
    }
    if(e === "status"){
      const data = {
        id: name.id
      }
      this.props.updateStatus(data).then(res => {
        this.props.getReferral();
      })
      this.setState({promo_table : "list" })
    }

    if(e === "edit"){
      let st = {...this.state};
      st.promo_table = "edit";
      st.single_discount.id = name.id;
      st.single_discount.code.value = name.code;
      st.single_discount.discount.value = name.discount_percent;
      this.setState(st)
    }

    if(e === "delete"){
      if(window.confirm("Are you sure you want to delete this code?")){
        let st = {...this.state};
        st.promo_table = "list";
        let list = st.discount_list;
        list = list.filter(code => 
          code[1] != name.code 
        )
        st.discount_list = list;
        this.setState(st)
        let data = {
          id:name.id
        }
        this.props.deleteCode(data).then(res => {
          this.props.getReferral();
        })
      }
      
    }
  };

  submitReferral = () => {
    let { referral_amount, discount_margin, referral_id } = this.state;
    if (referral_amount === '' || discount_margin === '') {
      return toaster('error', "Please fill all the fields")
    } else {
      let params = {
        amount: referral_amount,
        discount: discount_margin,
        id: referral_id
      };
      this.props.postReferral(params);
      addEditFlag = true;
    }
  }

  submitPromo = () => {
    let state = {...this.state};
    let promo_text_en = state.promo_text_en;
    let promo_text_es = state.promo_text_es;
    let invalidForm = false;
    if(!promo_text_en.value){
      promo_text_en.invalid = true;
      promo_text_en.message = "Promotional text is empty!";
      invalidForm = true;
    }
    if(!promo_text_es.value){
      promo_text_es.invalid = true;
      promo_text_es.message = "Promotional text is empty!";
      invalidForm = true;
    }
    if(invalidForm){
      this.setState({ promo_text_en, promo_text_es });
      return;
    }

    let params = {
      promo_text_es: promo_text_es.value,
      promo_text_en: promo_text_en.value
    }
    this.props.updatePromo(params).then(res => {
      if(res.value.data.status === 200){
        toaster('success','Promotional text updated successfully!');
      }
    });
  }

  submitVideo = () => {
    this.submitImage(this.state.video_file, 'video');
  }

  submitImage = (image, type) => {
        
    let index = image.name.lastIndexOf('.');
    let extension = image.name.substring(index,image.name.length);

    var date_create = moment().format('YYYY-MM-DD-H:m:ss.SS')
    date_create += extension;

      let params = {
        ACL: "public-read",
        ServerSideEncryption: "AES256",
        Body: image,
        Bucket: "blackpatchadmin",
        Key: `media/model/${date_create}`
      };
     

      s3.putObject(params, (err, data) => {
        if (err) {
          toaster("error", err.stack);
        } else {
          let params = {
            type,
            image: `https://blackpatchadmin.s3.amazonaws.com/media/model/${date_create}`,
          };
          this.props.addAvailableAreaImage(params);
        }
      });
  };

  render() {
    const { 
      referral_amount, 
      promo_text_en, 
      promo_text_es, 
      discount_margin, 
      edit_flag , 
      image1, 
      image2, 
      image3, 
      image4, 
      image5, 
      video_poster, 
      promo_table,
      discount_list, 
      single_discount
    } = this.state;
    return (
      <GridContainer>
        <ToastsContainer
          store={ToastsStore}
          position={ToastsContainerPosition.TOP_RIGHT}
        />
        <GridItem xs={6} sm={6} md={6}>
          <Card>
            <CardHeader color="primary">
              <Typography variant="h5" className='header_platform'>
                Promo Codes
                  {promo_table == 'list' && (
                    <Tooltip title="Add" className='icon_boundry'>
                    <IconButton
                      edge="end"
                      aria-label="Add"
                      onClick={e => this.handleChange(e, 'add_promo')}
                    >
                      <AddIcon />
                    </IconButton>
                  </Tooltip> )}
                  {promo_table == 'add' && (
                    <Tooltip title="Back" className='icon_boundry'>
                    <IconButton
                      edge="end"
                      aria-label="edit"
                      onClick={e => this.handleChange(e, 'list_promo')}
                    >
                      <SubdirectoryArrowLeftIcon />
                    </IconButton>
                  </Tooltip> )}
                  {promo_table == 'edit' && (
                    <Tooltip title="Back" className='icon_boundry'>
                    <IconButton
                      edge="end"
                      aria-label="edit"
                      onClick={e => this.handleChange(e, 'list_promo')}
                    >
                      <SubdirectoryArrowLeftIcon />
                    </IconButton>
                  </Tooltip> )}
              </Typography>
            </CardHeader>
            <CardBody>
              {promo_table == 'list' && (
                <Table
                  customClass='table_class_width'
                  tableHeaderColor="primary"
                  tableHead={["Sr. No.","Discount Code", "Amount(In %)", "Status"]}
                  tableData={discount_list}
                  rowsPerPage={this.state.rowsPerPage}
                  handleChangePage={this.handleChangePage}
                  handleChangeRowsPerPage={this.handleChangeRowsPerPage}
                  handleChange={this.handleChange}
                  page={this.state.page}
                  count={this.state.count}
                />
              )}
              {promo_table == 'add' && (
                <GridContainer>
                  <GridItem xs={12} sm={12} md={12}>
                    <TextField
                      margin="dense"
                      id="name"
                      label="Name"
                      type="text"
                      value={single_discount.code.value}
                      fullWidth
                      error={single_discount.code.error}
                      helperText={single_discount.code.message}
                      onChange={(e) => this.addDiscountChange(e,'code')}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={12}>
                    <TextField
                      error={single_discount.discount.error}
                      helperText={single_discount.discount.message}
                      margin="dense"
                      id="discount"
                      label="Discount amount (In %)"
                      type="number"
                      value={single_discount.discount.value}
                      fullWidth
                      max="100"
                      onChange={(e) => this.addDiscountChange(e,'discount')}
                    />
                  </GridItem>
                  <DialogActions>
          
                  <Button onClick={e => this.addDiscount()} color="primary" variant="contained">
                    Submit
                  </Button>
                </DialogActions>
                </GridContainer>
              )}
              {promo_table == 'edit' && (
                <GridContainer>
                  <GridItem xs={12} sm={12} md={12}>
                    <TextField
                      margin="dense"
                      id="name"
                      label="Name"
                      type="text"
                      value={single_discount.code.value}
                      fullWidth
                      error={single_discount.code.error}
                      helperText={single_discount.code.message}
                      onChange={(e) => this.addDiscountChange(e,'code')}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={12}>
                    <TextField
                      error={single_discount.discount.error}
                      helperText={single_discount.discount.message}
                      margin="dense"
                      id="discount"
                      label="Discount amount (In %)"
                      type="number"
                      value={single_discount.discount.value}
                      fullWidth
                      max="100"
                      onChange={(e) => this.addDiscountChange(e,'discount')}
                    />
                  </GridItem>
                  <DialogActions>
          
                  <Button onClick={e => this.addDiscount("update")} color="primary" variant="contained">
                    Update
                  </Button>
                </DialogActions>
                </GridContainer>
              )}
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={6} sm={6} md={6}>
          <Card>
            <CardHeader color="primary">
              <Typography variant="h5" className='header_platform'>
                Settings
              {!edit_flag && (
                  <Tooltip title="Edit" className='icon_boundry'>
                    <IconButton
                      edge="end"
                      aria-label="edit"
                      onClick={e => this.handleChange(e, 'edit')}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                )}
              </Typography>
            </CardHeader>
            <CardBody>
              {/* <span>Referral Amount</span> */}
              <TextField
                margin='dense'
                id="name"
                type="text"
                label="Referral Amount"
                value={referral_amount}
                fullWidth
                onChange={e => this.handleChange(e, "referral_amount")}
                InputProps={{
                  readOnly: edit_flag ? false : true,
                  startAdornment: <InputAdornment position="start">$</InputAdornment>
                }}
              />
              {/* <span>Discount Margin</span> */}
              <TextField
                margin='dense'
                id="name"
                type="text"
                label="Discount Margin"
                value={discount_margin}
                fullWidth
                onChange={e => this.handleChange(e, "discount_margin")}
                InputProps={{
                  readOnly: edit_flag ? false : true,
                  startAdornment: <InputAdornment position="start">%</InputAdornment>
                }}
              />
              {edit_flag && (
                <DialogActions>
                  <Button onClick={e => this.handleChange(e, 'cancel')} variant="contained">
                    Cancel
                </Button>
                  <Button onClick={e => this.submitReferral(e)} color="primary" variant="contained">
                    Submit
                </Button>
                </DialogActions>
              )}
            </CardBody>
          </Card>
          <Card>
            <CardHeader color="primary">
              <Typography variant="h5" className='header_platform'>
                Promotional Text
              </Typography>
            </CardHeader>
            <CardBody>
              {/* <span>Referral Amount</span> */}
              <TextField
                margin='dense'
                id="name"
                type="text"
                multiline
                rows={2}
                rowsMax={4}
                label="Enter english text"
                value={promo_text_en.value}
                fullWidth
                onChange={e => this.handleChange(e, "promo_text_en")}
                error={promo_text_en.invalid}
                helperText={promo_text_en.invalid ? promo_text_en.message : ''}
              />
              <TextField
                margin='dense'
                id="name"
                type="text"
                multiline
                rows={2}
                rowsMax={4}
                label="Enter spanish text"
                value={promo_text_es.value}
                fullWidth
                onChange={e => this.handleChange(e, "promo_text_es")}
                error={promo_text_es.invalid}
                helperText={promo_text_es.invalid ? promo_text_es.message : ''}
              />
              
                <DialogActions>
                  <Button onClick={e => this.submitPromo(e)} color="primary" variant="contained">
                    Submit
                </Button>
                </DialogActions>
             
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="primary">
              <Typography variant="h5" className='header_platform'>
                How to use images
              </Typography>
            </CardHeader>
            <CardBody>
              <GridContainer>
                <GridItem xs={2} md={2} sm={4}>
                  <div className="single_image">
                    <img width="100" height="100" className="modal_img" alt='modal_image' src={image1 ? image1 : "/images/user.jpg"} />
                    <span onClick={e => document.getElementById('show_image1').click()} className="edit_icon"><EditIcon fontSize="small" /></span>
                    <TextField
                      id="show_image1"
                      type="file"
                      style={{ display: "none" }}
                      onChange={e => this.handleChange(e, "image", 'image1')}
                    />
                  </div>
                  <button onClick={e => this.handleChange(e, "del_image", 'image1')} className="btn btn-danger">Delete</button>
                </GridItem>
                <GridItem xs={2} md={2} sm={4}>
                  <div className="single_image">
                    <img width="100" height="100" className="modal_img" alt='modal_image' src={image2 ? image2 : "/images/user.jpg"} />
                    <span onClick={e => document.getElementById('show_image2').click()} className="edit_icon"><EditIcon fontSize="small" /></span>
                    <TextField
                      id="show_image2"
                      type="file"
                      style={{ display: "none" }}
                      onChange={e => this.handleChange(e, "image", 'image2')}
                    />
                  </div>
                  <button onClick={e => this.handleChange(e, "del_image", 'image2')} className="btn btn-danger">Delete</button>

                </GridItem>
                <GridItem xs={2} md={2} sm={4}>
                  <div className="single_image">
                    <img width="100" height="100" className="modal_img" alt='modal_image' src={image3 ? image3 : "/images/user.jpg"} />
                    <span onClick={e => document.getElementById('show_image3').click()} className="edit_icon"><EditIcon fontSize="small" /></span>
                    <TextField
                      id="show_image3"
                      type="file"
                      style={{ display: "none" }}
                      onChange={e => this.handleChange(e, "image", 'image3')}
                    />
                  </div>
                  <button onClick={e => this.handleChange(e, "del_image", 'image3')} className="btn btn-danger">Delete</button>

                </GridItem>
                <GridItem xs={2} md={2} sm={4}>
                  <div className="single_image">
                    <img width="100" height="100" className="modal_img" alt='modal_image' src={image4 ? image4 : "/images/user.jpg"} />
                    <span onClick={e => document.getElementById('show_image4').click()} className="edit_icon"><EditIcon fontSize="small" /></span>
                    <TextField
                      id="show_image4"
                      type="file"
                      style={{ display: "none" }}
                      onChange={e => this.handleChange(e, "image", 'image4')}
                    />
                  </div>
                  <button onClick={e => this.handleChange(e, "del_image", 'image4')} className="btn btn-danger">Delete</button>

                </GridItem>
                <GridItem xs={2} md={2} sm={4}>
                  <div className="single_image">
                    <img width="100" height="100" className="modal_img" alt='modal_image' src={image5 ? image5 : "/images/user.jpg"} />
                    <span onClick={e => document.getElementById('show_image5').click()} className="edit_icon"><EditIcon fontSize="small" /></span>
                    <TextField
                      id="show_image5"
                      type="file"
                      style={{ display: "none" }}
                      onChange={e => this.handleChange(e, "image", 'image5')}
                    />
                  </div>
                  <button onClick={e => this.handleChange(e, "del_image", 'image5')} className="btn btn-danger">Delete</button>
                </GridItem>
              </GridContainer>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="primary">
              <Typography variant="h5" className='header_platform'>
                How to use video
              </Typography>
            </CardHeader>
            <CardBody>
            <GridContainer>
                <GridItem xs={4} md={4} sm={4}>
                {/* <video width="200" 
                      height="200" 
                      poster={video_poster}
            >
                  <source src={video_poster} />
                </video> */}
                  <div className="single_image mb-2">                    
                    <TextField
                      id="video"
                      type="file"
                      accept="video/mp4,video/x-m4v,video/*"
                      onChange={e => this.handleChange(e, "video")}
                    />
                  </div>
                  <Button onClick={e => this.submitVideo()} color="primary" variant="contained">
                    Submit
                  </Button>
                </GridItem>
            </GridContainer>
          </CardBody>
        </Card>
        </GridItem>
      </GridContainer>
    );
  }
}
const mapStateToProps = store => {
  return {
    referral_response: store.login.referral_response,
    get_referral: store.login.get_referral
  };
};

const mapDispatchToProps = dispatch => {
  return {
    addAvailableAreaImage: params => dispatch(addAvailableAreaImage(params)),
    deleteAvailableAreaImage: params => dispatch(deleteAvailableAreaImage(params)),
    addDiscountCode: params => dispatch(addDiscountCode(params)),
    updateDiscountCode: params => dispatch(updateDiscountCode(params)),
    deleteCode: params => dispatch(deleteCode(params)),
    updateStatus: params => dispatch(updateStatus(params)),
    postReferral: params => dispatch(postReferral(params)),
    updatePromo: params => dispatch(updatePromo(params)),
    getReferral: () => dispatch(getReferral())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ReferralPage);
