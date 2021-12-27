import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Provider } from 'react-redux'
import { BrowserRouter, Route } from "react-router-dom";
import store from "./store";
import * as serviceWorker from './serviceWorker';
import "assets/css/material-dashboard-react.css";
 
ReactDOM.render(<Provider store={store}><BrowserRouter>
    {App.map((prop, key) => {
      return <Route to={prop.path} component={prop.component} key={key} />;
    })}
    </BrowserRouter></Provider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
