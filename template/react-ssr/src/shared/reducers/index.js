import * as ActionTypes from '../constants/ActionTypes';

// Reducer
export default function reducer(state = {}, action) {
  switch (action.type) {
    case ActionTypes.FETCH_NEWS_SUCCESS:
      return { ...state, news: action.payload };
    default:
      return state;
  }
}