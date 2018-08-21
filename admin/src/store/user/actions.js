import * as types from './actionTypes';
import axios from 'axios';
import * as publisherActionTypes from '../publisher/actionTypes';

export function getPublishers(authToken, userData) {
  return async (dispatch, getState) => {
    try {
      const url = '/publishers';
      const method = 'get';
      const Authorization = `bearer ${authToken}`;
      const headers = { Authorization };
      const result = await axios({ url, method, headers });
      const { publishers } = result.data;
      dispatch({ type: types.USER_LOGGED_IN, authToken, userData });
      dispatch({ type: publisherActionTypes.PUBLISHERS_FETCHED, publishers });
      sessionStorage.setItem('authToken', authToken);
      sessionStorage.setItem('userData', userData);
    } catch (error) {
      dispatch({ type: publisherActionTypes.PUBLISHERS_FETCH_FAILED, error });
      console.error(error);
    }
  };
}
