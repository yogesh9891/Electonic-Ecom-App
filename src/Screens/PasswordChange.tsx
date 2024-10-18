import { View, Text, Dimensions, Image, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';

const { height, width } = Dimensions.get('window')
const PasswordChange = () => {
  const mainFont = 'Montserrat-Regular'
  const mainFontBold = 'Montserrat-Bold'
  const navigation: any = useNavigation()
  const [agree, setAgree]=useState(false)
  return (
    <View style={{ width: width, height: height, backgroundColor: 'white', alignItems: 'center', paddingTop: hp(10), paddingBottom: hp(12), justifyContent: 'space-between' }}>
      <Image source={require('../../assets/img/FPlogo.png')}
        style={{ height: hp(35), width: wp(85), resizeMode: 'contain' }} />
      <View style={{ width: wp(95), alignSelf: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: hp(3.5), color: 'black', fontFamily: mainFontBold }}>Reset Password</Text>
        <Text style={{ fontSize: hp(1.6), fontFamily: mainFont, marginTop: hp(1), width:wp(90), textAlign:'center' }}>Set the new password for your account so you can login and access all the features.</Text>
        <View style={{ width: wp(95), height: hp(6.3), backgroundColor: '#F5F5F5', borderRadius: 10, marginTop: hp(5),justifyContent:'center' }}>
          {/* <Text style={{ position: 'absolute', width: wp(42), backgroundColor: 'white', fontSize: hp(1.7), marginTop: hp(-1.5), marginLeft: wp(5), textAlign: 'center' }}>Email / Mobile Number</Text> */}
          <TextInput 
          placeholder='Enter New Password'
          style={{width:wp(75), paddingLeft:wp(3)}} />
        </View>
        <View style={{ width: wp(95), height: hp(6.3), backgroundColor: '#F5F5F5', borderRadius: 10, marginTop: hp(2),justifyContent:'center' }}>
          {/* <Text style={{ position: 'absolute', width: wp(42), backgroundColor: 'white', fontSize: hp(1.7), marginTop: hp(-1.5), marginLeft: wp(5), textAlign: 'center' }}>Email / Mobile Number</Text> */}
          <TextInput 
          placeholder='Re-Enter New Password'
          style={{width:wp(75), paddingLeft:wp(3)}} />
        </View>
       <TouchableOpacity 
       onPress={()=>navigation.navigate('Login')}
        style={{width:wp(95), height:hp(6.3), backgroundColor:'black', marginTop:hp(3), borderRadius:wp(1.8), alignItems:'center', justifyContent:'center'}}>
          <Text style={{color:'white', fontSize:hp(2.1), fontFamily:mainFont}}>Reset Password</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default PasswordChange