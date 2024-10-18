import { View, Text, Dimensions, FlatList, Image, TextInput, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Header from '../ReuseableComponents/Header';
import { useNavigation } from '@react-navigation/native';
import { getAllBrand } from '../services/brand.service';

const { height, width } = Dimensions.get('window')
const AllBrands = () => {
  const navigation = useNavigation()
  const mainFont = 'Montserrat-Regular'
  const mainFontBold = 'Montserrat-Bold'
  const secondFont = 'Lato-Regular'
  const red = '#CE3436'
  const [brandArr, setBrandArr] = useState([])


  const getBrandAll = async () => {
    const { data: res } = await getAllBrand();
    const topsellerData = JSON.stringify(res, null, 2)
    console.log("All Brand Data" + topsellerData)
    setBrandArr(res.data)
  }

  useEffect(() => {
    getBrandAll()
  }, [])

  const Data = [
    {
      img: require('../../assets/img/voltas.png'),
      titl: 'Voltas'
    },
    {
      img: require('../../assets/img/hitachi.png'),
      titl: 'Hitachi'
    },
    {
      img: require('../../assets/img/bluestr.png'),
      titl: 'Blue Star'
    },
    {
      img: require('../../assets/img/whirpool.png'),
      titl: 'Whirpool'
    },
    {
      img: require('../../assets/img/lloyd.png'),
      titl: 'Lloyd'
    },
    {
      img: require('../../assets/img/carrier.png'),
      titl: 'Carrier'
    },
    {
      img: require('../../assets/img/bluestr.png'),
      titl: 'Blue Star'
    },
    {
      img: require('../../assets/img/voltas.png'),
      titl: 'Voltas'
    },
    {
      img: require('../../assets/img/hitachi.png'),
      titl: 'Hitachi'
    },
    {
      img: require('../../assets/img/bluestr.png'),
      titl: 'Blue Star'
    },
    {
      img: require('../../assets/img/whirpool.png'),
      titl: 'Whirpool'
    },
    {
      img: require('../../assets/img/lloyd.png'),
      titl: 'Lloyd'
    },
    {
      img: require('../../assets/img/carrier.png'),
      titl: 'Carrier'
    },
    {
      img: require('../../assets/img/bluestr.png'),
      titl: 'Blue Star'
    },

  ]
  return (
    <View style={{ width: width, height: height, backgroundColor: 'white', alignItems: 'center', }}>
      <Header back={true} label='All Brands' />
      <FlatList
        data={brandArr}
        numColumns={2}
        contentContainerStyle={{ paddingBottom: hp(10), paddingLeft: wp(2) }}
        renderItem={({ item, index }) => {
          return (
            <TouchableOpacity
              onPress={() => navigation.navigate('ProductsSCR', { selectedcat: item.id })} style={{ width: wp(45.5), marginRight: wp(3), marginTop: hp(2) }}>
              <View style={{ width: wp(45.5), height: hp(20), backgroundColor: '#F5F5F5', alignItems: 'center', justifyContent: 'center' }}>
                <Image source={{ uri: item.imageUrl }}
                  style={{ width: wp(45), height: hp(18), resizeMode: 'contain' }} />
              </View>
              <Text style={{ width: wp(45.5), textAlign: 'center', marginTop: hp(1), color: 'black', fontSize: hp(2), fontFamily: secondFont }}>{item.name}</Text>
            </TouchableOpacity>
          )
        }}
      />
    </View>
  )
}

export default AllBrands