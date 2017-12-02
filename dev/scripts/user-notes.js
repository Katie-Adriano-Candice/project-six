import React from 'react';
import { firebaseRef, firebaseBase, provider, firebaseAuth } from './firebase-code';
import Login from './login.js';
import Form from './form.js';

class Pet extends React.Component {
    constructor(){
        super();
        this.state= {
             userNotes: ''
        }

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this)
    }

         // sending info to firebase for user notes with dynamic user-specific id
    handleSubmit(event) {
        event.preventDefault();
        const petNotesFromUser = this.state.userNotes;
        if (petNotesFromUser) {
            const commentsPath = `${this.props.userID}/animal/${this.props.pet.key}/comments`
            const commentKey = firebaseBase.ref(commentsPath).push().key;
           
            const updates = {}
            updates[`${commentsPath}/${commentKey}`] = petNotesFromUser;
            firebaseBase.ref().update(updates)
            this.setState ({
                userNotes: ''
            })

        } else {
            alert("You can't submit empty feilds!");
        }
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }
    
        render(){
            const pet = this.props.pet;
            return(
                <div>
                    <p>{pet.name}</p>
                        <p>{pet.petDescription}</p>
                        <p>{pet.shelterName}</p>
                        <p>{pet.shelterCity}</p>
                        <p>{pet.shelterContact}</p>
                        {pet.comments.map((comment, i) => {
                                return(
                                    <Note key={i} definedUserNote={comment.userComment} noteKey={comment.userCommentKey} userID={this.props.userID} petKey={pet.key}/>
                                )
                            })
                        }
                    <form onSubmit={this.handleSubmit}>

                        <input type="text" name="userNotes" placeholder="Put some notes here!" onChange={this.handleChange} value={this.state.userNotes}/>

                        <button>Add Note</button>
                    </form>
                </div>
            )
        }
    }

class Pets extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            firebasePet: [],
        }
    }

    componentWillReceiveProps(nextProps) {
        const dbRef = firebaseBase.ref(`${nextProps.userID}/animal`);
        console.log('props', this.props, nextProps);
        dbRef.on("value", (firebaseData) => {

            const addPetArray = [];
            console.log('mounted');

            const addPetData = firebaseData.val();
           
            if (addPetData) {
                for (let petsData in addPetData){
                    const comments =[] 
                    for (let comment in addPetData[petsData].comments){
                         comments.push({userComment: addPetData[petsData].comments[comment], userCommentKey: comment});
                    }
                    addPetArray.push({
                            key: petsData,
                            name: addPetData[petsData].name,
                            petDescription: addPetData[petsData].petDescription,
                            shelterName: addPetData[petsData].shelterName,
                            shelterCity:addPetData[petsData].shelterCity,
                            shelterContact: addPetData[petsData].shelterContact,
                            comments: comments
                        })
                }
                this.setState({
                firebasePet: addPetArray
            })
            }
        })

    }

    render(){
        return this.state.firebasePet.map((pet, i) => {
            console.log(pet);
            return(
                    <Pet key={i} pet={pet} userID= {this.props.userID}/>
            )
        })
    }
}

class Note extends React.Component {
    constructor(props) {
        super(props);
        this.removeItem = this.removeItem.bind(this)
    }

    // removing items with dynamtic folders
    removeItem() {
        const userResponse = confirm('Are you sure you want to delete this note?')
        if (userResponse == true) {
            const dbRef = firebaseBase.ref(`${this.props.userID}/animal/${this.props.petKey}/comments/${this.props.noteKey}`);
            dbRef.remove();
        }
        else {
            return null;
        }
    }

    render() {
        return (
            <div>
                <p>{this.props.definedUserNote}</p>
                <button onClick={this.removeItem}>Delete Note</button>
            </div>
        )
    }
}


class Notes extends React.Component {
    constructor() {
        super();
        this.state = {
            events: [],
        }
        
    }

    render() {
        return (
            <div>
                <div>
                    <section>

                        <Pets userID={this.props.userID} /> 
                           
                        
                    </section>
                </div>
            </div>
        )
    }
}

export default Notes;