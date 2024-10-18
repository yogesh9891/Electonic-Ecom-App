import { url } from './url.service';
import axios from 'axios';
import { getToken } from './user.service';

const server_url = `${url}/Order`


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


export const createOrderAPI = async (formData: any) => {
    const config = await getAuth()
    return axios.post(`${server_url}/createOrder`, formData, config)
}

export const createGuestOrderApi = async (formData: any) => {
    const config = await getAuth()
    return axios.post(`${server_url}/createGuestOrder`, formData, config)
}

export const getOrderByIdApi = (id: string) => {
    return axios.get(`${server_url}/getOrderById/${id}`)
}

export const getOrderByUserId = async (id: string) => {
    const config = await getAuth()
    return axios.get(`${server_url}/getById/${id}`, config)
}

export const getOrderIdSequence = (orderID: string) => {
    return 'Tekool ' + `${(new Date().getFullYear())}`.substring(2) + '-' + `${(new Date().getFullYear() + 1)}`.substring(2) + '/' + `${String(orderID).padStart(3, '0')}`;
}

export const cancelOrderByIdApi = async (id: string) => {
    const config = await getAuth()
    return axios.get(`${server_url}/cancelOrderById/${id}`, config)
}

export const getOrderByUserIdApi = async (query: any) => {
    const config = await getAuth()
    return axios.get(`${server_url}/getOrdersByUserId`, config)
}

export const paymentCallback = async (id: any, query: any) => {
    const config = await getAuth()
    return axios.get(`${server_url}/paymentCallback/${id}?${query}`, config);
};

export const getOrderss = async () => {
    const config = await getAuth()
    return axios.get(`${server_url}/getOrders`, config);
};