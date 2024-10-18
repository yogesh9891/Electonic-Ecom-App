import { View, Text, Dimensions, Image, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useState } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import { UserContext } from '../../App';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from "react-native-modal";
import { registerUser } from '../services/user.service';

const { height, width } = Dimensions.get('window')
const Signup = () => {
    const mainFont = 'Montserrat-Regular'
    const mainFontBold = 'Montserrat-Bold'
    const navigation: any = useNavigation()
    const [role, setRole] = useState('customer')
    const [name, setName] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [companyAddress, setCompanyaddress] = useState('');
    const [gstNo, setGstno] = useState('');
    const [phone, setMobile] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [stateprovince, setStateProvince] = useState('');
    const [state, setState] = useState('');
    const [pincode, setZipcode] = useState('');
    const [warnModal, setWarnmodal] = useState(false)
    const [warning, setWarning] = useState('')
    const [loading, setLoading] = useState(false)
    const [firstName, setfirstName] = useState('');
    const [lastName, setlastName] = useState('');


    const handleSignup = async () => {
        if (email == '' || password == '' || phone == '') {
            console.warn('Enter Credentials')
        }
        else {
            try {
                let obj = {
                    role,
                    phone,
                    email,
                    password,
                    firstName,
                    lastName,
                    stateprovince,
                    state,
                    pincode,
                    companyName,
                    companyAddress,
                    gstNo,

                }
                const {data:response} = await registerUser(obj)
                console.log(response + "+++++++++++++++++++++++++++++++")
                if (response.data) {
                    console.log('Signup Processing',)
                    if (response.data == "Mobile Number or Email Already Exist") {
                        // setsignupmodal(true)
                        console.warn("Mobile Number or Email Already Exist")
                    }
                    else {
                        let datanew = JSON.stringify(response.config.data, null, 2);
                        console.log("Signup Done", datanew)
                        setWarning(response.message)

                        navigation.navigate('Welcome')
                    }
                }
                else {
                    console.log('SignUp Failed.')
                    setWarning(response.data.message)
                    setWarnmodal(true)
                }
            } catch (error) {
                // Handle login failure, e.g., display an error message.
                console.error('Login failed:', error);
                setWarning(response.data.message)
                setWarnmodal(true)
            }
        }
    }
    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'padding'} style={{ width: width, height: height, backgroundColor: 'white', alignItems: 'center', paddingTop: hp(5), justifyContent: 'space-between', paddingBottom: hp(3) }}>
            <Image source={require('../../assets/img/signupi.png')}
                style={{ height: hp(25), width: wp(85), resizeMode: 'contain' }} />
            <View style={{ width: wp(95), alignSelf: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: hp(3.5), color: 'black', fontFamily: mainFontBold }}>Sign Up</Text>
                <Text style={{ fontSize: hp(1.5), fontFamily: mainFont, marginTop: hp(1), width: wp(90), textAlign: 'center' }}>Please Sign up to continue using our app.</Text>
                <View style={{ width: wp(95), flexDirection: 'row', marginTop: hp(2), paddingLeft: wp(20), paddingRight: wp(20), justifyContent: 'space-between' }}>
                    <TouchableOpacity
                        style={{ flexDirection: 'row' }}
                        onPress={() => setRole('USER')}
                    >
                        {role == 'USER' ? <Image source={require('../../assets/img/checkedC.png')}
                            style={{ height: wp(5), width: wp(5) }} /> : <Image source={require('../../assets/img/uncheckedC.png')}
                                style={{ height: wp(5), width: wp(5) }} />}
                        <Text style={{ color: 'black', fontSize: hp(1.8), fontFamily: mainFont, marginLeft: wp(1) }}>Customer</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{ flexDirection: 'row' }}
                        onPress={() => setRole('BUSINESS')}
                    >
                        {role == 'BUSINESS' ? <Image source={require('../../assets/img/checkedC.png')}
                            style={{ height: wp(5), width: wp(5) }} /> : <Image source={require('../../assets/img/uncheckedC.png')}
                                style={{ height: wp(5), width: wp(5) }} />}
                        <Text style={{ color: 'black', fontSize: hp(1.8), fontFamily: mainFont, marginLeft: wp(1) }}>Business</Text>
                    </TouchableOpacity>
                </View>

            </View>
            {role == 'USER' && <FlatList
                data={[]}
                renderItem={null}
                ListHeaderComponent={<>
                    <View style={{ width: wp(95), height: hp(6.3), borderColor: 'black', borderWidth: 0.7, borderRadius: 10, marginTop: hp(5) }}>
                        <Text style={{ position: 'absolute', width: wp(22), backgroundColor: 'white', fontSize: hp(1.7), marginTop: hp(-1.5), marginLeft: wp(5), textAlign: 'center' }}>First Name</Text>
                        <TextInput value={firstName} onChangeText={(e) => setfirstName(e)} style={{ width: wp(75), paddingLeft: wp(3) }} />
                    </View>
                    <View style={{ width: wp(95), height: hp(6.3), borderColor: 'black', borderWidth: 0.7, borderRadius: 10, marginTop: hp(3) }}>
                        <Text style={{ position: 'absolute', width: wp(22), backgroundColor: 'white', fontSize: hp(1.7), marginTop: hp(-1.5), marginLeft: wp(5), textAlign: 'center' }}>Last Name</Text>
                        <TextInput value={lastName} onChangeText={(e) => setlastName(e)} style={{ width: wp(75), paddingLeft: wp(3) }} />
                    </View>
                    <View style={{ width: wp(95), height: hp(6.3), borderColor: 'black', borderWidth: 0.7, borderRadius: 10, marginTop: hp(3) }}>
                        <Text style={{ position: 'absolute', width: wp(42), backgroundColor: 'white', fontSize: hp(1.7), marginTop: hp(-1.5), marginLeft: wp(5), textAlign: 'center' }}>Enter Your Mobile Number</Text>
                        <TextInput   keyboardType="numeric" value={phone} onChangeText={(e) => setMobile(e)} style={{ width: wp(75), paddingLeft: wp(3) }} />
                    </View>
                    <View style={{ width: wp(95), height: hp(6.3), borderColor: 'black', borderWidth: 0.7, borderRadius: 10, marginTop: hp(3) }}>
                        <Text style={{ position: 'absolute', width: wp(42), backgroundColor: 'white', fontSize: hp(1.7), marginTop: hp(-1.5), marginLeft: wp(5), textAlign: 'center' }}>Enter your email address</Text>
                        <TextInput value={email} onChangeText={(e) => setEmail(e)} style={{ width: wp(75), paddingLeft: wp(3) }} />
                    </View>
                    <View style={{ width: wp(95), height: hp(6.3), borderColor: 'black', borderWidth: 0.7, borderRadius: 10, marginTop: hp(3) }}>
                        <Text style={{ position: 'absolute', width: wp(32), backgroundColor: 'white', fontSize: hp(1.7), marginTop: hp(-1.5), marginLeft: wp(5), textAlign: 'center' }}>Create Password</Text>
                        <TextInput   secureTextEntry={true} value={password} onChangeText={(e) => setPassword(e)} style={{ width: wp(75), paddingLeft: wp(3) }} />
                    </View>
                    <View style={{ width: wp(95), height: hp(6.3), borderColor: 'black', borderWidth: 0.7, borderRadius: 10, marginTop: hp(3) }}>
                        <Text style={{ position: 'absolute', width: wp(32), backgroundColor: 'white', fontSize: hp(1.7), marginTop: hp(-1.5), marginLeft: wp(5), textAlign: 'center' }}>Confirm Password</Text>
                        <TextInput   secureTextEntry={true} style={{ width: wp(75), paddingLeft: wp(3) }} />
                    </View>
                    {/* <View style={{ width: wp(95), height: hp(6.3), borderColor: 'black', borderWidth: 0.7, borderRadius: 10, marginTop: hp(3) }}>
                        <Text style={{ position: 'absolute', width: wp(28), backgroundColor: 'white', fontSize: hp(1.7), marginTop: hp(-1.5), marginLeft: wp(5), textAlign: 'center' }}>State Province</Text>
                        <TextInput value={pincode} onChangeText={(e)=>setZipcode(e)} style={{ width: wp(75), paddingLeft: wp(3) }} />
                    </View> */}
                    <View style={{ width: wp(95), flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={{ width: wp(45), height: hp(6.3), borderColor: 'black', borderWidth: 0.7, borderRadius: 10, marginTop: hp(3) }}>
                            <Text style={{ position: 'absolute', width: wp(15), backgroundColor: 'white', fontSize: hp(1.7), marginTop: hp(-1.5), marginLeft: wp(5), textAlign: 'center' }}>State</Text>
                            <TextInput value={state} onChangeText={(e) => setState(e)} style={{ width: wp(75), paddingLeft: wp(3) }} />
                        </View>
                        <View style={{ width: wp(45), height: hp(6.3), borderColor: 'black', borderWidth: 0.7, borderRadius: 10, marginTop: hp(3) }}>
                            <Text style={{ position: 'absolute', width: wp(28), backgroundColor: 'white', fontSize: hp(1.7), marginTop: hp(-1.5), marginLeft: wp(5), textAlign: 'center' }}>Zip / Postal Code</Text>
                            <TextInput value={pincode} onChangeText={(e) => setZipcode(e)} style={{ width: wp(75), paddingLeft: wp(3) }} />
                        </View>
                    </View>
                </>}
            />}
            {role == 'BUSINESS' && <FlatList
                data={[]}
                renderItem={null}
                ListHeaderComponent={<>
                    <View style={{ width: wp(95), height: hp(6.3), borderColor: 'black', borderWidth: 0.7, borderRadius: 10, marginTop: hp(5) }}>
                        <Text style={{ position: 'absolute', width: wp(32), backgroundColor: 'white', fontSize: hp(1.7), marginTop: hp(-1.5), marginLeft: wp(5), textAlign: 'center' }}>Company Name</Text>
                        <TextInput value={companyName} onChangeText={(e) => setCompanyName(e)} style={{ width: wp(75), paddingLeft: wp(3) }} />
                    </View>
                    <View style={{ width: wp(95), height: hp(6.3), borderColor: 'black', borderWidth: 0.7, borderRadius: 10, marginTop: hp(5) }}>
                        <Text style={{ position: 'absolute', width: wp(32), backgroundColor: 'white', fontSize: hp(1.7), marginTop: hp(-1.5), marginLeft: wp(5), textAlign: 'center' }}>Company Address</Text>
                        <TextInput value={companyAddress} onChangeText={(e) => setCompanyaddress(e)} style={{ width: wp(75), paddingLeft: wp(3) }} />
                    </View>
                    <View style={{ width: wp(95), height: hp(6.3), borderColor: 'black', borderWidth: 0.7, borderRadius: 10, marginTop: hp(5) }}>
                        <Text style={{ position: 'absolute', width: wp(35), backgroundColor: 'white', fontSize: hp(1.7), marginTop: hp(-1.5), marginLeft: wp(5), textAlign: 'center' }}>Enter GST number</Text>
                        <TextInput value={gstNo} onChangeText={(e) => setGstno(e)} style={{ width: wp(75), paddingLeft: wp(3) }} />
                    </View>
                    <View style={{ width: wp(95), height: hp(6.3), borderColor: 'black', borderWidth: 0.7, borderRadius: 10, marginTop: hp(3) }}>
                        <Text style={{ position: 'absolute', width: wp(42), backgroundColor: 'white', fontSize: hp(1.7), marginTop: hp(-1.5), marginLeft: wp(5), textAlign: 'center' }}>Enter Your Mobile Number</Text>
                        <TextInput keyboardType='numeric' value={phone} onChangeText={(e) => setMobile(e)} style={{ width: wp(75), paddingLeft: wp(3) }} maxLength={10} />
                    </View>
                    <View style={{ width: wp(95), height: hp(6.3), borderColor: 'black', borderWidth: 0.7, borderRadius: 10, marginTop: hp(3) }}>
                        <Text style={{ position: 'absolute', width: wp(42), backgroundColor: 'white', fontSize: hp(1.7), marginTop: hp(-1.5), marginLeft: wp(5), textAlign: 'center' }}>Enter your email address</Text>
                        <TextInput value={email} onChangeText={(e) => setEmail(e)} style={{ width: wp(75), paddingLeft: wp(3) }} />
                    </View>
                    <View style={{ width: wp(95), height: hp(6.3), borderColor: 'black', borderWidth: 0.7, borderRadius: 10, marginTop: hp(3) }}>
                        <Text style={{ position: 'absolute', width: wp(32), backgroundColor: 'white', fontSize: hp(1.7), marginTop: hp(-1.5), marginLeft: wp(5), textAlign: 'center' }}>Create Password</Text>
                        <TextInput   secureTextEntry={true} value={password} onChangeText={(e) => setPassword(e)} style={{ width: wp(75), paddingLeft: wp(3) }} />
                    </View>
                    <View style={{ width: wp(95), height: hp(6.3), borderColor: 'black', borderWidth: 0.7, borderRadius: 10, marginTop: hp(3) }}>
                        <Text style={{ position: 'absolute', width: wp(32), backgroundColor: 'white', fontSize: hp(1.7), marginTop: hp(-1.5), marginLeft: wp(5), textAlign: 'center' }}>Confirm Password</Text>
                        <TextInput   secureTextEntry={true} style={{ width: wp(75), paddingLeft: wp(3) }} />
                    </View>
                    {/* <View style={{ width: wp(95), height: hp(6.3), borderColor: 'black', borderWidth: 0.7, borderRadius: 10, marginTop: hp(3) }}>
                        <Text style={{ position: 'absolute', width: wp(28), backgroundColor: 'white', fontSize: hp(1.7), marginTop: hp(-1.5), marginLeft: wp(5), textAlign: 'center' }}>State Province</Text>
                        <TextInput style={{ width: wp(75), paddingLeft: wp(3) }} />
                    </View> */}
                    <View style={{ width: wp(95), height: hp(6.3), borderColor: 'black', borderWidth: 0.7, borderRadius: 10, marginTop: hp(5) }}>
                        <Text style={{ position: 'absolute', width: wp(22), backgroundColor: 'white', fontSize: hp(1.7), marginTop: hp(-1.5), marginLeft: wp(5), textAlign: 'center' }}>Full Name</Text>
                        <TextInput value={name} onChangeText={(e) => setName(e)} style={{ width: wp(75), paddingLeft: wp(3) }} />
                    </View>
                    <View style={{ width: wp(95), flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={{ width: wp(45), height: hp(6.3), borderColor: 'black', borderWidth: 0.7, borderRadius: 10, marginTop: hp(3) }}>
                            <Text style={{ position: 'absolute', width: wp(15), backgroundColor: 'white', fontSize: hp(1.7), marginTop: hp(-1.5), marginLeft: wp(5), textAlign: 'center' }}>State</Text>
                            <TextInput value={state} onChangeText={(e) => setState(e)} style={{ width: wp(75), paddingLeft: wp(3) }} />
                        </View>
                        <View style={{ width: wp(45), height: hp(6.3), borderColor: 'black', borderWidth: 0.7, borderRadius: 10, marginTop: hp(3) }}>
                            <Text style={{ position: 'absolute', width: wp(28), backgroundColor: 'white', fontSize: hp(1.7), marginTop: hp(-1.5), marginLeft: wp(5), textAlign: 'center' }}>Zip / Postal Code</Text>
                            <TextInput value={pincode} onChangeText={(e) => setZipcode(e)} style={{ width: wp(75), paddingLeft: wp(3) }} />
                        </View>
                    </View>
                </>}
            />}
            <View style={{ width: wp(95) }}>
                <TouchableOpacity
                    onPress={() => handleSignup()}
                    style={{ width: wp(95), height: hp(6.3), backgroundColor: 'black', marginTop: hp(3), borderRadius: wp(1.8), alignItems: 'center', justifyContent: 'center', }}>
                    <Text style={{ color: 'white', fontSize: hp(2.2), fontFamily: mainFont }}>Register</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => navigation.navigate('Login')}
                    style={{ marginTop: hp(1.5), alignSelf: 'center' }}>
                    <Text style={{ fontSize: hp(1.8), fontFamily: mainFont }}>You have an account? <Text style={{ color: 'black', fontFamily: mainFontBold }}>Login</Text></Text>
                </TouchableOpacity>
            </View>

            <Modal
                isVisible={warnModal}
                onBackButtonPress={() => setWarnmodal(false)}
                onBackdropPress={() => setWarnmodal(false)}
                animationIn={'bounceIn'}
                animationOut={'bounceOut'}>
                <View style={{ height: hp(30), width: wp(90), backgroundColor: 'white', alignSelf: 'center', borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: 'black', fontSize: hp(2), fontFamily: mainFontBold }}>{warning}</Text>
                    <TouchableOpacity onPress={() => setWarnmodal(false)} style={{ width: wp(80), height: hp(5.5), backgroundColor: 'black', borderRadius: 5, alignItems: 'center', justifyContent: 'center', marginTop: hp(3) }}>
                        <Text style={{ color: 'white', fontFamily: mainFont, fontSize: hp(1.8) }}>Ok</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </KeyboardAvoidingView>
    )
}

export default Signup