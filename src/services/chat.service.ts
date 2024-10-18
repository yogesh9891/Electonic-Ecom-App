import { url } from './url.service';
import axios from 'axios';
import { getToken } from './user.service';

const prefix = `${url}/message`

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

// export const useMessageApiHook = async () => {

export const addMessageApi = async (chatId: string, obj: any) => {
    const config = await getAuth()
    return await axios.post(`${prefix}/?chatId=${chatId}`, obj, config);
};
export const getMessageApi = async (chatId: string) => {
    const config = await getAuth()
    return await axios.get(`${prefix}/?chatId=${chatId}`, config);
};
// return { addMessageApi, getMessageApi }
// }