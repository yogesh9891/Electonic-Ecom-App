import { Manager } from 'socket.io-client'
import { url } from '../services/url.service'

const manager = new Manager(url, {
    autoConnect: true
})
export const socket = manager.socket("/api/socket.io")

manager.open((err) => {
    if (err) {
        console.log("connection?", err)
    } else {
        console.log("connection?")
    }
});

export const connectToServerSocket = () => {
    socket.connect();
};

export const onSocketConnect = (callBackFn: any) => {
    socket.on("connect", callBackFn);
    console.log("connection?");
    console.log(callBackFn);
};

export const forceReconnectToServerSocket = () => {
    socket.disconnect().connect();
};

export const disconnectToServerSocket = () => {
    socket.disconnect();
};

export const joinRoom = (roomId: string) => {
    socket.emit("joinRoom", { id: roomId });
};
export const leaveRoom = (roomId: string) => {
    socket.emit("leaveRoom", { id: roomId });
};

export const getSocketId = () => {
    return socket.id;
};

// export const listenToAnyEvent = (callBackFn) =>{
//     socket.onAny(callBackFn);
//     // socket.onAny((event) => {
//     //     console.log(`${event.name} was called with data: `, event.items);
//     // });
// }

export const listenToMessages = (callBackFn: any) => {
    socket.on("message", callBackFn);
    // socket.on('message', msg=>{
    //     alert(`new message ${msg.content}`)
    // })
};
export const sendMessage = async (obj: any) => {
    socket.emit("message", {
        roomId: obj.roomId,
        message: obj.message,
        senderId: obj.userId,
        read: false,
        type: obj.type,
    });
};