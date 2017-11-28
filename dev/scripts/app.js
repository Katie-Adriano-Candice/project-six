import React from 'react';
import ReactDOM from 'react-dom';
import firebase from 'firebase';
import axios from 'axios';
import Scroll, { scroller } from 'react-scroll';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Login from './login.js';
import Form from './form.js';
import GetData from './axios-request';


// smooth scroll component
// const Link = Scroll.Link; -- might have to change this to const Element

class App extends React.Component {
    render() {
      return (
        <div>

          <main>
            <body>
              <nav>
                <ul>
                  <li>
                    <a href="https://twitter.com/share" className="nav--twitter" data-size="large" data-text="Adopt one of our animals" data-url="http://wewilladdasitelater.com">Tweet

              <nav>
                <ul>
                  <li>
                    <a href="https://twitter.com/share" className="twitter-share-button" data-size="large" data-text="Adopt one of our animals" data-url="http://wewilladdasitelater.com">Tweet

                    </a>
                  </li>
                  <li>
                    <Login />
                  </li>
                </ul>
              </nav>
              <header>
                <h1>TITLE</h1>
                <i className="fa fa-paw" aria-hidden="true"></i>
              </header>

            
              </body>
            </main>

              <Form />

            <GetData />
        </div>
      )
    }
}

ReactDOM.render(<App />, document.getElementById('app'));
