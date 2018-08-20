import * as types from './actionTypes';
import Immutable from 'seamless-immutable';

const initialState = Immutable({
  userData: {},
  authToken: '',
  isLoggedIn: false
});

export default function reduce(state = initialState, action = {}) {
  switch (action.type) {
    case types.USER_LOGGED_IN:
      return state.merge({
        userData: action.userData,
        authToken: action.authToken,
        isLoggedIn: true
      });
    case types.USER_LOGGED_OUT:
      return state.merge({
        userData: {},
        authToken: '',
        isLoggedIn: false
      });
    default:
      return state;
  }
}
