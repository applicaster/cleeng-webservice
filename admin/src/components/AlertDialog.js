import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

class AlertDialog extends React.Component {
  handleClose = result => {
    this.props.onClose && this.props.onClose(result);
  };

  render() {
    return (
      <div>
        <Dialog
          open={this.props.open || false}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{this.props.title}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {this.props.message}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            {this.props.cancelLabel && (
              <Button
                onClick={() => {
                  this.handleClose(0);
                }}
                color="primary"
              >
                {this.props.cancelLabel}
              </Button>
            )}

            <Button
              onClick={() => {
                this.handleClose(1);
              }}
              color="primary"
              autoFocus
            >
              {this.props.okLabel}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default AlertDialog;
