import * as types from './actionTypes';
import Immutable from 'seamless-immutable';

const initialState = Immutable({
  publishers: [],
  logs: [],
  activitylogs: []
});

export default function reduce(state = initialState, action = {}) {
  switch (action.type) {
    case types.PUBLISHERS_FETCHED:
      return state.merge({
        publishers: action.publishers
      });
    case types.PUBLISHER_UPDATED:
      const { publishers: _publishers } = state;
      const index = _publishers.findIndex(p => p._id === action.publisher._id);
      const publishers = [..._publishers];
      if (index === -1) {
        publishers.push(action.publisher);
      } else {
        publishers[index] = action.publisher;
      }
      return state.merge({ publishers });
    case types.PUBLISHER_LOGS_UPDATED:
      return state.merge({ logs: action.logs });
    case types.PUBLISHER_ACTIVITYLOGS_UPDATED:
      return state.merge({ activitylogs: action.activitylogs });
    case types.PUBLISHER_UPDATE_FAILED:
    case types.PUBLISHERS_FETCH_FAILED:
    case types.PUBLISHER_LOGS_UPDATED_FAILED:
      return state.merge({ error: action.error });
    case types.PUBLISHER_ACTIVITYLOGS_UPDATED_FAILED:
      return state.merge({ error: action.error });
    case types.CLEAR_ERROR:
      return state.merge({ error: {} });
    default:
      return state;
  }
}
