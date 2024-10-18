import { url } from './url.service';
import axios from 'axios';
import { getToken } from './user.service';

const server_url = `${url}/wishlist`



const getAuth = async () => {
    let token = await getToken();
    let config: any = {
        headers: {

        }
    }

    if (token) {
        console.log(token, "token")
        config.headers['authorization'] = `Bearer ` + JSON.parse(token)
    }
    return (config)
    console.log(config)
}

export const addToWishlistApi = async (obj: any) => {
    const config = await getAuth()
    return axios.post(`${server_url}/createWishlist`, obj, config);
};

export const getWishlistApi = async (obj: any) => {
    const config = await getAuth()
    return axios.get(`${server_url}/getWishlist`, config);
};

export const removeWishlistApi = async (id: string) => {
    const config = await getAuth()
    return axios.get(`${server_url}/removeWishlist/${id}`, config);
};