import { View, Text, Image, Dimensions, TextInput, TouchableOpacity, Pressable, StyleSheet, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import Header from '../ReuseableComponents/Header';
import Modal from "react-native-modal";
import { getNotification } from '../services/notification.service';

const { height, width } = Dimensions.get('window')

const Notification = () => {
  const mainFont = 'Montserrat-Regular'
  const mainFontBold = 'Montserrat-Bold'
  const secondFont = 'Lato-Regular'
  const red = '#CE3436'
  const [notificationArr, setNotificationArr] = useState([])


  const getAllNotification = async () => {
    const { data: res } = await getNotification();
    console.log(res.data, "Notifications")
    setNotificationArr(res.data)
  }

  useEffect(() => {
    getAllNotification()
  }, [])

  return (
    <View style={{ width: width, backgroundColor: '#fff', height: height }}>
      <Header back={true} label='Notifications' />
      <View style={{ width: width, alignSelf: 'center' }}>
        <FlatList
          data={[1, 1, 1, 1, 1, 1, 1]}
          contentContainerStyle={{ paddingBottom: hp(15) }}
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity style={{ width: width, paddingRight: wp(5), paddingLeft: wp(5), borderBottomColor: 'gray', borderBottomWidth: 0.8, paddingTop: hp(3), paddingBottom: hp(3) }}>
                {/* <Text style={{alignSelf:'flex-end', fontFamily:secondFont, fontSize:hp(1.7)}}>19 August 05:29pm</Text> */}
                <View style={{ width: wp(85), alignSelf: 'center', marginTop: hp(1), flexDirection: 'row', justifyContent: 'space-between' }}>
                  {/* <Image source={require('../../assets/img/discount.png')}
                        style={{height:wp(7), width:wp(7)}} /> */}
                  <Text style={{ width: wp(70), fontFamily: secondFont, fontSize: hp(1.9), color: 'black' }}><Text style={{ color: '#219653' }}>15% off</Text>  Metal Joints Curved AC Grills, For Outdoor, Capacity: 2 Ton</Text>
                </View>
                <Text style={{ fontFamily: secondFont, fontSize: hp(1.7), width: wp(85), alignSelf: 'center', marginTop: hp(2) }}>19 August 05:29pm</Text>
              </TouchableOpacity>
            )
          }}
        />
      </View>
    </View>
  )
}

export default Notification