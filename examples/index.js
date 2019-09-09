/* global document */
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import Basic from './basic';
import Advanced from './advanced';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/basic/" exact component={Basic} />
        <Route path="/advanced/" component={Advanced} />
        <Route path="/">
          <nav>
            <ul>
              <li>
                <Link to="/basic/">Basic Example</Link>
              </li>
              <li>
                <Link to="/advanced/">Advanced Example</Link>
              </li>
            </ul>
          </nav>
        </Route>
      </Switch>
    </Router>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
