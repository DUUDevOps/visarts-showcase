import firebase from 'firebase';

var firebaseConfig = {
    apiKey: "AIzaSyAxi0R0RARe2uX8afqlzXrBC7_ilIjgd7Y",
    authDomain: "visarts-showcase.firebaseapp.com",
    databaseURL: "https://visarts-showcase.firebaseio.com",
    projectId: "visarts-showcase",
    storageBucket: "visarts-showcase.appspot.com",
    messagingSenderId: "939119617819",
    appId: "1:939119617819:web:1b50e3b920b6ee3e6a15be",
    measurementId: "G-2LCJJDS2VZ"
    };

//   // Initialize Firebase
//   firebase.initializeApp(firebaseConfig);
//   firebase.analytics();

const firebaseApp = firebase.initializeApp(firebaseConfig);
export default firebaseApp;