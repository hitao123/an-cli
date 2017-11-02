// import { combineReducers } from 'redux';
import * as types from "../constants/ActionTypes";
import objectAssign from "object-assign";

var defaultState = {
  isFetching: false,
  data: []
};

function reducers(defaultState, action) {
  switch (action.type) {
    case types.REQUEST_TOPIC:
      return objectAssign({}, defaultState, {
        isFetching: true
      });
    case types.RECEIVE_TOPIC:
      return objectAssign({}, defaultState, {
        isFetching: false,
        data: action.data
      });
    default:
      return defaultState;
  }
}

export default reducers;

// export default combineReducers({
//
//})
