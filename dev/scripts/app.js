import React from 'react';
import ReactDOM from 'react-dom';
import { firebaseRef, firebaseBase, provider, firebaseAuth } from './firebase-code';
import axios from 'axios';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Login from './login.js';
import Form from './form.js';
import  Notes from './user-notes.js';


let unSubscribe = function () {}

class App extends React.Component {
    constructor() {
      super();
      this.state = {
        user: null,
        userIDSet: null,
      }
      this.login = this.login.bind(this);
      this.logout = this.logout.bind(this);
    }  

  // user logging in or out, while grabbing user uid
  componentDidMount() {
    unSubscribe = firebaseAuth.onAuthStateChanged((user) => {
      console.log(user);
      if (user) {
        console.log('user is logged in');
        const userName = user.displayName;
        const userID = user.uid;
        this.setState({
          user: userName,
          userIDSet: userID
        })
      } else {
        console.log('user is logged out');
        this.setState({
          user: null,
          userIDSet: null
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
    });
  }

  logout(history) {
    this.setState({
      user: null,
      userIDSet: null
    }, function(){
      history.push("/");  
    })  
  }
    
    render() {
      return (

        <Router>
          <div className="wrapper--max">
            <main>
              <section>
              <Login user={this.state.user} userID={this.state.userIDSet} userLogin={this.login} userLogout={this.logout}/>

                <Route exact path="/" render = {() => <Form user={this.state.user} userID={this.state.userIDSet} />} /> 
                {/* // <Form user={this.state.user} userID={this.state.userIDSet}/> */}

              <Route path="/profile/:userID" component={Notes} />
              {/* {this.state.user ?
                  // <Notes userID={this.state.userIDSet} />
                  :
                  null
              } */}
              </section>
            </main>
          </div>
        </Router>

      )
    }
}

ReactDOM.render(<App />, document.getElementById('app'));
