import React from "react";
import routes from "./routes";
import Login from "../views/Login/Login";
import Verify from "../views/Login/Verify";
import { Switch, Route, Redirect } from "react-router-dom";
import 'react-perfect-scrollbar/dist/css/styles.css';
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import Navbar from "components/Navbars/Navbar.js";
// import Footer from "components/Footer/Footer.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import styles from "assets/jss/material-dashboard-react/layouts/adminStyle.js";
import bgImage from "assets/img/sidebar-2.jpg";
import logo from "assets/img/reactlogo.png";

const switchRoutes = (
  <Switch>
    {routes.map((prop, key) => {
      if (prop.redirect)
        return <Redirect from={prop.path} to={prop.to} key={key} />;
      return !prop.parent ? (
        <Route path={prop.path} component={prop.component} key={key} />
      ) : (
        prop.children.map((props, key) => {
        return <Route path={props.path} component={props.component} key={key} />
        })
      );
    })}
    {/* <Redirect from="/" to="/dashboard" /> */}
  </Switch>
);

const useStyles = makeStyles(styles);

export default function Routes({ ...rest }) {
  // styles
  const classes = useStyles();
  // ref to help us initialize PerfectScrollbar on windows devices
  const mainPanel = React.createRef();
  // states and functions
  const [image] = React.useState(bgImage);
  const [color] = React.useState("blue");
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  let sidebarRoutes = routes.filter(route => route.path !== "/problems");
  return (
    <div>
      {localStorage.getItem("jorge_token") === null ||
      localStorage.getItem("jorge_token") === undefined ? (
        <Switch>
          <Route exact path="/" component={Login} />
          <Route exact path="/verify" component={Verify} />
        </Switch>
      ) : (
        <div className={classes.wrapper}>
          <Sidebar
            routes={sidebarRoutes}
            logoText={"Black Patch"}
            logo={logo}
            image={image}
            handleDrawerToggle={handleDrawerToggle}
            open={mobileOpen}
            color={color}
            {...rest}
          />
          <div className={classes.mainPanel} ref={mainPanel}>
            <Navbar
              routes={routes}
              handleDrawerToggle={handleDrawerToggle}
              {...rest}
            />
            {/* On the /maps route we want the map to be on full screen - this is not possible if the content and conatiner classes are present because they have some paddings which would make the map smaller */}

            <div className={classes.content}>
              <div className={classes.container}>{switchRoutes}</div>
            </div>

            {/* <Footer /> */}
          </div>
        </div>
      )}
    </div>
  );
}
