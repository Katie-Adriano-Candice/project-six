import React from 'react';
import { firebaseRef, firebaseBase, provider, firebaseAuth } from './firebase-code';
import Notes from './user-notes';
import { BrowserRouter as Router, Route, Link, withRouter } from 'react-router-dom';

class Login extends React.Component {
    constructor() {
        super();
        this.state = {
            user: null,
            userIDSet: null
        }
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
    }

    login(event) {
        event.preventDefault();
        console.log('logged in');
        firebaseAuth.signInWithPopup(provider)
            .then((data) => {
                const user = data.user.displayName;
                const userID = data.user.uid;
                this.props.userLogin(
                    user,
                    userID
                )
            })
    }

    logout(event) {
        event.preventDefault();
        firebaseAuth.signOut()
            .then(() => {
                this.props.userLogout(this.props.history);
            })
            
    }

    render() {
        return (
        <div>
            <header className="header">
                <nav className="header__nav wrapper--nav">
                    <ul>
                        <li>
                            <a href="https://twitter.com/share" className="nav--twitter" data-size="large" data-text="Adopt one of our animals" data-url="http://wewilladdasitelater.com"><div><i className="fa fa-twitter" aria-hidden="true"></i></div></a>
                        </li>
                        <li>
                            <img src="public/assets/pup_kitten_logo.png" className="petLogo" alt=""/>
                            <h1>
                                <span>Purrrfect</span> Friends
                            </h1>
                        </li>                                       
                        {this.props.user ?

                        <li>
                            <a href="" className="nav--signout"   onClick={this.logout}><div>Sign out  <i className="fa fa-google" aria-hidden="true"></i></div></a>
                        </li>
                        : 
                        <li>
                            <a href="" className="nav--signin" onClick={this.login}><div>Sign in  <i className="fa fa-google" aria-hidden="true"></i></div></a>
                        </li>
                        }
                    </ul>
                </nav>
            </header>
        </div>
        )
    }
}


export default withRouter(Login);