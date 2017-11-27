import React from 'react';
import ReactDOM from 'react-dom';
import firebase from 'firebase';

// put in code from firebase here

class App extends React.Component {
    render() {
      return (
        <div>
          Hello
        </div>
      )
    }
}

ReactDOM.render(<App />, document.getElementById('app'));
