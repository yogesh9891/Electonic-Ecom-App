import { View, Text, Dimensions, FlatList, Image, TextInput, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Header from '../ReuseableComponents/Header';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { getOrderByUserId, getOrderByUserIdApi, getOrderss } from '../services/order.service';
import { generateFilePath } from '../services/url.service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode';

const { height, width } = Dimensions.get('window')
const Order = () => {
  const navigation = useNavigation()
  const mainFont = 'Montserrat-Regular'
  const mainFontBold = 'Montserrat-Bold'
  const secondFont = 'Lato-Regular'
  const red = '#CE3436'
  const focused = useIsFocused()
  const [ordersArr, setOrdersArr] = useState([]);
  const [paginationArr, setPaginationArr] = useState([]);
  const [totalPage, setTotalPage] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false)
  const ITEMS_PER_PAGE = 10;

  const goToPage = (pageNumber: number) => {
    setPage(pageNumber);
  };

  const getOrders = async () => {
    setLoading(true)
    try {
      const userToken = await AsyncStorage.getItem('userData');
      let deCodeedToken = await jwtDecode(userToken)
      // console.log(JSON.stringify(deCodeedToken, null, 2), "sashsjkdhsakjshadkjsahdkjhkdh")
      console.log(JSON.stringify(deCodeedToken.userId, null, 2) + "User Nameeeeeeeeeeeeeeee")

      // console.log("inside try")
      let query = `page=${page}&perPage=${ITEMS_PER_PAGE}`;
      const { data: res } = await getOrderss();
      if (res) {
        console.log(JSON.stringify(res, null, 2) + "Dataaaaaaaaaaaaaaaa");
        setOrdersArr(res.data);
        setTotalPage(res?.totalPages);
        setLoading(false)
      }
    } catch (error) {
      console.log(error);
    }
  };


  useEffect(() => {
    if (focused) {
      getOrders();
    }
  }, [page, focused])

  useEffect(() => {
    const currentItems: any = Array(totalPage).fill(0);

    console.log(currentItems, "currentItemscurrentItems");
    setPaginationArr(currentItems);
  }, [totalPage]);

  const onHandleView = (id: string) => {
    if (id) {

    }
  }
  return (
    <View style={{ width: width, height: height, backgroundColor: 'white' }}>
      <Header back={true} label='Orders' />
      <FlatList
        data={ordersArr}
        contentContainerStyle={{ paddingBottom: hp(10) }}
        renderItem={({ item, index }) => {
          return (
            <TouchableOpacity
              onPress={() => navigation.navigate('OrderDetails', { IdofOrder: item._id })}
              style={{ width: wp(95), alignSelf: 'center', paddingTop: hp(1.5), paddingBottom: hp(1.5), backgroundColor: '#F5F5F5', marginTop: hp(1), marginBottom: hp(1), borderRadius: 8, flexDirection: 'row', paddingRight: wp(1.5), paddingLeft: wp(1.5), }}>
              <View style={{ width: wp(25), height: hp(14), backgroundColor: 'white', borderRadius: 7, marginLeft: wp(2), justifyContent: 'center', alignItems: 'center' }}>
                <Image source={{ uri: generateFilePath(item.productsArr[0].image) }}
                  style={{ height: hp(12), width: wp(23), resizeMode: 'contain' }} />
              </View>
              <View style={{ width: wp(62), marginLeft: wp(2), height: hp(14), justifyContent: 'space-between' }}>
                <Text style={{ color: item.orderStatus == "CANCELLED" ? "red" : 'green', fontSize: hp(2), fontFamily: secondFont }}>{item.orderStatus} <Text style={{ color: 'gray', fontSize: hp(1.7) }}>on {new Date(item?.updatedAt).toDateString()}</Text></Text>
                <Text style={{ color: 'gray', fontSize: hp(1.7), fontFamily: secondFont }}>{item.productsArr[0].name}</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ color: 'black', fontSize: hp(2), fontFamily: secondFont }}>₹ {item.subTotalAmount}</Text>
                  <Text style={{ color: 'black', fontSize: hp(1.8), fontFamily: secondFont }}>QTY: {item.productsArr[0].quantity}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )
        }}
      />
    </View>
  )
}

export default Order