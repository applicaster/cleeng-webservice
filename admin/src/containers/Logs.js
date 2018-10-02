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
import Button from '@material-ui/core/Button';
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
  }
});

class Logs extends Component {
  componentDidMount() {
    const { id } = this.props.match.params;
    this.props.dispatch(publisherActions.getLogs(id));
  }

  onClearLogsClick = () => {
    const { id } = this.props.match.params;
    this.props.dispatch(publisherActions.clearLogs(id));
  };

  rowClick = id => {};

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.layout}>
        <div className={classes.titleContainer}>
          <Typography variant="display1" gutterBottom className={classes.title}>
            Requests
          </Typography>
        </div>
        <div className={classes.tableContainer}>
          <Paper>
            <Table className={classes.table} aria-labelledby="publishers">
              <TableHead>
                <TableRow>
                  <TableCell>Url</TableCell>
                  <TableCell>Method</TableCell>
                  <TableCell>Headers</TableCell>
                  <TableCell>Body</TableCell>
                  <TableCell>Time</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.props.reqlogs.map(reqlog => {
                  const { _id, url, method, headers, body, reqtime } = reqlog;
                  return (
                    <TableRow
                      key={_id}
                      hover
                      onClick={() => {
                        this.rowClick(_id);
                      }}
                    >
                      <TableCell>{url}</TableCell>
                      <TableCell>{method}</TableCell>
                      <TableCell>{headers}</TableCell>
                      <TableCell>{body}</TableCell>
                      <TableCell>
                        {moment(reqtime).format('YYYY MMM DD HH:mm')}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Paper>
          <footer>
            <Button color="primary" onClick={this.onClearLogsClick}>
              Clear Logs
            </Button>
          </footer>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { publisher: { logs: reqlogs = [] } = {} } = state;
  return { reqlogs };
}

export default withRouter(connect(mapStateToProps)(withStyles(styles)(Logs)));
