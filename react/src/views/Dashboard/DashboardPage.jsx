import React, { useState, useEffect } from "react";
import { API_URL } from "../../config";
// react plugin for creating charts
import ChartistGraph from "react-chartist";
import { Pie } from "react-chartjs-2";
// @material-ui/core
import { makeStyles } from "@material-ui/core/styles";

// @material-ui/icons
import PersonIcon from "@material-ui/icons/Person";
import MoneyIcon from "@material-ui/icons/MonetizationOn";
import Technician from "@material-ui/icons/EmojiPeople";
import LibraryBooksIcon from "@material-ui/icons/LibraryBooks";
import ScheduleIcon from "@material-ui/icons/Schedule";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import ClearIcon from "@material-ui/icons/Clear";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import FilterListIcon from "@material-ui/icons/FilterList";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
// import { bugs, website, server } from "variables/general.js";

import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js";

const useStyles = makeStyles(styles);
const filterFields = [
  { name: "weekly", label: "Weekly" },
  { name: "monthly", label: "Monthly" },
  { name: "yearly", label: "Yearly" },
];
export default function Dashboard() {
  const classes = useStyles();
  const [dashboardData, dashboardFunc] = useState({});
  const [dailyBookingData, dailyBookingFunc] = useState({});
  const [weeklyBookingData, weeklyBookingFunc] = useState({});
  const [monthlyBookingData, monthlyBookingFunc] = useState({});
  const [yearlyBookingData, yearlyBookingFunc] = useState({});
  const [earningsData, earningsDataFunc] = useState({});
  const [dailyCompBookingData, dailyCompBookingFunc] = useState({});
  const [weeklyCompBookingData, weeklyCompBookingFunc] = useState({});
  const [monthlyCompBookingData, monthlyCompBookingFunc] = useState({});
  const [yearlyCompBookingData, yearlyCompBookingFunc] = useState({});
  const [earningsCompData, earningsCompDataFunc] = useState({});
  const [completeBookingData, completeBookingFunc] = useState({});
  const [ageUserData, ageUserDataFunc] = useState({});
  const [ageTechData, ageTechDataFunc] = useState({});
  const [genderUserData, genderUserDataFunc] = useState({});
  const [genderTechData, genderTechDataFunc] = useState({});
  const [iosData, iosDataFunc] = useState({});
  const [androidData, androidDataFunc] = useState({});
  const [huwaeiData, huwaeiDataFunc] = useState({});
  const [drawOpen, drawOpenState] = useState(false);
  const [selectedDailyFilter, selectedDailyFilterState] = useState(false);
  const [selectedCompletedFilter, selectedCompletedFilterState] = useState(
    false
  );

  // const cryptr_key =
  //   "$%^&*###$$T$%%^$T$%ecece22121cecc12c12ec###-black-patch-app-**--**098789089898989";
  const token = localStorage.getItem("jorge_token");
  useEffect(() => {
    fetch(`${API_URL}/cms/count_data`, {
      method: "GET",
      headers: {
        Authorization: "Token" + token,
      },
    })
      .then((res) => res.json())
      .then((response) => {
        dashboardFunc(response);
        dailyBookingFunc(response.dailyBookingData);
        weeklyBookingFunc(response.weeklyBookingData);
        monthlyBookingFunc(response.monthlyBookingData);
        yearlyBookingFunc(response.yearlyBookingData);
        earningsDataFunc(response.dailyBookingData);
        let ageUserlabels = [];
        response.user_data &&
          response.user_data.map((data, index) => {
            return ageUserlabels.push(data.range);
          });
        let ageUserdataval = [];
        response.user_data &&
          response.user_data.map((data, index) => {
            return ageUserdataval.push(data.count);
          });
        let ageUserData = {
          labels: ageUserlabels,
          datasets: [
            {
              data: ageUserdataval,
              backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
              hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
            },
          ],
        };

        let ageTechlabels = [];
        response.technician_data &&
          response.technician_data.map((data, index) => {
            return ageTechlabels.push(data.range);
          });
        let ageTechdataval = [];
        response.technician_data &&
          response.technician_data.map((data, index) => {
            return ageTechdataval.push(data.count);
          });
        let ageTechData = {
          labels: ageTechlabels,
          datasets: [
            {
              data: ageTechdataval,
              backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
              hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
            },
          ],
        };

        let genderUserlabels = Object.keys(response.user_male_female[0]);
        let popgenderUserlabels = genderUserlabels.pop();
        let genderUserdataval = Object.values(response.user_male_female[0]);
        let popgenderUserdataval = genderUserdataval.pop();
        let genderUserData = {
          labels: genderUserlabels,
          datasets: [
            {
              data: genderUserdataval,
              backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
              hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
            },
          ],
        };

        let genderTechlabels = Object.keys(response.technician_male_female[0]);
        let popgenderTechlabels = genderTechlabels.pop();
        let genderTechdataval = Object.values(
          response.technician_male_female[0]
        );
        let popgenderTechdataval = genderTechdataval.pop();
        let genderTechData = {
          labels: genderTechlabels,
          datasets: [
            {
              data: genderTechdataval,
              backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
              hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
            },
          ],
        };

        fetch(`${API_URL}/model/modelCount`, {
          method: "GET",
          headers: {
            Authorization: "Token" + token,
          },
        })
          .then((res) => res.json())
          .then((response) => {
            let ioslabels = [];
            let iosdataval = [];
            let androidlabels = [];
            let androiddataval = [];
            let huwaeilabels = [];
            let huwaeidataval = [];
            // response.ios_data.map((data, index) => {
            //   ioslabels.push(Object.keys(data)[0]);
            //   iosdataval.push(Object.values(data)[0]);
            //   return null;
            // });
            // response.android_data.map((data, index) => {
            //   androidlabels.push(Object.keys(data)[0]);
            //   androiddataval.push(Object.values(data)[0]);
            //   return null;
            // });
            // response.huwaei_data.map((data, index) => {
            //   huwaeilabels.push(Object.keys(data)[0]);
            //   huwaeidataval.push(Object.values(data)[0]);
            //   return null;
            // });
            let iosData = {
              labels: ioslabels,
              datasets: [
                {
                  data: iosdataval,
                  backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
                  hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
                },
              ],
            };
            let androidData = {
              labels: androidlabels,
              datasets: [
                {
                  data: androiddataval,
                  backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
                  hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
                },
              ],
            };
            let huwaeiData = {
              labels: huwaeilabels,
              datasets: [
                {
                  data: huwaeidataval,
                  backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
                  hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
                },
              ],
            };

            iosDataFunc(iosData);
            androidDataFunc(androidData);
            huwaeiDataFunc(huwaeiData);
          });

        dailyCompBookingFunc(response.dailyCompBookingData);
        weeklyCompBookingFunc(response.weeklyCompBookingData);
        monthlyCompBookingFunc(response.monthlyCompBookingData);
        yearlyCompBookingFunc(response.yearlyCompBookingData);
        earningsCompDataFunc(response.yearlyCompBookingData);
        ageUserDataFunc(ageUserData);
        ageTechDataFunc(ageTechData);
        genderTechDataFunc(genderTechData);
        genderUserDataFunc(genderUserData);
      })
      .catch((error) => console.log(error));
  }, []);

  const toggleDrawer = () => {
    drawOpenState(!drawOpen);
  };
  const handleActions = (e, name) => {

    const type = e.target.value;
    if (name === "daily") {
        if(type == "weekly") earningsDataFunc(weeklyBookingData);
        else if(type == "monthly") earningsDataFunc(monthlyBookingData);
        else if(type == "yearly") earningsDataFunc(yearlyBookingData);
        else earningsDataFunc(dailyBookingData);
      selectedDailyFilterState(e.target.value);
    } else {
        if(type == "weekly") earningsCompDataFunc(weeklyCompBookingData);
        else if(type == "monthly") earningsCompDataFunc(monthlyCompBookingData);
        else if(type == "yearly") earningsCompDataFunc(yearlyCompBookingData);
        else earningsCompDataFunc(dailyCompBookingData);
      selectedCompletedFilterState(e.target.value);
    }
  };
  const list = (tag) => (
    <span>
      {tag === "daily" ? (
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={selectedDailyFilter}
          onChange={(e) => handleActions(e, "daily")}
        >
          <MenuItem value="">None</MenuItem>
          {filterFields.map((item) => {
            return <MenuItem value={item.name}>{item.label}</MenuItem>;
          })}
        </Select>
      ) : (
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={selectedCompletedFilter}
          onChange={(e) => handleActions(e, "completed")}
        >
          <MenuItem value="">None</MenuItem>
          {filterFields.map((item) => {
            return <MenuItem value={item.name}>{item.label}</MenuItem>;
          })}
        </Select>
      )}
    </span>
  );

  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={6} md={4}>
          <Card>
            <CardHeader color="warning" stats icon>
              <CardIcon color="warning">
                <PersonIcon />
              </CardIcon>
              <p className={classes.cardCategory}>User</p>
              <h3 className={classes.cardTitle}>{dashboardData.user}</h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                Total number of users on the platform
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={4}>
          <Card>
            <CardHeader color="success" stats icon>
              <CardIcon color="success">
                <Technician />
              </CardIcon>
              <p className={classes.cardCategory}>Technician</p>
              <h3 className={classes.cardTitle}>{dashboardData.technician}</h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                Total number of technicians on the platform
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={4}>
          <Card>
            <CardHeader color="info" stats icon>
              <CardIcon color="info">
                <LibraryBooksIcon />
              </CardIcon>
              <p className={classes.cardCategory}>Total Bookings</p>
              <h3 className={classes.cardTitle}>
                {dashboardData.total_booking}
              </h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>Total added bookings</div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="success" stats icon>
              <CardIcon color="success">
                <ScheduleIcon />
              </CardIcon>
              <p className={classes.cardCategory}>Active Bookings</p>
              <h3 className={classes.cardTitle}>
                {dashboardData.inprohress_booking}
              </h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>No. of active bookings</div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="primary" stats icon>
              <CardIcon color="primary">
                <CheckCircleOutlineIcon />
              </CardIcon>
              <p className={classes.cardCategory}>Completed Bookings</p>
              <h3 className={classes.cardTitle}>
                {dashboardData.complete_booking}
              </h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>No. of completed bookings</div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="danger" stats icon>
              <CardIcon color="danger">
                <ClearIcon />
              </CardIcon>
              <p className={classes.cardCategory}>Rejected Bookings</p>
              <h3 className={classes.cardTitle}>
                {dashboardData.reject_booking}
              </h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>No. of rejected bookings</div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="success" stats icon>
              <CardIcon color="success">
                <MoneyIcon />
              </CardIcon>
              <p className={classes.cardCategory}>Total Earnings</p>
              <h3 className={classes.cardTitle}>
                {dashboardData.earnings}
              </h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>Total earnings</div>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
      <GridContainer>
        <GridItem xs={12} sm={12} md={6}>
          <Card chart>
            <CardHeader color="warning">
              <ChartistGraph
                className="ct-chart"
                data={earningsData}
                type="Bar"
              />
            </CardHeader>
            <CardBody>
              <h4 className={classes.cardTitle}>Daily Earnings</h4>
              <FilterListIcon onClick={() => toggleDrawer()} />
              {drawOpen && list("daily")}
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={6}>
          <Card chart>
            <CardHeader color="success">
              <ChartistGraph
                className="ct-chart"
                data={earningsCompData}
                type="Bar"
              />
            </CardHeader>
            <CardBody>
              <h4 className={classes.cardTitle}>Completed Bookings</h4>
              <FilterListIcon onClick={() => toggleDrawer()} />
              {drawOpen && list("completed")}
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
      <GridContainer>
        <GridItem xs={12} sm={12} md={6}>
          <Card chart>
            <CardHeader color="warning">
              <Pie data={ageUserData} />
            </CardHeader>
            <CardBody>
              <h4 className={classes.cardTitle}>User Age</h4>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={6}>
          <Card chart>
            <CardHeader color="success">
              <Pie data={ageTechData} />
            </CardHeader>
            <CardBody>
              <h4 className={classes.cardTitle}>Technician Age</h4>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>

      <GridContainer>
        <GridItem xs={12} sm={12} md={6}>
          <Card chart>
            <CardHeader color="warning">
              <Pie data={genderUserData} />
            </CardHeader>
            <CardBody>
              <h4 className={classes.cardTitle}>User Gender</h4>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={6}>
          <Card chart>
            <CardHeader color="success">
              <Pie data={genderTechData} />
            </CardHeader>
            <CardBody>
              <h4 className={classes.cardTitle}>Technician Gender</h4>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>

      {/* <GridContainer>
        <GridItem xs={12} sm={12} md={6}>
          <Card chart>
            <CardHeader color="warning">
              <Pie data={iosData} />
            </CardHeader>
            <CardBody>
              <h4 className={classes.cardTitle}>IOS Models</h4>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={6}>
          <Card chart>
            <CardHeader color="success">
              <Pie data={androidData} />
            </CardHeader>
            <CardBody>
              <h4 className={classes.cardTitle}>Android Models</h4>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
      <GridContainer>
        <GridItem xs={12} sm={12} md={6}>
          <Card chart>
            <CardHeader color="info">
              <Pie data={huwaeiData} />
            </CardHeader>
            <CardBody>
              <h4 className={classes.cardTitle}>Huawei Models</h4>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer> */}
    </div>
  );
}
