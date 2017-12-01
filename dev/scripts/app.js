import React from 'react';
import ReactDOM from 'react-dom';
import firebase from 'firebase';
import axios from 'axios';
import Scroll, { scroller } from 'react-scroll';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Login from './login.js';
import Form from './form.js';
import  Notes from './user-notes.js';



// smooth scroll componeent
// const Link = Scroll.Link; -- might have to change this to const Element

class App extends React.Component {
    // constructor() {
    //   super();
    //   this.state = {
    //     shelterName: '',
    //     email: '',
    //     phone: ''
    //   }
    // }  
    render() {
      return (
        <div className="wrapper--max">
          <main>
              <Login />
          </main>
            <Form />
            <section>
              <Notes />
            </section>

        </div>
      )
    }
}

ReactDOM.render(<App />, document.getElementById('app'));
