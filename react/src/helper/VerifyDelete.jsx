import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";

class VerifyDelete extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return (
        <Dialog
        open={this.props.show}
        onClose={this.props.onClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you want to delete this model?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={this.props.onClose}
            variant="contained"
          >
            Cancel
          </Button>
          <Button onClick={this.props.delete} color="secondary" variant="contained">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>)
    }
}

export default VerifyDelete;