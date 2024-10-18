import { View, Text, Image, Dimensions, TextInput, TouchableOpacity, Pressable, StyleSheet, FlatList, ScrollView, Linking } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import Header from '../ReuseableComponents/Header';
import Modal from "react-native-modal";
import { getuserData, removeToken } from '../services/user.service';
import { UserContext } from '../../App';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode';
import LinearGradient from 'react-native-linear-gradient';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder'

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

const { height, width } = Dimensions.get('window')
const Profile = () => {
  const mainFont = 'Montserrat-Regular'
  const mainFontBold = 'Montserrat-Bold'
  const secondFont = 'Lato-Regular'
  const userdata = 2
  const red = '#CE3436'
  const navigation = useNavigation()
  const [modals, setmodals] = useState(false)
  const [aboutmodals, setAboutmodals] = useState(false)
  const [user, setUser] = useContext(UserContext)
  const [userdataa, setUserData] = useState([])
  const [userid, setUserID] = useState("")
  const [firstName, setfirstName] = useState('');
  const [lastName, setlastName] = useState('');
  const [isLoading, setIsLoading] = useState(false)
  const focus = useIsFocused();

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userData');
      setUser(false);
      setmodals(false)
    } catch (error) {
      console.error('Error removing user data:', error);
    }
  }


  const getUser = async (id: any) => {
    console.log("getUser called")
    const userData = await getuserData(id);
    if (userData) {
      const newData = JSON.stringify(userData.data.userObj, null, 2);
      console.log(newData)
      setUserData(userData.data.userObj)
    }
    else {
      console.log("Nothing Get")
    }
  }

  const getDataUser = async () => {
    setIsLoading(true)
    const userToken = await AsyncStorage.getItem('userData');
    let deCodeedToken = await jwtDecode(userToken)
    console.log(JSON.stringify(deCodeedToken, null, 2), "sashsjkdhsakjshadkjsahdkjhkdh")
    console.log(JSON.stringify(deCodeedToken, null, 2) + "User Nameeeeeeeeeeeeeeee")

    const { data: res } = await getuserData(deCodeedToken.userId);
    // console.log(JSON.stringify(res.userObj, null, 2) + "user Dataaaaaaaaaaaaaaaaaaa")
    if (res) {
      const newData = JSON.stringify(res.userObj, null, 2);
      console.log(newData + "New .........................")
      setUserID(res.userObj._id)
      setUserData(res.userObj)
      // console.log(JSON.stringify(userdataa, null, 2) + "...............")
      setIsLoading(false)
    }
    else {
      // console.log("Nothing Get")
    }
  }

  useEffect(() => {
    if (focus) {
      // getUser("6596ace45b1cb1b0ba99818b")
      getDataUser()
    }
  }, [focus])
  return (
    <View style={{width: width, height: height, backgroundColor: 'white'}}>
      <Header back={true} label="Profile" />
      {user ? (
        <View
          style={{width: width, backgroundColor: '#F5F5F5', height: hp(45)}}>
          <View
            style={{
              width: wp(95),
              alignSelf: 'center',
              flexDirection: 'row',
              marginTop: hp(2),
            }}>
            {/* <Image source={require('../../assets/img/profileimg.png')}
            style={{ height: wp(30), width: wp(30) }} /> */}
            <View
              style={{
                width: wp(90),
                marginLeft: wp(3),
                height: wp(27),
                justifyContent: 'space-between',
              }}>
              <TouchableOpacity
                onPress={() => navigation.navigate('EditProfile', {userid})}
                style={{flexDirection: 'row', alignSelf: 'flex-end'}}>
                <Text style={{color: '#018FFD', fontSize: hp(1.8)}}>Edit</Text>
                <Image
                  source={require('../../assets/img/Edit1.png')}
                  style={{height: wp(5), width: wp(5)}}
                />
              </TouchableOpacity>
              <View style={{width: wp(60), flexDirection: 'row'}}>
                <Image
                  source={require('../../assets/img/Useri.png')}
                  style={{height: wp(5), width: wp(5)}}
                />
                {isLoading && (
                  <View style={{marginLeft: wp(2)}}>
                    <ShimmerPlaceholder style={{height: hp(1.9)}} />
                  </View>
                )}
                {!isLoading && (
                  <Text
                    style={{
                      fontSize: hp(1.9),
                      fontFamily: secondFont,
                      color: 'black',
                      marginLeft: wp(2),
                    }}>
                    {userdataa.name}
                  </Text>
                )}
              </View>
              <View style={{width: wp(60), flexDirection: 'row'}}>
                <Image
                  source={require('../../assets/img/Mail.png')}
                  style={{height: wp(5), width: wp(5)}}
                />
                {isLoading && (
                  <View style={{marginLeft: wp(2)}}>
                    <ShimmerPlaceholder style={{height: hp(1.9)}} />
                  </View>
                )}
                {!isLoading && (
                  <Text
                    style={{
                      fontSize: hp(1.9),
                      fontFamily: secondFont,
                      color: '#979797',
                      marginLeft: wp(2),
                    }}>
                    {userdataa.email}
                  </Text>
                )}
              </View>
              <View style={{width: wp(60), flexDirection: 'row'}}>
                <Image
                  source={require('../../assets/img/Call.png')}
                  style={{height: wp(5), width: wp(5)}}
                />
                {isLoading && (
                  <View style={{marginLeft: wp(2)}}>
                    <ShimmerPlaceholder style={{height: hp(1.9)}} />
                  </View>
                )}
                {!isLoading && (
                  <Text
                    style={{
                      fontSize: hp(1.9),
                      fontFamily: secondFont,
                      color: '#979797',
                      marginLeft: wp(2),
                    }}>
                    +91 {userdataa.phone}
                  </Text>
                )}
              </View>
            </View>
          </View>
        </View>
      ) : (
        <View
          style={{
            width: wp(95),
            alignSelf: 'center',
            paddingTop: hp(2),
            paddingBottom: hp(2),
            backgroundColor: 'white',
            elevation: 5,
            paddingLeft: wp(3),
            paddingRight: wp(2),
            borderRadius: wp(4),
            marginTop: hp(2),
          }}>
          <Text
            style={{
              color: 'black',
              fontFamily: mainFontBold,
              fontSize: hp(2.5),
            }}>
            Your profile
          </Text>
          <Text
            style={{
              color: 'black',
              fontFamily: mainFont,
              fontSize: hp(1.8),
              marginTop: hp(1),
            }}>
            Login or signup to view your complete profile.
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Welcome')}
            style={{
              width: wp(90),
              alignSelf: 'center',
              height: hp(5.5),
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: hp(2),
              borderWidth: 1,
              borderColor: red,
              borderRadius: 5,
            }}>
            <Text style={{color: red, fontFamily: mainFont, fontSize: hp(2)}}>
              Login/Signup
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Profile section >>>>>>>>>>>>>>>>>>>>>>>>> */}
      <View
        style={{
          width: wp(88),
          alignSelf: 'center',
          paddingTop: hp(2),
          paddingBottom: hp(2),
          backgroundColor: 'white',
          elevation: 3,
          borderRadius: wp(7),
          marginTop: user ? hp(-23) : hp(10),
        }}>
        {user && (
          <TouchableOpacity
            onPress={() => navigation.navigate('Notification')}
            style={{
              width: wp(88),
              height: hp(7),
              flexDirection: 'row',
              borderBottomColor: '#EEEEEE',
              borderBottomWidth: 0.7,
              alignItems: 'center',
              paddingLeft: wp(4),
            }}>
            <Image
              source={require('../../assets/img/Bell.png')}
              style={{tintColor: red, height: wp(6), width: wp(6)}}
            />
            <Text style={{fontSize: hp(2), marginLeft: wp(4), color: 'black'}}>
              Notification
            </Text>
          </TouchableOpacity>
        )}
        {user && (
          <TouchableOpacity
            onPress={() => navigation.navigate('AddAddress')}
            style={{
              width: wp(88),
              height: hp(7),
              flexDirection: 'row',
              borderBottomColor: '#EEEEEE',
              borderBottomWidth: 0.7,
              alignItems: 'center',
              paddingLeft: wp(4),
            }}>
              
            <Image
              source={require('../../assets/img/Home.png')}
              style={{tintColor: red, height: wp(6), width: wp(6), }}
            />
            <Text style={{fontSize: hp(2), marginLeft: wp(4), color: 'black'}}>
              My Address
            </Text>
          </TouchableOpacity>
        )}
        {user && (
          <TouchableOpacity
            onPress={() => navigation.navigate('Orderss')}
            style={{
              width: wp(88),
              height: hp(7),
              flexDirection: 'row',
              borderBottomColor: '#EEEEEE',
              borderBottomWidth: 0.7,
              alignItems: 'center',
              paddingLeft: wp(4),
            }}>
            <Image
              source={require('../../assets/img/order.png')}
              style={{tintColor: red, height: wp(6), width: wp(6)}}
            />
            <Text style={{fontSize: hp(2), marginLeft: wp(4), color: 'black'}}>
              Order History
            </Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={() => navigation.navigate('PrivacyPolicy')}
          style={{
            width: wp(88),
            height: hp(7),
            flexDirection: 'row',
            borderBottomColor: '#EEEEEE',
            borderBottomWidth: 0.7,
            alignItems: 'center',
            paddingLeft: wp(4),
          }}>
          <Image
            source={require('../../assets/img/Document.png')}
            style={{tintColor: red, height: wp(6), width: wp(6)}}
          />
          <Text style={{fontSize: hp(2), marginLeft: wp(4), color: 'black'}}>
            Privacy Policy
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('Help')}
          style={{
            width: wp(88),
            height: hp(7),
            flexDirection: 'row',
            borderBottomColor: '#EEEEEE',
            borderBottomWidth: 0.7,
            alignItems: 'center',
            paddingLeft: wp(4),
          }}>
          <Image
            source={require('../../assets/img/Headphones.png')}
            style={{tintColor: red, height: wp(6), width: wp(6)}}
          />
          <Text style={{fontSize: hp(2), marginLeft: wp(4), color: 'black'}}>
            Help & Support
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('T&C')}
          style={{
            width: wp(88),
            height: hp(7),
            flexDirection: 'row',
            borderBottomColor: '#EEEEEE',
            borderBottomWidth: 0.7,
            alignItems: 'center',
            paddingLeft: wp(4),
          }}>
          <Image
            source={require('../../assets/img/Document1.png')}
            style={{tintColor: red, height: wp(6), width: wp(6)}}
          />
          <Text style={{fontSize: hp(2), marginLeft: wp(4), color: 'black'}}>
            Term & Conditions
          </Text>
        </TouchableOpacity>
        {user && (
          <TouchableOpacity
            onPress={() => setmodals(true)}
            style={{
              width: wp(88),
              height: hp(7),
              flexDirection: 'row',
              alignItems: 'center',
              paddingLeft: wp(4),
            }}>
            <Image
              source={require('../../assets/img/Logout.png')}
              style={{tintColor: red, height: wp(6), width: wp(6)}}
            />
            <Text style={{fontSize: hp(2), marginLeft: wp(4), color: 'black'}}>
              Logout
            </Text>
          </TouchableOpacity>
        )}
      </View>
      <Modal
        onBackButtonPress={() => setmodals(false)}
        onBackdropPress={() => setmodals(false)}
        animationIn={'fadeIn'}
        animationOut={'fadeOut'}
        isVisible={modals}>
        <View
          style={{
            width: wp(90),
            paddingTop: hp(3),
            backgroundColor: 'white',
            alignItems: 'center',
            borderRadius: wp(3),
          }}>
          <Image
            source={require('../../assets/img/Logout.png')}
            style={{height: wp(25), width: wp(25), tintColor: red}}
          />
          <Text
            style={{
              width: wp(65),
              alignSelf: 'center',
              textAlign: 'center',
              fontSize: hp(2.2),
              fontFamily: secondFont,
              marginTop: hp(2),
              color: 'black',
            }}>
            Are you sure you want to logout ?
          </Text>
          <View
            style={{
              width: wp(90),
              height: hp(7),
              borderTopColor: '#D9D9D9',
              borderTopWidth: 0.7,
              marginTop: hp(3),
              flexDirection: 'row',
            }}>
            <TouchableOpacity
              onPress={() => setmodals(false)}
              style={{
                width: wp(45),
                borderRightColor: '#D9D9D9',
                borderRightWidth: 0.7,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  color: '#BFBFBF',
                  fontSize: hp(2),
                  fontFamily: secondFont,
                }}>
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleLogout()}
              style={{
                width: wp(45),
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text
                style={{color: red, fontSize: hp(2), fontFamily: secondFont}}>
                Logout
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <View
        style={{
          width: wp(53),
          height: hp(6),
          borderRadius: 2,
          alignSelf: 'center',
          marginTop: hp(3),
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        {/* <TouchableOpacity style={{ width:wp(40), backgroundColor:red, height:hp(6), alignItems:'center', justifyContent:'center',borderTopLeftRadius:wp(2), borderBottomLeftRadius:wp(2) }}>
          <Text style={{ color: 'white' , fontSize:hp(1.7), fontFamily:mainFont}}>Become A Member</Text>
        </TouchableOpacity>
        <TouchableOpacity 
        onPress={()=>setAboutmodals(true)}
        style={{ width:wp(40), backgroundColor:'black', height:hp(6), alignItems:'center', justifyContent:'center',borderTopRightRadius:wp(2), borderBottomRightRadius:wp(2) }}>
          <Text style={{ color: 'white' , fontSize:hp(1.7), fontFamily:mainFont}}>About Tekool</Text>
        </TouchableOpacity> */}
        <TouchableOpacity
          onPress={() => Linking.openURL('http://www.facebook.com')}
          style={{
            height: wp(8),
            width: wp(8),
            backgroundColor: '#393f53',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: wp(5),
          }}>
          <Image
            source={require('../../assets/img/facebook.png')}
            style={{
              height: wp(5),
              width: wp(5),
              tintColor: 'white',
              resizeMode: 'contain',
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => Linking.openURL('http://www.twitter.com')}
          style={{
            height: wp(8),
            width: wp(8),
            backgroundColor: '#393f53',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: wp(5),
          }}>
          <Image
            source={require('../../assets/img/twitter.png')}
            style={{
              height: wp(5),
              width: wp(5),
              tintColor: 'white',
              resizeMode: 'contain',
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => Linking.openURL('http://www.instagram.com')}
          style={{
            height: wp(8),
            width: wp(8),
            backgroundColor: '#393f53',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: wp(5),
          }}>
          <Image
            source={require('../../assets/img/instagram.png')}
            style={{
              height: wp(5),
              width: wp(5),
              tintColor: 'white',
              resizeMode: 'contain',
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => Linking.openURL('http://www.linkedin.com')}
          style={{
            height: wp(8),
            width: wp(8),
            backgroundColor: '#393f53',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: wp(5),
          }}>
          <Image
            source={require('../../assets/img/linkedin.png')}
            style={{
              height: wp(5),
              width: wp(5),
              tintColor: 'white',
              resizeMode: 'contain',
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => Linking.openURL('http://www.youtube.com')}
          style={{
            height: wp(8),
            width: wp(8),
            backgroundColor: '#393f53',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: wp(5),
          }}>
          <Image
            source={require('../../assets/img/youtube.png')}
            style={{
              height: wp(5),
              width: wp(5),
              tintColor: 'white',
              resizeMode: 'contain',
            }}
          />
        </TouchableOpacity>
      </View>
      {/* <Modal
      isVisible={aboutmodals}
      style={{marginLeft:0, marginRight:0}}>
<View style={{width:wp(80), height:hp(20),backgroundColor:'white', alignSelf:'center'}}>
<Text>Follow Us:</Text>
</View>
      </Modal> */}
    </View>
  );
}

export default Profile