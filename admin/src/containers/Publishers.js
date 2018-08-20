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
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import { Link } from 'react-router-dom';
import moment from 'moment';

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

class Publishers extends Component {
  componentDidMount() {}

  rowClick = id => {
    this.props.history.push(`/publisher/${id}`);
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.layout}>
        <div className={classes.titleContainer}>
          <Typography variant="display1" gutterBottom className={classes.title}>
            Publishers
          </Typography>
          <Button
            mini
            variant="fab"
            color="primary"
            aria-label="Add"
            className={classes.button}
            component={Link}
            to="/publisher/-1"
          >
            <AddIcon />
          </Button>
        </div>
        <div className={classes.tableContainer}>
          <Paper>
            <Table className={classes.table} aria-labelledby="publishers">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>PublisherId</TableCell>
                  <TableCell>Last Updated By</TableCell>
                  <TableCell>Last Update Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.props.publishers.map(publisher => {
                  const { _id, name, updatedBy, updatedAt } = publisher;
                  return (
                    <TableRow
                      key={_id}
                      hover
                      onClick={() => {
                        this.rowClick(_id);
                      }}
                    >
                      <TableCell>{name}</TableCell>
                      <TableCell>{_id}</TableCell>
                      <TableCell>{updatedBy}</TableCell>
                      <TableCell>
                        {updatedAt &&
                          moment(updatedAt).format('YYYY MMM DD HH:mm')}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Paper>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { publisher: { publishers = [] } = {} } = state;
  return { publishers };
}

export default withRouter(
  connect(mapStateToProps)(withStyles(styles)(Publishers))
);
