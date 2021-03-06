import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Publishers from '../containers/Publishers';
import Publisher from '../containers/Publisher';
import Logs from './Logs';
import ActivityLogs from './ActivityLogs';

const styles = theme => ({
  root: {
    flexGrow: 1,
    zIndex: 1,
    overflow: 'hidden',
    position: 'absolute',
    display: 'flex',
    width: '100%'
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
    marginTop: 60
  },
  title: {
    flexGrow: 1
  }
});

class Main extends Component {
  render() {
    const { classes = {} } = this.props;
    return (
      <div className={classes.root}>
        <AppBar position="absolute" className={classes.appBar}>
          <Toolbar>
            <Typography
              variant="title"
              color="inherit"
              noWrap
              className={classes.title}
            >
              Applicaster/Cleeng Admin Dashboard
            </Typography>
          </Toolbar>
        </AppBar>
        <main className={classes.content}>
          <Switch>
            <Route exact path="/" component={Publishers} />
            <Route exact path="/publisher/:id/logs" component={Logs} />
            <Route
              exact
              path="/publisher/:id/activitylogs"
              component={ActivityLogs}
            />
            <Route path="/publisher/:id" component={Publisher} />
          </Switch>
        </main>
      </div>
    );
  }
}

Main.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(Main);
