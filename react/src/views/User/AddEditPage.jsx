import React from "react";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import GridItem from "components/Grid/GridItem.js";
import MenuItem from '@material-ui/core/MenuItem';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
// If you want to use the provided css
import 'react-google-places-autocomplete/dist/index.min.css';
import GridContainer from "components/Grid/GridContainer.js";
export default function AddEditPage(props) {
  const { edit_page, person_data, role } = props.state
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
        <GridItem xs={12} sm={12} md={4}>
          <TextField
            margin="dense"
            id="name"
            label="Name"
            type="text"
            value={person_data.username}
            fullWidth
            onChange={(e) => props.handleEditChange(e, 'username')}
          />
        </GridItem>
        <GridItem xs={12} sm={12} md={4}>
          <TextField
            margin="dense"
            id="phone"
            label="Phone"
            type="text"
            value={person_data.phone}
            fullWidth
            onChange={(e) => props.handleEditChange(e, 'phone')}
          />
        </GridItem>
        <GridItem xs={12} sm={12} md={4}>
          <TextField
            margin="dense"
            id="email"
            label="Email"
            type="text"
            value={person_data.email}
            fullWidth
            disabled={edit_page && true}
            onChange={(e) => props.handleEditChange(e, 'email')}
          />
        </GridItem>
      </GridContainer>
      <GridContainer>
        <GridItem xs={12} sm={12} md={6}>
          <TextField
            margin="dense"
            id="dob"
            label="Birth Date"
            type="date"
            value={person_data.dob}
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(e) => props.handleEditChange(e, 'dob')}
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
            onChange={(e) => props.handleEditChange(e, 'gender')}
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
          {role === 'technician' ?
            <div class="MuiFormControl-root MuiTextField-root MuiFormControl-marginDense MuiFormControl-fullWidth">
              <label class="MuiFormLabel-root MuiInputLabel-root MuiInputLabel-formControl MuiInputLabel-animated MuiInputLabel-marginDense" data-shrink="false" for="zip" id="zip-label">Zip Code</label>
              <GooglePlacesAutocomplete
              initialValue={person_data.address}
              autocompletionRequest={{
                componentRestrictions: {
                  country: ['in'],
                }
              }}
                onSelect={(e) => console.log('ssdsdsd', e)}
              />
            </div>
            :
            <TextField
              margin="dense"
              id="address"
              label="Address"
              type="text"
              value={person_data.address}
              fullWidth
              onChange={(e) => props.handleEditChange(e, 'address')}
            />
          }
        </GridItem>
        <GridItem xs={12} sm={12} md={4}>
          <TextField
            margin="dense"
            id="zip"
            label="Zip Code"
            type="text"
            value={person_data.zip}
            fullWidth
            onChange={(e) => props.handleEditChange(e, 'zip')}
          />
        </GridItem>
      </GridContainer>
      <DialogActions>
        <Button onClick={e => props.backPage(e)} variant="contained">
          Cancel
        </Button>
        {edit_page ?
          <Button
            onClick={e => props.submitData(e, 'edit')}
            color="primary"
            variant="contained"
          >
            Submit
          </Button>
          : <Button
            onClick={e => props.submitData(e, 'add')}
            color="primary"
            variant="contained"
          >
            Submit
          </Button>
        }
      </DialogActions>
    </div>
  );
}
