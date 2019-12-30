import React from 'react';
import firebase from 'firebase/app';
import firebaseApp from '../firebaseConfig';
import 'firebase/auth';
import 'firebase/firestore';

import { Button, Form, FormGroup, Label, Input, Container } from 'reactstrap';
import Rating from 'react-rating';


const initialState = {
    submissions: [],
    unvotedSubmissions: [],
    currentSubmission: {},
    currentVote: null,
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
    }

    componentDidMount(){
        console.log("Component mounted");
        const submissionsRef = firebaseApp.database().ref('submissions');
        const voterRef = firebaseApp.database().ref(`voters/${this.currentUser.uid}/votes`)
        voterRef.on('value', (snapshot) => console.log("VOTE", snapshot.val()));
        
        submissionsRef.on('value', (snapshot) => {
            this.setState(initialState);
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

    handleSubmit(event){
        event.preventDefault();


        var votersRef = firebaseApp.database().ref(`voters/${this.currentUser.uid}/votes`);
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
                currentSubmission: this.state.unvotedSubmissions[index + 1]
            });
            return true;
        }
        return false;
    }
    handlePrevious(event){
        var index = this.state.unvotedSubmissions.indexOf(this.state.currentSubmission);
        if(index - 1 >= 0 && index - 1 < this.state.unvotedSubmissions.length){
            this.setState({
                currentSubmission: this.state.unvotedSubmissions[index - 1]
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
        return(
            <div>
                <h1>Hello, {this.currentUser.displayName}. Please vote on the following submissions.</h1>
                <ul>
                    {this.state.submissions.map((submission) => {
                        return(
                            <li key={submission.id}>
                                <h3>{submission.id}</h3>
                                <p>Title: {submission.title}</p>
                                <p>by {submission.firstName}</p>
                            </li>
                        )
                    })}
                </ul>
                {
                    this.state.currentSubmission
                    ?
                    <Container>
                        <img src={this.state.currentSubmission.url}/>
                        <p>Title: {this.state.currentSubmission.title}</p>
                        <p>Description: {this.state.currentSubmission.description}</p>
                        <p>Medium: {this.state.currentSubmission.medium}</p>
                        <p>Dimensions: {this.state.currentSubmission.dimensions}</p>
                        <p>Vote: <Rating value={this.state.currentVote} onChange={this.handleChangeVote}/></p>
                        <Form onSubmit={this.handleSubmit}>
                            <Button type="submit">Submit Vote</Button>
                        </Form>
                        <Button onClick={this.handlePrevious}>Previous</Button>
                        <Button onClick={this.handleNext}>Next</Button>
                        <button onClick={() => {console.log(this.state)}}>Get the fuckin state</button>
                    </Container>
                    : <h3>No more submissions to rate!</h3>
                }

            
            
            </div>
        );
    }
}
export default VotingMain;