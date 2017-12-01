import React from 'react';
// import firebase from 'firebase';
import ReactDOM from 'react-dom';
// import DisplayAnimal from './axios-request';
import axios from 'axios';
import Qs from 'qs';

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
            filteredResponse: [],
            petNameUnique: '',
            petDescription: ''
        }
        this.addRequest = this.addRequest.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    getAnimals(animal, size, place) {
        console.log(place)
        const key = 'e9a6ca7347527ff3b4dabbf7e663f9f1';
        const apiUrl = 'http://api.petfinder.com/';
        let getShelterList = [];
        let getInfo = axios({
            method: 'GET',
            url: 'http://proxy.hackeryou.com',
            dataResponse: 'jsonp',
            paramsSerializer: function (params) {
                return Qs.stringify(params, { arrayFormat: 'brackets' })
            },
            params: {
                reqUrl: `${apiUrl}pet.find`,
                params: {
                    key: key,
                    animal: animal,
                    size: size,
                    output: 'full',
                    // offset: 'lastOffset',
                    count: 20,
                    location: place,
                    format: 'json'
                },
                xmlToJSON: false
            }
        }).then((res) => {
            console.log(res);
            console.log(res.data.petfinder.pets.pet.age);
            //map or use for each to get each index and then do the dot dot whatever.
            let petArray = res.data.petfinder.pets.pet;
            

            console.log(petArray);
            // petArray.forEach(function(pet) {
            //     console.log(shelterId);
            // });
            petArray.forEach(id => {
                getShelterList.push(id.shelterId.$t);
                let petNameUnique = id.name.$t;
                let petDescription = id.description.$t;
                // console.log(petNameUnique);
                this.setState({petNameUnique});
                this.setState({petDescription});
            });
            console.log(getShelterList);
            const uniqueShelters = new Set(getShelterList);
            // this.setState(getShelterList);
            let getShelter = (id) => axios({
                method: 'GET',
                url: 'http://proxy.hackeryou.com',
                dataResponse: 'jsonp',
                paramsSerializer: function (params) {
                    return Qs.stringify(params, { arrayFormat: 'brackets' })
                },
                params: {
                    reqUrl: `${apiUrl}shelter.get`,
                    params: {
                        key,
                        id,
                        // id: 'ON432',
                        format: 'json'
                    },
                    xmlToJson: false
                }
            });
            let shelters = [];
            for(let value of uniqueShelters.values()){
                shelters.push(getShelter(value));
            }
            // let shelters = getShelterList.map(id => {
            //     console.log(id);
            //     return getShelter(id);
            // });
            Promise.all(shelters).then((shelterResponse) => {
                console.log(shelterResponse);
                console.log(shelterResponse[0].data.petfinder.header.status.message.$t);
                //for each animal that has message:{ $t: "shelter opt-out" }, set them so that they do not display/are not returned
                let filteredResponse = shelterResponse.filter(hasInfo => {
                    console.log(hasInfo.data.petfinder);
                    return hasInfo.data.petfinder.header.status.message.$t != 'shelter opt-out';
                }).map((shelter) => shelter.data);
                console.log(filteredResponse);

                this.setState({
                    filteredResponse
                })

                
                console.log(petArray);
                //petArray is an array of all the pets
                //filteredResponse is all the shelters that have opted in to be shown
                //These are different sizes
                //Take the filteredResponse and map through it, and for each shelter see if you can grab the pet
                //From the pet array and pair them up, returing a new object 
                //So in the end you have one array to display that is a match of the shelter and pets together
                /* 
                [{
                    shelter: {},
                    pets: [{},{}]
                }]
                */
                filteredResponse = filteredResponse.map((shelterPet) => {
                    let petMatch = [];
                    // if(shelter.petfinder.shelter.id.$t === )
                    petArray.forEach((animalPet) => {
                        if(shelterPet.petfinder.shelter.id.$t === animalPet.shelterId.$t) {
                            petMatch.push(animalPet);
                        }
                    });
                    return {
                        shelter: shelterPet,
                        pets: petMatch
                    }
                });
                console.log(filteredResponse);
                this.setState({filteredResponse});
                
            });


            

        })}

    addRequest(e) {
        e.preventDefault();
        
        const location = this.state.postalCode;
        if (location.length === 7) {
            const locationPostalCode = {
                postalCodeInfo: this.state.postalCode,

            }
            
            this.getAnimals(this.state.animal, this.state.size, this.state.postalCode);
            this.setState ({
                postalCode: '',
            });
        } else {
            alert("Please enter a valid postal code!");
        }
    }

    render() {
        return (
            <div className="second-frame wrapper-inner">
                <h3>Find your Furrrever Friend!</h3>
                <form onSubmit={this.addRequest} className="addForm">
                    <div className="text-input">
                        <label htmlFor="postalCode" className="locationInput">Enter your Postal Code: </label>
                        <input type="text" name="postalCode" placeholder="ie.M9P 1N8" id="currentPostalCode" required="required" value={this.state.postalCode} onChange={this.handleChange} />
                    </div>

                    {/* selecting between dog/cat */}

                    <p>Select the type of animal</p>
                    <div className="radio clearfix">
                        <div className="radioChoice">
                            <label htmlFor="cat"><span className="custom-input">Cat</span></label>
                            <input type="radio" value="cat" name="animal" required="required" id="currentAnimal" onChange={this.handleChange} />
                        </div>
                        <div className="radioChoice">
                            <label htmlFor="dog">Dog</label>
                            <input type="radio" value="dog" name="animal" required="required" id="currentAnimal" onChange={this.handleChange} />
                        </div>
                    </div>

                    {/* selecting a size of the animal*/}
                    <p>Select the size of animal</p>
                    <div className="radio clearfix">
                        <div className="radioChoice">
                            <label htmlFor="small">Small</label>
                            <input type="radio" value="S" name="size" required="required" id="currentSize" onChange={this.handleChange} />
                        </div>
                        <div className="radioChoice">
                            <label htmlFor="medium">Medium</label>
                            <input type="radio" value="M" name="size" required="required" id="currentSize" onChange={this.handleChange} />
                        </div>
                        <div className="radioChoice">
                            <label htmlFor="large">Large</label>
                            <input type="radio" value="L" name="size" required="required" id="currentSize" onChange={this.handleChange} />
                        </div>
                    </div>

                    {/* selecting the sex of the animal*/}
                    <p>Select the sex of the animal</p>
                    <div className="radio clearfix">
                        <div className="radioChoice">
                            <label htmlFor="male">Male</label>
                            <input type="radio" value="male" name="sex" required="required" id="currentSex" onChange={this.handleChange} />
                        </div>
                        <div className="radioChoice">
                            <label htmlFor="female">Female</label>
                            <input type="radio" value="female" name="sex" required="required" id="currentSex" onChange={this.handleChange} />
                        </div>
                    </div>

                    <input type='submit' className='button-submit' value='Submit' />
                    
                </form>
                <div>
                    {this.state.filteredResponse.map((shelter, i) => {
                        console.log(shelter);
                        
                        shelter.pets.map((displayNamePage, displayDescription) => {
                            console.log(displayNamePage);
                            return <div key={i}>
                                <p>{this.state.petNameUnique}</p>
                                <p>{this.state.petDescription}</p>
                            </div>
                        });
                        
                    })}
                </div>
            </div>
        )
    }
}

export default Form;