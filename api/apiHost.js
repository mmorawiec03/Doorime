import * as Axios from 'axios';


const apiHost = 'http://localhost:54321';

export const api = Axios.create({
    baseURL: apiHost,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        //'Authorization': 'Basic QWRtaW46MTIzNDU='
    },
});