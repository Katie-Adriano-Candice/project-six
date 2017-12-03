import React from 'react';//
import ReactDOM from 'react-dom';
import axios from 'axios';
import { firebaseRef, firebaseBase, provider, firebaseAuth } from './firebase-code';
import Login from './login.js';
import Notes from './user-notes.js';
import Qs from 'qs';

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
        this.getPetPhotos = this.getPetPhotos.bind(this);
        this.addPet = this.addPet.bind(this);
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    getAnimals(animal, size, place) {
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
                    count: 20,
                    location: place,
                    format: 'json'
                },
                xmlToJSON: false
            }
        }).then((res) => {
            let petArray = res.data.petfinder.pets.pet;


            petArray.forEach(id => {
                getShelterList.push(id.shelterId.$t);
                let petNameUnique = id.name.$t;
                let petDescription = id.description.$t;

                this.setState({ petNameUnique });
                this.setState({ petDescription });
            });
            const uniqueShelters = new Set(getShelterList);


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
                        format: 'json'
                    },
                    xmlToJson: false
                }
            });
            let shelters = [];
            for (let value of uniqueShelters.values()) {
                shelters.push(getShelter(value));
            }

            console.log('shelters', shelters);

            Promise.all(shelters).then((shelterResponse) => {
                console.log('shelterResponse', shelterResponse);
                let filteredResponse = shelterResponse.filter(hasInfo => {

                    const petfinder = hasInfo.data.petfinder;
                    return petfinder.shelter && petfinder.header.status.message.$t !== 'shelter opt-out';
                }).map((shelter) => shelter.data.petfinder.shelter);

                const matchedPetsResponse = filteredResponse.map((shelter) => {
                    const petMatch = [];

                    petArray.forEach((animalPet) => {
                        if (shelter.id.$t === animalPet.shelterId.$t) {


                            petMatch.push(animalPet);
                        }
                    });
                    return {

                        shelter,
                        pets: petMatch
                    }
                });

                this.setState({ filteredResponse: matchedPetsResponse });
                console.log(filteredResponse);

            });
        })
    }

    // adding the pet to firebase
    addPet(event) {
        event.preventDefault();

        let sheltersToFirebase = (JSON.parse(event.target.dataset.shelterinfo));
        const shelterToFirebase = sheltersToFirebase.shelter

        let petToFirebase = (JSON.parse(event.target.dataset.animalinfo));


        const sendingPetsToFirebase= {
            
            // petImage: petToFirebase.pet.media[0],
            name: petToFirebase.name.$t,
            petDescription: petToFirebase.description.$t,
            shelterName: shelterToFirebase.name.$t,
            shelterCity: shelterToFirebase.city.$t,
            shelterContact: shelterToFirebase.email.$t,
            comments: {}
        };
        console.log(sendingPetsToFirebase);
    
        const dbRef = firebaseBase.ref(`${this.props.userID}/animal`);
        const userPerferencePet = dbRef.push(sendingPetsToFirebase)
    }



    // gets get photo at size of x
    getPetPhotos(media) {
        return media.photos.photo.map(photo => {
            if (photo['@size'] === 'x') {
                return photo.$t
            }
        }).filter(photo => photo)
    }

    addRequest(e) {
        e.preventDefault();

        const location = this.state.postalCode;
        if (location.length === 7) {
            const locationPostalCode = {
                postalCodeInfo: this.state.postalCode,

            }

            this.getAnimals(this.state.animal, this.state.size, this.state.postalCode);
            this.setState({
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
                        const pets = shelter.pets;
                        return (
                            <div className="shelter-appear" key={i}>
                                <div className="shelter-sub wrapper--inner clearfix">
                                <p className="shelter-name" id="name">{shelter.shelter.name.$t}</p>
                                <p className="shelter-city" id="city">{shelter.shelter.city.$t}</p>
                                <a href={shelter.shelter.email.$t}>Email the shelter!</a>
                                </div>
                                {pets.map((pet, index) => {
                                    return (
                                        <div className="animals-appear wrapper--inner clearfix" key={index}>
                                            {/* displays first pet in array of images */}
                                            <img src={this.getPetPhotos(pet.media)[0]} />
                                            <div className="animal-info">
                                                <p className="animals-name" id="animalsName">{pet.name.$t}</p>
                                                <p className="animals-description" id="animals-descrip">{pet.description.$t}</p>
                                                <button onClick={this.addPet} data-shelterinfo={JSON.stringify(shelter)} data-animalinfo={JSON.stringify(pet)}>PRESS ME </button>
                                            </div>

                                        </div>
                                    )
                                })}

                            </div>
                        )

                    })}
                </div>
            </div>
        )
    }
}
export default Form;
