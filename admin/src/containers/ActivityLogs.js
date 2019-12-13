import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import moment from 'moment';
import * as publisherActions from '../store/publisher/actions';

const styles = theme => ({
  tableContainer: {},
  layout: {
    width: 'auto'
  },
  title: {
    display: 'inline',
    marginRight: 10
  },
  titleContainer: {
    marginBottom: 15
  },
  button: {
    marginTop: -10
  },
  timeCell: {
    minWidth: 150
  },
  dataCell: {
    maxWidth: 150
  }
});

const ACTIVITY_TYPES = [
  '',
  'Publisher added',
  'Offer added',
  'Offer removed',
  'Offer updated',
  'Publisher updated'
];

class ActivityLogs extends Component {
  componentDidMount() {
    const { id } = this.props.match.params;
    this.props.dispatch(publisherActions.getActivityLogs(id));
  }

  rowClick = id => {};

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.layout}>
        <div className={classes.titleContainer}>
          <Typography variant="display1" gutterBottom className={classes.title}>
            Activity
          </Typography>
        </div>
        <div className={classes.tableContainer}>
          <Paper>
            <Table className={classes.table} aria-labelledby="publishers">
              <TableHead>
                <TableRow>
                  <TableCell className={classes.timeCell}>Time</TableCell>
                  <TableCell className={classes.timeCell}>Action</TableCell>
                  <TableCell>User</TableCell>
                  <TableCell className={classes.dataCell}>Data</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.props.activitylogs.map(log => {
                  const { _id, activityType, user, diffData, logtime } = log;
                  return (
                    <TableRow
                      key={_id}
                      hover
                      onClick={() => {
                        this.rowClick(_id);
                      }}
                    >
                      <TableCell>
                        {moment(logtime).format('YYYY MMM DD HH:mm')}
                      </TableCell>
                      <TableCell>{ACTIVITY_TYPES[activityType]}</TableCell>
                      <TableCell>{user}</TableCell>
                      <TableCell>{JSON.stringify(diffData)}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Paper>
          <footer></footer>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { publisher: { activitylogs = [] } = {} } = state;
  return { activitylogs };
}

export default withRouter(
  connect(mapStateToProps)(withStyles(styles)(ActivityLogs))
);
