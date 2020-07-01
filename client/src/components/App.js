import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import './App.css';
import AboutPage from './About';
import Fib from './Fib';

class App extends Component {
  render() {
    return (
      <Router>
        <div className='App'>
          <header className='App-header'>
            <Link to='/' style={{ margin: '0 20px' }}>
              Home
            </Link>
            <Link to='/about'>About Me</Link>
          </header>
          <br />
          <div>
            <Route exact path='/' component={Fib} />
            <Route path='/about' component={AboutPage} />
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
