import { View, Text, Dimensions, Image, TouchableOpacity } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import jwtDecode from 'jwt-decode';
import { getuserData } from '../services/user.service';
import { UserContext, wishlistcntxt } from '../../App';
import { getNotification } from '../services/notification.service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getWishlistApi } from '../services/wishlist.service';
// import Header from '../ReuseableComponents/Header';

const { height, width } = Dimensions.get('window')
const Header = (props) => {
    const navigation: any = useNavigation()
    const mainFont = 'Montserrat-Regular'
    const mainFontBold = 'Montserrat-Bold'
    const mainFontMedium = 'Montserrat-Medium'
    const [userName, setUserName] = useState("")
    const [user, setUser] = useContext(UserContext)
    const [greeting, setgreeting] = useState("")
    const [notification, setNotification] = useState(false)
    const [wishlistArr, setWishlistArr] = useState([])
    const [itminwishlst, setitminwishlst] = useContext(wishlistcntxt)

    const isfocused = useIsFocused();



    const greetingmssg = () => {
    const currentTime = new Date().getHours();
        if (currentTime >= 5 && currentTime < 12) {
            return 'Good morning' ;
        } else if (currentTime >= 12 && currentTime < 18) {
           return 'Good afternoon';
        } else {
          return 'Good evening';
        }
    }

    const getAllNotification = async () => {
        const { data: res } = await getNotification();
        console.log(res.data.length)
        if (res.data.length > 0) {
            setNotification(true)
        }
        else {
            setNotification(false)
        }
    }

    const getWishlistData = async () => {
        const { data: res } = await getWishlistApi("")
        console.log(JSON.stringify(res, null, 2), ">>>>>>>>>>>>")
        setWishlistArr(res.data)
        setitminwishlst(res.data.length)
    }



    useEffect(() => {
        if (isfocused) {
            // greetingmssg()
            // getAllNotification()
            // getWishlistData()

            // getDataUser()
        }
    }, [isfocused])

    const getDataUser = async () => {
        const userToken = await AsyncStorage.getItem('userData');
        let deCodeedToken = await jwtDecode(userToken)
        console.log(JSON.stringify(deCodeedToken.userId, null, 2), "sashsjkdhsakjshadkjsahdkjhkdh")

        const getuserByyID = await getuserData(deCodeedToken.userId)
        console.log(JSON.stringify(getuserByyID.data.userObj.firstName, null, 2), "...............")

        setUserName(getuserByyID.data.userObj.name)

        // const userData = await getuserData(deCodeedToken.userId);
        // if (userData) {
        //     // const newData = JSON.stringify(userData.data.userObj.name, null, 2);
        //     // console.log(newData)
        //     setUserName(userData.data.userObj.name)
        // }
        // else {
        //     console.log("Nothing Get")
        // }

    }

    useEffect(() => {
        // getDataUser()
    }, [])


    return (
      <View
        style={{
          width: width,
          height: hp(8),
          flexDirection: 'row',
          paddingLeft: wp(1),
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingRight: wp(3),
          backgroundColor: 'white',
        }}>
        {props.profile && (
          <View
            style={{flexDirection: 'row', height: hp(8), alignItems: 'center'}}>
            {/* <Image source={require('../../assets/img/profileimg.png')}
                    style={{ height: wp(15), width: wp(15), resizeMode: 'contain' }} /> */}
            <View
              style={{
                height: hp(8),
                paddingTop: hp(1.5),
                paddingBottom: hp(1.5),
                marginLeft: wp(2),
              }}>
              <Text
                style={{
                  color: 'black',
                  fontSize: hp(2),
                  fontFamily: mainFontMedium,
                }}>
                Hi {greetingmssg()}
              </Text>
              <Text
                style={{
                  color: 'black',
                  fontSize: hp(1.8),
                  fontFamily: mainFontMedium,
                }}>
                {user ? userName : 'User'}
              </Text>
            </View>
          </View>
        )}
        {props.back && (
          <View
            style={{
              height: hp(8),
              flexDirection: 'row',
              width: wp(50),
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Image
                source={require('../../assets/img/back.png')}
                style={{height: wp(6), width: wp(6)}}
              />
            </TouchableOpacity>
            <Text
              style={{fontSize: hp(2), fontFamily: mainFont, color: 'black'}}>
              {props.label ? props.label : ''}
            </Text>
          </View>
        )}
        <View
          style={{flexDirection: 'row', height: hp(8), alignItems: 'center'}}>
          {/* <TouchableOpacity>
            <Image
              source={require('../../assets/img/Search.png')}
              style={{tintColor: 'black', height: wp(5.5), width: wp(5.5)}}
            />
          </TouchableOpacity> */}
          {/* <TouchableOpacity
                    onPress={() => navigation.navigate('Notification')}>
                    <Image source={require('../../assets/img/Bell.png')}
                        style={{ tintColor: 'black', height: wp(5.5), width: wp(5.5), marginLeft: wp(2) }} />

                    {notification && <View style={{ height: wp(3.5), width: wp(3.5), backgroundColor: '#e0502f', borderRadius: wp(4), position: 'absolute', right: -2, top: -5, alignItems: 'center', justifyContent: 'center' }}>
                    </View>}

                </TouchableOpacity> */}
          <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
            <Image
              source={require('../../assets/img/Bag.png')}
              style={{tintColor: 'black', height: wp(5.5), width: wp(5.5)}}
            />
          </TouchableOpacity>
          {user && (
            <TouchableOpacity onPress={() => navigation.navigate('Wishlist')}>
              <Image
                source={require('../../assets/img/like.png')}
                style={{
                  tintColor: 'black',
                  height: wp(5.5),
                  width: wp(5.5),
                  marginLeft: wp(2),
                }}
              />
              {itminwishlst > 0 && (
                <View
                  style={{
                    height: wp(4),
                    width: wp(4),
                    borderRadius: 10,
                    backgroundColor: 'red',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'absolute',
                    left: wp(5),
                    top: hp(-0.5),
                  }}>
                  <Text style={{fontSize: hp(1.5), color: 'white'}}>
                    {itminwishlst}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
}

export default Header