/* eslint-disable */
import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import Cluster from './components/Cluster';
import Home from './components/Home/Home';
import './App.css';


class App extends Component {
  render() {
    return (
      <div>
        <Switch>
          <Route exact path='/' component={Home} />
          <Route path='/cl' component={Cluster} />
        </Switch>
      </div>
    )
  }
}

export default App;
