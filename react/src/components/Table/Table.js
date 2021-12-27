import React from "react";
import PropTypes from "prop-types";
// @material-ui/core components
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import Switch from '@material-ui/core/Switch'
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import PaymentIcon from '@material-ui/icons/Payment';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import Edit from "@material-ui/icons/Edit";
import Block from "@material-ui/icons/Block";
import DeleteIcon from "@material-ui/icons/Delete";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import View from "@material-ui/icons/Visibility";
// core components
import styles from "assets/jss/material-dashboard-react/components/tableStyle.js";

const useStyles = makeStyles(styles);
const useStyles1 = makeStyles((theme) => ({
  root: {
    flexShrink: 0,
    marginLeft: theme.spacing(2.5),
  },
}));
function TablePaginationActions(props) {
  const classes = useStyles1();
  const theme = useTheme();
  const { count, page, rowsPerPage, onChangePage } = props;

  const handleFirstPageButtonClick = (event) => {
    onChangePage(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onChangePage(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onChangePage(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <div className={classes.root}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </div>
  );
}
TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

export default function CustomTable(props) {
  const classes = useStyles();

  const { tableHead, tableData, tableHeaderColor, customClass, rowsPerPage, count, page, handleChangePage,handleChangeRowsPerPage, hideEdit, hideView, tipText } = props;
  return (
    <div className={customClass}>
      <Table className={classes.table}>
        {tableHead !== undefined ? (
          <TableHead className={classes[tableHeaderColor + "TableHeader"]}>
            <TableRow className={classes.tableHeadRow}>
              {tableHead.map((prop, key) => {
                return (
                  <TableCell
                    className={classes.tableCell + " " + classes.tableHeadCell}
                    key={key}
                  >
                    {prop}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
        ) : null}
        <TableBody>
          {(rowsPerPage > 0
            ? tableData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : tableData
          ).map((prop, key) => {
            return prop[prop.length - 1] instanceof Object ? (
              <TableRow key={key} className={classes.tableBodyRow}>
                {prop.map((prop1, key) => {
                  return key !== prop.indexOf(prop[prop.length - 1]) ? (
                    <TableCell className={classes.tableCell} key={key}>
                      {prop1}
                    </TableCell>
                  ) : (
                      <React.Fragment>
                        <TableCell className={classes.tableCell}>
                          {!hideView && <span
                            key={Object.keys(prop1)[0]}
                            onClick={() =>
                              props.handleChange(
                                Object.keys(prop1)[0],
                                Object.values(prop1)[0]
                              )
                            }
                          >
                            {Object.keys(prop1)[0] === "view" && (
                              <Tooltip title="View">
                                <View />
                              </Tooltip>
                            )}
                            {Object.keys(prop1)[0] === "status" && (
                              <Switch defaultChecked={Object.values(prop1)[0].status == 'active'} ></Switch>
                            )}
                            {Object.keys(prop1)[1] === "pay" && (
                              <Tooltip title="Pay Amount">
                                <PaymentIcon />
                              </Tooltip>
                            )}
                            {Object.keys(prop1)[1] === "paid" && (
                              <Tooltip title="Amount completed">
                                <CheckCircleOutlineIcon />
                              </Tooltip>
                            )}
                          </span>}
                          {!hideEdit && <span
                            className="ml-2"
                            key={Object.keys(prop1)[1]}
                            onClick={() =>
                              props.handleChange(
                                Object.keys(prop1)[1],
                                Object.values(prop1)[1]
                              )
                            }
                          >
                            {Object.keys(prop1)[1] === "edit" && (
                              <Tooltip title="Edit">
                                <Edit />
                              </Tooltip>
                            )}
                          </span>}
                          <span
                            className="ml-2"
                            key={Object.keys(prop1)[2]}
                            onClick={() =>
                              props.handleChange(
                                Object.keys(prop1)[2],
                                Object.values(prop1)[2],
                                Object.values(prop)[0]
                              )
                            }
                          >
                            {Object.keys(prop1)[2] === "block" && (
                              <Tooltip title={tipText ? 'Delete' : 'Block'}>
                                <Block />
                              </Tooltip>
                            )}
                            {Object.keys(prop1)[2] === "unblock" && (
                              <Tooltip title="Unblock">
                                <CheckCircleIcon />
                              </Tooltip>
                            )}
                          </span>
                          <span
                            className="ml-2"
                            key={key}
                            onClick={() =>
                              props.handleChange(
                                "delete",
                                Object.values(prop1)[2] ? Object.values(prop1)[2] : Object.values(prop1)[1],
                                Object.values(prop)[0]
                              )
                            }
                          >
                            {Object.keys(prop1).includes("delete") && (
                              <Tooltip title='Delete'>
                                <DeleteIcon />
                              </Tooltip>
                            )}
                          </span>
                        </TableCell>
                      </React.Fragment>
                    );
                })}
              </TableRow>
            ) : (
                <TableRow key={key} className={classes.tableBodyRow}>
                  {prop.map((prop, key) => {
                    return (
                      <TableCell className={classes.tableCell} key={key}>
                        {prop}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
          })}
        </TableBody>
        <TableFooter>
          <TableRow>
          <TablePagination
              rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
              
              count={count}
              rowsPerPage={rowsPerPage}
              page={page}
              SelectProps={{
                inputProps: { 'aria-label': 'rows per page' },
                native: true,
              }}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </TableRow>
          </TableFooter>
      </Table>
    </div>
  );
}

CustomTable.defaultProps = {
  tableHeaderColor: "gray"
};

CustomTable.propTypes = {
  tableHeaderColor: PropTypes.oneOf([
    "warning",
    "primary",
    "danger",
    "success",
    "info",
    "rose",
    "gray"
  ]),
  tableHead: PropTypes.arrayOf(PropTypes.string),
  tableData: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string))
};
