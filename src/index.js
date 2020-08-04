import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';

import * as serviceWorker from './components/app/serviceWorker';

import App from './components/app/App';
import DataProvider from './components/utils/DataProvider';

import './index.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';
import 'simplebar/dist/simplebar.min.css';

const Multiverse = () => (
  <DataProvider>
    <HashRouter>
      <App />
    </HashRouter>
  </DataProvider>
);

ReactDOM.render(<Multiverse />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
