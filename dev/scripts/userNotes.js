import React from 'react';
import firebase from 'firebase';
import Login from './login.js';


// class userNotes extends React.Component {
//     constructor() {
//         super();
//         this.state = {
//             userNotes = [],
//             displayUserNotes = ''
//         }
//         this.handleChange = this.handleChange.bind(this);
//         this.handleSubmit = this.handleSubmit.bind(this);
//     }

//     handleChange(userNote) {
//         this.setState({
//             [userNote.target.name]: userNote.target.value
//         });
//     }

//     // sending info to firebase for user notes
//     handleSubmit(userNote) {
//         event.preventDefault();
//         const petNotesFromUser = this.state.displayUserNotes;
//         if (petNotesFromUser) {
//             const dbRef = firebase.database().ref(`${userID}`);
//             const userNotesSaved = {
//                 definedUserNote: this.state.displayUserNotes,
//             }
//             dbRef.push(definedUserNote);
//             this.setState({
//                 displayUserNotes: '',
//             });
//         } else {
//             alert("You can't submit empty feilds!");
//         }
//     }

//     render() {
//         return (
//             <div>
//                 <form onSubmit={this.handleSubmit}>

//                     <input type="text" name="userNotes" placeholder="Put some notes here!" onChange={this.handleChange} value={this.state.displayUserNotes} />

//                     <button>Add Note</button>
//                 </form>
//             </div>
//         )
//     }
// }

// export default userNotes;