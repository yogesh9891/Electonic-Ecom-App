import { CartItem } from './localcart.service';
import { url } from './url.service';
import axios from 'axios';
import { getToken } from './user.service';

const server_url = `${url}/userCart`



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

export const getCartProduct = async () => {
    const config = await getAuth()

    return axios.get(`${server_url}/`, config)
}

export const addToCart = async (obj: any) => {

    const config = await getAuth()

    return axios.post(`${server_url}/addToCart`, obj, config)
}

export const removecartProduct = async (id: any,obj:any) => {

    const config = await getAuth()

    return axios.patch(
      `${server_url}/removeProductFromCart/${id}`,
      obj,
      config,
    );
}

export const addLocalCartApi = async (obj: any) => {
    const config = await getAuth()
    return axios.post(`${server_url}/addLocalCart/`, { data: obj }, config);
};



// let token = await getToken();
//     let config: any = {
//         headers: {

//         }
//     }

//     if (token) {
//         console.log(token, "token")
//         config.headers['authorization'] = `Bearer ` + JSON.parse(token)
//     }