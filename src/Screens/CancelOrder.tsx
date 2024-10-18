import { View, Text, Image, Dimensions, TextInput, TouchableOpacity, Pressable, StyleSheet, FlatList, ScrollView } from 'react-native'
import React, { useContext, useState } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import Header from '../ReuseableComponents/Header';

const { height, width } = Dimensions.get('window')
const CancelOrder = () => {
    const [cnclmodl, setCnclmodl] = useState(false)
    const [typ, setTyp] = useState('')
    const mainFont = 'Montserrat-Regular'
    const mainFontBold = 'Montserrat-Bold'
    const secondFont = 'Lato-Regular'
    const red = '#CE3436'
    return (
        <View style={{ width: width, height: height, backgroundColor: 'white', paddingBottom: hp(2) }}>
            <Header back={true} label='Order Cancel' buttonshow={true} />
            <ScrollView style={{ width: wp(95), alignSelf: 'center' }}>
                <View style={{ flexDirection: 'row', paddingTop: hp(2), paddingBottom: hp(2), backgroundColor: '#F5F5F5' }}>
                    <Image source={require('../../assets/img/img4.png')}
                        style={{ height: wp(30), width: wp(30), borderRadius: 5 }} />
                    <View style={{ marginLeft: wp(2) }}>
                        <Text style={{ fontFamily: secondFont, fontSize: hp(1.8), width: wp(60), color: 'black' }}>Metal Joints Curved AC Grills, For Outdoor, Capacity: 2 Ton</Text>
                        <Text style={{ fontFamily: secondFont, fontSize: hp(1.8), width: wp(50), marginTop: hp(0.7) }}>Brand :  Brand Name</Text>
                        <View style={{ flexDirection: 'row', marginTop: hp(1) }}>
                            <Text style={{ fontFamily: secondFont, fontSize: hp(1.8), color: 'black' }}>₹19,999.00</Text>
                            <Text style={{ fontFamily: secondFont, fontSize: hp(1.5), color: 'gray', marginLeft: wp(4), textDecorationLine: 'line-through' }}>₹24,999.00</Text>
                        </View>
                        <Text style={{ fontFamily: secondFont, fontSize: hp(1.9), color: 'black', marginTop: hp(1.5) }}>QTY: 1</Text>
                    </View>
                </View>
                <Text style={{ fontFamily: secondFont, fontSize: hp(1.8), width: wp(80), marginTop: hp(3), color: 'black' }}>REASON FOR CANCELLATION</Text>
                <View>
                    <View style={{ marginTop: hp(1.5) }}>
                        <TouchableOpacity
                            onPress={() => setTyp('1')}
                            style={{ flexDirection: 'row', alignItems: 'center' }}>
                            {typ == '1' ? <Image source={require('../../assets/img/crcltk.png')} style={{ height: wp(5), width: wp(5) }} /> : <Image source={require('../../assets/img/crcltk1.png')} style={{ height: wp(5), width: wp(5) }} />}
                            <Text style={{ marginLeft: wp(1.5), fontSize: hp(1.9), color: typ == '1' ? 'black' : 'gray' }}>I want to change address for the order</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setTyp('2')}
                            style={{ flexDirection: 'row', alignItems: 'center', marginTop: hp(2) }}>
                            {typ == '2' ? <Image source={require('../../assets/img/crcltk.png')} style={{ height: wp(5), width: wp(5) }} /> : <Image source={require('../../assets/img/crcltk1.png')} style={{ height: wp(5), width: wp(5) }} />}
                            <Text style={{ marginLeft: wp(1.5), fontSize: hp(1.9), color: typ == '2' ? 'black' : 'gray' }}>Price for the product has becreased</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setTyp('3')}
                            style={{ flexDirection: 'row', alignItems: 'center', marginTop: hp(2) }}>
                            {typ == '3' ? <Image source={require('../../assets/img/crcltk.png')} style={{ height: wp(5), width: wp(5) }} /> : <Image source={require('../../assets/img/crcltk1.png')} style={{ height: wp(5), width: wp(5) }} />}
                            <Text style={{ marginLeft: wp(1.5), fontSize: hp(1.9), color: typ == '3' ? 'black' : 'gray' }}>I have purchased the product elsewhere</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View>
                    <TextInput placeholder='Enter your comment (optional)'
                        style={{ width: wp(95), marginTop: hp(2), borderColor: 'gray', borderWidth: 0.7, paddingBottom: hp(10) }} />
                </View>

            </ScrollView>
            <TouchableOpacity style={{ width: wp(90), height: hp(6), backgroundColor: 'black', alignSelf: 'center', marginTop: hp(2), justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: '#fff', fontWeight: '400', fontSize: hp(1.8) }}>Submit Review</Text>
            </TouchableOpacity>
        </View>
    )
}

export default CancelOrder