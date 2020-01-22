import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { HashRouter, Route, Link } from 'react-router-dom';
import SubmissionForm from './Components/SubmissionForm';
import VotingSignIn from './Components/VotingSignIn';
import AdminSignIn from './Components/AdminSignIn';



function App() {
  return (
    // <div className="App-style">

      <HashRouter basename='/' className="App-style">
          <Route exact path="/" component={SubmissionForm} />
          <Route path="/voting" component={VotingSignIn} />
          <Route path="/admin" component={AdminSignIn} />
      </HashRouter>


    // </div>
  );
}

export default App;
