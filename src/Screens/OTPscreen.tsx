import { View, Text, Dimensions, Image, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useState, useRef } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import OtpInputs from 'react-native-otp-inputs';

const { height, width } = Dimensions.get('window')

const OTPscreen = () => {
    const mainFont = 'Montserrat-Regular'
    const mainFontBold = 'Montserrat-Bold'
    const navigation: any = useNavigation()
    const et1: any = useRef();
    const et2: any = useRef();
    const et3: any = useRef();
    const et4: any = useRef();
    return (
        <View style={{ width: width, height: height, backgroundColor: 'white', alignItems: 'center', paddingTop: hp(10), paddingBottom: hp(12), justifyContent: 'space-between' }}>
            <Image source={require('../../assets/img/FPlogo.png')}
                style={{ height: hp(35), width: wp(85), resizeMode: 'contain' }} />
            <View style={{ width: wp(95), alignSelf: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: hp(3.5), color: 'black', fontFamily: mainFontBold }}>Enter 4 Digits Code</Text>
                <Text style={{ fontSize: hp(1.6), fontFamily: mainFont, marginTop: hp(1), width: wp(90), textAlign: 'center' }}>Enter the 4 digits code that you received on your email.</Text>
                {/* <OtpInputs
        //   handleChange={(code) => console.log(code)}
          numberOfInputs={4}
        /> */}
                {/* OTP section >>>>>>>>>>>>>>>>>>>>>*/}

                <View style={{ width: '100%', height: hp(5.5), marginTop: hp(1), flexDirection: 'row', alignItems: 'center', paddingLeft: wp(20) }}>
                    <TextInput ref={et1} style={styles.input}
                        keyboardType='number-pad'
                        maxLength={1}
                        onChangeText={txt => {
                            if (txt.length >= 1) {
                                if (et2 && et2.current) {
                                    et2?.current?.focus();
                                }
                            }
                            else if (txt.length < 1) {
                                et1.current.focus();
                            }
                        }} />

                    <TextInput ref={et2} style={styles.input}
                        keyboardType='number-pad'
                        maxLength={1}
                        onChangeText={txt => {
                            if (txt.length >= 1) {
                                et3.current.focus();
                            }
                            else if (txt.length < 1) {
                                et1.current.focus();
                            }
                        }} />
                    <TextInput ref={et3} style={styles.input}
                        keyboardType='number-pad'
                        maxLength={1}
                        onChangeText={txt => {
                            if (txt.length >= 1) {
                                et4.current.focus();
                            }
                            else if (txt.length < 1) {
                                et2.current.focus();
                            }
                        }} />

                    <TextInput ref={et4} style={styles.input}
                        keyboardType='number-pad'
                        maxLength={1}
                        onChangeText={txt => {
                            if (txt.length >= 1) {
                                et4.current.focus();
                            }
                            else if (txt.length < 1) {
                                et3.current.focus();
                            }
                        }} />
                </View>
                <TouchableOpacity
                    onPress={() => navigation.navigate('PasswordChange')}
                    style={{ width: wp(95), height: hp(6.3), backgroundColor: 'black', marginTop: hp(3), borderRadius: wp(1.8), alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: 'white', fontSize: hp(2.2), fontFamily: mainFont }}>Continue</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    input: {
        width: 40,
        height: 50,
        borderRadius: 10,
        backgroundColor: '#E8E8E8',
        marginLeft: 10,
        textAlign: 'center',
        fontSize: hp(2.5),
        fontWeight: '700',
        // marginRight:0,

    }
})
export default OTPscreen