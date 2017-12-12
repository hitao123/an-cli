import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import favicon from 'serve-favicon';
import compression from 'compression';
import path from 'path';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import { RouterContext, match } from 'react-router';
import serialize from 'serialize-javascript';
import routes from '../shared/configs/routes';
import configureStore from '../shared/stores/configureStore';
import { fetchNews } from '../shared/actions';
import App from '../shared/pages/App';
import api from '../server/api';

const app = express();
const port = 4000;

// 添加响应头 解决跨域问题
app.all('*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
  next();
});
// 中间件
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(favicon(path.join(__dirname, '../..', 'public', 'favicon.ico')));

app.use(express.static("public"));
app.use('/api', api);

app.get('*', handleRender);

// react-router SSR match router function
function handleRender(req, res) {
  match({ routes: routes, location: req.url }, (err, redirectLocation, renderProps) => {
    if (err) {
      res.status(500).end(`server error: ${err}`);
    } else if (redirectLocation) {
      res.redirect(redirectLocation.pathname + redirectLocation.search);
    } else if (renderProps) {
      const store = configureStore();
      Promise.all([
        store.dispatch(fetchNews())
      ]).then(() => {
        const html = renderToString(
          <Provider store={store}>
            <RouterContext {...renderProps} />
          </Provider>
        );
        const finalState = store.getState();
        res.status(200);
        res.end(renderFullPage(html, finalState));
      }).catch((err) => {
        console.log(err);
      });
    } else {
      res.status(404).end('404 not found');
    }
  });
  // 这里处理中间件出现问题 https://stackoverflow.com/questions/7042340/error-cant-set-headers-after-they-are-sent-to-the-client
  // next();  
}

function renderFullPage(html, initState) {
  return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <title>react-ssr</title>
          <link rel="stylesheet" href="/css/main.css">
          <script src="/bundle.js" defer></script>
      </head>
      <body>
          <div id="reactInit"><div>${html}</div></div>
          <script>
            window.__INITIAL_STATE__ = ${serialize(initState)}
          </script>
      </body>
      </html>
    `;
}

app.listen(port, err => {
  if (err) {
    console.error(err);
  } else {
    console.info(`server listeing at port: ${port}`);
  }
});