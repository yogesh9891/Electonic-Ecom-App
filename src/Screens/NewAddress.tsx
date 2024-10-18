import { View, Text, Image, Dimensions, TextInput, TouchableOpacity, Pressable, StyleSheet, FlatList, ScrollView, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useEffect, useState } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation, useRoute } from '@react-navigation/native';
import Header from '../ReuseableComponents/Header';
import { addAddressApi, getPincodeApi, updateAddressById } from '../services/address.service';

const { height, width } = Dimensions.get('window')

const NewAddress = () => {
    const [adresssave, setAddressssave] = useState(false)
    const [adrestyp, setAdrestyp] = useState('Home')
    const navigation = useNavigation()
         const route = useRoute();

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
    const [pincodeArr, setPincodeArr] = useState<any>([]);
    const [homeType, setHomeType] = useState<any>("Home");
    const [landmark, setLandmark] = useState<any>("");
    const [addressId, setaddressId] = useState("");
    const red = '#CE3436'


    
  useEffect(() => {
    if (route.params) {
      console.log(route.params, '(route.params(route.params');
      const {address}: any = route.params;

        if (address?.firstName) {
          setFirstName(address?.firstName);
      }
          if (address?.lastName) {
            setLastName(address?.lastName);
        }
            if (address?.phone) {
              setPhone(address?.phone);
        }

          if (address?.email) {
            setEmail(address?.email);
        }
        
         if (address?.street) {
           setStreet(address?.street);
         }
            if (address?.city) {
              setCity(address?.city);
        }
            if (address?.state) {
              setState(address?.state);
            }
            if (address?.pincode) {
              setPincode(address?.pincode);
        }
         if (address?.homeType) {
              setHomeType(address?.homeType);
        }
         if (address?.landmark) {
           setLandmark(address?.landmark);
         }
         if (address?._id) {
           setaddressId(address?._id);
         }
    }

  }, [route.params]);

    const onHandleSubmit = async () => {
        try {
            if (firstName == "") {
                // toastError("First name is required");
                console.warn("First name is required")
                return;
            } else if (email == "") {

                console.warn("Email is required")
                // toastError("Email is required");
                return;
            } else if (phone == "") {
                console.warn("Phone is required")
                // toastError("Phone is required");
                return;
            } else if (email == "") {
                console.warn("Email is required")
                // toastError("Email is required");
                return;
            } else if (city == "") {
                console.warn("City is required")
                // toastError("City is required");
                return;
            } else if (street == "") {
                console.warn("Street is required")
                // toastError("Street is required");
                return;
            } else if (state == "") {
                console.warn("State is required")
                // toastError("State is required");
                return;
            } else if (pincode == "") {
                console.warn("Pincode is required")
                // toastError("Pincode is required");
                return;
            }


            if (email) {
                if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
                    console.warn("Email is Invalid")
                    //   toastError("Email is Invalid");
                    return;
                }
            }

            if (!/^[a-zA-Z ]+$/.test(firstName)) {
                console.warn("first name is Invalid")
                // toastError("first name is Invalid");
                return;
            }
            if (!/^[0-9]+$/.test(phone) || phone?.length < 10) {
                console.warn("Phone is Invalid")
                // toastError("phone  is Invalid");
                return;
            }
            if (!/^[0-9]+$/.test(pincode) || pincode?.length > 6) {
                console.warn("pincode  is Invalid")
                // toastError("pincode  is Invalid");
                return;
            }
            if (lastName) {
                if (lastName != "" && !/^[a-zA-Z ]+$/.test(lastName)) {
                    console.warn("last name is Invalid")
                    // toastError("last name is Invalid");
                    return;
                }
            }
            if (state == "") {
                console.warn("State is Invalid")
                // toastError("State is Invalid");
                return;
            }

            let addressObj = {
                firstName,
                lastName,
                phone,
                email,
                city,
                street,
                state,
                pincode,
                isDefault,
                homeType
            };


            if (addressId != "") {
                let { data: res } = await updateAddressById(addressId, addressObj);
                if (res.success) {
                    console.warn(res.message)

                    // handleClose();
                }
            } else {
                let { data: res } = await addAddressApi(addressObj);
                if (res) {
                    //   toastSuccess(res.message);
                    console.warn(res.message)
                    // }
                }
                navigation.navigate('AddAddress')
                setFirstName("");
                setLastName("");
                setEmail("");
                setPhone("");
                setCity("");
                setStreet("");
                setState("");
                setPincode("");
                setIsDefault(false);
            }
        } catch (error) {
            // toastError(error);
            console.log(error)
            console.warn(error)
        }
    };


    let handleGetPincode = async (value: string) => {
        try {
            setPincode(value)

            if (value?.length == 6) {
                let { data: res } = await getPincodeApi(value);

                if (res?.data) {
                    console.log(res.data)
                    let data = res?.data;
                    setPincodeArr(data);
                }
            } else {
                setPincodeArr([]);
                setCity("");
                setState("")


            }

        } catch (error) {
            console.log(error);
        }
    };

    const handleSetPincode = (pin: any) => {
        if (pin?.Name) {
            setCity(pin?.Name)
        }

        if (pin?.State) {
            setState(pin?.State)
        }

        setPincodeArr([])
    }

    const dorpdownList = ({ item, index }) => {
        return (
            <Pressable
                key={index}
                onPress={() => {
                    handleSetPincode(item)
                }}>
                <Text
                    style={{
                        padding: 5,
                        borderBottomColor: "#333",
                        borderBottomWidth: 0.3,
                        borderStyle: "solid",
                        color: '#000'
                    }}>
                    {item?.Name} , {item?.State}
                </Text>
            </Pressable>
        );
    };
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{width: width, height: height, backgroundColor: '#fff'}}>
        <Header back={true} label="New Address" />
        <ScrollView style={{width: wp(95), alignSelf: 'center'}}>
          <View style={{marginTop: hp(2)}}>
            <Text style={{fontSize: hp(1.7), color: 'black'}}>
              First Name <Text style={{color: '#EB5757'}}>*</Text>
            </Text>
            <TextInput
              placeholder="Enter your First Name"
              value={firstName}
              onChangeText={e => setFirstName(e)}
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

          <View style={{marginTop: hp(2)}}>
            <Text style={{fontSize: hp(1.7), color: 'black'}}>
              Last Name <Text style={{color: '#EB5757'}}>*</Text>
            </Text>
            <TextInput
              placeholder="Enter your Last Name"
              value={lastName}
              onChangeText={e => setLastName(e)}
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

          <View style={{marginTop: hp(2)}}>
            <Text style={{fontSize: hp(1.7), color: 'black'}}>
              Phone Number <Text style={{color: '#EB5757'}}>*</Text>
            </Text>
            <TextInput
              placeholder="Enter your Phone Number"
              value={phone}
              keyboardType="numeric"
              maxLength={10}
              onChangeText={e => setPhone(e)}
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
          <View style={{marginTop: hp(2)}}>
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
          <View style={{marginTop: hp(2)}}>
            <Text style={{fontSize: hp(1.7), color: 'black'}}>
              Email<Text style={{color: '#EB5757'}}>*</Text>
            </Text>
            <TextInput
              value={email}
              onChangeText={e => setEmail(e)}
              placeholder="Enter your email"
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
          <View style={{marginTop: hp(2)}}>
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
          {/* <View style={{ marginTop: hp(2) }}>
                    <Text style={{ fontSize: hp(1.7), color: 'black' }}>Country<Text style={{ color: '#EB5757' }}>*</Text></Text>
                    <TextInput placeholder='Enter your name' style={{ width: wp(95), height: hp(6), backgroundColor: '#F9F9F9', marginTop: hp(0.6), paddingLeft: wp(3), borderRadius: 5 }} />
                </View> */}
          <View style={{marginTop: hp(2)}}>
            <Text style={{fontSize: hp(1.7), color: 'black'}}>
              Pincode<Text style={{color: '#EB5757'}}>*</Text>
            </Text>
            <TextInput
              value={pincode}
              keyboardType="numeric"
              onChangeText={e => handleGetPincode(e)}
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
          {pincodeArr && pincodeArr?.length > 0 && (
            <View
              style={{
                position: 'absolute',
                top: hp(75.8),
                borderRadius: 5,
                width: wp(88),
                overflow: 'scroll',
                padding: 10,
                backgroundColor: '#fff',
                zIndex: 99999,
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 1,
                },
                shadowOpacity: 0.18,
                shadowRadius: 1.0,

                elevation: 1,
              }}>
              <FlatList
                data={pincodeArr}
                renderItem={dorpdownList}
                nestedScrollEnabled
              />
            </View>
          )}
          <View style={{marginTop: hp(2)}}>
            <Text style={{fontSize: hp(1.7), color: 'black'}}>
              City<Text style={{color: '#EB5757'}}>*</Text>
            </Text>
            <TextInput
              value={city}
              onChangeText={e => setCity(e)}
              placeholder="Enter your City"
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
          <View style={{marginTop: hp(2)}}>
            <Text style={{fontSize: hp(1.7), color: 'black'}}>
              State<Text style={{color: '#EB5757'}}>*</Text>
            </Text>
            <TextInput
              value={state}
              onChangeText={e => setState(e)}
              placeholder="Enter your State"
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
                style={{marginLeft: wp(1), fontSize: hp(1.9), color: 'black'}}>
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
                style={{marginLeft: wp(1), fontSize: hp(1.9), color: 'black'}}>
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
                style={{marginLeft: wp(1), fontSize: hp(1.9), color: 'black'}}>
                Other
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() => onHandleSubmit()}
            style={{
              width: wp(90),
              height: hp(6),
              backgroundColor: 'black',
              alignSelf: 'center',
              marginTop: hp(2),
              marginBottom: hp(2),
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{color: '#fff', fontWeight: '400', fontSize: hp(1.8)}}>
              Save Profile
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    );
}

export default NewAddress