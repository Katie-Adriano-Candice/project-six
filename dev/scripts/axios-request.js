import React from 'react';
import axios from 'axios';
import Qs from 'qs';




// export class GetData extends React.Component {
//     constructor() {
//         super();
//         this.state = {
//             getShelter: []
//         }
//     }
//     componentDidMount() {
        // axios({
        //     method: 'GET',
        //     url: 'http://proxy.hackeryou.com',
        //     dataResponse: 'jsonp',
        //     paramsSerializer: function (params) {
        //         return Qs.stringify(params, { arrayFormat: 'brackets' })
        //     },
        //     params: {
        //         reqUrl: 'http://api.petfinder.com/pet.find',
        //         params: {
        //         key: key,
        //         animal: 'dog',
        //         size: 'S',
        //         output: 'full',
        //         // offset: 'lastOffset',
        //         count: 6,
        //         location: 'M2J2Y7',
        //         format: 'json'   
        //         },     
        //         xmlToJSON: false
        //     }            
        //     }).then((res) => {
//                 console.log(res);
//                 let petArray = res.data.petfinder.pets.pet;
//                 console.log(petArray);
//                 // petArray.forEach(function(pet) {
//                 //     console.log(shelterId);
//                 // });
//                 let getShelter = petArray.map(id => id.shelterId.$t);
//                 console.log(getShelter);
//                 this.setState(getShelter);
//                 // let shelterId = 
//             });
//     }
//     render() {
//         return (
//             <div>
//                 {/* render 6 animals on page, photo, age, sex, breed, etc */}
//             </div>
//         )
//     }
// }

// export class GetShelterInfo extends React.Component {
//     constructor() {
//         super();
//         this.state = {
//             getShelter: {}
//         }
//     }
//     componentDidMount() {
        // axios({
        //     method: 'GET',
        //     url: 'http://proxy.hackeryou.com',
        //     dataResponse: 'jsonp',
        //     paramsSerializer: function (params) {
        //         return Qs.stringify(params, { arrayFormat: 'brackets' })
        //     },
        //     params: {
        //         reqUrl: 'http://api.petfinder.com/shelter.get',
        //         params: {
        //         key,
        //         // id: `${getShelter.id}`,
        //         id: 'ON432',
        //         format: 'json'
        //         },
        //         xmlToJson: false
        //     }        
        // }).then((res) => {
//             console.log(res);
//             // console.log(`${getShelter.id}`);
//             console.log('does this work?');
//         });
    
//     }
//     render() {
//         return (
//             <div>

//             </div>
//         )
//     }
// }

class DisplayAnimal extends React.Component {
    // constructor() {
    //     super();
    //     this.state = {
    //         getShelterList: []
    //     }

    // }
    componentDidMount() {
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
                    animal: 'dog',

                    size: 'S',
                    output: 'full',
                    // offset: 'lastOffset',
                    count: 20,
                    location: 'M2J2Y7',
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
                petArray.map(id => {
                    getShelterList.push(id.shelterId.$t);
                });
                console.log(getShelterList);
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
                
                Promise.all(getShelterList).then((res) => {
                    console.log(res);
                    let shelters = res.map(e => {
                        console.log(e);
                        return getShelter(e);
                    });
                    Promise.all(shelters).then((shelterResponse) => {
                        console.log(shelterResponse);
                        console.log(shelterResponse[0].data.petfinder.header.status.message.$t);
                        //for each animal that has message:{ $t: "shelter opt-out" }, set them so that they do not display/are not returned
                        let filteredResponse = shelterResponse.filter(hasInfo => {
                            console.log(hasInfo.data.petfinder);
                            return hasInfo.data.petfinder.header.status.message.$t != 'shelter opt-out';
                        }).map((eachAnimal) => {
                            // name: eachAnimal.data.petfinder.shelter.name.$t
                            // console.log(name);
                            console.log(eachAnimal.data.petfinder.shelter.name.$t);
                            console.log(eachAnimal.data.petfinder.shelter.email.$t);
                            console.log(eachAnimal.data.petfinder.shelter.phone.$t);
                            const name = eachAnimal.data.petfinder.shelter.name.$t;
                            const email = eachAnimal.data.petfinder.shelter.email.$t;
                            const phone = eachAnimal.data.petfinder.shelter.phone.$t;
                            // console.log(eachAnimal);
                            // console.log(eachAnimal);
                        });


                        
                        // console.log(filteredResponse);
                        // filteredResponse.map();
                        // console.log(filteredResponse.data.petfinder);
                        });

                    
                });


            });
        
    }
    render() {
        return (
            <div>

            </div>
        )
    }

}
export default DisplayAnimal;
