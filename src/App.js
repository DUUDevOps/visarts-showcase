import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import SubmissionForm from './Components/SubmissionForm';
import VotingSignIn from './Components/VotingSignIn';



function App() {
  return (
    <div>
      <header>VisArts Spring 2020 Showcase Submission</header>
      <Router>
        <Switch>
          <Route exact path="/">
            <SubmissionForm />
          </Route>

          <Route path="/voting">
            <VotingSignIn />
          </Route>
        </Switch>
      </Router>


    </div>
  );
}

export default App;
