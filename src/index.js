import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import { Provider } from 'react-redux'
import store from './redux/store'

ReactDOM.render(
    <App/>,
    document.getElementById('root')
);

/*
REDUX code
ReactDOM.render(
    <Provider store={store}>
      <App/>,
    </Provider>,
    document.getElementById('root')
);
*/

/**
 * IF NEED TO RE-ENABLE STRICT MODE THEN UNNCOMMENT AND ADD BACK
 * 
 *   <React.StrictMode>
    <MainUpload></MainUpload>
  </React.StrictMode>,
 */

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
