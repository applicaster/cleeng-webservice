import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

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

class OfferDialog extends Component {
  constructor() {
    super();
    this.state = { offer: {}, okDisabled: true };
  }

  handleClose = result => {
    const offer = result === 1 ? this.state.offer : null;
    this.props.handleClose && this.props.handleClose(offer);
    this.setState({ offer: {} });
  };

  onTextFieldChange = e => {
    let { offer } = this.state;
    offer[e.target.id] = e.target.value;
    this.setState({
      okDisabled: false,
      offer
    });
  };

  render() {
    const { classes } = this.props;
    const {
      authId,
      offerId,
      secretKey,
      appleProductId,
      androidProductId
    } = this.props.offer;
    return (
      <Dialog
        open={this.props.open}
        onClose={this.props.handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title"> </DialogTitle>
        <DialogContent>
          <Paper className={classes.paper}>
            <Grid container spacing={24}>
              <Grid item xs={12}>
                <TextField
                  id="offerId"
                  label="offerId"
                  className={classes.textField}
                  defaultValue={offerId}
                  margin="normal"
                  onChange={this.onTextFieldChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="authId"
                  label="authId"
                  className={classes.textField}
                  defaultValue={authId}
                  margin="normal"
                  onChange={this.onTextFieldChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="secretKey"
                  label="secretKey"
                  className={classes.textField}
                  defaultValue={secretKey}
                  margin="normal"
                  onChange={this.onTextFieldChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="appleProductId"
                  label="appleProductId"
                  className={classes.textField}
                  defaultValue={appleProductId}
                  margin="normal"
                  onChange={this.onTextFieldChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="androidProductId"
                  label="androidProductId"
                  className={classes.textField}
                  defaultValue={androidProductId}
                  margin="normal"
                  onChange={this.onTextFieldChange}
                  required
                />
              </Grid>
            </Grid>
          </Paper>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              this.handleClose(1);
            }}
            color="primary"
            autoFocus
            disabled={this.state.okDisabled}
          >
            Ok
          </Button>
          <Button
            onClick={() => {
              this.handleClose(0);
            }}
            color="primary"
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default withStyles(styles)(OfferDialog);