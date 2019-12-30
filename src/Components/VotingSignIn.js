import React from 'react';
import VotingMain from './VotingMain';

import firebase from 'firebase/app';
import 'firebase/auth';
import withFirebaseAuth from 'react-with-firebase-auth';
import firebaseApp from '../firebaseConfig';


const firebaseAppAuth = firebaseApp.auth();

const providers = {
    googleProvider: new firebase.auth.GoogleAuthProvider()
};


class VotingSignIn extends React.Component {
    render(){
        const {user, signOut, signInWithGoogle} = this.props;
        return(
                <div>

                <h1>VOTING PAGE</h1>
                {
                    user 
                    ? <VotingMain user={user}/>
                    : <p>Please sign in.</p>    
                }
                {
                    user
                    ? <button onClick={signOut}>Sign out</button>
                    : <button onClick={signInWithGoogle}>Sign in with Google</button>
                }
            </div>

        );
    }
}

export default withFirebaseAuth({
    providers,
    firebaseAppAuth
})(VotingSignIn);