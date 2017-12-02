import React from 'react';
import firebase from 'firebase';
import Login from './login.js';
import Form from './form.js';

class DeleteNotes extends React.Component {
    constructor(props) {
        super(props);
        this.removeItem = this.removeItem.bind(this)
    }

    // removing items with dynamtic folders
    removeItem(itemToRemove) {
        const userResponse = confirm('Are you sure you want to delete this note?')
        if (userResponse == true) {
            const dbRef = firebase.database().ref(`${this.props.userIDProp}/${itemToRemove}`);
            dbRef.remove();
        }
        else {
            return null;
        }
    }

    render() {
        return (
            <div>
                <p>{this.props.event.data.definedUserNote}</p>
                <button onClick={() => this.removeItem(this.props.event.key)}>Delete Note</button>
            </div>
        )
    }
}


class Notes extends React.Component {
    constructor() {
        super();
        this.state = {
            events: [],
            userNotes: '',
            userID: ''
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        // this.addPet = this.addPet.bind(this)
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    // sending info to firebase for user notes with dynamic user-specific id
    handleSubmit(event) {
        event.preventDefault();
        const petNotesFromUser = this.state.userNotes;
        if (petNotesFromUser) {
            const dbRef = firebase.database().ref(`${this.state.userID}`);
            const userNotesSaved = {
                definedUserNote: this.state.userNotes,
            }
            dbRef.push(userNotesSaved);
            this.setState({
                userNotes: ''
            });
        } else {
            alert("You can't submit empty feilds!");
        }
    }

    componentDidMount() {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                const dbRef = firebase.database().ref(`${user.uid}`);
                dbRef.on("value", (firebaseData) => {
                    const eventsArray = [];
                    const eventsData = firebaseData.val();

                    for (let definedUserNote in eventsData) {
                        eventsArray.push({
                            data: eventsData[definedUserNote],
                            key: definedUserNote
                        })
                    }
                    this.setState({
                        events: eventsArray,
                        userID: user.uid

                    });
                });
            }
        });
    }

    render() {
        return (
            <div className="third-frame">
                <form onSubmit={this.handleSubmit}>

                    <input type="text" name="userNotes" placeholder="Put some notes here!" onChange={this.handleChange} value={this.state.userNotes}/>

                    <button>Add Note</button>
                </form>
                <div>
                    <section>

                        {this.state.events.map((event) => {
                            return(
                                <DeleteNotes event={event} key={event.key} userIDProp={this.state.userID}/>
                            )
                        })}

                    </section>
                </div>
            </div>
        )
    }
}

export default Notes;