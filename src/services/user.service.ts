import { url } from './url.service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import jwtDecode from "jwt-decode";

const server_url = `${url}/users`

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


export const loginUser = async (obj: any) => {
    return axios.post(`${server_url}/login`, obj)
}

export const registerUser = async (obj: any) => {
    return axios.post(`${server_url}/register`, obj)
}

export const getuserData = async (id: any) => {
    const config = await getAuth()
    return axios.get(`${server_url}/getById/${id}`, config)
}


export const sendMail = async (obj: any) => {
    return axios.post(`${server_url}/sendMailToUserEmail`, obj)
}


export const updateUserByID = async (id: any, obj: any) => {
    return axios.patch(`${server_url}/updateById/${id}`, obj)
}


export const ChangePass = async (obj: any) => {
    return axios.post(`${server_url}/changePassword`, obj)
}

export const getemailUser = async (obj: any) => {
    return axios.post(`${server_url}/getUserByemail`, obj)
}



// export const setToken = async (token: string) => {
//     await AsyncStorage.setItem('AUTH_TOKEN', token);
//     return true;
// };


// export const getToken = async () => {
//     let token = await AsyncStorage.getItem('AUTH_TOKEN');
//     return token;
// };


export const getDecodedToken = async () => {
    let token = await AsyncStorage.getItem('userData');
    console.log(token, "token check")
    if (!token) {
        return null;
    }
    let value = JSON.parse(token);
    let decodedToken = await jwtDecode(value);
    console.log(decodedToken, "DECODED TOKEN IN SERVICE")
    return decodedToken;
};


export const getToken = async () => {
    let token = await AsyncStorage.getItem('userData');
    return token;
};



export const removeToken = async () => {
    await AsyncStorage.removeItem('AUTH_TOKEN');
};