import { url } from './url.service';
import axios from 'axios';

const server_url = `${url}/brand`

export const getAllBrand = async (query:string) => {
    return axios.get(`${server_url}/getBrand?${query}`);
}