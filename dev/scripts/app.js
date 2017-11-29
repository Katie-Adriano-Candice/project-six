import React from 'react';
import ReactDOM from 'react-dom';
import firebase from 'firebase';
import axios from 'axios';
import Scroll, { scroller } from 'react-scroll';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Login from './login.js';
import Form from './form.js';

import DisplayAnimal from './axios-request';

import { GetData, GetShelterInfo } from './axios-request';
import  Notes from './user-notes.js';



// smooth scroll component
// const Link = Scroll.Link; -- might have to change this to const Element

class App extends React.Component {
    render() {
      return (
        <div className="wrapper--max">
          <main>
              <Login />
          </main>
            <Form />

            <DisplayAnimal />

            {/* <GetData />
            <GetShelterInfo /> */}
            <section>
              <Notes />
            </section>

        </div>
      )
    }
}

ReactDOM.render(<App />, document.getElementById('app'));
