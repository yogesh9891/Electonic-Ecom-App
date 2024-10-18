import { url } from './url.service';
import axios from 'axios';
import { getToken } from './user.service';

const server_url = `${url}/userNotification`


export const getNotification = async () => {

    let token = await getToken();
    let config: any = {
        headers: {

        }
    }

    if (token) {
        console.log(token, "token")
        config.headers['authorization'] = `Bearer ` + JSON.parse(token)
    }

    console.log(config)


    return axios.get(`${server_url}/`, config)
}

