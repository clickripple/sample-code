import React from "react";
import TextField from "@material-ui/core/TextField";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
export default function Actions(props) {
  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={6}>
          <TextField
            margin="dense"
            id="name"
            label="Model Name"
            type="text"
            value={props.detail.modelName}
            fullWidth
            InputProps={{
              readOnly: true,
            }}
          />
        </GridItem>
        <GridItem xs={12} sm={12} md={6}>
          <TextField
            margin="dense"
            id="phone"
            label="Estimate Price"
            type="text"
            value={props.detail.repair_estimate}
            fullWidth
            InputProps={{
              readOnly: true,
            }}
          />
        </GridItem>
        <GridItem xs={12} sm={12} md={6}>
          <TextField
            margin="dense"
            id="email"
            label="Finish Date"
            type="text"
            value={props.detail.dateTime}
            fullWidth
            InputProps={{
              readOnly: true,
            }}
          />
        </GridItem>
      </GridContainer>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <TextField
            margin="dense"
            id="address"
            label="Pickup Address"
            type="text"
            value={props.detail.address}
            fullWidth
            InputProps={{
              readOnly: true,
            }}
          />
        </GridItem>
      </GridContainer>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <TextField
            margin="dense"
            id="address"
            label="Status"
            type="text"
            value={props.detail.status}
            fullWidth
            InputProps={{
              readOnly: true,
            }}
          />
        </GridItem>
      </GridContainer>
    </div>
  );
}
