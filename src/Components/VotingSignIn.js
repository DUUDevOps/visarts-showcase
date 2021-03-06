import React from 'react';
import VotingMain from './VotingMain';

import firebase from 'firebase/app';
import 'firebase/auth';
import withFirebaseAuth from 'react-with-firebase-auth';
import firebaseApp from '../firebaseConfig';
import { Button } from 'reactstrap';


const firebaseAppAuth = firebaseApp.auth();

const providers = {
    googleProvider: new firebase.auth.GoogleAuthProvider()
};


class VotingSignIn extends React.Component {
    render(){
        const {user, signOut, signInWithGoogle} = this.props;
        return(
            <div>
    <h2 align="center"><b>VisArts Spring {new Date().getFullYear()} Showcase Voting</b></h2>

                {
                user ?
                <div>
                    <Button style={{position: "absolute", top: 0, right: 0}} outline color="danger" onClick={signOut}>Sign out</Button>
                </div>
                : ''
                } 

                <div align="center">
                {
                    user 
                    ?
                    <div>
                        <VotingMain user={user}/>
                    </div>
                    : 
                    (
                        <div className="centerPage">
                        <h5>For VisArts Committee Members only - please sign in to vote.</h5> 
                        <Button outline color="primary" onClick={signInWithGoogle}>Sign in with Google</Button>
                        </div>
                    )   
                }

                {/* {
                    user
                    ? <button onClick={signOut}>Sign out</button>
                    : <Button outline color="primary" onClick={signInWithGoogle}>Sign in with Google</Button>
                } */}
                </div>
            </div>

        );
    }
}

export default withFirebaseAuth({
    providers,
    firebaseAppAuth
})(VotingSignIn);