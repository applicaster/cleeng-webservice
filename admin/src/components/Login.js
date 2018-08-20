import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { GoogleLogin } from 'react-google-login';

const styles = theme => ({
  layout: {
    width: 'auto',
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto'
    }
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme
      .spacing.unit * 3}px`
  },
  title: {
    marginBottom: theme.spacing.unit * 3
  }
});

class Login extends Component {
  responseGoogle = response => {
    this.props.onLoginResponse(response);
  };

  render() {
    const { classes } = this.props;
    const googleClientId =
      process.env.NODE_ENV === 'production'
        ? '7448824555-sr9k7pjd8t561q88fck00v3jg6h2tnor.apps.googleusercontent.com'
        : '7448824555-vqlj6r0153smnhujq7iaf5h1k2aobqr8.apps.googleusercontent.com';

    return (
      <div className={classes.layout}>
        <Paper className={classes.paper}>
          <Typography variant="headline" className={classes.title}>
            Sign in
          </Typography>

          <GoogleLogin
            clientId={googleClientId}
            buttonText="Login"
            onSuccess={this.responseGoogle}
            onFailure={this.responseGoogle}
          />
        </Paper>
      </div>
    );
  }
}

Login.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(Login);
