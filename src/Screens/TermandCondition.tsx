import { View, Text, Image, Dimensions, TextInput, TouchableOpacity, Pressable, StyleSheet, FlatList, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import Header from '../ReuseableComponents/Header';
import Modal from "react-native-modal";

const { height, width } = Dimensions.get('window')
const TermandCondition = () => {
    const mainFont = 'Montserrat-Regular'
    const mainFontBold = 'Montserrat-Bold'
    const secondFont = 'Lato-Regular'
    const red = '#CE3436'
  return (
    <View style={{width: width, height: height}}>
      <Header back={true} label="Privacy & Policy" />
      <ScrollView
        style={{width: wp(95), alignSelf: 'center', marginBottom: hp(3)}}>
        <Text
          style={{
            marginTop: hp(1),
            fontFamily: secondFont,
            fontSize: hp(1.9),
            color: 'black',
          }}>
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s, when an unknown printer took a galley of type and
          scrambled it to make a type specimen book. It has survived not only
          five centuries, but also the leap into electronic typesetting,
          remaining essentially unchanged. It was popularised in the 1960s with
          the release of Letraset sheets containing Lorem Ipsum passages, and
          more recently with desktop publishing software like Aldus PageMaker
          including versions of Lorem Ipsum.
        </Text>
        <Text
          style={{
            marginTop: hp(2),
            fontFamily: 'AvenirNextLTPro-SemiBold',
            fontSize: hp(1.9),
            color: 'black',
          }}>
          SECTION 1 - ONLINE STORE TERMS
        </Text>
        <Text
          style={{
            marginTop: hp(1),
            fontFamily: 'AvenirNextLTPro-Regular',
            fontSize: hp(1.9),
            color: 'black',
          }}>
          By agreeing to these Terms of Service, you confirm that you are at
          least the age of majority in your state or province of residence, or
          that you are at least the age of majority in your state or province of
          residence and you have given us permission to let any of your minor
          dependents use this site. You can't use our goods for anything illegal
          or against the law, and you can't use the Service in a way that breaks
          any laws in your country, including copyright laws. You can't send
          worms, viruses, or any other code that could cause damage. If you
          break any of the Terms or don't follow them, your Services will end
          right away.
        </Text>
        <Text
          style={{
            marginTop: hp(2),
            fontFamily: 'AvenirNextLTPro-SemiBold',
            fontSize: hp(1.9),
            color: 'black',
          }}>
          SECTION 2 - ONLINE STORE TERMS
        </Text>
        <Text
          style={{
            marginTop: hp(1),
            fontFamily: 'AvenirNextLTPro-Regular',
            fontSize: hp(1.9),
            color: 'black',
          }}>
          By agreeing to these Terms of Service, you confirm that you are at
          least the age of majority in your state or province of residence, or
          that you are at least the age of majority in your state or province of
          residence and you have given us permission to let any of your minor
          dependents use this site. You can't use our goods for anything illegal
          or against the law, and you can't use the Service in a way that breaks
          any laws in your country, including copyright laws. You can't send
          worms, viruses, or any other code that could cause damage. If you
          break any of the Terms or don't follow them, your Services will end
          right away.
        </Text>
      </ScrollView>
    </View>
  );
}

export default TermandCondition