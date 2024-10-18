import { View, Text, Image, Dimensions, TextInput, TouchableOpacity, Pressable, StyleSheet, FlatList, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import Header from '../ReuseableComponents/Header';
import { deleteAddressById, getAllAddresssApi } from '../services/address.service';
import Modal from "react-native-modal";

const { height, width } = Dimensions.get('window')

const AddAddress = () => {
    const navigation = useNavigation()
    const [firstName, setFirstName] = useState<any>("");
    const [lastName, setLastName] = useState<any>("");
    const [email, setEmail] = useState<any>("");
    const [phone, setPhone] = useState<any>("");
    const [city, setCity] = useState<any>("");
    const [street, setStreet] = useState<any>("");
    const [state, setState] = useState<any>("");
    const [pincode, setPincode] = useState<any>("");
    const [addressArr, setAddressArr] = useState<any>([]);
    const [isDefault, setIsDefault] = useState<any>(false);
    const [defaultAddId, setDefaultAddId] = useState<any>("");
    const [confirmationmodal, setconfirmationmodal] = useState(false);
    const [useridtoDelete, setuseridtoDelete] = useState('')
    const isFocused = useIsFocused();
    const [refreshing, setRefreshing] = useState(false);




    const getuserAddress = async () => {
        const { data: res } = await getAllAddresssApi("");
        console.log(JSON.stringify(res.data, null, 2), ">>>>>>>>>>>>>>>")
        setAddressArr(res.data)
    }

    let onHandleDelete = async (id: string) => {
        try {
            let { data: res } = await deleteAddressById(id);
            if (res) {
                // toastSuccess(res.message ? res.message : "Address Deleted");
                console.warn(res.message ? res.message : "Address Deleted")
                setconfirmationmodal(false)
                getuserAddress();
            }
        } catch (err) {
            // toastError(err);
            console.warn(err)
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        getuserAddress()
        setRefreshing(false);
    };
    useEffect(() => {
        if (isFocused) {
            getuserAddress()
        }
    }, [isFocused])
    const Saved_Address = [
        {
            name: 'Rohan Sarkar',
            address: 'Magneto, Action Area II, Newtower',
            stateAndPIN: 'Delhi: 110091',
            Mobile: '01234567890',
            addresstype: 'Home'
        },
        {
            name: 'Mohan Sarkar',
            address: 'Railway Road, Action Area II, Newtower',
            stateAndPIN: 'Delhi: 110091',
            Mobile: '8686465457',
            addresstype: 'Other'
        },
        {
            name: 'Sohan Sarkar',
            address: 'Circulaar Road, Action Area II, Newtower',
            stateAndPIN: 'Delhi: 110091',
            Mobile: '982356387',
            addresstype: 'Office'
        },
    ]
    const [addressselected, setAddressselected] = useState('')
    return (
        <View style={{ width: width, height: height, backgroundColor: '#fff' }}>
            <Header back={true} label='Add Address' buttonshow={true} />
            <View style={{ width: width }}>
                <View style={{ width: wp(95), alignSelf: 'center', marginTop: hp(3) }}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('NewAddress')}
                        style={{ height: hp(6.5), width: wp(85), borderColor: 'black', borderWidth: 1, alignSelf: 'center', borderRadius: 5, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <Image source={require('../../assets/img/cplus.png')}
                            style={{ height: wp(9), width: wp(9), resizeMode: 'contain' }} />
                        <Text style={{ color: 'black', marginLeft: wp(2), fontSize: hp(2), fontWeight: '500' }}>Add New</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ width: wp(95), alignSelf: 'center', marginTop: hp(2) }}>
                    <FlatList
                        data={addressArr}
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                        renderItem={({ item, index }) => {
                            return (
                              <TouchableOpacity
                                onPress={() => setAddressselected(item._id)}
                                style={{
                                  width: wp(95),
                                  paddingTop: hp(3),
                                  paddingBottom: hp(3),
                                  backgroundColor:
                                    addressselected == item._id
                                      ? '#CE3436'
                                      : '#F9F9F9',
                                  marginBottom: hp(2),
                                  paddingRight: wp(2),
                                  paddingLeft: wp(2),
                                  borderRadius: wp(2),
                                }}>
                                <View
                                  style={{
                                    width: wp(85),
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignSelf: 'center',
                                  }}>
                                  <View style={{width: wp(65)}}>
                                    <Text
                                      style={{
                                        color:
                                          addressselected == item._id
                                            ? '#fff'
                                            : '#000',
                                        fontSize: hp(1.9),
                                        fontFamily: 'AvenirNextLTPro-SemiBold',
                                      }}>
                                      {item.firstName} {item.lastName}
                                    </Text>
                                    <Text
                                      style={{
                                        color:
                                          addressselected == item._id
                                            ? '#fff'
                                            : '#000',
                                        fontSize: hp(1.9),
                                        fontFamily: 'AvenirNextLTPro-Regular',
                                        marginTop: hp(0.5),
                                      }}>
                                      {item.street} {item.city}, {item.state},{' '}
                                      {item.pincode}
                                    </Text>
                                    {/* <Text style={{ color: addressselected == item.address ? '#fff' : '#000', fontSize: hp(1.9), fontFamily: 'AvenirNextLTPro-Regular', marginTop: hp(0.5) }}>{item.stateAndPIN}</Text> */}
                                    <Text
                                      style={{
                                        color:
                                          addressselected == item._id
                                            ? '#fff'
                                            : '#000',
                                        fontSize: hp(1.9),
                                        fontFamily: 'AvenirNextLTPro-Regular',
                                        marginTop: hp(1),
                                      }}>
                                      Mobile No.: {item.phone}
                                    </Text>
                                  </View>
                                  {addressselected == item._id && (
                                    <Image
                                      source={require('../../assets/img/tick1.png')}
                                      style={{height: wp(8), width: wp(8)}}
                                    />
                                  )}
                                </View>
                                <View
                                  style={{
                                    width: wp(85),
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignSelf: 'center',
                                    marginTop: hp(1.5),
                                  }}>
                                  <View
                                    style={{
                                      width: wp(20),
                                      height: hp(4),
                                      backgroundColor: 'white',
                                      borderRadius: 5,
                                      justifyContent: 'center',
                                      alignItems: 'center',
                                    }}>
                                    <Text
                                      style={{
                                        color: 'black',
                                        fontSize: hp(1.8),
                                        fontFamily: 'AvenirNextLTPro-SemiBold',
                                      }}>
                                      {item.homeType}
                                    </Text>
                                  </View>
                                  <View
                                    style={{
                                      flexDirection: 'row',
                                      width: wp(18),
                                      justifyContent: 'space-between',
                                    }}>
                                    <TouchableOpacity
                                      onPress={() =>
                                        navigation.navigate('NewAddress',{address:item})
                                      }>
                                      <Image
                                        source={require('../../assets/img/edit.png')}
                                        style={{
                                          height: wp(7),
                                          width: wp(7),
                                          resizeMode: 'contain',
                                        }}
                                      />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                      onPress={() => {
                                        setconfirmationmodal(true);
                                        setuseridtoDelete(item._id);
                                      }}>
                                      <Image
                                        source={require('../../assets/img/dlt.png')}
                                        style={{
                                          height: wp(7),
                                          width: wp(7),
                                          resizeMode: 'contain',
                                        }}
                                      />
                                    </TouchableOpacity>
                                  </View>
                                </View>
                              </TouchableOpacity>
                            );
                        }}
                    />

                    <Modal
                        isVisible={confirmationmodal}
                        onBackButtonPress={() => setconfirmationmodal(false)}
                        animationIn={'bounceIn'}
                        animationOut={'bounceOut'}
                    >
                        <View style={{ width: wp(85), height: hp(28), backgroundColor: 'white', alignSelf: 'center', borderRadius: 3, justifyContent: 'center' }}>
                            <Text style={{ color: 'black', fontSize: hp(2.5), fontFamily: 'AvenirNextLTPro-Regular', width: wp(70), alignSelf: 'center', textAlign: 'center' }}>Do you want to delete the address?</Text>
                            <View style={{ flexDirection: 'row', width: wp(78), alignSelf: 'center', justifyContent: 'space-between', marginTop: hp(3) }}>
                                <TouchableOpacity onPress={() => setconfirmationmodal(false)} style={{ width: wp(37), height: hp(5.5), backgroundColor: 'white', borderColor: 'black', borderWidth: 0.7, borderRadius: 2, alignItems: 'center', justifyContent: 'center' }}>
                                    <Text style={{ color: 'black', fontSize: hp(2), fontFamily: 'AvenirNextLTPro-Regular', width: wp(70), alignSelf: 'center', textAlign: 'center' }}>No</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => onHandleDelete(useridtoDelete)} style={{ width: wp(37), height: hp(5.5), backgroundColor: 'black', borderRadius: 2, alignItems: 'center', justifyContent: 'center' }}>
                                    <Text style={{ color: 'white', fontSize: hp(2), fontFamily: 'AvenirNextLTPro-Regular', width: wp(70), alignSelf: 'center', textAlign: 'center' }}>Yes</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                </View>
            </View>
        </View>
    )
}

export default AddAddress