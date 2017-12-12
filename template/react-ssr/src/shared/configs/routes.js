import React from 'react';
import { Route, IndexRoute } from 'react-router';
import Home from '../pages/home';
import News from '../pages/news';
import App from '../pages/App';

const routes = (
  <Route path="/" component={App}>
    <IndexRoute component={Home} />
    <Route path="/news" component={News} />
  </Route>
);

export default routes;