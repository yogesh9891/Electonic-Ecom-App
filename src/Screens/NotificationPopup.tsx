import { View, Text, Dimensions, FlatList, Image, TextInput, TouchableOpacity, RefreshControl } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Header from '../ReuseableComponents/Header';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { getCartProduct, removecartProduct } from '../services/usercart.service';
import jwtDecode from 'jwt-decode';
import { UserContext } from '../../App';
import * as Animatable from 'react-native-animatable';
import { BlurView } from '@react-native-community/blur';

const { height, width } = Dimensions.get('window')


const POPUo = (props: any) => {
    const mainFont = 'Montserrat-Regular'
    const mainFontBold = 'Montserrat-Bold'
    const secondFont = 'Lato-Regular'
    const red = '#CE3436'

    return (
        <Animatable.View
            animation={'slideInDown'}
            duration={500}
            style={{ width: wp(93), alignSelf: 'center', height: hp(8), backgroundColor: 'rgba(0, 0, 0, 0.7)', position: 'absolute', justifyContent: 'center', top: hp(2), borderRadius: 8, alignItems: 'center', zIndex: 999 }}>
            <View style={{
                width: wp(93), alignSelf: 'center', height: hp(8),
                backgroundColor: 'rgba(255, 255, 255, 0.2)', alignItems: 'center', justifyContent: 'center' // Semi-transparent white

                // blurRadius: 10,
            }}>

                < Text style={{ color: "white", fontFamily: mainFontBold, fontSize: hp(1.8), }}>{props.name ? props.name : ""}</Text>
            </View>
        </Animatable.View >
    )
}

const NotificationPopup = (props: any) => {
    return POPUo(props)
}



export default NotificationPopup