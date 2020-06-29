import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import Fib from './Fib';
import About from './About';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Route exact path='/' component={Fib} />
        <Route exact path='/about' component={About} />
      </BrowserRouter>
    </div>
  );
}

export default App;
