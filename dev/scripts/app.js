import React from 'react';
import ReactDOM from 'react-dom';
import firebase from 'firebase';
import Scroll, { scroller } from 'react-scroll';
import Login from './login.js';
import GetData from './axios-request'

// smooth scroll component
const Link = Scroll.Link;

class App extends React.Component {
    render() {
      return (
        <div>
          <GetData />
          <Login />
          Hello
          
        </div>
      )
    }
}

ReactDOM.render(<App />, document.getElementById('app'));
