
import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Home from './scenes/Home.js'
import About from './scenes/About.js'
import RegisterOwner from './scenes/RegisterOwner.js'
import RegisterAmbassador from './scenes/RegisterAmbassador.js'
import Checkin from './scenes/Checkin.js'
import {StripeProvider} from 'react-stripe-elements';

const App = () => (
<StripeProvider apiKey="pk_test_wqyEmC6jvICLhAUgyhubfkgD">
  <div>
    <Router>
      <div>
        <Route path="/home" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/owners/register" component={RegisterOwner} />
        <Route path="/ambassadors/register" component={RegisterAmbassador} />
        <Route path="/checkin" component={Checkin} />
      </div>
    </Router>
  </div>
</StripeProvider>

);

export default App;
