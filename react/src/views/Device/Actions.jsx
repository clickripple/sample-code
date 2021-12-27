import React from "react";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/Add";
import Button from "@material-ui/core/Button";
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import CancelIcon from '@material-ui/icons/Cancel';
import Card from "components/Card/Card.js";
import Typography from "@material-ui/core/Typography";
import DeleteIcon from "@material-ui/icons/Delete";
import CardBody from "components/Card/CardBody.js";
import Tooltip from "@material-ui/core/Tooltip";
export default function Actions(props) {
  return (
    <div className='issue_action'>
      <div className='upload_wrap'>
        {props.state.view_image.map((data, index) =>
          <div>
            <img className="issue_img" alt='issue_image' src={data} />
            <CancelIcon onClick={e => props.removeImage(e, index)} />
          </div>
        )}


        {(props.state.view_image.length !== 2) && <div><label for="file-upload" class="custom-file-upload">
          <AddCircleOutlineIcon />
        </label>
          <input id="file-upload" type="file" accept="image/*" onChange={e => props.handleChange(e, "view_image")} /></div>}
      </div>
      {/* <TextField
        autoFocus
        className='image_design'
        margin="dense"
        id="image"
        label="image"
        type="file"
        fullWidth
        onChange={e => props.handleChange(e, "view_image")}
      /> */}
      {props.state.issue_array.map((data, index) => {
        return (
          <Card>
            <CardBody>
              <Typography variant="h5" className='header_help'>
                {index + 1}
                {props.state.issue_array.length !== 1 &&
                  <Tooltip title="Delete" className='help_delete_icon'>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={e =>
                        props.addIssue(e, "delete", index)
                      }
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>}
              </Typography>
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label={"Issue " + (index + 1)}
                type="text"
                value={data.en_issue}
                fullWidth
                onChange={e => props.handleChange(e, index, 'en_issue')}
              />
              <TextField
                margin="dense"
                id="name"
                label={"Problema " + (index + 1)}
                type="text"
                value={data.es_issue}
                fullWidth
                onChange={e => props.handleChange(e, index, 'es_issue')}
              />
              <TextField
                margin="dense"
                id="name"
                label={"Price " + (index + 1)}
                type="text"
                value={data.price}
                fullWidth
                onChange={e => props.handleChange(e, index, 'value')}
              />

            </CardBody>
          </Card>
        );
      })}
      <IconButton
        edge="end"
        aria-label="edit"
        className='icon_boundry'
        onClick={e => props.addIssue(e, "add")}
      >
        <AddIcon />
      </IconButton>
      <Button
        onClick={e => {
          (props.state.add_edit === 1 && props.submitData(e, "add")) ||
            (props.state.add_edit === 2 && props.submitData(e, "edit"));
        }}
        color="primary"
        variant="contained"
      >
        Submit
      </Button>
    </div>
  );
}
