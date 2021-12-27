import React from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import DialogActions from "@material-ui/core/DialogActions";
export default function Actions(props) {
  return (
    <div>
      <TextField
        autoFocus
        margin="dense"
        id="subject"
        label="Subject"
        type="text"
        value={props.state.subject}
        fullWidth
        onChange={e => props.handleChange(e, "subject")}
      />
      <TextField
        margin="dense"
        multiline
        id="message"
        label="Message"
        type="text"
        value={props.state.message}
        fullWidth
        onChange={e => props.handleChange(e, "message")}
      />
      <DialogActions>
        <Button onClick={e => props.backPage(e)} variant="contained">
          Cancel
        </Button>
        <Button
          onClick={e => props.submitData(e)}
          color="primary"
          variant="contained"
        >
          Submit
      </Button>
      </DialogActions>
    </div>
  );
}
