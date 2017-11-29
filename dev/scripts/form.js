import React from 'react';
// import firebase from 'firebase';
import ReactDOM from 'react-dom';

// var config = {
//     apiKey: "AIzaSyC_fT1wegJor-5lw0KsHTglHEXHxAbQnBE",
//     authDomain: "project-six-3b01e.firebaseapp.com",
//     databaseURL: "https://project-six-3b01e.firebaseio.com",
//     projectId: "project-six-3b01e",
//     storageBucket: "",
//     messagingSenderId: "747497473002"
// };
// firebase.initializeApp(config);


class Form extends React.Component {
    constructor() {
        super();
        this.state = {
        }
        this.addItem = this.addItem.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }
    addItem(e) {
        e.preventDefault();
        const usersChoice = {
            postalCode: this.state.postalCode,
            type: this.state.type,
            size: this.state.size,
            sex: this.state.sex,
        }
        this.setState ({
            postalCode: "",
            type: "",
            size: "",
            sex: "",
        });
        const dbRef = firebase.database().ref();
        dbref.push(usersChoice);
    }
    render() {
        return (
            <div>
                <section>
                    <form onSubmit={this.addItem} className="addForm">
                        <label htmlFor="location">Location: </label>
                        <input type="text" name="postalCode" placeholder="Please enter a postal code" value= {this.state.postalCode} onChange={this.handleChange} />

                        {/* selecting an animal */}

                        <div className="radio">
                            <div className="radioChoice">
                                <label htmlFor="cat">Cat</label>
                                <input type="radio" value="cat" name="type" id="currentType" onChange={this.handleChange}/>
                            </div>
                            <div className="radioChoice">
                                <label htmlFor="cat">Dog</label>
                                <input type="radio" value="dog" name="type" id="currentType" onChange={this.handleChange} />
                            </div>
                        </div>

                        {/* selecting a size */}

                        {/* <div className>
                            <div>

                            </div>
                        </div> */}

                        <p>How big do you want the animal to be:</p>
                        <label htmlFor="size">Small</label>
                        <input type="radio" name="size" value={this.state.size} onChange={this.handleChange}/>
                        <label htmlFor="size">Medium</label>
                        <input type="radio" name="size" value={this.state.size} onChange={this.handleChange}/>
                        <label htmlFor="size">Large</label>
                        <input type="radio" name="size" value={this.state.size} onChange={this.handleChange}/>

                        <p>Select a sex:</p>
                        <label htmlFor="sex">Male</label>
                        <input type="radio" name="sex" value={this.state.sex} onChange={this.handleChange}/>
                        <label htmlFor="sex">Female</label>
                        <input type="radio" name="sex" value={this.state.sex} onChange={this.handleChange}/>

                        <input type='submit' className='button-submit' value='Submit' onChange={this.handleChange}/>
                    </form>
                </section>
            </div>
        )
    }
}

export default Form;