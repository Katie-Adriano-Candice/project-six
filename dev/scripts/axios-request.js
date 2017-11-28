import React from 'react';
import axios from 'axios';
import Qs from 'qs';

const key = 'e9a6ca7347527ff3b4dabbf7e663f9f1';

class GetData extends React.Component {
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



    // axios.get('http://api.petfinder.com/pet.find', {
    //     params: {
    //         key: key,
    //         animal: 'dog',
    //         size: 'S',
    //         location: 'M6J2Y7',
    //         format: 'jsonp'
    //     }
    // })
    // .then((res) => {
    //     console.log(res);
    // });