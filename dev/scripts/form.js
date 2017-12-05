import React from 'react';//
import ReactDOM from 'react-dom';
import axios from 'axios';
import { firebaseRef, firebaseBase, provider, firebaseAuth } from './firebase-code';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Scroll, { scroller, Link as LinkScroll } from 'react-scroll';
import Login from './login.js';
import Notes from './user-notes.js';
import Qs from 'qs';

// smooth scroll componeent
let scroll = Scroll.animateScroll;

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
            petDescription: '',
            imageOfPet: ''
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

    getAnimals(animal, sex, size, place) {
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
                    sex: sex,
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
            console.log(petArray);
            
            petArray.forEach(id => {
                getShelterList.push(id.shelterId.$t);
                let petNameUnique = id.name.$t;
                let petSex = id.sex.$t;
                let petDescription = id.description.$t;

                this.setState({ petNameUnique });
                this.setState({petSex});
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

            Promise.all(shelters).then((shelterResponse) => {
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

            });
        })
    }

    // adding the pet to firebase
    addPet(event) {
        event.preventDefault();

        if (!this.props.user) {
            alert("Please login to save an animal to your profile.");
            return;
        }

        let sheltersToFirebase = (JSON.parse(event.target.dataset.shelterinfo));
        const shelterToFirebase = sheltersToFirebase.shelter;

        let petToFirebase = (JSON.parse(event.target.dataset.animalinfo));
        

        let petImages = petToFirebase.media.photos.photo;
        let petImage = petImages.map(photo => {
                if (photo['@size'] === 'x') {
                    return photo.$t
                }
            }).filter(photo => photo)

        

        const sendingPetsToFirebase= {
            

            petImage: petImage[0],
            name: petToFirebase.name.$t,
            petDescription: petToFirebase.description.$t,
            shelterName: shelterToFirebase.name.$t,
            shelterCity: shelterToFirebase.city.$t,
            shelterContact: shelterToFirebase.email.$t,
            comments: {}
        };


        const dbRef = firebaseBase.ref(`${this.props.userID}/animal`);
        const userPerferencePet = dbRef.push(sendingPetsToFirebase)
    }




    // gets get photo at size of x
    getPetPhotos(media) {
        console.log(media);
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

            this.getAnimals(this.state.animal, this.state.sex, this.state.size, this.state.postalCode);
            this.setState({
                postalCode: '',
            });
        } else {
            alert("Please enter a valid postal code!");
        }
    }

    scrollTo() {
        scroll.scrollTo(810);
        smooth: "easeOutQuad"
    }

    render() {
        return (
            <div>

                <section className="headerAnimals">
                    <div className="circle__wrapper">
                        <div className="circle__content">
                            {this.props.user ?
                                <p>{`Hi ${this.props.user}, let's find you a furrrever friend!`}</p>
                                : <p>Sign in to find your <span>furrrever friend!</span></p>
                            }
                        </div>
                    </div>

                    <a onClick={this.scrollTo}>

                            <i className="fa fa-arrow-down arrow" aria-hidden="true" aria-label="Go Down To Form Section"></i>
                    </a>
                    
                </section>

                <div className="second-frame">
                    {this.props.user ?
                        <div className="floating--profile">
                            <Link to={`/profile/${this.props.userID}`}>your profile <i className="fa fa-paw" aria-hidden="true"></i> </Link>
                        </div>
                        :
                            null
                        }
                
                    <div className="wrapper--inner">
                        <div className="second-frame--title" name="test1">
                        <h3>Find A Furry Friend Near You!</h3>
                        <div className= "floating-profile--mediaquerie">
                        {this.props.user ?
                            <Link to={`/profile/${this.props.userID}`}>Go to your profile</Link>   
                        :
                            null
                        }
                        </div>
                    </div>
                    <form onSubmit={this.addRequest} className="addForm">
                        <div className="text-input">
                            <label htmlFor="postalCode" className="locationInput">What's your postal code*</label>
                            <input type="text" name="postalCode" placeholder="ie.M9P 1N8" id="currentPostalCode" rrequired="true" value={this.state.postalCode} onChange={this.handleChange} />
                        </div>

                        {/* selecting between dog/cat */}

                        <p>What kind of furry friend are you looking for?*</p>
                        <div className="radio two-options clearfix">
                            <div className="radioChoice">
                                <input type="radio" value="cat" name="animal" required="true" id="cat" onChange={this.handleChange} />

                                <label htmlFor="cat">Cat</label>
                                <div className="check"></div>
                            </div>
                            <div className="radioChoice">
                                <input type="radio" value="dog" name="animal" required="true" id="dog" onChange={this.handleChange} />
                                <label htmlFor="dog">Dog</label>
                                <div className="check"></div>
                            </div>
                        </div>

                        {/* selecting a size of the animal*/}
                        <p>How big of a companion are you looking for?*</p>
                        <div className="radio clearfix">
                            <div className="radioChoice">
                                <input type="radio" value="S" name="size" required="true" id="small" onChange={this.handleChange} />
                                <label htmlFor="small">Small</label>
                                <div className="check"></div>
                            </div>
                            <div className="radioChoice">
                                <input type="radio" value="M" name="size" required="true" id="medium" onChange={this.handleChange} />
                                <label htmlFor="medium">Medium</label>
                                <div className="check"></div>
                            </div>
                            <div className="radioChoice">
                                <input type="radio" value="L" name="size" required="true" id="large" onChange={this.handleChange} />
                                <label htmlFor="large">Large</label>
                                <div className="check"></div>
                            </div>
                        </div>

                        {/* selecting the sex of the animal*/}
                        <p>Choose the sex of the animal you'd like to adopt.*</p>
                        <div className="radio clearfix">
                            <div className="radioChoice">
                                <input type="radio" value="M" name="sex" required="true"  id="male" onChange={this.handleChange} />
                                <label htmlFor="male">Male</label>
                                <div className="check"></div>
                            </div>
                            <div className="radioChoice">
                                <input type="radio" value="F" name="sex" required="true" id="female" onChange={this.handleChange} />
                                <label htmlFor="female">Female</label>
                                <div className="check"></div>
                            </div>
                            <div className="radioChoice">
                                <label htmlFor="both">Either</label>
                                <input type="radio" value="" name="sex" required="true" id="both" onChange={this.handleChange} />
                                <div className="check"></div>
                            </div>
                        </div>
                        <input type='submit' className='button-submit' value="Find A Furry Friend!" />
                    </form>
                    <nav className="credits">
                        <ul className="credits__list">
                            <li>Website Created By:</li>
                            <li><a href="https://twitter.com/adriboin">Adriano Boin,</a></li>
                            <li><a href="https://twitter.com/Kate_DAngelo">Katie D'Angelo,</a></li>
                            <li><a href="https://twitter.com/candicecodes">Candice Mayes</a></li>
                        </ul>
                    </nav>
                </div>
            <div>
            {this.state.filteredResponse.map((shelter, i) => {
                const pets = shelter.pets;
                console.log(shelter);
                return (
                    <div>
                        
                        <div className="shelter-appear" key={shelter.shelter.id.$t}>
                            <div className="shelter-sub wrapper--inner clearfix">
                                <p className="shelter-name" id="name">{shelter.shelter.name.$t}</p>
                                <p className="shelter-city" id="city">{shelter.shelter.city.$t}</p>
                                    <a href="mailto:{shelter.shelter.email.$t}">Email the shelter</a>
                            </div>
                            {pets.map((pet, index) => {
                                return (
                                    <div className="animals-appear wrapper--inner clearfix" key={pet.id.$t}>
                                        {/* displays first pet in array of images */}
                                        <img src={this.getPetPhotos(pet.media)[0]} />
                                        <div className="animal-info">
                                            <p className="animals-name" id="animalsName">{pet.name.$t}</p>
                                            <p className="animals-description" id="animals-descrip">{pet.description.$t}</p>
                                            <button onClick={this.addPet} data-shelterinfo={JSON.stringify(shelter)} data-animalinfo={JSON.stringify(pet)}>Add This Animal To Your Profile</button>
                                        </div>

                                    </div>
                                )
                            })}

                        </div>
                </div>
                        )

                    })}
                </div>
            </div>
        </div>
        )
    }
}
export default Form;
