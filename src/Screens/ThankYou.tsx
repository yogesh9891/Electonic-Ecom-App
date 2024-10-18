import { View, Text, Image, Dimensions, TextInput, TouchableOpacity, Pressable, StyleSheet, FlatList, ScrollView } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import Modal from "react-native-modal";
import { UserContext } from '../../App';
import Header from '../ReuseableComponents/Header';
import { generateFilePath } from '../services/url.service';
import { cancelOrderByIdApi, getOrderByIdApi, getOrderIdSequence } from '../services/order.service';


const { height, width } = Dimensions.get('window')

const ThankYou = (props: any) => {
    const navigate = useNavigation()

    const [user, setUser] = useContext(UserContext)

    const navigation = useNavigation()
    const mainFont = 'Montserrat-Regular'
    const mainFontBold = 'Montserrat-Bold'
    const secondFont = 'Lato-Regular'
    const red = '#CE3436'
    const route = useRoute();
    const { orderId } = route.params;
    const isFocused = useIsFocused();
    const [opncoupon, setOpncoupon] = useState(false)
    const [orderid, setOrderid] = useState<any>("");
    const [orderdata, setOrderdata] = useState<any>("");

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [itemArr, setItemArr] = useState([

    ]);

    console.log(orderId, "Order IDdddddddddddddddddddd")


    // useEffect(() => {
    //     if (props.route.params?.orderId != '') {
    //         getOrders(props.route.params?.orderId);

    //     }
    // }, [props.route.params?.orderId]);

    useEffect(() => {
        getOrders()
    }, [])

    const handleCancelOrder = async () => {
        try {
            let statusArr = [...orderdata?.statusArr];

            if (statusArr.some((el) => el.status == "CANCELLED")) {
                console.warn("Your Order already is Cancelled");
                setShow(false);
                return 0;
            }
            const { data: res } = await cancelOrderByIdApi(orderdata?._id);
            if (res.message) {
                console.warn(res.message);
                setShow(false);
                getOrders();
                setOpncoupon(false)
            }
        } catch (error) {
            console.warn(error);
            setShow(false);
        }
    };
    const getOrders = async () => {
        try {
            const { data: res } = await getOrderByIdApi(orderId);
            if (res) {
                console.log(JSON.stringify(res.data, null, 2), "Datataatatatatatta");
                setOrderdata(res.data);
                let id = res.data.orderId
                    ? getOrderIdSequence(res.data.orderId)
                    : res.data?._id;

                console.log(
                    id,
                    "orderData?.shippingCharges orderData?.shippingCharges orderData?.shippingCharges "
                );
                setOrderid(id);
            }
        } catch (error: any) {
            console.log(error);
        }
    };

    const checkoutData = [
        {
            img: require('../../assets/img/img8.png'),
            name: 'Ring Qwerty',
            Price: '2499',
            type: 'Silver-7',
            Qty: 1
        },
        {
            img: require('../../assets/img/img8.png'),
            name: 'Ring Qwerty',
            Price: '2499',
            type: 'Silver',
            Qty: 1

        },
        {
            img: require('../../assets/img/img8.png'),
            name: 'Ring Qwerty',
            Price: '2499',
            type: 'Silver-7',
            Qty: 2
        },
        {
            img: require('../../assets/img/img8.png'),
            name: 'Ring Qwerty',
            Price: '2499',
            type: 'Silver-7',
            Qty: 1
        },
        {
            img: require('../../assets/img/img8.png'),
            name: 'Ring Qwerty',
            Price: '2499',
            type: 'Oxidised Silver',
            Qty: 3
        },

    ]
    return (
        <View style={{ width: width, height: height, backgroundColor: 'white' }}>
            {/* <Header secondheader={true} label='' /> */}
            <Header backbtn label='Your Order' />

            <ScrollView style={{ width: width, paddingTop: hp(2) }}>
                <View style={{ width: wp(95), alignSelf: 'center' }}></View>
                <Text style={{ color: 'black', fontFamily: mainFontBold, fontSize: hp(1.8), alignSelf: 'center' }}>THANK YOU FOR YOUR ORDER</Text>
                <Text style={{ color: 'gray', fontFamily: mainFont, fontSize: hp(1.5), alignSelf: 'center', marginTop: hp(0.5) }}>Please check your inbox, as a confirmation is on its way</Text>
                <View style={{ width: wp(95), alignSelf: 'center' }}>
                    <View style={{ width: wp(95), flexDirection: 'row', marginTop: hp(4), }}>
                        <Text style={{ color: 'black', fontSize: hp(1.7), fontFamily: mainFont, }}>ORDER DATE</Text>
                        <Text style={{ color: 'black', fontSize: hp(1.7), fontFamily: mainFontBold, }}>:        {new Date(orderdata?.createdAt).toDateString()}</Text>
                    </View>
                    <View style={{ width: wp(95), flexDirection: 'row', marginTop: hp(1), }}>
                        <Text style={{ color: 'black', fontSize: hp(1.7), fontFamily: mainFont, }}>ORDER ID</Text>
                        <Text style={{ color: 'black', fontSize: hp(1.7), fontFamily: mainFontBold, }}>:      {orderdata?._id}</Text>
                    </View>
                    <View style={{ width: wp(95), flexDirection: 'row', marginTop: hp(1), }}>
                        <Text style={{ color: 'black', fontSize: hp(1.7), fontFamily: mainFont, }}>ORDER TOTAL</Text>
                        <Text style={{ color: 'black', fontSize: hp(1.7), fontFamily: mainFontBold, }}>:      ₹ {orderdata?.totalAmount}</Text>
                    </View>
                    <View style={{ width: wp(95), flexDirection: 'row', marginTop: hp(1), }}>
                        <Text style={{ color: 'black', fontSize: hp(1.7), fontFamily: mainFont, }}>ORDER STATUS</Text>
                        <Text style={{ color: 'black', fontSize: hp(1.7), fontFamily: mainFontBold, }}>:      {orderdata.orderStatus}</Text>
                    </View>
                </View>

                <View style={{ width: wp(95), paddingBottom: hp(1), marginTop: hp(2) }}>
                    <FlatList
                        data={orderdata?.productsArr}
                        renderItem={({ item, index }) => {
                            return (
                                <View style={{ width: wp(95), height: hp(13), borderBottomColor: 'gray', borderBottomWidth: 0.7, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Image source={{ uri: generateFilePath(item.image) }}
                                        style={{ height: hp(12), width: hp(12) }} />
                                    <View style={{ width: wp(67), }}>
                                        <Text style={{ fontSize: hp(1.8), color: 'black', fontFamily: mainFont }}>{item.name}</Text>
                                        <Text style={{ fontSize: hp(1.8), color: 'gray', fontFamily: mainFont }}>{item.quantity}</Text>

                                        <View style={{ width: wp(65), flexDirection: 'row', marginTop: hp(2), justifyContent: 'space-between' }}>
                                            <Text style={{ fontSize: hp(1.8), color: 'black', fontFamily: mainFont }}>₹ {item.price}</Text>
                                        </View>
                                    </View>
                                </View>
                            )
                        }}

                    />
                </View>

                {
                    user && (
                        <View style={{ width: width, height: hp(5), backgroundColor: '#DEDEDE', flexDirection: 'row', alignItems: 'center', paddingRight: wp(2), paddingLeft: wp(2), justifyContent: 'space-between', alignSelf: 'center', marginTop: hp(1.5) }}>
                            <TouchableOpacity onPress={() => setOpncoupon(true)}>
                                <Text style={{ color: 'black', fontSize: hp(1.8), fontFamily: mainFontBold, }}>Cancel this order</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => navigate.navigate('BottamTab', { screen: 'Profile' })}>
                                <Text style={{ color: 'black', fontSize: hp(1.8), fontFamily: mainFontBold, }}>My Account</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => navigate.navigate('PrivacyPolicy')}>
                                <Text style={{ color: 'black', fontSize: hp(1.8), fontFamily: mainFontBold, }}>Return Policy</Text>
                            </TouchableOpacity>
                        </View>
                    )
                }


                <View style={{ width: wp(97), borderColor: 'gray', borderWidth: 1, alignSelf: 'center', marginTop: hp(1.5), paddingTop: hp(1.5), paddingBottom: hp(1.5), borderStyle: 'dashed', paddingRight: wp(2), paddingLeft: wp(2) }}>
                    <Text style={{ color: '#bdbbb7', fontSize: hp(1.6), fontFamily: mainFont, textAlign: 'center' }}>We live for your silver moments! Snap, tag, and leave a review – we'd love to see your shine.</Text>
                </View>

                <TouchableOpacity onPress={() => (navigate.navigate('Home'))} style={{ height: hp(5.5), width: wp(95), backgroundColor: 'black', alignItems: 'center', justifyContent: 'center', borderRadius: 5, alignSelf: 'center', marginTop: hp(2) }}>
                    <Text style={{ fontSize: hp(1.7), color: 'white', fontFamily: mainFontBold }}>Continue Shopping</Text>
                </TouchableOpacity>

                <Modal
                    isVisible={opncoupon}
                    animationIn={'bounceIn'}
                    animationOut={'bounceOut'}
                    onBackButtonPress={() => setOpncoupon(false)}
                    onBackdropPress={() => setOpncoupon(false)} >
                    <View style={{ width: wp(90), backgroundColor: 'white', alignSelf: 'center', borderRadius: 5, paddingTop: hp(2), paddingBottom: hp(2) }}>
                        <Text style={{ color: 'black', fontSize: hp(2), fontFamily: mainFontBold, alignSelf: 'center', textAlign: 'center' }}>Do You Want To Cancel Oreder?</Text>
                        <View style={{ width: wp(85), alignSelf: 'center', flexDirection: 'row', marginTop: hp(1.5), alignItems: 'center', justifyContent: 'space-between' }}>
                            <TouchableOpacity onPress={() => handleCancelOrder()} style={{ height: hp(5.5), width: wp(40), borderColor: 'black', borderWidth: 0.9, alignItems: 'center', justifyContent: 'center', borderRadius: 5, alignSelf: 'center', marginTop: hp(2) }}>
                                <Text style={{ fontSize: hp(1.7), color: 'black', fontFamily: mainFontBold }}>Yes</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => setOpncoupon(false)} style={{ height: hp(5.5), width: wp(40), backgroundColor: 'black', alignItems: 'center', justifyContent: 'center', borderRadius: 5, alignSelf: 'center', marginTop: hp(2) }}>
                                <Text style={{ fontSize: hp(1.7), color: 'white', fontFamily: mainFontBold }}>No</Text>
                            </TouchableOpacity>
                        </View>
                        {/* <Text style={{ color: 'black', fontSize: hp(2), fontFamily: mainFontBold, marginTop: hp(2), marginLeft: wp(3) }}>Available Coupon</Text> */}
                    </View>
                </Modal>


                <View style={{ height: hp(5) }} />
            </ScrollView>
        </View>
    )
}

export default ThankYou