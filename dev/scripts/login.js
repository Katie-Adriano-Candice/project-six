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

let unSubscribe = function(){}

class Login extends React.Component {
    constructor() {
        super();
        this.state = {
            loggedIn: false,
            user: '',
            userIDSet: ''
        }
        this.login = this.login.bind(this);
    }

    // user logging in or out, while grabbing user uid
    componentDidMount() {
        unSubscribe = firebase.auth().onAuthStateChanged((user) => {
            console.log(user);
            if (user) {
                console.log('user is logged in');
                const userName = user.displayName;
                const userID = user.uid;
                // console.log(user.uid);
                this.setState({
                    loggedIn: true,
                    user: userName,
                    userIDSet: userID
                })
            } else {
                console.log('user is logged out');
                this.setState({
                    loggedIn: false,
                    user: '',
                    userIDSet: ''
                })
            }
        })
    }

    // to ensure mounts do not "compete"
    componentWillUnmount() {
        unSubscribe();
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
            <section className="first-frame--nav-header">
                <nav className="wrapper--nav">
                    <ul>
                        <li>
                            <a href="https://twitter.com/share" className="nav--twitter" data-size="large" data-text="Adopt one of our animals" data-url="http://wewilladdasitelater.com">Tweet </a>
                        </li>
                        <div className="first-frame--login-logout">
                        {/* different outputs given logged in or logged out */}
                        {this.state.user ?
                            <li>
                                <a href="" onClick={this.logout}>Logout</a>
                            </li>
                            :
                            <li>
                                <a href="" onClick={this.login}>Login</a>
                            </li>
                        }
                        </div>
                    </ul>
                </nav>
                <header className="wrapper--inner">
                    <h1>TITLE</h1>
                    {/* different outputs given logged in or logged out */}
                        {this.state.loggedIn === true ? 
                        <h2>{`Hi, ${this.state.user}, Let's find you a furrrever friend!`}</h2> 
                        : <h2>Find your furrrever friend!</h2>
                        }
                    <i className="fa fa-paw" aria-hidden="true"></i>
                </header>
            </section>
        </div>
        )
    }
}


export default Login;