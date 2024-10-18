import { url } from './url.service';
import axios from 'axios';

const server_url = `${url}/category`

export const getAllCat = async () => {
    return axios.get(`${server_url}/getCategoryForAppHomePage`)
}

export const getCategoryForAppHomePage = async (query: string) => {
  return axios.get(`${server_url}/getCategoryForAppHomePage/?${query}`);
};

export const getCategoryBySlug = async (id: string, query = '') => {
  console.log(`${server_url}/getNameBySlug/${id}?${query}`);
  return axios.get(`${server_url}/getNameBySlug/${id}?${query}`);
};