import React from 'react';
import ReactDOM from 'react-dom';
import { firebaseRef, firebaseBase, provider, firebaseAuth } from './firebase-code';
import axios from 'axios';
import Scroll, { scroller } from 'react-scroll';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Login from './login.js';
import Form from './form.js';
import  Notes from './user-notes.js';


// smooth scroll componeent
// const Link = Scroll.Link; -- might have to change this to const Element

let unSubscribe = function () {}

class App extends React.Component {
    constructor() {
      super();
      this.state = {
        user: '',
        userIDSet: ''
      }
      this.login = this.login.bind(this);
    }  


  // user logging in or out, while grabbing user uid
  componentDidMount() {
    unSubscribe = firebaseAuth.onAuthStateChanged((user) => {
      console.log(user);
      if (user) {
        console.log('user is logged in');
        const userName = user.displayName;
        const userID = user.uid;
        // console.log(user.uid);
        this.setState({
          user: userName,
          userIDSet: userID
        })
      } else {
        console.log('user is logged out');
        this.setState({
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

  login(user, userIDSet){
    this.setState({
      user,
      userIDSet
    })  
  }
    
    render() {
      return (
        <Router>
          <div className="wrapper--max">
            <main>
              <Login user={this.state.user} userID={this.state.userIDSet} userLogin={this.login}/>
              <Link to="/profile">Profile</Link>
              
            </main>
              <Form user={this.state.user} userID={this.state.userIDSet}/>
              <section>
              
                  <Notes userID={this.state.userIDSet}/>
                  
              </section>

          </div>
        </Router>
      )
    }
}

ReactDOM.render(<App />, document.getElementById('app'));
