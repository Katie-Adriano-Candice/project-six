import React from 'react';//
import ReactDOM from 'react-dom';
import axios from 'axios';
import firebase from 'firebase';
import Login from './login.js';
import Notes from './user-notes.js';
import Qs from 'qs';




class Form extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            postalCode: '',
            animal: '',
            size: '',
            sex: '',
            filteredResponse: [],
            petNameUnique: '',
            petDescription: '',
            FirebasePet: ''
        }
        this.addRequest = this.addRequest.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.getPetPhotos = this.getPetPhotos.bind(this);
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
    };

    // adding the pet to firebase
    addPet(event) {
        event.preventDefault();
        let sheltersToFirebase = (JSON.parse(event.target.dataset.shelterinfo));
        const shelterToFirebase = sheltersToFirebase.shelter

        let petToFirebase = (JSON.parse(event.target.dataset.animalinfo));

        const animalID = petToFirebase.id.$t
        console.log(animalID);

        const sendingPetsToFirebase = {

            name: petToFirebase.name.$t,
            petDescription: petToFirebase.description.$t,
            shelterName: shelterToFirebase.name.$t,
            shelterCity: shelterToFirebase.city.$t,
            sheterContact: shelterToFirebase.email.$t,

        };
        console.log(sendingPetsToFirebase);

        const dbRef = firebase.database().ref(`${firebase.auth().currentUser.uid}/animalID/`);
        const userPerferencePet = dbRef.push(sendingPetsToFirebase)
    }

    // componentDidMount() {
    //     const dbRef = firebase.database().ref(`${firebase.auth().currentUser.uid}/animalID/`);
    //     dbRef.on("value", (firebaseData) => {
    //         const addPetArray = [];
    //         const addPetData = firebaseData.val();
    //         this.setState({
    //             FirebasePet: addPetData
    //         })
    //     })
    // }

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
                            <div key={i}>
                                <p>{shelter.shelter.name.$t}</p>
                                <p>{shelter.shelter.city.$t}</p>
                                <a href={shelter.shelter.email.$t}>Email the shelter!</a>
                                {pets.map((pet, index) => {
                                    return (
                                        <div className="animals-appear" key={index}>
                                            {/* displays first pet in array of images */}
                                            <img src={this.getPetPhotos(pet.media)[0]} />
                                            <p>{pet.name.$t}</p>
                                            <p class="animals-description">{pet.description.$t}</p>
                                            <button onClick={this.addPet} data-shelterinfo={JSON.stringify(shelter)} data-animalinfo={JSON.stringify(pet)}>PRESS ME </button>

                                        </div>
                                    )
                                })}

                            </div>
                        )

                    })}
                </div>
                <div>
                    {this.state.FirebasePet}
                </div>
            </div>
        )
    }
}


export default Form;

