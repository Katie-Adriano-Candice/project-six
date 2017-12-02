import React from 'react';
import { firebaseRef, firebaseBase, provider, firebaseAuth } from './firebase-code';

class Login extends React.Component {
    constructor() {
        super();
        this.state = {
            loggedIn: false,
            // user: '',
            // userIDSet: ''
        }
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
    }

    login(event) {
        event.preventDefault();
        console.log('logged in');
        firebaseAuth.signInWithPopup(provider)
            .then((user) => {
                const userName = user.displayName;
                const userID = user.uid;
                this.setState({
                    loggedIn: true,
                });
                this.props.userLogin(
                    userName,
                    userID
                )
            })
    }

    logout(event) {
        event.preventDefault();
        firebaseAuth.signOut()
            .then(() => {
                console.log('logged out');
                this.setState({
                    loggedIn: false,
                });
                this.props.userLogin(
                    '',
                    ''
                )
            })
    }

    render() {
        return (
        <div>
            {/* <section className="first-frame--nav-header">
                <nav className="wrapper--nav">
                    <ul>
                        <li>
                            <a href="https://twitter.com/share" className="nav--twitter" data-size="large" data-text="Adopt one of our animals" data-url="http://wewilladdasitelater.com">Tweet </a>
                        </li>
                        <div className="first-frame--login-logout">
                        //  different outputs given logged in or logged out 
                        {this.props.user ?
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
                    <h1><span>Purrrfect</span> Friends</h1>
                   // {/* different outputs given logged in or logged out 
                        {this.state.loggedIn === true ? 
                        <h2>{`Hi, ${this.props.user}, Let's find you a furrrever friend!`}</h2> 
                        : <h2>Find your furrrever friend!</h2>
                        }
                    <i className="fa fa-paw" aria-hidden="true"></i>
                </header>
            </section> */}
            <header className="header">
                <nav className="header__nav">
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

                        <li>
                            <h1><span>Purrrfect</span> Friends</h1>
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
            <section className="headerAnimals">
                    {this.state.loggedIn === true ?
                        <h2>{`Hi, ${this.state.user}, let's find you a furrrever friend!`}</h2>
                        : <h2>Sign in to find your furrrever friend!</h2>
                    }
                    <div className="circleContainer">
                        <p>Find a furry friend <span>near you!</span></p>
                    </div>
                
            </section>

        </div>
        )
    }
}


export default Login;