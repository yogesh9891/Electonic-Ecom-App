import { View, Text, Image, Dimensions, TextInput, TouchableOpacity, Pressable, StyleSheet, FlatList, ScrollView, KeyboardAvoidingView, Platform, Keyboard } from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import Header from '../ReuseableComponents/Header';
import * as Animatable from 'react-native-animatable';
import io from 'socket.io-client';
import { getuserData } from '../services/user.service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode';
import { getMessageApi } from '../services/chat.service';
import { joinRoom, listenToMessages, sendMessage } from '../utils/socketService';

const { height, width } = Dimensions.get('window')
const Chat = () => {
  const mainFont = 'Montserrat-Regular'
  const mainFontBold = 'Montserrat-Bold'
  const secondFont = 'Lato-Regular'
  const red = '#CE3436'
  const navigation = useNavigation()
  const [mediaopn, setMediaopn] = useState(false)
  const [chatId, setChatId] = useState('');
  const [chatArr, setChatArr] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const [userId, setuserId] = useState('')
  const [loading, setloading] = useState(true)
  // let { addMessageApi, getMessageApi } = useMessageApiHook()
  // const socket = io('http://your-server-address:port');

  useEffect(() => {
    const socket = io('https://apitekool.ebslonserver3.com/message');

    // Socket.io event listeners
    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('message', (data) => {
      console.log('Received message:', data);
    });

    // Clean up the socket connection when component unmounts
    return () => {
      socket.disconnect();
    };
  }, []);

  const flatListRef = useRef(null);

  const getChatID = async () => {
    setloading(true)
    const userToken = await AsyncStorage.getItem('userData');
    let deCodeedToken = await jwtDecode(userToken)
    console.log(deCodeedToken.user._id, ">>LLLL")
    let res = await getuserData(deCodeedToken.user._id)
    console.log(JSON.stringify(res.data.userObj._id, null, 2), "?///////////????????")
    if (res.data.userObj) {
      setChatId(res.data.userObj.chatId)
      setuserId(res.data.userObj._id)

    }
    let chatIDDDDDDDDD = res.data.userObj.chatId;
    let { data: response } = await getMessageApi(chatIDDDDDDDDD);
    if (response.data) {
      console.log(JSON.stringify(response.data, null, 2), "response.............")
      let sortedMessage = response.data.sort((a: any, b: any) => new Date(a.createdAt) - new Date(b.createdAt));

      if (sortedMessage) {
        setChatArr(sortedMessage)
        // if (flatListRef.current) {
        //   flatListRef.current.scrollToIndex({ index: chatArr.length - 1, animated: true });
        // }
        setloading(false)
      }
    }
  }

  const handleOnint = async () => {
    try {
      joinRoom(chatId);
      listenToMessages(async (data: any) => {
        console.log(data);
        // let userSession:any = session.user;
        // const userToken = await jwtDecode()
        const userToken = await AsyncStorage.getItem('userData');
        let deCodeedToken = await jwtDecode(userToken)
        let userId = deCodeedToken.user._id;
        console.log(deCodeedToken.user._id, ">>LLLL")
        if (userId != data.senderId) {
          let tempObj = { ...data, chatId: data.roomId, message: data.message, sentByMe: false, userId: data.senderId };
          setChatArr((prevState: any) => {
            prevState.push(tempObj);
            return [...prevState];
          });
        }
        // readChatMessage();
        console.log("ASdADsADs");
      });
    } catch (error) {
      console.error(error)
    }

  };


  useEffect(() => {
    getChatID()
    handleOnint()
  }, [])


  const handleKeypress = (event: any) => {
    console.log(event.nativeEvent.key, "aaasaSa")
    if (event.nativeEvent.key === 'Enter') {
      sendMessageee()
      // console.log("event.nativeEvent.key")
    }
  }

  const sendMessageee = async () => {
    console.log("send Message called", message)

    if (message != "") {
      await sendMessage({ roomId: chatId, type: "text", message, senderId: userId })
      let tempArr = [...chatArr];
      tempArr.push({ message, chatId: chatId, type: "text", senderId: userId, sentByMe: true });
      setChatArr((prevState: any) => {
        prevState.push({ message, chatId: chatId, userId: userId, sentByMe: true, createdAt: new Date() });
        return [...prevState];
      });
      setMessage("");
    }
  }

  const date = new Date();

  // Get individual components of the date
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // Month is zero-indexed
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  // Format the date in a human-readable format
  const formattedDate = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day} ${hours}:${minutes}:${seconds}`;


  // useEffect(() => {
  //   if (chatArr) {
  //     if (flatListRef.current) {
  //       flatListRef.current.scrollToIndex({ index: chatArr.length - 1, animated: true });
  //     }
  //   }
  // }, [chatArr]);




  useEffect(() => {
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {

      // sendMessageee()
      console.log('Keyboard Hidden');
    });

    return () => {
      hideSubscription.remove();
    };
  }, []);



  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ width: width, height: height, backgroundColor: 'white', flex:1, paddingBottom: hp(1.5) }}>
      <Header back={true} label='Chat With Us' />

      <FlatList
        data={chatArr}
        ref={flatListRef}
        // onScroll={}
        // onStartReached={ }
        renderItem={({ item, index }) => {
          return (
            <View style={{ width: wp(95), alignSelf: 'center', marginBottom: hp(2) }}>
              <View style={{ maxWidth: wp(70), paddingTop: hp(1), paddingBottom: hp(1), backgroundColor: '#F5F5F5', paddingRight: item.sentByMe == true ? wp(1) : wp(3), paddingLeft: item.sentByMe == true ? wp(3) : wp(1), marginBottom: hp(0), borderRadius: wp(4), alignSelf: item.userId ? 'flex-start' : 'flex-end' }}>
                <Text style={{ color: 'black', fontFamily: secondFont, maxWidth: wp(66), textAlign: 'right', fontSize: hp(1.8) }}>{item.message}
                </Text>
              </View>
              <View style={{ alignSelf: item.userId ? 'flex-start' : 'flex-end' }}>
                <Text style={{ color: 'black', fontFamily: secondFont, maxWidth: wp(30), fontSize: hp(1) }}>{new Date(item.createdAt).toLocaleString('en-US', { timeStyle: 'long' })}</Text>
              </View>
              {/* <View style={{ maxWidth: wp(70), paddingTop: hp(1), paddingBottom: hp(1), backgroundColor: '#F5F5F5', paddingRight: wp(1), paddingLeft: wp(3), marginBottom: hp(1.5), borderRadius: wp(4) }}>
                  <Text style={{ color: 'black', fontFamily: secondFont, fontSize: hp(1.8) }}>Hi,
                    i am Rajini from Tekool.</Text>
                </View> */}

            </View>
          )
        }}

        ListFooterComponent={<>
        </>}
      />
      {/* <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ height: hp(90), paddingBottom: hp(0) }}> */}
      {mediaopn && <Animatable.View animation={'bounceInUp'} style={{ width: wp(80), height: hp(20), backgroundColor: 'white', elevation: 2, position: 'absolute', alignSelf: 'center', bottom: hp(9), borderRadius: 3, flexDirection: 'row', paddingTop: hp(2), paddingLeft: wp(3), gap: wp(8) }}>
        <TouchableOpacity >
          <Image source={require('../../assets/img/camera.png')}
            style={{ height: wp(10), width: wp(10), }} />
        </TouchableOpacity>
        <TouchableOpacity >
          <Image source={require('../../assets/img/gallery.png')}
            style={{ height: wp(10), width: wp(10), tintColor: 'gray' }} />
        </TouchableOpacity>
        <TouchableOpacity >
          <Image source={require('../../assets/img/docs.png')}
            style={{ height: wp(10), width: wp(10), tintColor: 'gray' }} />
        </TouchableOpacity>
      </Animatable.View>}

      <View
        style={{ width: wp(95), flexDirection: 'row', alignSelf: 'center', justifyContent: 'space-between', paddingTop: hp(1) }}>
        <View style={{ width: wp(80), height: hp(6), backgroundColor: '#F1F1F1', borderRadius: wp(10), flexDirection: 'row', alignItems: 'center', paddingRight: wp(3), paddingLeft: wp(3), elevation: 2 }}>
          <TouchableOpacity>
            <Image source={require('../../assets/img/smile.png')}
              style={{ height: wp(7), width: wp(7) }} />
          </TouchableOpacity>
          <TextInput
            // onKeyPress={(keyPress) => console.log(keyPress, "ASd")}
            value={message}
            onChangeText={(e) => { setMessage(e); }}
            onSubmitEditing={() => { sendMessageee() }}
            placeholder='Message'
            style={{ width: wp(55), marginLeft: wp(2) }}
          // returnKeyType="send"
          />
          <TouchableOpacity onPress={() => setMediaopn(!mediaopn)}>
            <Image source={require('../../assets/img/attach.png')}
              style={{ height: wp(6), width: wp(6), tintColor: 'gray' }} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={sendMessageee} style={{ width: wp(11), height: wp(11), backgroundColor: red, borderRadius: wp(6), alignItems: 'center', justifyContent: 'center', elevation: 3, marginTop: hp(0.4) }}>
          <Image source={require('../../assets/img/send.png')}
            style={{ height: wp(5), width: wp(5), tintColor: 'white' }} />
        </TouchableOpacity>
      </View>
      {/* </KeyboardAvoidingView> */}
    </KeyboardAvoidingView>
  )
}

export default Chat