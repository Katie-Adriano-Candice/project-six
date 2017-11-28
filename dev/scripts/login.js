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
            loggedIn: false,
            user: ''
        }
        this.login = this.login.bind(this);
    }

    componentDidMount() {
        firebase.auth().onAuthStateChanged((user) => {
            console.log(user);
            if (user) {
                console.log('user is logged in');
                const userName = user.displayName;
                this.setState({
                    loggedIn: true,
                    user: userName
                })
            } else {
                console.log('user is logged out');
                this.setState({
                    loggedIn: false,
                    user: ''
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
            <section className="first-frame--nav-header">
                <nav className="wrapper--nav">
                    <ul>
                        <li>
                            <a href="https://twitter.com/share" className="nav--twitter" data-size="large" data-text="Adopt one of our animals" data-url="http://wewilladdasitelater.com">Tweet </a>
                        </li>
                        <div className="first-frame--login-logout">
                            <li>
                                <a href="" onClick={this.login}>Login</a>
                            </li>
                            <li>
                                <a href="" onClick={this.logout}>Logout</a>
                            </li>
                        </div>
                    </ul>
                </nav>
                <header className="wrapper--inner">
                    <h1>TITLE</h1>
                        {this.state.loggedIn === true ? <h2>{`Hi, ${this.state.user}, Let's find you a furrrever friend!`}</h2> : <h2>Find your furrrever friend!</h2>}
                    <i className="fa fa-paw" aria-hidden="true"></i>
                </header>
            </section>
        </div>
        )
    }
}


export default Login;