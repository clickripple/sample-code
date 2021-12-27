import React from "react";
import TextField from "@material-ui/core/TextField";
import GridItem from "components/Grid/GridItem.js";
import MenuItem from '@material-ui/core/MenuItem';

import GridContainer from "components/Grid/GridContainer.js";
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
export default function Actions(props) {
  const { payment_history } = props.state
  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={4}>
          <TextField
            margin="dense"
            id="name"
            label="Technician Name"
            type="text"
            value={payment_history.username}
            fullWidth
            inputProps={{ readOnly: true }}
          />
        </GridItem>
        <GridItem xs={12} sm={12} md={4}>
          <TextField
            margin="dense"
            id="phone"
            label="Technician Phone"
            type="text"
            value={payment_history.phone}
            fullWidth
            inputProps={{ readOnly: true }}
          />
        </GridItem>
      </GridContainer>
      <GridContainer>
        <GridItem xs={12} sm={12} md={4}>
          <TextField
            margin="dense"
            id="email"
            label="Technician Email"
            type="text"
            value={payment_history.email}
            fullWidth
            disabled
          />
        </GridItem>
      </GridContainer>
      <GridContainer>
        <GridItem xs={12} sm={12} md={3}>
          <TextField
            margin="dense"
            id="dob"
            label="Transaction Date"
            type="text"
            value={payment_history.dob}
            fullWidth
            inputProps={{ readOnly: true }}
          />
        </GridItem>
        <GridItem xs={12} sm={12} md={3}>
        <TextField
            margin="dense"
            id="dob"
            label="Transaction Mode"
            type="text"
            value={payment_history.dob}
            fullWidth
            inputProps={{ readOnly: true }}
          />
        </GridItem>
        <GridItem xs={12} sm={12} md={3}>
          <TextField
            margin="dense"
            id="address"
            label="Transaction Amount"
            type="text"
            value={payment_history.address}
            fullWidth
            inputProps={{ readOnly: true }}
          />
        </GridItem>
        <GridItem xs={12} sm={12} md={3}>
          <TextField
            margin="dense"
            id="zip"
            label="Remaining Amount"
            type="text"
            value={payment_history.zip}
            fullWidth
            inputProps={{ readOnly: true }}
          />
        </GridItem>
      </GridContainer>
    </div>
  );
}
