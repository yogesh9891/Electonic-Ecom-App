import { url } from './url.service';
import axios from 'axios';
import { getToken } from './user.service';

const server_url = `${url}/product`


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

export const getAllProduct = async () => {
    const config = await getAuth()
    return axios.get(`${server_url}/getProducts`, config)
}


export const getProductById = async (slug: any) => {
    const config = await getAuth()
    return axios.get(`${server_url}/getProductBySlug/${slug}`)
}

export const getProductBuSlugApi = (slug: string) => {
  return axios.get(`${server_url}/getProductBySlug/${slug}`);
};


export const getAllProducts = (query: string, cancelToken: any = null) => {
  if (!cancelToken || !cancelToken?.token) {
    return axios.get(`${server_url}/getActiveProducts?${query}`);
  } else {
    return axios.get(`${server_url}/getActiveProducts?${query}`, {
      cancelToken: cancelToken?.token,
    });
  }
}
