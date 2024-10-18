import { View, Text, Image, Dimensions, TextInput, TouchableOpacity, Pressable, StyleSheet, FlatList, ScrollView, Alert } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import Header from '../ReuseableComponents/Header';
import { getAllAddresssApi } from '../services/address.service';
import { getCartProduct } from '../services/usercart.service';
import { getProductById } from '../services/product.service';
import { generateFilePath } from '../services/url.service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserContext } from '../../App';
import { getLocalCart } from '../services/localcart.service';
import { createGuestOrderApi, createOrderAPI, paymentCallback } from '../services/order.service';
import RazorpayCheckout from 'react-native-razorpay';
import { getToken } from '../services/user.service';

const { height, width } = Dimensions.get('window')
const Checkout = () => {

    const navigation = useNavigation()
    const mainFont = 'Montserrat-Regular'
    const mainFontBold = 'Montserrat-Bold'
    const secondFont = 'Lato-Regular'
    const red = '#CE3436'
    const route = useRoute();
    const isFocused = useIsFocused();
    const { typeofpage } = route.params;
    const [addressArr, setAddressArr] = useState<any>([]);
    const [selectedpaymentmethod, setSelectedPaymentMethod] = useState('')
    const [totallprice, setTotalprice] = useState('')
    const [checkoutArr, setCheckoutArr] = useState([])
    const [img, setImg] = useState('')
    const [shippingCharge, setShippingCharge] = useState(160)
    const [subTotal, setSubTotal] = useState(0)
    const [user, setUser] = useContext(UserContext)
    const [loading, setLoading] = useState(false)
    const [checkoutAddress, setCheckoutAddress] = useState('')
  const focused = useIsFocused();

    const getuserAddress = async () => {
        const { data: res } = await getAllAddresssApi("");
        console.log(JSON.stringify(res.data, null, 2), ">>>>>>>>>>>>>>>Adress")
        setAddressArr(res.data)

    }
    console.log(typeofpage, "Page typeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee")

    const CartData = async () => {
      let token = await getToken();

        if (token) {
          const {data: res} = await getCartProduct();
          const resdta = res.data;
          console.log(resdta, '>>>>>>>>>>>>>>>>>>>>>aaaaaaaaaaaaaaaaaaaaaa');
          const totalPrice = resdta.reduce(
            (total, item) => total + item.price * item.quantity,
            0,
          );
          setTotalprice(totalPrice);
          console.log(
            JSON.stringify(res.data, null, 2),
            '>>>>>>>>>>>>>>>>>>>>>',
          );
          setCheckoutArr(res.data);
          const subtotalPrice = resdta.reduce(
            (total, item) => total + item.price * item.quantity,
            0,
          );
          console.log(subtotalPrice, 'SubtotalPriceeeeeeeeeeee');
          setSubTotal(subtotalPrice);
        } else {
          const {data: res} = await getLocalCart();
          const resdta = res.data;
          // console.log(resdta, ">>>>>>>>>>>>>>>>>>>>>")
          const totalPrice = resdta.reduce(
            (total, item) => total + item.price * item.quantity,
            0,
          );
          setCheckoutArr(res.data);
          // setinc(res.data[0].quantity)
          setTotalprice(totalPrice);
          console.log(res, ':::::::::::::::::::');
        }

    }

      useEffect(() => {
        if (focused) {
          CartData();
        }
      }, [focused]);
    const BuyData = async () => {

        let cart: any = await AsyncStorage.getItem("@tekool-local-buy-now");
        let cartData = JSON.parse(cart);

        console.log(JSON.stringify(cartData[0], null, 2) + "Cart dataatatatatat")
        setCheckoutArr(cartData)
        setSubTotal(cartData[0].price * cartData[0].quantity)

    }

    let onHandleBuyPayment = async () => {
        try {
            //   if (!isAuthorised) {
            //     handleGuestOrderSubmit();
            //     return
            //   }
            if (checkoutAddress == "") {
                console.warn("Please Select Address ");
                return;
            }
            if (selectedpaymentmethod == "") {
                console.warn("Please Select Payment Method ");
                return;
            }

            let addressObj: any = addressArr.find((el: any) => el._id == checkoutAddress);
            // console.log(addressObj, "Adressssssssssssss")
            //   if (orderNotes != "") {
            //     addressObj.orderNotes = orderNotes;
            //   }

            let orderObj: any = {
                addressObj,
                payMethod: selectedpaymentmethod,
                cartArr: checkoutArr,
                subTotalAmount: subTotal,
                totalAmount: subTotal + shippingCharge,
                dicountObj: 0,
                // giftwarp
            };
            // console.log(orderObj, "Orderobjjjjjjjjjjjjjjjjjjjjjjjjjjjjj")

            //   if (userId != "") {
            //     orderObj.userId = userId
            //   }

            console.log(JSON.stringify(orderObj, null, 2), ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>buy")
            setLoading(true);
            let { data: res } = await createOrderAPI(orderObj);
            if (res.success) {
                console.log(res.orderId, "Order Datatttttttttttttttttttt")
                navigation.navigate('ThankYou', { orderId: res.orderId })
                // let localCart: any = JSON.stringify([]);
                // await AsyncStorage.setItem("@touch-local-buy-now", localCart);
                // await AsyncStorage.removeItem("@touch-local-coupon");
                // //   router.push(`/order-complete/${res.orderId}`);
                // navigation.navigate('ThankYou', { orderId: res.orderId })
                //     if (payMethod == "phonepay") {
                //       let localCart: any = JSON.stringify([]);
                //       await AsyncStorage.setItem("@touch-local-buy-now", localCart);
                //       console.log(res?.data?.instrumentResponse, "asasdfafsasdfs");
                //       if (res?.data && res?.data.instrumentResponse) {
                //         let instrumentResponse = res?.data.instrumentResponse;
                //         if (instrumentResponse?.redirectInfo) {
                //           //   window.location.href = instrumentResponse?.redirectInfo.url;
                //           return 0;
                //         }
                //       } else {
                //         toastError(
                //           "`Phonepe is not working.Please Try Some another Payment Method"
                //         );
                //       }

                //       return 0;
                //     } else if (payMethod == "COD") {

                //   toastSuccess(res.message);
                //   let localCart: any = JSON.stringify([]);
                //   await AsyncStorage.setItem("@touch-local-buy-now", localCart);
                //   await AsyncStorage.removeItem("@touch-local-coupon");
                //   //   router.push(`/order-complete/${res.orderId}`);
                //   navigation.navigate('ThankYou', { orderId: res.orderId })
                // }
            }
        } catch (error: any) {
            //   toastError(error?.response?.data?.message);
            setLoading(false);
            console.log(error);
        }

    };

    const onlinePayment = async () => {
        try {

            let addressObj: any = addressArr.find((el: any) => el._id == checkoutAddress);
            let orderObj: any = {
                addressObj,
                payMethod: selectedpaymentmethod,
                cartArr: checkoutArr,
                subTotalAmount: subTotal,
                totalAmount: subTotal + shippingCharge,
                // dicountObj: discountObj,
                // giftwarp
            };
            console.log(orderObj, ">>>>>>>>>>>>>>>>>>>>>>order")
            const orderidd = await createGuestOrderApi(orderObj)
            console.log(JSON.stringify(orderidd.data, null, 2), "Orderrrrrrrrrrrrrrrrrr")

            // console.log(JSON.stringify(obj, null, 2));
            // console.log(JSON.stringify(obj, null, 2), 'object');
            // let tempObj = obj;
            // let OrderId = orderId;
            var options = {
                description: 'Order',
                image: 'https:i.imgur.com/3g7nmJC.png',
                currency: "INR",
                key: 'rzp_test_jOl57g4TNamtFW',
                amount: `${subTotal *100}`,
                name: 'Order',
                order_id: "",
                // orderidd.data.orderId
                //   Replace this with an order_id created using Orders API.
                theme: {
                    color: '#CE3436',
                },
            };
            RazorpayCheckout.open(options)
                .then(async data => {
                    //  handle success
                    console.log(data, 'Objjjjjjjjjjjjjjjjjjjjj');

                    let Obj = { ...data};
                    await handlePaymentCallBack(Obj, orderidd.data.orderId);
                })
                .catch(error => {
                    //  handle failure console.error(error);
                        console.log(
                          error,
                          '  console.log( error);  console.log( error);',
                        );

                    if (error?.error?.description) {
                        alert(error?.error?.description, 'saddfsfdfsd');
                    } else {
                        alert(`Error: ${error.code} | ${error.description}`);
                    }
                });
        } catch (error) {
            console.error(error, 'jhgjgkkjhjkljhkljk;ljk;lk;lk;lkl;k;');
        }
    }

    const handlePaymentCallBack = async (obj: any, id: any) => {
        try {
            let addressObj: any = addressArr.find((el: any) => el._id == checkoutAddress);
            let orderObj: any = {
                addressObj,
                payMethod: selectedpaymentmethod,
                cartArr: checkoutArr,
                subTotalAmount: subTotal,
                totalAmount: subTotal + shippingCharge,
                // dicountObj: discountObj,
                // giftwarp
            };
            const serialize = function (obj) {
                var str = [];
                for (var p in obj)
                    if (obj.hasOwnProperty(p)) {
                        str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
                    }
                return str.join('&');
            };
            let { data: res, status: statusCode } = await paymentCallback(id, serialize(orderObj));

            console.log(
              res,
              statusCode,
              'statusCodestatusCodestatusCodestatusCode',
            );
            if (statusCode == 200 || statusCode == 304) {
                //   setModalVisible(true);
                 navigation.navigate('ThankYou', {
                   orderId: res.orderId,
                 });
              
            }
        } catch (error) {
            console.error(error);
        }
    };
    const handlePayment = async () => {

        if (!checkoutAddress) {
            alert("Please Select Address");
            return
        }
         if (selectedpaymentmethod == "COD") {
                onHandleBuyPayment();
            }
            else {
                onlinePayment()
            }
    }

    useEffect(() => {
        if (isFocused) {
            getuserAddress();
            // if (typeofpage == 'Cart') {
            //     CartData();
            // }
            // else {
            BuyData();
            // }
        }
    }, [isFocused])

    const Productdata = [
        {
            name: "Metal Joints Curved AC Grills, For Outdoor,",
            price: '449',
            capacity: "2 Ton",
            img: require("../../assets/img/img3.png")
        },
        {
            name: "Metal Joints Curved AC Grills, For Outdoor,",
            price: '449',
            capacity: "2 Ton",
            img: require("../../assets/img/img6.png")
        },
        {
            name: "Metal Joints Curved AC Grills, For Outdoor,",
            price: '449',
            capacity: "2 Ton",
            img: require("../../assets/img/img9.png")
        },
        {
            name: "Metal Joints Curved AC Grills, For Outdoor,",
            price: '449',
            capacity: "2 Ton",
            img: require("../../assets/img/img7.png")
        },
    ]

    return (
      <View
        style={{
          width: width,
          height: height,
          backgroundColor: 'white',
          paddingBottom: hp(1.5),
        }}>
        <Header back={true} label="Checkout" />

        <FlatList
          data={checkoutArr}
          ListHeaderComponent={
            <View style={{width: width, paddingBottom: hp(1.5)}}>
              {/* <View style={{ width: width, height: hp(8), backgroundColor: '#F5F5F5', flexDirection: 'row', paddingLeft: wp(2), alignItems: 'center', paddingRight: wp(3), justifyContent: 'space-between' }}>
                            <View style={{ flexDirection: 'row' }}>
                                <Image source={require('../../assets/img/location.png')}
                                    style={{ height: wp(6.5), width: wp(6.5), }} />
                                <Text style={{ width: wp(55), fontSize: hp(1.8), fontFamily: secondFont, marginLeft: wp(1) }}>XYZ</Text>
                                {/* {addressArr[0].street}, {addressArr[0].city}, {addressArr[0].state}, {addressArr[0].pincode} */}
              {/* </View>
                            <TouchableOpacity
                                onPress={() => navigation.navigate('AddAddress')}
                                style={{ width: wp(20), height: hp(4), borderColor: 'black', borderWidth: 0.9, borderRadius: 5, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ color: 'black', fontFamily: secondFont, fontSize: hp(1.8) }}>Change</Text>
                            </TouchableOpacity>
                        </View>  */}

              <FlatList
                data={addressArr}
                scrollEnabled={false}
                showsHorizontalScrollIndicator={false}
                renderItem={({item, index}) => {
                  return (
                    <TouchableOpacity
                      onPress={() => setCheckoutAddress(item._id)}
                      style={{
                        width: width,
                        maxHeight: hp(15),
                        backgroundColor: '#F5F5F5',
                        flexDirection: 'row',
                        paddingLeft: wp(2),
                        alignItems: 'center',
                        paddingRight: wp(3),
                        justifyContent: 'space-between',
                        paddingTop: hp(1.5),
                        paddingBottom: hp(1.5),
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
                            color:"black"
                          }}>
                          {item.firstName} {item.lastName}, {item.street},{' '}
                          {item.city}, {item.pincode}, {item.state} 
                        </Text>
                        {/* {addressArr[0].street}, {addressArr[0].city}, {addressArr[0].state}, {addressArr[0].pincode} */}
                      </View>
                      <View
                        style={{
                          height: wp(5),
                          width: wp(5),
                          borderColor:
                            checkoutAddress == item._id ? red : 'gray',
                          borderWidth: 1,
                          borderRadius: wp(5),
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        {checkoutAddress == item._id && (
                          <View
                            style={{
                              height: wp(3.5),
                              width: wp(3.5),
                              backgroundColor: red,
                              borderRadius: wp(4),
                            }}
                          />
                        )}
                      </View>
                    </TouchableOpacity>
                  );
                }}
              />
            </View>
          }
          renderItem={({item, index}) => {
            return (
              <View
                style={{
                  width: wp(95),
                  alignSelf: 'center',
                  flexDirection: 'row',
                  marginBottom: hp(2),
                  justifyContent: 'space-between',
                }}>
                <View style={{flexDirection: 'row'}}>
                  <Image
                    source={
                      item.productImage != ''
                        ? {uri: generateFilePath(item.productImage)}
                        : require('../../assets/img/img3.png')
                    }
                    style={{
                      height: wp(20),
                      width: wp(20),
                      borderColor: 'gray',
                      borderWidth: 0.6,
                      borderRadius: 5,
                    }}
                  />
                  <View
                    style={{
                      width: wp(40),
                      marginLeft: wp(2),
                      marginTop: hp(2),
                    }}>
                    <Text
                      style={{
                        fontSize: hp(1.8),
                        fontFamily: mainFont,
                        color: 'gray',
                      }}>
                      {item.name}
                    </Text>
                    <Text
                      style={{
                        fontSize: hp(1.8),
                        fontFamily: mainFontBold,
                        color: 'black',
                      }}>
                      Price: ₹{item.price * item.quantity}
                    </Text>
                    <Text
                      style={{
                        fontSize: hp(1.8),
                        fontFamily: mainFont,
                        color: 'black',
                      }}>
                      QTY: {item.quantity}
                    </Text>
                  </View>
                </View>
              </View>
            );
          }}
          ListFooterComponent={
            <View
              style={{width: wp(95), alignSelf: 'center', marginTop: hp(2)}}>
              <Text
                style={{
                  fontSize: hp(2),
                  fontFamily: mainFontBold,
                  color: 'black',
                }}>
                Order Summary
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: hp(1),
                  justifyContent: 'space-between',
                }}>
                <Text
                  style={{
                    fontSize: hp(1.8),
                    fontFamily: mainFont,
                    color: 'black',
                  }}>
                  Sub Total
                </Text>
                <Text
                  style={{
                    fontSize: hp(1.8),
                    fontFamily: mainFontBold,
                    color: 'black',
                  }}>
                  ₹ {subTotal}.00
                </Text>
              </View>
              {/* <View style={{ flexDirection: 'row', marginTop: hp(1), justifyContent: 'space-between' }}>
                            <Text style={{ fontSize: hp(1.8), fontFamily: mainFont, color: 'black' }}>Shipping</Text>
                            <Text style={{ fontSize: hp(1.8), fontFamily: mainFontBold, color: 'black' }}>₹ 160.00</Text>
                        </View> */}

              <View
                style={{
                  width: wp(95),
                  marginTop: hp(1),
                  borderBottomColor: 'black',
                  borderBottomWidth: 0.8,
                }}
              />
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: hp(1),
                  justifyContent: 'space-between',
                }}>
                <Text
                  style={{
                    fontSize: hp(1.8),
                    fontFamily: mainFont,
                    color: 'black',
                  }}>
                  Order Total
                </Text>
                <Text
                  style={{
                    fontSize: hp(1.8),
                    fontFamily: mainFontBold,
                    color: 'black',
                  }}>
                  ₹ {subTotal}.00
                </Text>
              </View>

              <Text
                style={{
                  fontSize: hp(2),
                  fontFamily: mainFontBold,
                  color: 'black',
                  marginTop: hp(2),
                }}>
                Select Payment
              </Text>
              <TouchableOpacity
                onPress={() => setSelectedPaymentMethod('Online')}
                style={{flexDirection: 'row', marginTop: hp(1.5)}}>
                <View
                  style={{
                    width: wp(5),
                    height: wp(5),
                    borderColor:
                      selectedpaymentmethod == 'Online' ? red : 'gray',
                    borderWidth: 0.7,
                    borderRadius: wp(3),
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  {selectedpaymentmethod == 'Online' && (
                    <View
                      style={{
                        width: wp(3.5),
                        height: wp(3.5),
                        borderRadius: wp(4),
                        backgroundColor: red,
                      }}
                    />
                  )}
                </View>
                <Text
                  style={{
                    fontSize: hp(1.8),
                    fontFamily: mainFont,
                    color: selectedpaymentmethod == 'Online' ? 'black' : 'gray',
                    marginLeft: wp(2),
                  }}>
                  Pay Online
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setSelectedPaymentMethod('COD')}
                style={{flexDirection: 'row', marginTop: hp(1.5)}}>
                <View
                  style={{
                    width: wp(5),
                    height: wp(5),
                    borderColor: selectedpaymentmethod == 'COD' ? red : 'gray',
                    borderWidth: 0.7,
                    borderRadius: wp(3),
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  {selectedpaymentmethod == 'COD' && (
                    <View
                      style={{
                        width: wp(3.5),
                        height: wp(3.5),
                        borderRadius: wp(4),
                        backgroundColor: red,
                      }}
                    />
                  )}
                </View>
                <Text
                  style={{
                    fontSize: hp(1.8),
                    fontFamily: mainFont,
                    color: selectedpaymentmethod == 'COD' ? 'black' : 'gray',
                    marginLeft: wp(2),
                  }}>
                  Cash on Delivery
                </Text>
              </TouchableOpacity>

              <Text
                style={{
                  fontSize: hp(1.7),
                  fontFamily: mainFont,
                  color: 'black',
                  marginLeft: wp(2),
                  marginTop: hp(2),
                }}>
                We Accept
              </Text>
              <View
                style={{
                  width: wp(95),
                  alignSelf: 'center',
                  flexDirection: 'row',
                  marginTop: hp(1),
                  justifyContent: 'space-between',
                }}>
                <Image
                  source={require('../../assets/img/visa.png')}
                  style={{height: wp(18), width: wp(18), resizeMode: 'contain'}}
                />
                <Image
                  source={require('../../assets/img/discover.png')}
                  style={{height: wp(18), width: wp(18), resizeMode: 'contain'}}
                />
                <Image
                  source={require('../../assets/img/mastercard.png')}
                  style={{height: wp(18), width: wp(18), resizeMode: 'contain'}}
                />
                <Image
                  source={require('../../assets/img/paypal.png')}
                  style={{height: wp(18), width: wp(18), resizeMode: 'contain'}}
                />
              </View>

              <TouchableOpacity
                onPress={() => handlePayment()}
                style={{
                  width: wp(95),
                  height: hp(5.5),
                  backgroundColor: red,
                  alignSelf: 'center',
                  marginTop: hp(2),
                  borderRadius: 5,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    fontSize: hp(1.8),
                    fontFamily: mainFont,
                    color: 'white',
                    marginLeft: wp(2),
                  }}>
                  Place Order
                </Text>
              </TouchableOpacity>
            </View>
          }
        />
      </View>
    );
}

export default Checkout