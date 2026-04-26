import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

import { Provider } from 'react-redux'
import store from './store'

/* ReactDOM.render(
    <App/>,
    document.getElementById('root')
);
 */

//REDUX code
ReactDOM.render(
    <Provider store={store}>
      <App/>
    </Provider>,
    document.getElementById('root')
);


/**
 * IF NEED TO RE-ENABLE STRICT MODE THEN UNNCOMMENT AND ADD BACK
 * 
 *   <React.StrictMode>
    <MainUpload></MainUpload>
  </React.StrictMode>,
 */
