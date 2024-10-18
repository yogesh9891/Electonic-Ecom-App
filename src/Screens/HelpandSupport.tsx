import { View, Text, Image, Dimensions, TextInput, TouchableOpacity, Pressable, StyleSheet, FlatList, ScrollView, Linking } from 'react-native'
import React, { useContext, useState } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import Header from '../ReuseableComponents/Header';

const { height, width } = Dimensions.get('window')
const HelpandSupport = () => {
    const mainFont = 'Montserrat-Regular'
    const mainFontBold = 'Montserrat-Bold'
    const secondFont = 'Lato-Regular'
    const red = '#CE3436'
    const navigation = useNavigation()
    return (
        <View style={{ width: width, height: height, backgroundColor: 'white' }}>
            <Header back={true} label='Help and Support' />
            <View style={{ width: wp(95), alignSelf: 'center', height: height, justifyContent: 'center' }}>
                <TouchableOpacity onPress={() => Linking.openURL('tel:1234567890')}
                    style={{ width: wp(90), height: hp(20), backgroundColor: '#F5F5F5', alignSelf: 'center', borderRadius: wp(5), alignItems: 'center', justifyContent: 'center' }}>
                    <Image source={require('../../assets/img/HaS.png')}
                        style={{ height: wp(20), width: wp(25), resizeMode: 'contain' }} />
                    <Text style={{ color: 'black', fontSize: hp(2.5), fontFamily: mainFont, marginTop: hp(1.5), }}>Call Us</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => navigation.navigate('Chat')}
                    // onPress={() => Linking.openURL('http://api.whatsapp.com/send/?phone=911234567890')}
                    style={{ width: wp(90), height: hp(20), backgroundColor: '#F5F5F5', alignSelf: 'center', borderRadius: wp(5), alignItems: 'center', justifyContent: 'center', marginTop: hp(4) }}>
                    <Image source={require('../../assets/img/chat.png')}
                        style={{ height: wp(20), width: wp(25), resizeMode: 'contain' }} />
                    <Text style={{ color: 'black', fontSize: hp(2.5), fontFamily: mainFont, marginTop: hp(1.5) }}>Chat With Us</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default HelpandSupport