/*eslint-disable*/
import React, { useState } from "react";
import { Link } from "react-router-dom";
import classNames from "classnames";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import Icon from "@material-ui/core/Icon";
import Collapse from "@material-ui/core/Collapse";
// core components
import AdminNavbarLinks from "components/Navbars/AdminNavbarLinks.js";

import styles from "assets/jss/material-dashboard-react/components/sidebarStyle.js";

const useStyles = makeStyles(styles);

export default function Sidebar(props) {
  const classes = useStyles();
  const [stateName, setState] = useState(false);
  // verifies if routeName is the one active (in browser input)
  function activeRoute(routeName) {
    return window.location.href.indexOf(routeName) > -1 ? true : false;
  }

  function handler(children) {
    return children.map((subOption, key) => {
      var activePro = " ";
      var listItemClasses;

      listItemClasses = classNames({
        [" " + classes[color]]: activeRoute(subOption.path)
      });

      const whiteFontClasses = classNames({
        [" " + classes.whiteFont]: activeRoute(subOption.path)
      });
      if (!subOption.children) {
        return (
          <div key={subOption.name}>
            <NavLink
              to={subOption.path}
              className={activePro + classes.item}
              activeClassName="active"
              key={key}
            >
              <ListItem
                button
                // onClick={() => this.handleClick(subOption.name)}
                className={classes.itemLink + listItemClasses}
              >
                <ListItemText
                  inset
                  primary={subOption.name}
                  className={classNames(classes.itemText, whiteFontClasses)}
                />
              </ListItem>
            </NavLink>
          </div>
        );
      }

      return (
        <div key={subOption.name}>
          <NavLink
            to={subOption.path}
            className={activePro + classes.item}
            activeClassName="active"
            key={key}
          >
            <ListItem
              button
              className={classes.itemLink + listItemClasses}
            >
              <ListItemText
                inset
                primary={subOption.name}
                className={classNames(classes.itemText, whiteFontClasses)}
              />
              {stateName ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={stateName} timeout="auto" unmountOnExit>
              {() => this.handler(subOption)}
            </Collapse>
          </NavLink>
        </div>
      );
    });
  }
  const { color, logo, image, logoText, routes } = props;
  var links = (
    <List className={classes.list}>
      {routes.map((prop, key) => {
        var activePro = " ";
        var listItemClasses;

        listItemClasses = classNames({
          [" " + classes[color]]: activeRoute(prop.path)
        });

        const whiteFontClasses = classNames({
          [" " + classes.whiteFont]: activeRoute(prop.path)
        });
        return (

          (!prop.subpage && !prop.redirect) &&
          (prop.parent === undefined ? (
            (prop.path === '/about' || prop.path === '/privacy_policy' || prop.path === '/terms_conditions') ? (
              <a
                href={prop.path}
                className={activePro + classes.item}
                activeclassname="active"
                key={key}
              >

                <ListItem button className={classes.itemLink + listItemClasses}>
                  <prop.icon
                    className={classNames(classes.itemIcon, whiteFontClasses)}
                  />
                  <ListItemText
                    primary={prop.name}
                    className={classNames(classes.itemText, whiteFontClasses)}
                    disableTypography={true}
                  />
                </ListItem>
              </a>) : (
                <NavLink
                  to={prop.path}
                  className={activePro + classes.item}
                  activeClassName="active"
                  key={key}
                >

                  <ListItem button className={classes.itemLink + listItemClasses}>
                    <prop.icon
                      className={classNames(classes.itemIcon, whiteFontClasses)}
                    />
                    <ListItemText
                      primary={prop.name}
                      className={classNames(classes.itemText, whiteFontClasses)}
                      disableTypography={true}
                    />
                  </ListItem>
                </NavLink>
              )
          ) : (
              <NavLink
                to="#"
                className={activePro + classes.item}
                activeClassName="active"
                key={key}
              >
                <ListItem
                  button
                  className={classes.itemLink + listItemClasses}
                  onClick={() => setState(!stateName)}
                >
                  <prop.icon
                    className={classNames(classes.itemIcon, whiteFontClasses)}
                  />
                  <ListItemText
                    inset
                    primary={prop.name}
                    className={classNames(classes.itemText, whiteFontClasses)}
                  />
                  {stateName ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={stateName} timeout="auto" unmountOnExit>
                  {handler(prop.children)}
                </Collapse>
              </NavLink>
            ))
        );
      })}
    </List>
  );

  var brand = (
    <div className={classes.logo}>
      <a
        href="/dashboard"
        className={classNames(classes.logoLink)}
      // target="_blank"
      >
        <div className={classes.logoImage}>
          <img src={logo} alt="logo" className={classes.img} />
        </div>
        {logoText}
      </a>
    </div>
  );
  return (
    <div>
      <Hidden mdUp implementation="css">
        <Drawer
          variant="temporary"
          anchor={"right"}
          open={props.open}
          classes={{
            paper: classNames(classes.drawerPaper)
          }}
          onClose={props.handleDrawerToggle}
          ModalProps={{
            keepMounted: true // Better open performance on mobile.
          }}
        >
          {brand}
          <div className={classes.sidebarWrapper}>
            {<AdminNavbarLinks />}
            {links}
          </div>
          {image !== undefined ? (
            <div
              className={classes.background}
              style={{ backgroundImage: "url(" + image + ")" }}
            />
          ) : null}
        </Drawer>
      </Hidden>
      <Hidden smDown implementation="css">
        <Drawer
          anchor={"left"}
          variant="permanent"
          open
          classes={{
            paper: classNames(classes.drawerPaper)
          }}
        >
          {brand}
          <div className={classes.sidebarWrapper}>{links}</div>
          {image !== undefined ? (
            <div
              className={classes.background}
              style={{ backgroundImage: "url(" + image + ")" }}
            />
          ) : null}
        </Drawer>
      </Hidden>
    </div>
  );
}

Sidebar.propTypes = {
  handleDrawerToggle: PropTypes.func,
  bgColor: PropTypes.oneOf(["purple", "blue", "green", "orange", "red"]),
  logo: PropTypes.string,
  image: PropTypes.string,
  logoText: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object),
  open: PropTypes.bool
};
