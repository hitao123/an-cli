import fetch from 'isomorphic-fetch';
import * as ActionTypes from '../constants/ActionTypes';

// Action Creators
const requestNews = () => ({ type: ActionTypes.FETCH_NEWS_REQUEST });
const receivedNews = news => ({ type: ActionTypes.FETCH_NEWS_SUCCESS, payload: news });
const newsError = () => ({ type: ActionTypes.FETCH_NEWS_FAILURE });

export const fetchNews = () => (dispatch, getState) => {
  dispatch(requestNews());
  return fetch("http://localhost:4000/api/news")
    .then(response => response.json())
    .then(news => dispatch(receivedNews(news)))
    .catch(err => dispatch(newsError(err)));
};