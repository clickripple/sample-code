import React, { Component } from "react";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Card from "components/Card/Card.js";
import DeleteIcon from "@material-ui/icons/Delete";
import CardBody from "components/Card/CardBody.js";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/Add";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";

export default class HelpAddEdit extends Component {
  render() {
    const { state, handleChange, addHelp, submitData } = this.props;
    const { add_edit_data, add_edit } = state;
    return (
      <div>
        {add_edit_data.map((data, index) => {
          return (
            <Card>
              <CardBody>
                <Typography variant="h5" className='header_help'>
                  {index + 1}
                  {add_edit_data.length !== 1 &&
                    <Tooltip title="Delete" className='help_delete_icon'>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={e =>
                          addHelp(e, "delete", index)
                        }
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  }
                </Typography>
                <TextField
                  autoFocus
                  margin="dense"
                  id="name"
                  label={"Phone " + (index + 1)}
                  type="text"
                  value={data.phone}
                  fullWidth
                  onChange={e => handleChange(e, "phone", index)}
                />
                <TextField
                  margin="dense"
                  id="name"
                  label={"Email " + (index + 1)}
                  type="text"
                  value={data.email}
                  fullWidth
                  onChange={e => handleChange(e, "email", index)}
                />
                <TextField
                  margin="dense"
                  id="name"
                  label={"Address " + (index + 1)}
                  type="text"
                  value={data.address}
                  fullWidth
                  onChange={e => handleChange(e, "address", index)}
                />
                <TextField
                  margin="dense"
                  id="name"
                  label={"Website " + (index + 1)}
                  type="text"
                  value={data.website}
                  fullWidth
                  onChange={e => handleChange(e, "website", index)}
                />
              </CardBody>
            </Card>
          );
        })}
        <IconButton
          edge="end"
          aria-label="edit"
          className='icon_boundry'
          onClick={e => addHelp(e, "add")}
        >
          <AddIcon />
        </IconButton>
        <Button
          onClick={e => {
            (add_edit === 1 && submitData(e, "add")) ||
              (add_edit === 2 && submitData(e, "edit"));
          }}
          color="primary"
          variant="contained"
        >
          Submit
        </Button>
      </div>
    );
  }
}
