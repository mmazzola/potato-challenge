import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router,Route, Switch} from 'react-router-dom';
import './index.css';
import {DetailPost} from './DetailPost.js';
import {MainView} from './MainView.js';
const DETAIL_URL = "/detail"

ReactDOM.render(
  <Router>
  <div className="fullscreen">
    <div id="container">
      <h1 className="list-header">Potatoes on Flickr</h1>
        <Switch>
          <Route exact path="/" component={MainView} />
          <Route path={DETAIL_URL} component={DetailPost} />
        </Switch>
    </div>
  </div>
  </Router>, document.getElementById('root'));