import { View, Text, Dimensions, Image, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useContext, useState } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation, useRoute } from '@react-navigation/native';
import { loginUser, } from '../services/user.service';
import { UserContext } from '../../App';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from "react-native-modal";
import jwtDecode from 'jwt-decode';

const { height, width } = Dimensions.get('window')
const Login = () => {
  const mainFont = 'Montserrat-Regular'
  const mainFontBold = 'Montserrat-Bold'
  const navigation: any = useNavigation()
  const [agree, setAgree] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useContext(UserContext)
  const [warnModal, setWarnmodal] = useState(false)
  const [warning, setWarning] = useState('')
  const [loading, setLoading] = useState(false)
  const route = useRoute();

  // const { pageType } = route.params;
  // console.log(pageType, "Coming from")

  const HandleLogin = async () => {
    try {
      if (email == '' || password == '') {
        setWarning('Enter all Credentials.')
        setWarnmodal(true)
        setLoading(false)
      }

      let obj = {
        email,
        password
      }

      const result = await loginUser(obj);
      if (result?.data.success) {
        console.log(JSON.stringify(result, null, 2) + "......................................")
        await AsyncStorage.setItem('userData', JSON.stringify(result.data.token));
        setUser(true)
        navigation.navigate('BottamTab', { fromPage: "loginPage" })

        setLoading(false)
      }
    } catch (error) {
      console.log("first Next")
      setLoading(false)
      setWarnmodal(true)
      setWarning("Wrong Credentials")
    }
  };
  return (
    <View
      style={{
        width: width,
        height: height,
        backgroundColor: 'white',
        alignItems: 'center',
        paddingTop: hp(2),
        paddingBottom: hp(5),
        justifyContent: 'space-between',
      }}>
      <TouchableOpacity
        onPress={() => navigation.navigate('BottamTab')}
        style={{
          height: hp(4),
          width: wp(18),
          borderColor: 'gray',
          borderWidth: 1,
          borderRadius: wp(10),
          alignSelf: 'flex-end',
          marginRight: wp(2),
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text style={{color: 'gray', fontSize: hp(1.7), fontFamily: mainFont}}>
          Skip
        </Text>
      </TouchableOpacity>
      <Image
        source={require('../../assets/img/Logo.png')}
        style={{height: hp(28), width: wp(85), resizeMode: 'contain'}}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
        style={{width: wp(95), alignSelf: 'center', alignItems: 'center'}}>
        <Text
          style={{fontSize: hp(3.5), color: 'black', fontFamily: mainFontBold}}>
          Login
        </Text>
        <Text
          style={{
            fontSize: hp(1.6),
            fontFamily: mainFont,
            marginTop: hp(0.5),
            color: 'black',
          }}>
          Please login to continue using our app
        </Text>
        <View
          style={{
            width: wp(95),
            height: hp(6.3),
            borderColor: 'black',
            borderWidth: 0.7,
            borderRadius: 10,
            marginTop: hp(3),
          }}>
          <Text
            style={{
              position: 'absolute',
              width: wp(42),
              backgroundColor: 'white',
              fontSize: hp(1.7),
              marginTop: hp(-1.5),
              marginLeft: wp(5),
              textAlign: 'center',
              color: 'black',
            }}>
            Email / Mobile Number
          </Text>
          <TextInput
            value={email}
            onChangeText={e => setEmail(e)}
            style={{width: wp(75), paddingLeft: wp(3), color: 'black'}}
          />
        </View>
        <View
          style={{
            width: wp(95),
            height: hp(6.3),
            borderColor: 'black',
            borderWidth: 0.7,
            borderRadius: 10,
            marginTop: hp(3),
          }}>
          <Text
            style={{
              position: 'absolute',
              width: wp(20),
              backgroundColor: 'white',
              fontSize: hp(1.7),
              marginTop: hp(-1.5),
              marginLeft: wp(5),
              textAlign: 'center',
              color: 'black',
            }}>
            Password
          </Text>
          <TextInput
            secureTextEntry={true}
            value={password}
            onChangeText={e => setPassword(e)}
            style={{width: wp(75), paddingLeft: wp(3), color: 'black'}}
          />
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('ForgotPassword')}
          style={{alignSelf: 'flex-end', marginTop: hp(0.8)}}>
          <Text style={{fontSize: hp(1.7), color: '#0075FF'}}>
            Forgot password
          </Text>
        </TouchableOpacity>
        {agree ? (
          <TouchableOpacity
            onPress={() => {
              setLoading(true);
              HandleLogin();
            }}
            style={{
              width: wp(95),
              height: hp(6.3),
              backgroundColor: 'black',
              marginTop: hp(3),
              borderRadius: wp(1.8),
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={{color: 'white', fontSize: hp(2.2), fontFamily: mainFont}}>
              Login
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            disabled
            style={{
              width: wp(95),
              height: hp(6.3),
              backgroundColor: 'gray',
              marginTop: hp(3),
              borderRadius: wp(1.8),
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={{color: 'white', fontSize: hp(2.2), fontFamily: mainFont}}>
              Login
            </Text>
          </TouchableOpacity>
        )}
        <View style={{width: wp(95), marginTop: hp(2), flexDirection: 'row'}}>
          <TouchableOpacity onPress={() => setAgree(!agree)}>
            {agree ? (
              <Image
                source={require('../../assets/img/checkbox.png')}
                style={{width: wp(7), height: wp(7)}}
              />
            ) : (
              <Image
                source={require('../../assets/img/unchecked.png')}
                style={{width: wp(7), height: wp(7)}}
              />
            )}
          </TouchableOpacity>
          <Text
            style={{
              fontSize: hp(1.7),
              marginLeft: wp(1),
              width: wp(88),
              fontFamily: mainFont,
              color: 'black',
            }}>
            By continuing, you agree to Our's Conditions of Use and Privacy
            Notice.
          </Text>
        </View>
        <TouchableOpacity
          // onPress={() => navigation.navigate('Signup')}
          // onPress={() => navigation.navigate('Signup')}
          onPress={() => navigation.navigate('Signup')}
          style={{marginTop: hp(3)}}>
          <Text
            style={{fontSize: hp(1.7), fontFamily: mainFont, color: 'black'}}>
            Don’t have an account?{' '}
            <Text style={{color: 'black', fontFamily: mainFontBold}}>
              Sign Up
            </Text>
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
      {loading && (
        <View
          style={{
            position: 'absolute',
            top: hp(50),
            height: wp(15),
            width: wp(15),
            backgroundColor: 'white',
            elevation: 7,
            borderRadius: 5,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <ActivityIndicator size="large" color="#00ff00" />
        </View>
      )}
      <Modal
        isVisible={warnModal}
        onBackButtonPress={() => setWarnmodal(false)}
        onBackdropPress={() => setWarnmodal(false)}
        animationIn={'bounceIn'}
        animationOut={'bounceOut'}>
        <View
          style={{
            height: hp(30),
            width: wp(90),
            backgroundColor: 'white',
            alignSelf: 'center',
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={{color: 'black', fontSize: hp(2), fontFamily: mainFontBold}}>
            {warning}
          </Text>
          <TouchableOpacity
            onPress={() => setWarnmodal(false)}
            style={{
              width: wp(80),
              height: hp(5.5),
              backgroundColor: 'black',
              borderRadius: 5,
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: hp(3),
            }}>
            <Text
              style={{color: 'white', fontFamily: mainFont, fontSize: hp(1.8)}}>
              Ok
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

export default Login