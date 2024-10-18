import { View, Text, Dimensions, Image, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import { ChangePass, getemailUser, sendMail } from '../services/user.service';
import Modal from "react-native-modal";

const { height, width } = Dimensions.get('window')
const ForgotPassword = () => {
  const mainFont = 'Montserrat-Regular'
  const mainFontBold = 'Montserrat-Bold'
  const navigation: any = useNavigation()
  const [agree, setAgree] = useState(false)
  const [email, setEmail] = useState("");
  const [warnModal, setWarnmodal] = useState(false)
  const [warning, setWarning] = useState('')
  const [passwordfield, setPasswordfield] = useState(false)
  const [newPassword, setNewPassword] = useState("");

  const sendOtp = async () => {
    if (email == '') {

      setWarning('Enter Email Credentials.')
      setWarnmodal(true)
      // setLoading(false)
    }
    else {
      try {
        let obj = {
          email,
        }

        let response = await sendMail(obj)
        if (response) {
          console.log(response)




          // setLoading(false)
        }
        else {
          // setLoading(false)
          setWarning(response.data.message)
          setWarnmodal(true)
        }
      }

      catch (error) {

      }
    }

  }

  const changingPassword = async () => {
    try {
      let obj = {
        email,
        password: newPassword
      }

      const res = await ChangePass(obj)
      console.log(JSON.stringify(res, null, 2) + "firstttttttttttttttttttttttttt")
      if (res.data.success) {
        navigation.navigate("Welcome")
        // setWarning("Password Changes Successfully.")
        // setWarnmodal(true)
      }
    } catch (error) {
      setWarning("Something Went Wrong.")
      setWarnmodal(true)
    }
  }

  const forgetUser = async () => {
    try {
      let obj = {
        email
      }

      const res = await getemailUser(obj);
      console.log(JSON.stringify(res, null, 2) + "first response")
      if (res.data.success) {
        setPasswordfield(true)
      }
    } catch (error) {
      console.log(error)
      setWarning("Wrong E-mail")
      setWarnmodal(true)
    }
  }
  return (
    <ScrollView>
      <KeyboardAvoidingView
        style={{
          width: width,
          height: height,
          backgroundColor: 'white',
          alignItems: 'center',
          paddingTop: hp(10),
          paddingBottom: hp(12),
          justifyContent: 'space-between',
        }}>
        <Image
          source={require('../../assets/img/FPlogo.png')}
          style={{height: hp(35), width: wp(85), resizeMode: 'contain'}}
        />
        <View
          style={{width: wp(95), alignSelf: 'center', alignItems: 'center'}}>
          <Text
            style={{
              fontSize: hp(3.5),
              color: 'black',
              fontFamily: mainFontBold,
            }}>
            Forgot Password
          </Text>
          <Text
            style={{
              fontSize: hp(1.6),
              fontFamily: mainFont,
              marginTop: hp(1),
              width: wp(90),
              textAlign: 'center',
              color: '#000',
            }}>
            Please enter your email for the verification process, we will send 4
            digits code to your email.
          </Text>
          {!passwordfield && (
            <View
              style={{
                width: wp(95),
                height: hp(6.3),
                borderColor: 'black',
                borderWidth: 0.7,
                borderRadius: 10,
                marginTop: hp(5),
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
                  color: '#000',
                }}>
                Email / Mobile Number
              </Text>
              <TextInput
                value={email}
                onChangeText={e => setEmail(e)}
                style={{width: wp(75), paddingLeft: wp(3), color: '#000'}}
              />
            </View>
          )}
          {passwordfield && (
            <>
              <View
                style={{
                  width: wp(95),
                  height: hp(6.3),
                  borderColor: 'black',
                  borderWidth: 0.7,
                  borderRadius: 10,
                  marginTop: hp(5),
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
                    color: '#000',
                  }}>
                  Email / Mobile Number
                </Text>
                <Text
                  style={{
                    color: 'black',
                    fontSize: hp(1.7),
                    top: hp(1.7),
                    left: wp(2),
                  }}>
                  {email}
                </Text>
              </View>
              <View
                style={{
                  width: wp(95),
                  height: hp(6.3),
                  borderColor: 'black',
                  borderWidth: 0.7,
                  borderRadius: 10,
                  marginTop: hp(5),
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
                    color: '#000',
                  }}>
                  Enter New Password
                </Text>
                <TextInput
                  value={newPassword}
                  onChangeText={e => setNewPassword(e)}
                  style={{width: wp(75), paddingLeft: wp(3), color: '#000'}}
                />
              </View>
              <TouchableOpacity
                onPress={() => changingPassword()}
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
                  style={{
                    color: 'white',
                    fontSize: hp(2.2),
                    fontFamily: mainFont,
                  }}>
                  Continue
                </Text>
              </TouchableOpacity>
            </>
          )}
          {!passwordfield && (
            <TouchableOpacity
              onPress={() => forgetUser()}
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
                style={{
                  color: 'white',
                  fontSize: hp(2.2),
                  fontFamily: mainFont,
                }}>
                Continue
              </Text>
            </TouchableOpacity>
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
                style={{
                  color: 'black',
                  fontSize: hp(2),
                  fontFamily: mainFontBold,
                }}>
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
                  style={{
                    color: 'white',
                    fontFamily: mainFont,
                    fontSize: hp(1.8),
                  }}>
                  Ok
                </Text>
              </TouchableOpacity>
            </View>
          </Modal>
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
}

export default ForgotPassword