import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, Link, BrowserRouter as Router } from 'react-router-dom';
import SubmissionForm from './Components/SubmissionForm';
import VotingSignIn from './Components/VotingSignIn';



function App() {
  return (
    <div>
      <header>VisArts Spring 2020 Showcase Submission</header>

      <Router>
        <div>
          <Route exact path="/" component={SubmissionForm} />
          <Route path="/voting" component={VotingSignIn} />
        </div>
        
      </Router>


    </div>
  );
}

export default App;
