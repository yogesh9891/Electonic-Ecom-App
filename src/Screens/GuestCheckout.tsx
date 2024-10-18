import { View, Text, Image, Dimensions, TextInput, TouchableOpacity, Pressable, StyleSheet, FlatList, ScrollView, Alert } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import Header from '../ReuseableComponents/Header';
import { getAllAddresssApi, getPincodeApi } from '../services/address.service';
import { getCartProduct } from '../services/usercart.service';
import { getProductById } from '../services/product.service';
import { generateFilePath } from '../services/url.service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserContext } from '../../App';
import { clearCart, getLocalCart } from '../services/localcart.service';
import { createGuestOrderApi, createOrderAPI, paymentCallback } from '../services/order.service';
import RazorpayCheckout from 'react-native-razorpay';
import { getToken } from '../services/user.service';

const { height, width } = Dimensions.get('window')
const GuestCheckout = () => {

    const navigation = useNavigation()
    const mainFont = 'Montserrat-Regular'
    const mainFontBold = 'Montserrat-Bold'
    const secondFont = 'Lato-Regular'
    const red = '#CE3436'
    const route = useRoute();
    const isFocused = useIsFocused();
    const { typeofpage } = route.params;
    const [selectedpaymentmethod, setSelectedPaymentMethod] = useState('COD')
    const [totallprice, setTotalprice] = useState('')
    const [checkoutArr, setCheckoutArr] = useState([])
    const [img, setImg] = useState('')
    const [shippingCharge, setShippingCharge] = useState(160)
    const [subTotal, setSubTotal] = useState(0)
    const [user, setUser] = useContext(UserContext)
    const [loading, setLoading] = useState(false)
    const [checkoutAddress, setCheckoutAddress] = useState('')
  const focused = useIsFocused();
 const [firstName, setFirstName] = useState<any>('');
 const [lastName, setLastName] = useState<any>('');
 const [email, setEmail] = useState<any>('');
 const [phone, setPhone] = useState<any>('');
 const [city, setCity] = useState<any>('');
 const [street, setStreet] = useState<any>('');
 const [state, setState] = useState<any>('');
 const [pincode, setPincode] = useState<any>('');
 const [isDefault, setIsDefault] = useState<any>(false);
 const [defaultAddId, setDefaultAddId] = useState<any>('');
 const [pincodeArr, setPincodeArr] = useState<any>([]);
 const [homeType, setHomeType] = useState<any>('Home');
 const [landmark, setLandmark] = useState<any>('');
 const [addressId, setaddressId] = useState('');


  
    console.log(typeofpage, "Page typeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee")

    const CartData = async () => {

      
          const {data: res} = await getLocalCart();
          const resdta = res.data;
          // console.log(resdta, ">>>>>>>>>>>>>>>>>>>>>")
          const totalPrice = resdta.reduce(
            (total, item) => total + item.price * item.quantity,
            0,
          );
          setCheckoutArr(res.data);
          // setinc(res.data[0].quantity)
          setSubTotal(totalPrice);

          console.log(res, ':::::::::::::::::::');

    }

      useEffect(() => {
        if (route && route?.params?.typeofpage) {
          BuyData();
        } else {
          CartData();
        }
      }, [route]);
    const BuyData = async () => {

        let cart: any = await AsyncStorage.getItem("@tekool-local-buy-now");
        let cartData = JSON.parse(cart);

        console.log(JSON.stringify(cartData[0], null, 2) + "Cart dataatatatatat")
        setCheckoutArr(cartData)
        setSubTotal(cartData[0].price * cartData[0].quantity)

    }

  
    let onHandleBuyPayment = async () => {
        try {
            if (selectedpaymentmethod == "") {
                console.warn("Please Select Payment Method ");
                return;
            }

             let addressObj: any = await onHandleSend();

             if (!addressObj) {
               return 0;
             }
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

            setLoading(true);
          let {data: res} = await createGuestOrderApi(orderObj);
          if (res.success) {
         
            if (selectedpaymentmethod == "COD") {
              await clearCart()
              navigation.navigate('ThankYou', {orderId: res.orderId});
            } else {
              var options = {
                description: 'Order',
                image: 'https:i.imgur.com/3g7nmJC.png',
                currency: 'INR',
                key: 'rzp_test_jOl57g4TNamtFW',
                amount: `${subTotal * 100}`,
                name: 'Order',
                order_id: "",
                // orderidd.data.orderId
                //   Replace this with an order_id created using Orders API.
                theme: {
                  color: '#CE3436',
                },
              };

            console.log(
              JSON.stringify(options, null, 2),
              '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>buy',
            );
              let orderId = res.orderId;
              RazorpayCheckout.open(options)
                .then(async data => {
                  //  handle success
                  console.log(data, 'Objjjjjjjjjjjjjjjjjjjjj');

                  let Obj = {...data};
                  await handlePaymentCallBack(Obj, orderId);
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
            }
          }
        } catch (error: any) {
            //    console.warn(error?.response?.data?.message);
            setLoading(false);
            console.log(error);
        }

    };


    const handlePaymentCallBack = async (obj: any, id: any) => {
        try {
            let orderObj: any = {
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
               await clearCart();
                 navigation.navigate('ThankYou', {
                   orderId: res.orderId,
                 });
              
            }
        } catch (error) {
            console.error(error);
        }
  };
    
      const onHandleSend = async () => {
        try {
          if (firstName == '') {
             console.warn('First name is required');
            return 0;
          } else if (email == '') {
             console.warn('Email is required');
            return 0;
          } else if (phone == '') {
             console.warn('Phone is required');
            return 0;
          } else if (email == '') {
             console.warn('Email is required');
            return 0;
          } else if (city == '') {
             console.warn('Please Select city from the drop down list.');
            return;
          } else if (street == '') {
             console.warn('Street is required');
            return;
          } else if (state == '') {
             console.warn('Please Select state from the drop down list.');
            return;
          } else if (pincode == '') {
             console.warn('Pincode is required');
            return 0;
          }
          console.log(
            /^[a-zA-Z ]+$/.test(firstName),
            'firstNamefirstNamefirstNamefirstNamefirstName',
          );

          if (email) {
            if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
               console.warn('Email is Invalid');
              return 0;
            }
          }

          if (!/^[a-zA-Z ]+$/.test(firstName)) {
             console.warn('first name is Invalid');
            return 0;
          }
          if (!/^[0-9]+$/.test(phone) || phone?.length != 10) {
             console.warn('phone  is Invalid');
            return 0;
          }

          if (!/^[0-9]+$/.test(pincode) || pincode?.length != 6) {
             console.warn('pincode  is Invalid');
            return 0;
          }

          if (lastName) {
            if (lastName != '' && !/^[a-zA-Z ]+$/.test(lastName)) {
               console.warn('last name is Invalid');
              return 0;
            }
          }

          if (state == '') {
             console.warn('state is Invalid');
            return 0;
          }
          let addressObj: any = {
            firstName,
            lastName,
            phone,
            email,
            city,
            street,
            state,
            pincode,
            landmark,
            homeType,
          };
            return addressObj;
        } catch (error) {
           console.warn(error);
        }
      };

 

  

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
          data={[1]}
          ListHeaderComponent={
            <View style={{width: width, paddingBottom: hp(1.5)}}>
              <FlatList
                data={checkoutArr}
                scrollEnabled={false}
                showsHorizontalScrollIndicator={false}
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
              />
            </View>
          }
          renderItem={({item, index}) => {
            return (
              <View style={{width: width, paddingBottom: hp(1.5)}}>
                <ScrollView style={{width: wp(95), alignSelf: 'center'}}>
                  <View
                    style={{
                      flex: 1,
                      padding: 10,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <View style={{width: wp(30)}}>
                      <Text style={{fontSize: hp(1.7), color: 'black'}}>
                        First Name <Text style={{color: '#EB5757'}}>*</Text>
                      </Text>
                      <TextInput
                        placeholder="Enter your First Name"
                        value={firstName}
                        onChangeText={e => setFirstName(e)}
                        style={{
                          width: wp(40),
                          height: hp(6),
                          backgroundColor: '#F9F9F9',
                          marginTop: hp(0.6),
                          paddingLeft: wp(3),
                          borderRadius: 5,
                          color: 'black',
                        }}
                      />
                    </View>
                    <View>
                      <Text style={{fontSize: hp(1.7), color: 'black'}}>
                        Last Name <Text style={{color: '#EB5757'}}>*</Text>
                      </Text>
                      <TextInput
                        placeholder="Enter your Last Name"
                        value={lastName}
                        onChangeText={e => setLastName(e)}
                        style={{
                          width: wp(40),
                          height: hp(6),
                          backgroundColor: '#F9F9F9',
                          marginTop: hp(0.6),
                          paddingLeft: wp(3),
                          borderRadius: 5,
                          color: 'black',
                        }}
                      />
                    </View>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      padding: 10,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <View>
                      <Text style={{fontSize: hp(1.7), color: 'black'}}>
                        Phone Number <Text style={{color: '#EB5757'}}>*</Text>
                      </Text>
                      <TextInput
                        placeholder="Enter Phone Number"
                        value={phone}
                        keyboardType="numeric"
                        maxLength={10}
                        onChangeText={e => setPhone(e)}
                        style={{
                          width: wp(40),
                          height: hp(6),
                          backgroundColor: '#F9F9F9',
                          marginTop: hp(0.6),
                          paddingLeft: wp(3),
                          borderRadius: 5,
                          color: 'black',
                        }}
                      />
                    </View>
                    <View>
                      <Text style={{fontSize: hp(1.7), color: 'black'}}>
                        Email<Text style={{color: '#EB5757'}}>*</Text>
                      </Text>
                      <TextInput
                        value={email}
                        onChangeText={e => setEmail(e)}
                        placeholder="Enter your email"
                        style={{
                          width: wp(40),
                          height: hp(6),
                          backgroundColor: '#F9F9F9',
                          marginTop: hp(0.6),
                          paddingLeft: wp(3),
                          borderRadius: 5,
                          color: 'black',
                        }}
                      />
                    </View>
                  </View>
                  <View>
                    <Text style={{fontSize: hp(1.7), color: 'black'}}>
                      Address Line<Text style={{color: '#EB5757'}}>*</Text>
                    </Text>
                    <TextInput
                      value={street}
                      onChangeText={e => setStreet(e)}
                      placeholder="Enter AddressLine"
                      style={{
                        width: wp(95),
                        height: hp(6),
                        backgroundColor: '#F9F9F9',
                        marginTop: hp(0.6),
                        paddingLeft: wp(3),
                        borderRadius: 5,
                        color: 'black',
                      }}
                    />
                  </View>

                  <View>
                    <Text style={{fontSize: hp(1.7), color: 'black'}}>
                      Pincode<Text style={{color: '#EB5757'}}>*</Text>
                    </Text>
                    <TextInput
                      value={pincode}
                      keyboardType="numeric"
                      onChangeText={e => setPincode(e)}
                      placeholder="Enter your Pincode"
                      style={{
                        width: wp(95),
                        height: hp(6),
                        backgroundColor: '#F9F9F9',
                        marginTop: hp(0.6),
                        paddingLeft: wp(3),
                        borderRadius: 5,
                        color: 'black',
                      }}
                    />
                  </View>

                  <View
                    style={{
                      flex: 1,
                      padding: 10,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <View>
                      <Text style={{fontSize: hp(1.7), color: 'black'}}>
                        City<Text style={{color: '#EB5757'}}>*</Text>
                      </Text>
                      <TextInput
                        value={city}
                        onChangeText={e => setCity(e)}
                        placeholder="Enter your City"
                        style={{
                          width: wp(40),
                          height: hp(6),
                          backgroundColor: '#F9F9F9',
                          marginTop: hp(0.6),
                          paddingLeft: wp(3),
                          borderRadius: 5,
                          color: 'black',
                        }}
                      />
                    </View>
                    <View>
                      <Text style={{fontSize: hp(1.7), color: 'black'}}>
                        State<Text style={{color: '#EB5757'}}>*</Text>
                      </Text>
                      <TextInput
                        value={state}
                        onChangeText={e => setState(e)}
                        placeholder="Enter your State"
                        style={{
                          width: wp(40),
                          height: hp(6),
                          backgroundColor: '#F9F9F9',
                          marginTop: hp(0.6),
                          paddingLeft: wp(3),
                          borderRadius: 5,
                          color: 'black',
                        }}
                      />
                    </View>
                  </View>

                  <View>
                    <Text style={{fontSize: hp(1.7), color: 'black'}}>
                      Landmark (Optional)
                    </Text>
                    <TextInput
                      value={landmark}
                      onChangeText={e => setLandmark(e)}
                      placeholder="Enter Landmark"
                      style={{
                        width: wp(95),
                        height: hp(6),
                        backgroundColor: '#F9F9F9',
                        marginTop: hp(0.6),
                        paddingLeft: wp(3),
                        borderRadius: 5,
                        color: 'black',
                      }}
                    />
                  </View>
                  {/* <View style={{ marginTop: hp(2), flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => setAddressssave(!adresssave)}>
                        <Image source={require('../../assets/img/tick2.png')}
                            style={{ height: wp(6), width: wp(6), tintColor: adresssave ? red : 'gray', resizeMode: 'contain' }} />
                    </TouchableOpacity>
                    <Text style={{ fontSize: hp(1.9), marginLeft: wp(0.5) }}>save the address for later</Text>
                </View> */}
                  <View
                    style={{
                      width: wp(65),
                      marginTop: hp(2),
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <TouchableOpacity
                      onPress={() => setHomeType('Home')}
                      style={{flexDirection: 'row', alignItems: 'center'}}>
                      {homeType == 'Home' ? (
                        <Image
                          source={require('../../assets/img/crcltk.png')}
                          style={{height: wp(6), width: wp(6), tintColor: red}}
                        />
                      ) : (
                        <Image
                          source={require('../../assets/img/crcltk1.png')}
                          style={{height: wp(6), width: wp(6)}}
                        />
                      )}
                      <Text
                        style={{
                          marginLeft: wp(1),
                          fontSize: hp(1.9),
                          color: 'black',
                        }}>
                        Home
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => setHomeType('Office')}
                      style={{flexDirection: 'row', alignItems: 'center'}}>
                      {homeType == 'Office' ? (
                        <Image
                          source={require('../../assets/img/crcltk.png')}
                          style={{height: wp(6), width: wp(6), tintColor: red}}
                        />
                      ) : (
                        <Image
                          source={require('../../assets/img/crcltk1.png')}
                          style={{height: wp(6), width: wp(6)}}
                        />
                      )}
                      <Text
                        style={{
                          marginLeft: wp(1),
                          fontSize: hp(1.9),
                          color: 'black',
                        }}>
                        Office
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => setHomeType('Other')}
                      style={{flexDirection: 'row', alignItems: 'center'}}>
                      {homeType == 'Other' ? (
                        <Image
                          source={require('../../assets/img/crcltk.png')}
                          style={{height: wp(6), width: wp(6), tintColor: red}}
                        />
                      ) : (
                        <Image
                          source={require('../../assets/img/crcltk1.png')}
                          style={{height: wp(6), width: wp(6)}}
                        />
                      )}
                      <Text
                        style={{
                          marginLeft: wp(1),
                          fontSize: hp(1.9),
                          color: 'black',
                        }}>
                        Other
                      </Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
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
                onPress={() => onHandleBuyPayment()}
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

export default GuestCheckout;