import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import * as userActions from '../store/user/actions';
import Login from '../components/Login';
import Main from './Main';
import AlertDialog from '../components/AlertDialog';
import * as publisherTypes from '../store/publisher/actionTypes';

class App extends Component {
  componentDidMount() {
    const authToken = sessionStorage.getItem('authToken');
    const userData = sessionStorage.getItem('userData');
    if (authToken && userData) {
      this.props.dispatch(userActions.getPublishers(authToken, userData));
    }
  }

  onLoginResponse = response => {
    const { profileObj, tokenId } = response;
    this.props.dispatch(userActions.getPublishers(tokenId, profileObj));
  };

  closeError = () => {
    this.props.dispatch({ type: publisherTypes.CLEAR_ERROR });
  };

  render() {
    const showError =
      this.props.error &&
      this.props.error.message &&
      this.props.error.message.length > 0;
    return (
      <div>
        {this.props.isLoggedIn ? (
          <Main />
        ) : (
          <Login onLoginResponse={this.onLoginResponse} />
        )}{' '}
        <AlertDialog
          open={showError}
          title="Error"
          message={this.props.error.message}
          okLabel="Close"
          onClose={this.closeError}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { user: { isLoggedIn } = {}, publisher: { error = {} } = {} } = state;
  return { isLoggedIn, error };
}

export default withRouter(connect(mapStateToProps)(App));
