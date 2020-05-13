import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Main from './Main.js';
import * as serviceWorker from './serviceWorker';
import { HashRouter as Router, Switch, Route, useParams } from 'react-router-dom';

function App() {
  let {sheetId} = useParams();
  return <Main sheetId={sheetId}/>
}

ReactDOM.render(
  <React.StrictMode>
    <Router basename='/'>
      <Switch>
        <Route path='/:sheetId' children={<App />} />
        <Route path='/'><Main /></Route>
      </Switch>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
