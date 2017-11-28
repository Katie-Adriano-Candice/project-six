import React from 'react';
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
firebase.initializeApp(config);

const provider = new firebase.auth.GoogleAuthProvider()

class Login extends React.Component {
    constructor() {
        super();
        this.state = {
            loggedIn: false
        }
        this.login = this.login.bind(this);
    }

    componentDidMount() {
        firebase.auth().onAuthStateChanged((user) => {
            console.log(user);
            if (user) {
                console.log('user is logged in');
                this.setState({
                    loggedIn: true
                })
            } else {
                console.log('user is logged out');
                this.setState({
                    loggedIn: false
                })
            }
        })
    }

    login(event) {
        event.preventDefault();
        console.log('logged in');
        firebase.auth().signInWithPopup(provider)
            .then((user) => {
                this.setState({
                    loggedIn: true
                });
            })
    }

    logout(event) {
        event.preventDefault();
        firebase.auth().signOut()
            .then(() => {
                console.log('logged out');
            })
    }


    render() {
        return (
        <div>
            <a href="" onClick={this.login}>Login</a>
            <a href="" onClick={this.logout}>Logout</a>

            {this.state.loggedIn === true ? <p>Hi, USER NAME HERE</p> : <p>TAG LINE FOR PETS BEING ADOPTED</p>}
        </div>
        )
    }
}


export default Login;