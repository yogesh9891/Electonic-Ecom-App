import { url } from './url.service';
import axios from 'axios';
import { getToken } from './user.service';

const server_url = `${url}/user-address`

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


export const addAddressApi = async (formData: any) => {
    const config = await getAuth()
    return axios.post(`${server_url}/registerUserAddress`, formData, config)
}

export const updateAddressById = async (id: string, formData: any) => {
  const config = await getAuth();
  return axios.patch(`${server_url}/updateById/${id}`, formData, config);
};


export const getAllAddresssApi = async (query: string) => {
    const config = await getAuth()
    return axios.get(`${server_url}/getUserAddress?${query}`, config)
}
export const getPincodeApi = (query: string) => {
    return axios.get(`${server_url}/getPincode/${query}`)
}

export const deleteAddressById = async (id: string) => {
    const config = await getAuth()
    return axios.delete(`${server_url}/deleteById/${id}`, config)
}