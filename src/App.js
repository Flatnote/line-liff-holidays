import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import axios from "axios";
import moment from "moment";
import React, { Component } from "react";
import "./App.css";
import MonthDialog from "./MonthDialog";

import CircularProgress from "@material-ui/core/CircularProgress";

const CircularIndeterminateStyles = makeStyles(theme => ({
  root: {
    margin: "auto",
    width: "50%"
  }
}));

function CircularIndeterminate() {
  const classes = CircularIndeterminateStyles();

  return (
    <div className={classes.root}>
      <CircularProgress />
    </div>
  );
}

const liff = window.liff;
// const liffId = "1653833629-eDvXvG9q";
// console.log(liffId);

const months = moment.months();

function pad2(number) {
  return (number < 10 ? "0" : "") + number;
}

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      userLineID: "",
      pictureUrl: "",
      statusMessage: "",
      languageDevice: "",
      versionSDK: "",
      client: "",
      isLogin: "",
      os: "",
      data: [],
      show: false,
      currentMonth: 0,
      loadData: false
    };
  }

  componentDidMount() {
    // liff
    //   .init({ liffId })
    //   .then(async () => {
    //     if (!liff.isLoggedIn()) {
    //       liff.login();
    //     }
    //   })
    //   .catch(err => {
    //     console.log(err);
    //   });
  }

  getData = month => {
    const now = moment();
    const year = now.format("YYYY");
    const monthFormat = pad2(month);
    const currentMonth = months.find((item, index) => index === month - 1);
    this.setState({ currentMonth, loadData: true });
    const url = `https://line-noti-bot.herokuapp.com/api/holidays/homeAcconuncment?year=${year}&month=${monthFormat}`;
    axios
      .get(url)
      .then(response =>
        this.setState({
          data: response.data.detail,
          show: true,
          loadData: false
        })
      )
      .catch(err => {
        console.log(err);
        this.setState({ loadData: false });
      });
  };

  getProfile() {
    liff.getProfile().then(dataInfo => {
      this.setState({
        name: dataInfo.displayName,
        userLineID: dataInfo.userId,
        pictureUrl: dataInfo.pictureUrl,
        statusMessage: dataInfo.statusMessage
      });
    });

    const languageDevice = liff.getLanguage();
    const versionSDK = liff.getVersion();
    const client = liff.isInClient();
    const isLogin = liff.isLoggedIn();
    const os = liff.getOS();

    this.setState({
      languageDevice: languageDevice,
      versionSDK: versionSDK,
      client: client === true ? "YES" : "NO",
      isLogin: isLogin === true ? "Login" : "Not Login",
      os: os
    });
  }

  // sendMessage() {
  //   liff
  //     .sendMessages([
  //       {
  //         type: "text",
  //         text: "Hi LIFF"
  //       }
  //     ])
  //     .then(() => {
  //       liff.closeWindow();
  //     });
  // }

  // closeLIFF() {
  //   liff.closeWindow();
  // }

  render() {
    const { data, show, currentMonth, loadData } = this.state;
    return (
      <div className="App">
        <div style={{ margin: 16 }} className="vertical-center">
          <AutoGrid
            callBack={this.getData}
            loading={loadData}
            currentMonth={currentMonth}
          />
        </div>
        <MonthDialog
          open={show}
          handleClose={() => this.setState({ show: false })}
          data={data}
          month={currentMonth}
        />
      </div>
    );
  }
}

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary
  }
}));

function AutoGrid(props) {
  const { callBack, loading, currentMonth } = props;
  const classes = useStyles();
  const currentIndex = months.indexOf(currentMonth);
  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        {months.map((value, index) => (
          <Grid key={value} item xs={6}>
            <DisplayCard
              headerText={value}
              index={index + 1}
              callBack={callBack}
              loading={loading}
              currentIndex={currentIndex}
            />
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

const cardStyles = makeStyles(() => ({
  root: {
    maxWidth: 345
  }
}));

function DisplayCard(props) {
  const { headerText, index, callBack, loading, currentIndex } = props;
  const classes = cardStyles();
  return (
    <Card className={classes.root}>
      <CardActionArea onClick={() => callBack(index)}>
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {loading && currentIndex + 1 === index ? (
              <CircularIndeterminate />
            ) : (
              headerText
            )}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default App;
