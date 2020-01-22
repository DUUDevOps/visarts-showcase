import React from 'react';
import firebase from 'firebase/app';
import firebaseApp from '../firebaseConfig';
import 'firebase/auth';
import 'firebase/firestore';

import { Alert, ButtonGroup, Spinner, Button, Form, FormGroup, Label, Input, Container } from 'reactstrap';
import Rating from 'react-rating';
import VotingAllSubmissions from './VotingAllSubmissions';


const initialState = {
    submissions: [],
    unvotedSubmissions: [],
    currentSubmission: {},
    currentVote: null,
    unVotedOn: true, 
    failedSubmission: false
};

class VotingMain extends React.Component{
    

    constructor(props){
        super(props);
        this.state = initialState;

        this.currentUser = this.props.user;
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChangeVote = this.handleChangeVote.bind(this);
        this.handleNext = this.handleNext.bind(this);
        this.handlePrevious = this.handlePrevious.bind(this);

        this.handleUnvotedOnState = this.handleUnvotedOnState.bind(this);
        this.validateSubmission = this.validateSubmission.bind(this);
    }

    componentDidMount(){
        console.log("Component mounted");
        const submissionsRef = firebaseApp.database().ref(`submissions/${new Date().getFullYear()}`);
        const voterRef = firebaseApp.database().ref(`voters/${new Date().getFullYear()}/${this.currentUser.uid}/votes`)
        voterRef.on('value', (snapshot) => console.log("VOTE", snapshot.val()));
        
        submissionsRef.on('value', (snapshot) => {
            let submissions = snapshot.val();
            let newState = [];
            let unvotedState = [];
            for (let submission in submissions){

                var objToAdd = {...submissions[submission], ...{id: submission}};
                newState.push(objToAdd);

                voterRef.on('value', (snap) => {
                    if ((snap.val() == null) || !(submission in snap.val())){
                        unvotedState.push(objToAdd);
                    }
                })
                
            }

            this.setState({
                submissions: newState,
                unvotedSubmissions: unvotedState,
                currentSubmission: unvotedState[0]
            });


        });
    }

    handleUnvotedOnState(event){
        if (event.target.textContent == 'All submissions'){
            this.setState({
                unVotedOn: false
            })
        }
        else{
            this.setState({
                unVotedOn: true
            })
        }
    }

    validateSubmission(event){
        event.preventDefault();

        if (this.state.currentVote == null){
            this.setState({failedSubmission: true});
        }
        else{
            this.handleSubmit(event);
        }
    }

    handleSubmit(event){
        event.preventDefault();


        var votersRef = firebaseApp.database().ref(`voters/${new Date().getFullYear()}/${this.currentUser.uid}/votes`);
        var vote = {
            [this.state.currentSubmission.id]: this.state.currentVote 
        };

        var newUnvotedArr = [...this.state.unvotedSubmissions];
        var indexToRemove = newUnvotedArr.indexOf(this.state.currentSubmission);

        if (indexToRemove > -1){
            newUnvotedArr.splice(indexToRemove, 1)
            this.setState({
                    unvotedSubmissions: newUnvotedArr
                }, () => {

                if (this.state.unvotedSubmissions.length == 0){
                    this.setState({currentSubmission: null});
                }
                else{
                    if (!this.handleNext()){
                        this.handlePrevious();
                    }
                }
            });
        }

        votersRef.update(vote).then(() => console.log('Pushed vote successful', this.state.currentVote));
    }

    handleNext(event){
        var index = this.state.unvotedSubmissions.indexOf(this.state.currentSubmission);
        if(index + 1 >= 0 && index + 1 < this.state.unvotedSubmissions.length){
            this.setState({
                currentSubmission: this.state.unvotedSubmissions[index + 1],
                currentVote: null,
                failedSubmission: false

            });
            return true;
        }
        return false;
    }
    handlePrevious(event){
        var index = this.state.unvotedSubmissions.indexOf(this.state.currentSubmission);
        if(index - 1 >= 0 && index - 1 < this.state.unvotedSubmissions.length){
            this.setState({
                currentSubmission: this.state.unvotedSubmissions[index - 1],
                currentVote: null,
                failedSubmission: false

            });
            return true;
        }
        return false;

    }

    handleChangeVote(value){
        this.setState({
            currentVote: value
        });
    }

    render(){
        if (this.state.currentSubmission == null && this.state.unVotedOn){
            return (
                <div>
                <ButtonGroup>
                    <Button outline color="primary" onClick={this.handleUnvotedOnState} active={this.state.unVotedOn == false}>All submissions</Button>
                    <Button outline color="primary" onClick={this.handleUnvotedOnState} active={this.state.unVotedOn == true}>Unvoted</Button>
                </ButtonGroup>
                <h4>Hello, {this.currentUser.displayName}! There are no more submissions to rate at this time.</h4>
                </div>
            );
        }
        if (this.state.unVotedOn == false){
            return (
                <div>
                    <ButtonGroup>
                        <Button outline color="primary" onClick={this.handleUnvotedOnState} active={this.state.unVotedOn == false}>All submissions</Button>
                        <Button outline color="primary" onClick={this.handleUnvotedOnState} active={this.state.unVotedOn == true}>Unvoted</Button>
                    </ButtonGroup>
                    <VotingAllSubmissions user={this.currentUser} year={new Date().getFullYear()}/>

                </div>
            );
        }
        return(
            <div>
                <ButtonGroup>
                    <Button outline color="primary" onClick={this.handleUnvotedOnState} active={this.state.unVotedOn == false}>All submissions</Button>
                    <Button outline color="primary" onClick={this.handleUnvotedOnState} active={this.state.unVotedOn == true}>Unvoted</Button>
                </ButtonGroup>
                
                <div>
                <h3>Hello, {this.currentUser.displayName}! Please submit a vote for the following {this.state.unvotedSubmissions.length} submission(s).</h3>
                <div className="inline">
                    <Button outline color="secondary" onClick={this.handlePrevious}>Previous</Button>
                    {/* <h4>{this.state.unvotedSubmissions.indexOf(this.state.currentSubmission)+1}/{this.state.unvotedSubmissions.length}</h4> */}
                    <Button outline color="secondary" onClick={this.handleNext}>Next</Button>
                </div>
                <a href={this.state.currentSubmission.url} target="_blank">
                        <img src={this.state.currentSubmission.url} height="200"/>
                    </a>
                <div className="containerVoting">
                    
                    <p><i>(Click to enlarge)</i></p>
                    <div align="left">
                        <p><b>Title:</b> {this.state.currentSubmission.title}</p>
                        <p><b>Description:</b> {this.state.currentSubmission.description}</p>
                        <p><b>Medium:</b> {this.state.currentSubmission.medium}</p>
                        <p><b>Dimensions:</b> {this.state.currentSubmission.dimensions}</p>
                        <p><b>Your vote:</b> <Rating placeholderRating={this.state.currentVote} onChange={this.handleChangeVote}/></p>
                        {
                            this.state.failedSubmission ?
                            <Alert color="danger">Error! Please select a rating before submitting.</Alert> : ''
                        }
                    </div>
                    <Form onSubmit={this.validateSubmission}>
                        <Button color="primary" type="submit">Submit Vote</Button>

                    </Form>
                    {/* <button onClick={() => {console.log(this.state)}}>Get the fuckin state</button> */}
                
                </div>
                </div>
                

            </div>
        );
    }
}
export default VotingMain;