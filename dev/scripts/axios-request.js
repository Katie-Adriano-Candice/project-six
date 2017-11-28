import React from 'react';
import axios from 'axios';
import Qs from 'qs';

const key = 'e9a6ca7347527ff3b4dabbf7e663f9f1';

class GetData extends React.Component {
    constructor() {
        super();
        this.state = {
            getShelter = []
        }
    }
    componentDidMount() {
        axios({
            method: 'GET',
            url: 'http://proxy.hackeryou.com',
            dataResponse: 'jsonp',
            paramsSerializer: function (params) {
                return Qs.stringify(params, { arrayFormat: 'brackets' })
            },
            params: {
                reqUrl: 'http://api.petfinder.com/pet.find',
                params: {
                key: key,
                animal: 'dog',
                size: 'S',
                output: 'full',
                // offset: 'lastOffset',
                count: 6,
                location: 'M2J2Y7',
                format: 'json'   
                },     
                xmlToJSON: false
            }            
            }).then((res) => {
                console.log(res);
                let petArray = res.data.petfinder.pets.pet;
                console.log(petArray);
                // petArray.forEach(function(pet) {
                //     console.log(shelterId);
                // });
                let getShelter = petArray.map(id => id.shelterId.$t);
                console.log(getShelter);
                this.setState(getShelter);
                // let shelterId = 
               
            });
    }
    render() {
        return (
            <div>

            </div>
        )
    }
}

export default GetData;