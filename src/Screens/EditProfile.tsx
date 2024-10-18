import { View, Text, Image, Dimensions, TextInput, TouchableOpacity, Pressable, StyleSheet, FlatList, ScrollView } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import Header from '../ReuseableComponents/Header';
import { useRoute } from '@react-navigation/native';
import { getuserData, updateUserByID } from '../services/user.service';
import Modal from "react-native-modal";
import { launchCamera, launchImageLibrary, } from 'react-native-image-picker';
import ImagePicker from 'react-native-image-picker';

const { height, width } = Dimensions.get('window')
const EditProfile = () => {
    const navigation = useNavigation()
    const mainFont = 'Montserrat-Regular'
    const mainFontBold = 'Montserrat-Bold'
    const secondFont = 'Lato-Regular'
    const red = '#CE3436'
    const route = useRoute();
    const { userid } = route.params;
    const [name, setName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [successmodal, setSuccessModal] = useState(false)
    const [imageSource, setImageSource] = useState(null);
    const [selectedimage, setSelectedimage] = useState("")

    const options = {
        title: 'Select Image',
        storageOptions: {
            skipBackup: true,
            path: 'images',
        },
    };


    const openImagePicker = () => {
        let options = {
            storageOptions: {
                path: "image"
            }
        }

        launchImageLibrary(options, response => {
            setSelectedimage(response.assets[0].uri)
            console.log(response.assets[0].uri)
        })
    };

    const userData = async () => {
        const response = await getuserData(userid);
        if (response.data.userObj) {
            console.log(response.data.userObj, ">>>>>>>>>>>>>>>>>")
            setName(response.data.userObj.name)
            setLastName(response.data.userObj.lastName)
            setEmail(response.data.userObj.email)
            setPhone(response.data.userObj.phone)
        }
    }

    const UpdateUser = async () => {
        let obj = {
            name,
            email,
            phone
        }
        console.log(obj, 'obj')
        const response = await updateUserByID(userid, obj);
        if (response) {
            console.log(response)
            setSuccessModal(true)
        }
    }

    useEffect(() => {
        userData()
    }, [])
    return (
      <View style={{width: width, height: height, backgroundColor: 'white'}}>
        <Header back={true} label="Edit Profile" />
        {/* <View style={{ width: wp(95), alignSelf: 'center', alignItems: 'center', paddingTop: hp(3) }}>
                <Image source={{ uri: selectedimage }}
                    style={{ height: wp(30), width: wp(30), borderRadius: wp(15) }} />
                <TouchableOpacity onPress={openImagePicker}>
                    <Text style={{ marginTop: hp(2), color: '#018FFD', fontSize: hp(1.9), fontFamily: secondFont }}>Change Profile Picture</Text>
                </TouchableOpacity>
            </View> */}
        <View
          style={{
            borderBottomColor: '#DADADA',
            borderBottomWidth: 1.5,
            width: wp(93),
            height: hp(5),
            marginTop: hp(5),
            flexDirection: 'row',
            alignItems: 'center',
            alignSelf: 'center',
            paddingLeft: wp(2),
          }}>
          <Image
            source={require('../../assets/img/Useri.png')}
            style={{height: wp(6), width: wp(6), tintColor: red}}
          />
          <TextInput
            value={name}
            onChangeText={e => setName(e)}
            style={{width: wp(80), marginLeft: wp(2), color: '#000'}}
            placeholder="Enter Name"
          />
        </View>

        {/* <View style={{ borderBottomColor: '#DADADA', borderBottomWidth: 1.5, width: wp(93), height: hp(5), marginTop: hp(3), flexDirection: 'row', alignItems: 'center', alignSelf: 'center', paddingLeft: wp(2) }}>
                <Image source={require('../../assets/img/Useri.png')}
                    style={{ height: wp(6), width: wp(6), tintColor: red }} />
                <TextInput value={lastName} onChangeText={(e) => setLastName(e)} style={{ width: wp(80), marginLeft: wp(2) }} placeholder='Enter Name' />
            </View> */}
        {/* <View style={{ borderBottomColor: '#DADADA', borderBottomWidth: 1.5, width: wp(93), height: hp(5), marginTop: hp(3), flexDirection: 'row', alignItems: 'center', alignSelf: 'center', paddingLeft: wp(2) }}>
                <Image source={require('../../assets/img/Mail.png')}
                    style={{ height: wp(6), width: wp(6), tintColor: red }} />
                <TextInput value={email} style={{ width: wp(80), marginLeft: wp(2) }} placeholder='Enter Email' />
            </View> */}
        <View
          style={{
            borderBottomColor: '#DADADA',
            borderBottomWidth: 1.5,
            width: wp(93),
            height: hp(7),
            marginTop: hp(3),
            flexDirection: 'row',
            alignItems: 'center',
            alignSelf: 'center',
            paddingLeft: wp(2),
          }}>
          <Image
            source={require('../../assets/img/Call.png')}
            style={{height: wp(6), width: wp(6), tintColor: red}}
          />
          <TextInput
            value={phone}
            onChangeText={e => setPhone(e)}
            style={{width: wp(80), marginLeft: wp(2), color: '#000'}}
            placeholder="Enter Mobile Number"
          />
        </View>
        <View style={{width: wp(93), alignSelf: 'center', marginTop: hp(8)}}>
          <TouchableOpacity
            // onPress={() => navigation.navigate('BottamTab')}
            onPress={() => UpdateUser()}
            style={{
              width: wp(93),
              height: hp(6),
              backgroundColor: 'black',
              marginTop: hp(3),
              borderRadius: wp(1),
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                color: 'white',
                fontSize: hp(2.2),
                fontFamily: mainFont,
               
              }}>
              Submit
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('ForgotPassword')}
            style={{
              width: wp(93),
              height: hp(6),
              borderColor: 'black',
              borderWidth: 1,
              marginTop: hp(3),
              borderRadius: wp(1),
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={{color: 'black', fontSize: hp(2.2), fontFamily: mainFont}}>
              Reset Password
            </Text>
          </TouchableOpacity>
        </View>
        <Modal
          isVisible={successmodal}
          onBackButtonPress={() => setSuccessModal(false)}
          onBackdropPress={() => setSuccessModal(false)}
          animationIn={'bounceIn'}
          animationOut={'bounceOut'}>
          <View
            style={{
              width: wp(85),
              backgroundColor: 'white',
              height: hp(30),
              alignSelf: 'center',
              borderRadius: 8,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                color: 'black',
                fontSize: hp(2.5),
                fontFamily: mainFont,
                width: wp(75),
                textAlign: 'center',
                alignSelf: 'center',
              }}>
              Changes Updated Successfully.
            </Text>
            <TouchableOpacity
              onPress={() => {
                setSuccessModal(false);
                navigation.navigate('Profile');
              }}
              style={{
                width: wp(80),
                height: hp(5.5),
                backgroundColor: 'black',
                borderRadius: 5,
                marginTop: hp(2),
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text
                style={{color: 'white', fontSize: hp(2), fontFamily: mainFont}}>
                Ok
              </Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    );
}

export default EditProfile