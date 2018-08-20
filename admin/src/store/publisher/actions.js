import * as types from './actionTypes';
import axios from 'axios';
import history from '../../utils/history';

export function updatePublisher(publisherData) {
  return async (dispatch, getState) => {
    try {
      const url = '/publisher';
      const method = 'post';
      const { authToken } = getState().user;
      const Authorization = `bearer ${authToken}`;
      const headers = { Authorization };
      const data = { publisher: publisherData };
      const result = await axios({ url, method, headers, data });
      const { publisher } = result.data;
      dispatch({ type: types.PUBLISHER_UPDATED, publisher });
      history.replace('/');
    } catch (error) {
      dispatch({ type: types.PUBLISHER_UPDATE_FAILED, error });
      console.error(error);
    }
  };
}
