import { View, Text, Image, Dimensions, TextInput, TouchableOpacity, Pressable, StyleSheet, FlatList, ScrollView, ActivityIndicator } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import Header from '../ReuseableComponents/Header';
import { cancelOrderByIdApi, getOrderByIdApi } from '../services/order.service';
import { generateFilePath } from '../services/url.service';
import Modal from "react-native-modal";

const { height, width } = Dimensions.get('window')

const OrderDetail = () => {
    const mainFont = 'Montserrat-Regular'
    const mainFontBold = 'Montserrat-Bold'
    const secondFont = 'Lato-Regular'
    const red = '#CE3436'
    const navigation = useNavigation()
    const route = useRoute()
    const { IdofOrder } = route.params
    console.log(IdofOrder, "IDdddddddddddddddddddddddddddd")
    const [cnclmodl, setCnclmodl] = useState(false)
    const [productData, setProductData] = useState([])
    const [loading, setLoading] = useState(false)
    const isFocused = useIsFocused();
    const [opncoupon, setOpncoupon] = useState(false)
    const [orderid, setOrderid] = useState<any>("");
    const [orderdata, setOrderdata] = useState<any>("");

    const [show, setShow] = useState(false);

    const orderById = async () => {
        setLoading(true)
        const { data: res } = await getOrderByIdApi(IdofOrder)
        if (res.data) {
            console.log(JSON.stringify(res.data, null, 2), "::::::::::::::::::::::::;aaaaaaaaaaaaaaa");
            setProductData(res.data)
            setLoading(false)
        }
        // console.log(productData, "::::::::::::::::::::::::;")
    }

    const handleCancelOrder = async () => {
        try {
            console.log(IdofOrder, "AAAAAAaaaaaaaaaaaaaa")
            let statusArr = [...productData?.statusArr];
            console.log(IdofOrder, "AAAAAAaaaaaaaaaaaaaa")
            if (statusArr.some((el) => el.status == "CANCELLED")) {
                console.warn("Your Order already is Cancelled");
                setShow(false);
                return 0;
            }
            console.log(IdofOrder, "AAAAAAaaaaaaaaaaaaaa")
            const { data: res } = await cancelOrderByIdApi(IdofOrder);
            if (res.message) {
                console.warn(res.message);
                setShow(false);
                orderById();
                setOpncoupon(false)
            }
        } catch (error) {
            console.warn(error);
            setShow(false);
        }
    };

    useEffect(() => {
        orderById()
    }, [])
    return (
      <View style={{width: width, height: height, backgroundColor: 'white'}}>
        <Header back={true} label="Order Details" />
        <ScrollView style={{width: width, backgroundColor: 'white'}}>
          {loading ? (
            <ActivityIndicator />
          ) : (
            productData.productsArr &&
            productData.productsArr.map((item, index) => (
              <View style={{width: wp(95), alignSelf: 'center'}}>
                <View
                  style={{
                    flexDirection: 'row',
                    paddingTop: hp(2),
                    paddingBottom: hp(2),
                  }}>
                  <Image
                    source={{uri: generateFilePath(item.image)}}
                    style={{height: wp(30), width: wp(30), borderRadius: 5}}
                  />
                  <View style={{marginLeft: wp(2)}}>
                    <Text
                      style={{
                        fontFamily: secondFont,
                        fontSize: hp(1.8),
                        width: wp(60),
                        color: 'black',
                      }}>
                      {item.name}
                    </Text>
                    <Text
                      style={{
                        fontFamily: secondFont,
                        fontSize: hp(1.8),
                        width: wp(50),
                        marginTop: hp(0.7),
                      }}>
                      Brand : Brand Name
                    </Text>
                    <View style={{flexDirection: 'row', marginTop: hp(1)}}>
                      <Text
                        style={{
                          fontFamily: secondFont,
                          fontSize: hp(1.8),
                          color: 'black',
                        }}>
                        ₹ {productData.totalAmount}
                      </Text>
                      {/* <Text style={{ fontFamily: secondFont, fontSize: hp(1.5), color: 'gray', marginLeft: wp(4), textDecorationLine: 'line-through' }}>₹24,999.00</Text> */}
                    </View>
                    <Text
                      style={{
                        fontFamily: secondFont,
                        fontSize: hp(1.9),
                        color: 'black',
                        marginTop: hp(1.5),
                      }}>
                      QTY: {item.quantity}
                    </Text>
                  </View>
                </View>
                <Text
                  style={{
                    fontFamily: mainFontBold,
                    fontSize: hp(2),
                    color: 'black',
                    marginTop: hp(1.5),
                  }}>
                  Track Order
                </Text>
                <Text
                  style={{
                    fontFamily: secondFont,
                    fontSize: hp(1.9),
                    color: 'gray',
                    marginTop: hp(1.5),
                  }}>
                  Order ID - {productData.orderId}
                </Text>
                <View style={{flexDirection: 'row', marginTop: hp(3)}}>
                  <Image
                    source={require('../../assets/img/img50.png')}
                    style={{
                      height: hp(15),
                      width: wp(10),
                      resizeMode: 'contain',
                    }}
                  />
                  <View
                    style={{
                      height: hp(15),
                      marginLeft: wp(3),
                      justifyContent: 'space-between',
                    }}>
                    <View>
                      <Text
                        style={{
                          fontFamily: mainFontBold,
                          fontSize: hp(1.9),
                          color: 'black',
                        }}>
                        {productData.orderStatus == 'ORDERED'
                          ? 'Order Confirmed'
                          : 'Order yet to be confirmed'}
                      </Text>
                      <Text style={{fontFamily: secondFont}}>
                        On {new Date(productData?.createdAt).toDateString()}
                      </Text>
                    </View>
                    <View>
                      <Text
                        style={{
                          fontFamily: mainFontBold,
                          fontSize: hp(1.9),
                          color: 'black',
                        }}>
                        {productData.statusArr[0]?.status == 'DELIVERED'
                          ? 'Order Delivered'
                          : productData.statusArr[0]?.status == 'CANCELLED'
                          ? 'Order Cancelled'
                          : 'Order on Transit'}
                      </Text>
                      <Text style={{fontFamily: secondFont}}>
                        On{' '}
                        {new Date(
                          productData?.statusArr[0]?.on
                            ? productData?.statusArr[0]?.on
                            : productData?.updatedAt,
                        ).toDateString()}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Shipping Detail >>>>>>>>>>>>>>>>>>>>>>>>> */}
                <View style={{marginTop: hp(3)}}>
                  <Text
                    style={{
                      fontFamily: mainFontBold,
                      fontSize: hp(2),
                      color: 'gray',
                      marginTop: hp(1.5),
                    }}>
                    Shipping Details
                  </Text>
                  <View style={{width: wp(55), marginTop: hp(2)}}>
                    <Text
                      style={{
                        color: '#000',
                        fontSize: hp(1.9),
                        fontFamily: mainFontBold,
                      }}>
                      {productData.addressObj.firstName}
                    </Text>
                    <Text
                      style={{
                        color: '#000',
                        fontSize: hp(1.9),
                        fontFamily: secondFont,
                        marginTop: hp(0.5),
                      }}>
                      {productData.addressObj.street},{' '}
                      {productData.addressObj.city}
                    </Text>
                    <Text
                      style={{
                        color: '#000',
                        fontSize: hp(1.9),
                        fontFamily: secondFont,
                        marginTop: hp(0.5),
                      }}>
                      {productData.addressObj.state}:{' '}
                      {productData.addressObj.pincode}
                    </Text>
                    <Text
                      style={{
                        color: '#000',
                        fontSize: hp(1.9),
                        fontFamily: secondFont,
                        marginTop: hp(0.5),
                      }}>
                      Mobile No.: {productData.addressObj.phone}
                    </Text>
                  </View>
                  <Text
                    style={{
                      color: '#000',
                      fontFamily: mainFontBold,
                      fontSize: hp(2),
                 
                      marginTop: hp(4),
                    }}>
                    Price Details
                  </Text>
                  <View
                    style={{
                      color: '#000',
                      flexDirection: 'row',
                      width: wp(95),
                      justifyContent: 'space-between',
                      alignSelf: 'center',
                    }}>
                    <View style={{width: wp(70), marginTop: hp(2)}}>
                      {/* <Text style={{ fontSize: hp(1.9), fontFamily: secondFont, marginTop: hp(0.5) }}>List Price:</Text> */}
                      <Text
                        style={{
                          color: '#000',
                          fontSize: hp(1.9),
                          fontFamily: secondFont,
                          marginTop: hp(0.5),
                        }}>
                        Selling Price:
                      </Text>
                      {/* <Text style={{ fontSize: hp(1.9), fontFamily: secondFont, marginTop: hp(0.5) }}>Exttra Discount:</Text>
                                        <Text style={{ fontSize: hp(1.9), fontFamily: secondFont, marginTop: hp(0.5) }}>Special Price:</Text>
                                        <Text style={{ fontSize: hp(1.9), fontFamily: secondFont, marginTop: hp(0.5) }}>Shipping Fee + Secured Packing Fee:</Text>
                                        <Text style={{ fontSize: hp(1.9), fontFamily: secondFont, marginTop: hp(0.5) }}>Shipping Discount:</Text> */}
                      <Text
                        style={{
                          color: '#000',
                          fontSize: hp(1.9),
                          fontFamily: secondFont,
                          marginTop: hp(0.5),
                        }}>
                        Total Amount:
                      </Text>
                    </View>
                    <View style={{marginTop: hp(2)}}>
                      {/* <Text style={{ fontSize: hp(1.9), fontFamily: secondFont, marginTop: hp(0.5) }}>₹14,999</Text> */}
                      <Text
                        style={{
                          color: '#000',
                          fontSize: hp(1.9),
                          fontFamily: secondFont,
                          marginTop: hp(0.5),
                        }}>
                        ₹{item.price}
                      </Text>
                      {/* <Text style={{ fontSize: hp(1.9), fontFamily: secondFont, marginTop: hp(0.5) }}>-₹3,000</Text>
                                        <Text style={{ fontSize: hp(1.9), fontFamily: secondFont, marginTop: hp(0.5) }}>₹9,999</Text>
                                        <Text style={{ fontSize: hp(1.9), fontFamily: secondFont, marginTop: hp(0.5) }}>₹59</Text>
                                        <Text style={{ fontSize: hp(1.9), fontFamily: secondFont, marginTop: hp(0.5) }}>-₹40</Text> */}
                      <Text
                        style={{
                          color: '#000',
                          fontSize: hp(1.9),
                          fontFamily: secondFont,
                          marginTop: hp(0.5),
                        }}>
                        ₹{productData.subTotalAmount}
                      </Text>
                    </View>
                  </View>
                  {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: hp(4) }}>
                                    <Text style={{ fontFamily: mainFontBold, fontSize: hp(2), color: 'gray', }}>Price Details</Text>
                                    <TouchableOpacity>
                                        <Text style={{ color: '#2F80ED', fontFamily: secondFont, }}>Download Invoice</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: hp(2), alignproductDatas: 'center' }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Image source={require('../../assets/img/axis.png')}
                                            style={{ height: wp(17), width: wp(17) }} />
                                        <View style={{ marginLeft: wp(1.5), justifyContent: 'space-between' }}>
                                            <Text style={{ fontFamily: mainFontBold, fontSize: hp(1.9), color: 'black' }}>Card</Text>
                                            <Text style={{ fontFamily: secondFont, fontSize: hp(1.9) }}>Axis</Text>
                                            <Text style={{ fontFamily: mainFontBold, fontSize: hp(1.9), color: 'black' }}>xxxx xxxx 1485</Text>
                                        </View>
                                    </View>
                                    <Text style={{ fontFamily: mainFontBold, fontSize: hp(2), color: 'black' }}>₹10,028.00</Text>
                                </View> */}
                  {productData.orderStatus != 'CANCELLED' ? (
                    <View
                      style={{
                        width: wp(95),
                        alignSelf: 'center',
                        flexDirection: 'row',
                        paddingTop: hp(1.5),
                        paddingBottom: hp(1),
                        backgroundColor: 'white',
                        elevation: 25,
                        marginTop: hp(1.5),
                      }}>
                      <TouchableOpacity
                        // onPress={() => navigation.navigate('CancelOrder')}
                        onPress={() => setOpncoupon(true)}
                        style={{
                          width: wp(48),
                          height: hp(5),
                          borderRightColor: 'gray',
                          borderRightWidth: 0.8,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <Text style={{color: '#FF0000', fontSize: hp(1.8)}}>
                          Cancel
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={{
                          width: wp(47.5),
                          height: hp(5),
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexDirection: 'row',
                        }}>
                        <Image
                          source={require('../../assets/img/Phone.png')}
                          style={{
                            height: wp(5),
                            width: wp(5),
                            marginRight: wp(2),
                          }}
                        />
                        <Text style={{color: '#2F80ED', fontSize: hp(1.8)}}>
                          Support
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View
                      style={{
                        width: wp(95),
                        alignSelf: 'center',
                        flexDirection: 'row',
                        paddingTop: hp(1.5),
                        paddingBottom: hp(1),
                        backgroundColor: 'white',
                        elevation: 25,
                        marginTop: hp(1.5),
                      }}>
                      <TouchableOpacity
                        style={{
                          width: wp(95),
                          height: hp(5),
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexDirection: 'row',
                        }}>
                        <Image
                          source={require('../../assets/img/Phone.png')}
                          style={{
                            height: wp(5),
                            width: wp(5),
                            marginRight: wp(2),
                          }}
                        />
                        <Text style={{color: '#2F80ED', fontSize: hp(1.8)}}>
                          Support
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
            ))
          )}

          <Modal
            isVisible={opncoupon}
            animationIn={'bounceIn'}
            animationOut={'bounceOut'}
            onBackButtonPress={() => setOpncoupon(false)}
            onBackdropPress={() => setOpncoupon(false)}>
            <View
              style={{
                width: wp(90),
                backgroundColor: 'white',
                alignSelf: 'center',
                borderRadius: 5,
                paddingTop: hp(2),
                paddingBottom: hp(2),
              }}>
              <Text
                style={{
                  color: 'black',
                  fontSize: hp(2),
                  fontFamily: mainFontBold,
                  alignSelf: 'center',
                  textAlign: 'center',
                }}>
                Do You Want To Cancel Oreder?
              </Text>
              <View
                style={{
                  width: wp(85),
                  alignSelf: 'center',
                  flexDirection: 'row',
                  marginTop: hp(1.5),
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <TouchableOpacity
                  onPress={() => handleCancelOrder()}
                  style={{
                    height: hp(5.5),
                    width: wp(40),
                    borderColor: 'black',
                    borderWidth: 0.9,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 5,
                    alignSelf: 'center',
                    marginTop: hp(2),
                  }}>
                  <Text
                    style={{
                      fontSize: hp(1.7),
                      color: 'black',
                      fontFamily: mainFontBold,
                    }}>
                    Yes
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setOpncoupon(false)}
                  style={{
                    height: hp(5.5),
                    width: wp(40),
                    backgroundColor: 'black',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 5,
                    alignSelf: 'center',
                    marginTop: hp(2),
                  }}>
                  <Text
                    style={{
                      fontSize: hp(1.7),
                      color: 'white',
                      fontFamily: mainFontBold,
                    }}>
                    No
                  </Text>
                </TouchableOpacity>
              </View>
              {/* <Text style={{ color: 'black', fontSize: hp(2), fontFamily: mainFontBold, marginTop: hp(2), marginLeft: wp(3) }}>Available Coupon</Text> */}
            </View>
          </Modal>
        </ScrollView>
      </View>
    );
}

export default OrderDetail



