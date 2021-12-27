import React from "react";
import TextField from "@material-ui/core/TextField";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
export default function Actions(props) {
  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={5}>
          <TextField
            margin="dense"
            id="name"
            label="Name"
            type="text"
            value={props.state.view_data.user.username}
            fullWidth
            InputProps={{
              readOnly: true,
            }}
          />
        </GridItem>
        <GridItem xs={12} sm={12} md={3}>
          <TextField
            margin="dense"
            id="phone"
            label="Phone"
            type="text"
            value={props.state.view_data.user.phone}
            fullWidth
            InputProps={{
              readOnly: true,
            }}
          />
        </GridItem>
        <GridItem xs={12} sm={12} md={4}>
          <TextField
            margin="dense"
            id="email"
            label="Email"
            type="text"
            value={props.state.view_data.user.email}
            fullWidth
            InputProps={{
              readOnly: true,
            }}
          />
        </GridItem>
      </GridContainer>
      <GridContainer>
        <GridItem xs={12} sm={12} md={6}>
          <TextField
            margin="dense"
            id="issue"
            label="Issue Subject"
            type="text"
            value={props.state.view_data.subject}
            fullWidth
            readOnly
          />
        </GridItem>
        <GridItem xs={12} sm={12} md={6}>
          <TextField
            margin="dense"
            id="message"
            label="Issue"
            type="text"
            value={props.state.view_data.message}
            fullWidth
            readOnly
          />
        </GridItem>
      </GridContainer>
      <GridContainer>
        <GridItem xs={12} sm={12} md={6}>
          <TextField
            margin="dense"
            id="subject"
            label="Reply Subject"
            type="text"
            value={props.state.view_data.mail_subject}
            fullWidth
            readOnly
          />
        </GridItem>
        <GridItem xs={12} sm={12} md={6}>
          <TextField
            margin="dense"
            id="reply"
            label="Reply"
            type="text"
            value={props.state.view_data.mail_message}
            fullWidth
            readOnly
          />
        </GridItem>
      </GridContainer>
    </div>
  );
}
