import React from 'react';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Auth from './Auth';
import RoomsComponent from './RoomsComponent';
const App = () => {
  return (
    <div>
      <Router>
        <Switch>
          <Route path='/rooms' exact>
            <RoomsComponent />
          </Route>
          <Route path='/' exact>
            <Auth />
          </Route>
        </Switch>
      </Router>
    </div>
  );
};

export default App;
