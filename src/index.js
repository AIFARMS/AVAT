import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

import { Provider } from 'react-redux'
import store from './store'

//REDUX code
createRoot(document.getElementById('root')).render(
    <Provider store={store}>
      <App/>
    </Provider>
);


/**
 * IF NEED TO RE-ENABLE STRICT MODE THEN UNNCOMMENT AND ADD BACK
 * 
 *   <React.StrictMode>
    <MainUpload></MainUpload>
  </React.StrictMode>,
 */
