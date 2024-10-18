import { View, Text, Dimensions, FlatList, Image, TextInput, TouchableOpacity, RefreshControl } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Header from '../ReuseableComponents/Header';
import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import { addLocalCartApi, getCartProduct, removecartProduct } from '../services/usercart.service';
import jwtDecode from 'jwt-decode';
import { UserContext } from '../../App';
import NotificationPopup from './NotificationPopup';
import LinearGradient from 'react-native-linear-gradient';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder'
import { generateFilePath } from '../services/url.service';
import { getLocalCart, removeItemFromlocalCart } from '../services/localcart.service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getToken } from '../services/user.service';

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

const { height, width } = Dimensions.get('window')
const Cart = () => {
  const navigation = useNavigation()
  const mainFont = 'Montserrat-Regular'
  const mainFontBold = 'Montserrat-Bold'
  const secondFont = 'Lato-Regular'
  const red = '#CE3436'
  const focused = useIsFocused()
  const [inc, setinc] = useState(0)
  const [cartArr, setCartArr] = useState([])
  const [user, setUser] = useContext(UserContext)
  const [totallprice, setTotalprice] = useState('')
  const [notificationtxt, setNotificationtxt] = useState("")
  const [loading, setLoading] = useState(false)
  const route = useRoute();

  // const { fromPage } = route.params != null ? route.params : "default";

  // console.log(route.params, "coming from")


  useEffect(() => {
    if (cartArr && cartArr?.length > 0) {
      let total: any = 0;
      let mrp: any = 0;
      let totalmrprice: any = 0;
      let disc: any = 0;
      cartArr.map(el => {
        total += el.price * el.quantity;
        if (el.mrp && el.mrp > 0) {
          mrp += el?.mrp * el.quantity;
        } else {
          mrp += el?.price * el.quantity;
        }
        // disc = totalmrp - totalPrice;
      });

      console.log(total, 'totaltotaltotaltotaltotaltotaltotaltotal');

      setTotalprice(total);

     
    } else {
      setTotalprice(0);
    }
  }, [cartArr]);


 let onHandleRemove = async (id: string, obj:any) => {
   try {
      let token = await getToken();
     console.log('Product deleted from the cart');
     if (token) {
       let {data: res} = await removecartProduct(id, {
         productId: obj.productId,
       });
       if (res) {
         setNotificationtxt('Product deleted from the cart.');
          setTimeout(() => {
            setNotificationtxt('');
          }, 5000);
       }
     } else {
       let {data: res} = await removeItemFromlocalCart(id, {
         productId: obj.productId,
       });
       if (res) {
         setNotificationtxt('Product deleted from the cart.');
          setTimeout(() => {
            setNotificationtxt('');
          }, 5000);
       }
     }
     handleUseCartData();
   } catch (error) {
     console.log(error);
   }
 };






  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    handleUseCartData();
    setRefreshing(false);
  };


  let handleUseCartData = async () => {
    try {

      let token = await getToken();

      if (token) {
        let {data: res} = await getCartProduct();
        console.log('getCartApigetCartApigetCartApigetCartApi ');
        let cartData = res?.data;

        setCartArr(cartData);
      } else {
        let { data: res } = await getLocalCart();
        let cartData = res?.data;

        console.log('getCartApigetCartApigetCartApigetCartApi ', cartData);
        
        setCartArr(cartData);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const Datafromlocalcart = async () => {
    console.log("Datafromlocalcart")
    try {
      const { data: res } = await getLocalCart();
      const resdta = res.data
      // const itemsArr = resdta.map((item, index) => item)
      // console.log(JSON.stringify(itemsArr.name, null, 2), "console from datafromlocalcartttttttttt")
      // console.log(JSON.stringify(resdta, null, 2), "console from datafromlocalcartttttttttt")
      // let obj = {
      //   productId: resdta.productId,
      //   name: resdta.name,
      //   price: resdta.price,
      //   image: resdta.image,
      //   sku: resdta.sku,
      //   stock: resdta.stock,
      //   // productImage: mainImage,
      //   quantity: resdta.quantity,
      // }

      const { data: result } = await addLocalCartApi(resdta)
      console.log(result, "Resulttttttttttttttttttttttttttt")

      // console.log(obj, ">>>>>>>>>>")
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (focused) {
      handleUseCartData();
    }
  }, [focused])
  return (
    <View
      style={{
        width: width,
        height: height,
        backgroundColor: 'white',
        justifyContent: 'space-between',
        paddingBottom: hp(7),
      }}>
      <Header back={true} label="Cart" />
      {notificationtxt != '' && <NotificationPopup name={notificationtxt} />}
      {user && (
        <View
          style={{
            width: width,
            height: hp(8),
            backgroundColor: '#F5F5F5',
            flexDirection: 'row',
            paddingLeft: wp(2),
            alignItems: 'center',
            paddingRight: wp(3),
            justifyContent: 'space-between',
          }}>
          <View style={{flexDirection: 'row'}}>
            <Image
              source={require('../../assets/img/location.png')}
              style={{height: wp(6.5), width: wp(6.5)}}
            />
            <Text
              style={{
                width: wp(55),
                fontSize: hp(1.8),
                fontFamily: secondFont,
                marginLeft: wp(1),
                color: 'black',
              }}>
              Delivering to Rohan, 110091 Action Area II, Newtown, Delhi
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate('AddAddress')}
            style={{
              width: wp(20),
              height: hp(4),
              borderColor: 'black',
              borderWidth: 0.9,
              borderRadius: 5,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                color: 'black',
                fontFamily: secondFont,
                fontSize: hp(1.8),
              }}>
              Change
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {cartArr && cartArr?.length > 0 ? (
        <FlatList
          data={cartArr}
          contentContainerStyle={{paddingBottom: hp(1)}}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={({item, index}) => {
            return (
              <View
                style={{width: wp(95), alignSelf: 'center', marginTop: hp(2)}}>
                {loading ? (
                  <ShimmerPlaceholder style={{width: wp(95), height: hp(15)}} />
                ) : (
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('ProductDetail', {
                        slug: item.slug,
                      })
                    }
                    style={{
                      width: wp(95),
                      alignSelf: 'center',
                      backgroundColor: 'white',
                      elevation: 2,
                      borderRadius: 10,
                      flexDirection: 'row',
                      paddingLeft: wp(2),
                      paddingTop: hp(2),
                      paddingBottom: hp(2),
                      paddingRight: wp(2),
                    }}>
                    <View
                      style={{
                        width: wp(25),
                        height: hp(12),
                        backgroundColor: '#F5F5F5',
                        borderRadius: 8,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Image
                        source={
                          item.productImage != ''
                            ? {uri: generateFilePath(item.productImage)}
                            : require('../../assets/img/img3.png')
                        }
                        style={{
                          height: hp(11),
                          width: wp(24),
                          resizeMode: 'contain',
                        }}
                      />
                    </View>
                    <View style={{width: wp(65), marginLeft: wp(2)}}>
                      <Text
                        style={{
                          width: wp(65),
                          color: 'black',
                          fontFamily: secondFont,
                          fontSize: hp(1.7),
                        }}>
                        {item.name}
                      </Text>
                      <Text
                        style={{
                          width: wp(65),
                          color: 'black',
                          fontFamily: secondFont,
                          fontSize: hp(1.9),
                          marginTop: hp(0.5),
                        }}>
                        ₹{item.price}
                      </Text>
                      <View
                        style={{
                          width: wp(65),
                          flexDirection: 'row',
                          marginTop: hp(1.5),
                          justifyContent: 'space-between',
                          paddingRight: wp(2),
                        }}>
                        <View
                          style={{
                            width: wp(25),
                            // borderColor: 'black',
                            // borderWidth: 0.8,
                            height: hp(4),
                            borderRadius: 5,
                            paddingLeft: wp(2),
                            paddingRight: wp(2),
                            justifyContent: 'space-between',
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}>
                          <Text
                            style={{
                              color: 'black',
                              fontSize: hp(2.2),
                              fontFamily: secondFont,
                            }}>
                            {item.quantity}
                          </Text>
                          {/* 
                          <TouchableOpacity
                            onPress={() => {
                              if (inc <= 1) setinc(1);
                              else setinc(inc - 1);
                            }}>
                            <Image
                              source={require('../../assets/img/minus.png')}
                              style={{height: wp(6), width: wp(5)}}
                            />
                          </TouchableOpacity>
                          <TouchableOpacity onPress={() => setinc(inc + 1)}>
                            <Image
                              source={require('../../assets/img/plus.png')}
                              style={{height: wp(6), width: wp(5)}}
                            />
                          </TouchableOpacity> */}
                        </View>
                        <TouchableOpacity
                          onPress={() => onHandleRemove(item.productId, item)}>
                          <Image
                            source={require('../../assets/img/dlt.png')}
                            style={{height: wp(8), width: wp(8)}}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </TouchableOpacity>
                )}
              </View>
            );
          }}
        />
      ) : (
        <View
          style={{
            height: hp(100),
            display: 'flex',
            alignItems: 'center',
            paddingTop: hp(20),
          }}>
          <Image
            source={require('../../assets/img/cartimg.png')}
            style={{height: wp(30), width: wp(30), objectFit: 'contain'}}
          />

          <Text
            style={{
              color: '#e53c49',
              fontSize: wp(6),
              marginVertical: wp(5),
              fontFamily: mainFontBold,
            }}>
            Your cart is empty
          </Text>
          <Text style={{color: '#000', fontSize: wp(3), fontFamily: mainFont}}>
            Looks like you have not added anything to you cart. Go
          </Text>
          <Text style={{color: '#000', fontSize: wp(3), fontFamily: mainFont}}>
            ahead & explore top categories.
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Home')}
            style={{
              backgroundColor: '#e25c5f',
              padding: 10,
              marginTop: wp(5),
              borderRadius: 5,
              paddingHorizontal: wp(8),
              paddingVertical: wp(3),
            }}>
            <Text
              style={{color: '#fff', fontSize: wp(4), fontFamily: mainFont}}>
              Start Shop
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {cartArr && cartArr?.length > 0 ? (
        <>
          <View
            style={{
              height: hp(8),
              width: width,
              backgroundColor: 'white',
              elevation: 30,
              flexDirection: 'row',
              borderTopRightRadius: wp(10),
              borderTopLeftRadius: wp(10),
              paddingLeft: wp(7),
              paddingTop: hp(1),
              paddingRight: wp(7),
              justifyContent: 'space-between',
            }}>
            <View>
              <Text
                style={{
                  color: 'black',
                  fontSize: hp(1.9),
                  fontFamily: secondFont,
                }}>
                Payable Amount
              </Text>
              <Text
                style={{
                  color: 'black',
                  fontSize: hp(1.9),
                  fontFamily: secondFont,
                  marginTop: hp(1),
                  fontWeight: '700',
                }}>
                ₹{totallprice}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() =>
                user
                  ? navigation.navigate('Checkout', {typeofpage: 'Cart'})
                  : navigation.navigate('GuestCheckout', {pageType: 'Cart'})
              }
              style={{
                width: wp(30),
                height: hp(6),
                backgroundColor: 'black',
                borderRadius: 8,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  color: 'white',
                  fontFamily: secondFont,
                  fontSize: hp(1.9),
                }}>
                Pay Now
              </Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        ''
      )}
    </View>
  );
}

export default Cart