import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import OffersTable from '../components/OffersTable';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

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
  paper: {
    padding: 10
  },
  textField: {
    width: 300
  },
  titleContainer: {
    marginBottom: 15
  },
  button: {
    marginTop: -10
  }
});

class Publisher extends Component {
  componentDidMount() {}

  constructor(props) {
    super();

    this.state = {
      okDisabled: true,
      offers: [],
      publisher: props.publisher || {},
      offersDidChange: false
    };
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.publisher._id && this.props.publisher._id) {
      this.setState({ publisher: this.props.publisher });
    }
  }

  onOffersChanged = offers => {
    this.setState({ offers, okDisabled: false, offersDidChange: true });
  };

  onTextFieldChange = e => {
    let { publisher: _publisher } = this.state;
    const publisher = { ..._publisher };
    publisher[e.target.id] =
      e.target.id === 'logActive' ? e.target.checked : e.target.value;
    this.setState({
      okDisabled: false,
      publisher
    });
  };

  onCancelClick = () => {
    this.props.history.replace('/');
  };

  onOkClick = () => {
    const { offers, publisher: _publisher, offersDidChange } = this.state;
    const {
      publisher: { _id = '-1' }
    } = this.props;
    const publisher = { _id, ..._publisher, offers };
    if (!offersDidChange) {
      delete publisher.offers;
    }

    this.props.dispatch(publisherActions.updatePublisher(publisher));
  };

  onLogsClick = () => {
    const { _id = '' } = this.state.publisher;
    this.props.history.push(`/publisher/${_id}/logs`);
  };

  onActivityLogsClick = () => {
    const { _id = '' } = this.state.publisher;
    this.props.history.push(`/publisher/${_id}/activitylogs`);
  };

  render() {
    const { classes } = this.props;
    const { _id, offers } = this.props.publisher;
    const {
      name = '',
      publisherToken = '',
      appStoreSharedKey = '',
      logActive = false
    } = this.state.publisher;
    return (
      <div className={classes.layout}>
        <div className={classes.titleContainer}>
          <Typography variant="display1" gutterBottom className={classes.title}>
            {_id ? `${name} - ${_id}` : 'New Publisher'}
          </Typography>
        </div>
        <Paper className={classes.paper}>
          <Grid container spacing={24}>
            <Grid item xs={12}>
              <TextField
                id="name"
                label="name"
                className={classes.textField}
                value={name}
                margin="normal"
                onChange={this.onTextFieldChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="publisherToken"
                label="publisherToken"
                className={classes.textField}
                value={publisherToken}
                margin="normal"
                onChange={this.onTextFieldChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="appStoreSharedKey"
                label="iTunes AppStoreSharedKey"
                className={classes.textField}
                value={appStoreSharedKey}
                margin="normal"
                onChange={this.onTextFieldChange}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    id="logActive"
                    color="secondary"
                    name="logActive"
                    value={logActive.toString()}
                    checked={logActive}
                    onChange={this.onTextFieldChange}
                  />
                }
                label="Logs Active"
              />
            </Grid>
            <Grid item xs={12}>
              <OffersTable
                offers={offers}
                onOffersChanged={this.onOffersChanged}
              />
            </Grid>
          </Grid>
        </Paper>
        <footer>
          <Button
            color="primary"
            autoFocus
            disabled={this.state.okDisabled}
            onClick={this.onOkClick}
          >
            Ok
          </Button>
          <Button color="primary" onClick={this.onCancelClick}>
            Cancel
          </Button>
          <Button color="primary" onClick={this.onLogsClick}>
            Logs
          </Button>
          <Button color="primary" onClick={this.onActivityLogsClick}>
            Activity Logs
          </Button>
        </footer>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const {
    match: {
      params: { id }
    }
  } = ownProps;
  const publisher =
    (state.publisher.publishers &&
      state.publisher.publishers.find(p => p._id === id)) ||
    {};
  return { publisher };
}

export default withRouter(
  connect(mapStateToProps)(withStyles(styles)(Publisher))
);
