import firebase from 'firebase';

// Initialize Firebase
var config = {
    apiKey: "AIzaSyC_fT1wegJor-5lw0KsHTglHEXHxAbQnBE",
    authDomain: "project-six-3b01e.firebaseapp.com",
    databaseURL: "https://project-six-3b01e.firebaseio.com",
    projectId: "project-six-3b01e",
    storageBucket: "",
    messagingSenderId: "747497473002"
};

export const firebaseRef = firebase.initializeApp(config);

export const provider = new firebase.auth.GoogleAuthProvider();

export const firebaseBase = firebase.database();

export const firebaseAuth = firebase.auth();