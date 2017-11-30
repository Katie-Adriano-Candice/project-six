import React from 'react';
// import firebase from 'firebase';
import ReactDOM from 'react-dom';
import DisplayAnimal from './axios-request';

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
            postalCode: '',
            animal: '',
            size: '',
            sex: '',
        }
        this.addRequest = this.addRequest.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    addRequest(e) {
        e.preventDefault();
        // console.log('submit')
        // const usersChoice = {
        //     postalCode: this.state.postalCode,
        //     animal: this.state.animal,
        //     size: this.state.size,
        //     sex: this.state.sex,
        // }
        // this.setState ({
        //     currentPostalCode: "",
        //     currentAnimal: "",
        //     currentSize: "",
        //     currentSex: "",
        // });
        const location = this.state.postalCode;
        if (location.length === 7) {
            const locationPostalCode = {
                postalCodeInfo: this.state.postalCode,

        }
        this.setState ({
            postalCode: '',
        });

        } else {
            alert("Please enter a valid postal code!");
        }
    }

    render() {
        return (
            <div>
                <form onSubmit={this.addRequest} className="addForm">
                    <label htmlFor="postalCode">Location: </label>
                    <input type="text" name="postalCode" placeholder="Postal code ie.M9P 1N8" id="currentPostalCode" required="required" value={this.state.currentPostalCode} onChange={this.handleChange} />

                    {/* selecting between dog/cat */}

                    <p>Select the type of animal</p>
                    <div className="radio">
                        <div className="radioChoice">
                            <label htmlFor="cat">Cat</label>
                            <input type="radio" value="cat" name="animal" required="required" id="currentType" onChange={this.handleChange} />
                        </div>
                        <div className="radioChoice">
                            <label htmlFor="dog">Dog</label>
                            <input type="radio" value="dog" name="animal" required="required" id="currentAnimal" onChange={this.handleChange} />
                        </div>
                    </div>

                    {/* selecting a size of the animal*/}
                    <p>Select the size of animal</p>
                    <div className="radio">
                        <div className="radioChoice">
                            <label htmlFor="small">Small</label>
                            <input type="radio" value="small" name="size" required="required" id="currentSize" onChange={this.handleChange} />
                        </div>
                        <div className="radioChoice">
                            <label htmlFor="medium">Medium</label>
                            <input type="radio" value="medium" name="size" required="required" id="currentSize" onChange={this.handleChange} />
                        </div>
                        <div className="radioChoice">
                            <label htmlFor="large">Large</label>
                            <input type="radio" value="large" name="size" required="required" id="currentSize" onChange={this.handleChange} />
                        </div>
                    </div>

                    {/* selecting the sex of the animal*/}
                    <p>Select the sex of the animal</p>
                    <div className="radio">
                        <div className="radio">
                            <label htmlFor="male">Male</label>
                            <input type="radio" value="male" name="sex" required="required" id="currentSex" onChange={this.handleChange} />
                        </div>
                        <div className="radio">
                            <label htmlFor="female">Female</label>
                            <input type="radio" value="female" name="sex" required="required" id="currentSex" onChange={this.handleChange} />
                        </div>
                    </div>

                    <input type='submit' className='button-submit' value='Submit' onChange={this.handleChange} />
                    
                </form>
                <div>
                    <p></p>
                </div>
            </div>
        )
    }
}

export default Form;