import React from 'react';
import ReactDOM from 'react-dom';
import firebase from 'firebase';
import Scroll, { scroller } from 'react-scroll';
import Login from './login.js';


// smooth scroll component
const Link = Scroll.Link;

class App extends React.Component {
    render() {
      return (
        <div>
          <Login />
          Hello          
        </div>
      )
    }
}

ReactDOM.render(<App />, document.getElementById('app'));
