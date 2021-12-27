import React, { useState, useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import GridItem from "components/Grid/GridItem.js";
import MenuItem from '@material-ui/core/MenuItem';
import Table from "components/Table/Table.js";
import { IMG_PATH } from "../../config";
import EditIcon from "@material-ui/icons/Edit";
import GridContainer from "components/Grid/GridContainer.js";
import { Dialog, DialogContent } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { bindActionCreators } from 'redux'
import { uploadDocument, docStatus } from "../../actions/user";
import { connect } from "react-redux";

const styles = {
  cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0"
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none"
  },
  imageStyle: {
    width: "100%",
    maxWidth: "156px",
    maxHeight: "156px",
    objectFit: "contain",
    align: "center"
  }
};
function Actions(props) {

  let [openImgDialog, openImgDialogFunc] = useState(false);
  let [openEditImgDialog, openEditImgDialogFunc] = useState(false);
  let [previewImage, editPImgFunc] = useState('images/user.jpg');
  let [previewType, editPTypeFunc] = useState('other_doc');
  let [imgSrc, imgSrcFunc] = useState("");
  let [preview, previewFunc] = useState("");
  let [imageOb, setImage] = useState("");
  let [all_images, setAllImage] = useState({});
  let [doc_status, setDocStatus] = useState('');
  
  let phone_booking =[];
  let issue_bookings =[];
  let booking_per_total =[];
  let { person_data, role, selected_person, person_info } = props.state;
  
  if(role === "user"){
    person_info.phone_bookings.map(b => {
      phone_booking.push([b.phone, b.bookings.toString()]);
    })
    person_info.issue_bookings.map(b => {
      issue_bookings.push([b.id, b.issues.toString()]);
    })
    person_info.amountBooking.map(b => {
      booking_per_total.push([b.id, b.afterDiscount_amount ? b.afterDiscount_amount.toString(): "0"]);
    })
  }


  useEffect(()=>{

    let data = props.state.person_data;
    for(let a of ['id_doc','actual_photo','address_doc','reference_doc','secure_doc','other_doc']){
      data[a] = data[a] ? (data[a].includes(IMG_PATH) ? data[a] : IMG_PATH + data[a]) : "/images/user.jpg"
    }
    setAllImage(data);
    setDocStatus(data.doc_status);
  })

  function openImage(img){
    openImgDialogFunc(true);
    const image = all_images[img]
    imgSrcFunc(image);
  }

  const changeDocStatus = (status) => {
    const data = {
      id: person_data.id,
      status
    }

    let response = docStatus(data);
    // setDocStatus(status);

    response.payload.then(res => {
      if(res.data.status === 200){
        window.location.reload();
      }
    });
  }

  function openEditImage(img){
    openEditImgDialogFunc(true);
    const image = all_images[img]
    editPImgFunc(image);
    editPTypeFunc(img);
  }

  function uploadImage(event){
    if (event.target.files && event.target.files[0]) {
      previewFunc(URL.createObjectURL(event.target.files[0]));
      setImage(event.target.files[0]);
    }
  }

  function updateImage(){
    const formData = new FormData();
    formData.append("doc_type", previewType);
    formData.append("doc", imageOb);
    formData.append("id", person_data.id);
    uploadDocument(formData);
    all_images[previewType] = URL.createObjectURL(imageOb);
    openEditImgDialogFunc(false);
  }

  const gender_data = [
    {
      value: '',
      label: 'Please Select A Gender',
    },
    {
      value: 'M',
      label: 'Male',
    },
    {
      value: 'F',
      label: 'Female',
    },
    {
      value: 'O',
      label: 'Other',
    }
  ];

  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          {person_data.profile_pic ?
            <img className='user_profile' alt='profile' src={IMG_PATH+person_data.profile_pic} style={styles.imageStyle} />
            :
            <img src='/images/user.jpg' alt='profile' className='user_profile' style={styles.imageStyle} />
          }
        </GridItem>
      </GridContainer>
      <GridContainer>
        <GridItem xs={12} sm={12} md={6}>
          <TextField
            margin="dense"
            id="name"
            label="Name"
            type="text"
            value={person_data.username}
            fullWidth
            inputProps={{ readOnly: true }}
          />
        </GridItem>
        <GridItem xs={12} sm={12} md={6}>
          <TextField
            margin="dense"
            id="phone"
            label="Phone"
            type="text"
            value={person_data.phone ? person_data.phone : "-"}
            fullWidth
            inputProps={{ readOnly: true }}
          />
        </GridItem>
      </GridContainer>
      <GridContainer>
        <GridItem xs={12} sm={12} md={6}>
          <TextField
            margin="dense"
            id="email"
            label="Email"
            type="text"
            value={person_data.email}
            fullWidth
            disabled
          />
        </GridItem>
        <GridItem xs={12} sm={12} md={6}>
          <TextField
            margin="dense"
            id="referal_code"
            label="Referral Code"
            type="text"
            value={person_data.referal_code ? person_data.referal_code : "-"}
            fullWidth
            inputProps={{ readOnly: true }}
          />
        </GridItem>
      </GridContainer>
      <GridContainer>
        <GridItem xs={12} sm={12} md={6}>
          <TextField
            margin="dense"
            id="dob"
            label="Birth Date"
            type="text"
            value={person_data.dob ? person_data.dob : ""}
            fullWidth
            inputProps={{ readOnly: true }}
          />
        </GridItem>
        <GridItem xs={12} sm={12} md={6}>
          <TextField
            
            margin="dense"
            id="gender"
            label="Gender"
            select
            type="text"
            value={person_data.gender}
            fullWidth
            inputProps={{ readOnly: true }}
          >
            {gender_data.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </GridItem>
      </GridContainer>
      <GridContainer>
        <GridItem xs={12} sm={12} md={8}>
          <TextField
            margin="dense"
            id="address"
            label="Address"
            type="text"
            value={person_data.address}
            fullWidth
            inputProps={{ readOnly: true }}
          />
        </GridItem>
        <GridItem xs={12} sm={12} md={4}>
          <TextField
            margin="dense"
            id="zip"
            label="Zip Code"
            type="text"
            value={person_data.zip ? person_data.zip : '-'}
            fullWidth
            inputProps={{ readOnly: true }}
          />
        </GridItem>
        </GridContainer>
        {role === "user" &&
        <GridContainer>
        
        
          <GridItem xs={12} sm={12} md={6}>
            <TextField
              margin="dense"
              id="zip"
              label="Total number of services"
              type="text"
              value={person_info.booking_count ? person_info.booking_count : 0}
              fullWidth
              inputProps={{ readOnly: true }}
            />
          </GridItem>
          <GridItem xs={12} sm={12} md={6}>
            <TextField
              margin="dense"
              id="zip"
              label="Total amount paid"
              type="text"
              value={person_info.booking_total ? person_info.booking_total : 0}
              fullWidth
              inputProps={{ readOnly: true }}
            />
          </GridItem>
      

          <GridItem xs={6} sm={6} md={6}>
            <h3>Phone Model per service</h3>
            <Table
              customClass='table_class_width'
              tableHeaderColor="primary"
              tableHead={["Model Name", "Services"]}
              tableData={phone_booking}
              rowsPerPage={5}
              handleChangePage={()=>console.log('ab')}
              page={0}
              count={0}
            />
          </GridItem>
          <GridItem xs={6} sm={6} md={6}>
            <h3>Issue repaired per service</h3>
            <Table
              customClass='table_class_width'
              tableHeaderColor="primary"
              tableHead={["Booking id", "Issues"]}
              tableData={issue_bookings}
              rowsPerPage={5}
              handleChangePage={()=>console.log('ab')}
              page={0}
              count={0}
            />
          </GridItem>
          <GridItem xs={6} sm={6} md={6}>
            <h3>Amount Paid per service</h3>
            <Table
              customClass='table_class_width'
              tableHeaderColor="primary"
              tableHead={["Booking id", "Amount paid"]}
              tableData={booking_per_total}
              rowsPerPage={5}
              handleChangePage={()=>console.log('ab')}
              page={0}
              count={0}
            />
          </GridItem>
      </GridContainer>}
      {
        role === 'technician' &&
        <React.Fragment>
          <GridContainer>
            <GridItem xs={12} sm={12} md={4}>
              <TextField
                margin="dense"
                id="tbooking"
                label="Total Bookings"
                type="text"
                value={selected_person.total_booking}
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{ readOnly: true }}
              />
            </GridItem>
            <GridItem xs={12} sm={12} md={4}>
              <TextField
                margin="dense"
                id="cbooking"
                label="Complete Bookings"
                type="text"
                value={selected_person.Cpmolete_booking}
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{ readOnly: true }}
              />
            </GridItem>
            <GridItem xs={12} sm={12} md={4}>
              <TextField
                margin="dense"
                id="pbooking"
                label="Pending Bookings"
                type="text"
                value={selected_person.pending_booking}
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{ readOnly: true }}
              />
            </GridItem>
          </GridContainer>
          <GridContainer>
            <GridItem xs={12} sm={12} md={6}>
              <TextField
                margin="dense"
                id="cbooking"
                label="Total Payment"
                type="text"
                value={selected_person.user_data && selected_person.user_data.totalAmount}
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{ readOnly: true }}
              />
            </GridItem>
            <GridItem xs={12} sm={12} md={6}>
              <TextField
                margin="dense"
                id="pbooking"
                label="Received Payment"
                type="text"
                value={selected_person.user_data && selected_person.user_data.totalPaidAmount}
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{ readOnly: true }}
              />
            </GridItem>
          </GridContainer>
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
              <img 
                onClick={() => openImage(doc)} 
                src={all_images[doc]} 
                className="img_doc"
              />
              <h5 className="text-center">ID proof</h5>
              <span onClick={() => openEditImage(doc)}  className="edit_icon doc_icon"><EditIcon /></span>
            </GridItem>
              )
              }
              
          </GridContainer>
          {doc_status != "accepted" &&
          <div className="d-flex justify-content-center bd-highlight mb-3">
            <div className="p-2">
              <Button onClick={() => changeDocStatus('accepted')} variant="contained" color="primary" className="mr-2">
                Accept
              </Button>
            </div>
            <div className="p-2">
              <Button onClick={() => changeDocStatus('rejected')} color="error" variant="contained">
                Reject
              </Button>
            </div>
          </div>}
          
          <div className="d-flex justify-content-center bd-highlight mb-3">
            <div className="p-2">
              Technician Document Status - {person_data.doc_status ? person_data.doc_status.toUpperCase() : null}
            </div>
          </div>
          <Dialog fullWidth open={openImgDialog} maxWidth="lg">
            <DialogContent align={'center'}>
              <span className="cross_img" onClick={() => openImgDialogFunc(false)}>X</span>
              <div className="imageWrapper">
                <img className="" src={imgSrc} />
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={openEditImgDialog} >
            <DialogContent align={'center'} className="m-3">
              <span className="cross_img cross_img2" onClick={() => openEditImgDialogFunc(false)}>X</span>
              <GridContainer>
                <GridItem lg={6} sm={6} xl={6}>
                  <h5>Original Document</h5>
                  <img className="img-fluid" src={previewImage} />
                </GridItem>
                <GridItem lg={6} sm={6} xl={6}>
                  <h5>Upload another</h5>
                  <TextField
                      type="file"
                      name="imageChange"
                      onChange={e => uploadImage(e)}
                  />
                  
                  <img className="img-fluid" src={preview} />
                  <div className="my-3">
                    <Button variant="contained" className="mr-2">
                      Cancel
                    </Button>
                    <Button onClick={updateImage} color="primary" variant="contained">
                      Submit 
                    </Button>
                  </div>
                </GridItem>
              </GridContainer>
            </DialogContent>
          </Dialog>
        </React.Fragment>
      }
    </div>
  );
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ uploadDocument , docStatus }, dispatch)
}

export default connect(null,mapDispatchToProps)(Actions);