import React from 'react';
import ReactDOM from 'react-dom';
import firebase from 'firebase';
import Scroll, { scroller } from 'react-scroll';
import Login from './login.js';
// put in code from firebase here
// smooth scroll component
const Link = Scroll.Link;

class App extends React.Component {
    render() {
      return (
        <div>
          <Login />
          Hello
            <a href="https://twitter.com/share" class="twitter-share-button" data-size="large" data-text="Adopt one of our animals" data-url="http://wewilladdasitelater.com">Tweet
            </a>
          {/* test */}
        </div>
      )
    }
}

ReactDOM.render(<App />, document.getElementById('app'));
