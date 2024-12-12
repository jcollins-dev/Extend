import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import 'normalize.css';
import './index.css';

//Import i18n.ts
import './i18n';

import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';

import { Provider } from 'react-redux';

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { default as store } from 'store';
import { Loader } from 'components';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <DndProvider debugMode={true} backend={HTML5Backend}>
        <Suspense fallback={<Loader />}>
          <App />
        </Suspense>
      </DndProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
