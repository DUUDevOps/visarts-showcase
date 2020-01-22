import React from 'react';
import AdminMain from './AdminMain';

import firebase from 'firebase/app';
import 'firebase/auth';
import withFirebaseAuth from 'react-with-firebase-auth';
import firebaseApp from '../firebaseConfig';
import { Button } from 'reactstrap';


const firebaseAppAuth = firebaseApp.auth();

const providers = {
    googleProvider: new firebase.auth.GoogleAuthProvider()
};


class AdminSignIn extends React.Component {
    render(){
        const {user, signOut, signInWithGoogle} = this.props;
        return(
            <div>
                <h2 align="center"><b>VisArts Spring Showcase Admin</b></h2>

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
                        <AdminMain user={user}/>
                    </div>
                    : 
                    (
                        <div className="centerPage">
                        <h5>For VisArts Committee Chair only - please sign in.</h5> 
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
})(AdminSignIn);