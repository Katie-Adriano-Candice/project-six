import React from 'react';
import { firebaseRef, firebaseBase, provider, firebaseAuth } from './firebase-code';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Login from './login.js';
import Form from './form.js';

class Pet extends React.Component {
    constructor(){
        super();
        this.state= {
             userNotes: ''
        }

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);

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
            alert("You can't submit empty fields!");
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
                <div className="animals-appear wrapper-inner clearfix">
                    
                    <div>
                    <img src={pet.image} alt="" id="animal-picture-profile"/>
                    </div>
                    <div className="animals-info">
                        <p className="animals-name" id="user-animal-name">{pet.name}</p>
                        <p className="animals-description" id="user-animal-descrip">{pet.petDescription}</p>
                    </div>
                        <div className="user-display">
                            <div className="shelter-user clearfix">
                                <p>Shelter: {pet.shelterName}</p>
                                <p>City: {pet.shelterCity}</p>
                                <p>Contact: {pet.shelterContact}</p>
                            </div>
                        {pet.comments.map((comment, i) => {
                                return(
                                    <Note key={i} definedUserNote={comment.userComment} noteKey={comment.userCommentKey} userID={this.props.userID} petKey={pet.key}/>
                                )
                            })
                        }

                    <form onSubmit={this.handleSubmit}>
                        <div className="user-input">
                            <input type="text" name="userNotes" cols="66" rows="11" id="user-note-input" placeholder="Put some notes here about your furry friend!" onChange={this.handleChange} value={this.state.userNotes}/>
                        </div>
                        <div className="user-add-button">
                            <button>Add Note</button>
                        </div>
                    </form>
                    <div className="user-delete-animal">
                            <button value={pet.key} onClick={this.props.removeEntireItem}> 𝗫 Remove This Animal From Profile</button>
                    </div>


                    </div>

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
        this.removeEntireItem = this.removeEntireItem.bind(this);
    }

    // removing both note and description
    removeEntireItem(e) {
        const userResponse = confirm('Are you sure you want to delete this animal?');
        if (userResponse === true) {
            const dbRef = firebaseBase.ref(`${this.props.userID}/animal/${e.target.value}`);
            dbRef.remove();
            
            let oldState = this.state.firebasePet;
            let newState = oldState.filter(pet => {
                return pet.key !== e.target.value;
            });
            this.setState({firebasePet: newState});
        }
        else {
            return null;
        }
    }

    componentWillMount() {
        const dbRef = firebaseBase.ref(`${this.props.userID}/animal`);
         dbRef.on("value", (firebaseData) => {

            const addPetArray = [];
            

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
                            image: addPetData[petsData].petImage,
                            petDescription: addPetData[petsData].petDescription,
                            shelterName: addPetData[petsData].shelterName,
                            shelterCity:addPetData[petsData].shelterCity,
                            shelterContact: addPetData[petsData].shelterContact,
                            comments: comments,
                            petImage: addPetData[petsData].petImage
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
            return(

                    <Pet key={i} pet={pet} userID= {this.props.userID} removeEntireItem={this.removeEntireItem}/>

            )
        })
    }
}

class Note extends React.Component {
    constructor(props) {
        super(props);
        this.removeItem = this.removeItem.bind(this);
        
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
            <div className="defined-user-note">
                <p>{this.props.definedUserNote}</p>

                <div className="delete-note">
                    <button onClick={this.removeItem}>𝗫 Delete this Note</button>
                </div>

                {/* <div className="delete-note">
                    <button onClick={this.removeItem}>Delete Note</button>
                </div> */}

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
        console.log(this.props);
        return (  
             <div className="third-frame">
               <div className="wrapper--inner">
                  <form onSubmit={this.handleSubmit}>
                     </form>

                    <div>
                        <section className="return-home-button">
                            <Link to='/'>Go Back To The Homepage!</Link>

                            <Pets userID={this.props.match.params.userID} />                             
                        </section>
                    </div>
                </div>
            </div>
        )
    }
}

export default Notes;