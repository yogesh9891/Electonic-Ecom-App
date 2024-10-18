import { View, Text, ActivityIndicator, useWindowDimensions, Image } from 'react-native'
import React, { useContext, useEffect, useMemo, useState } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../Screens/Login';
import ForgotPassword from '../Screens/ForgotPassword';
import OTPscreen from '../Screens/OTPscreen';
import PasswordChange from '../Screens/PasswordChange';
import Signup from '../Screens/Signup';
import BottomTab from '../Navigators/BottomTab/BottomTab';
import AddAddress from '../Screens/AddAddress';
import NewAddress from '../Screens/NewAddress';
import ProductDetail from '../Screens/ProductDetail';
import ProductsSCR from '../Screens/ProductsSCR';
import OrderDetail from '../Screens/OrderDetail';
import CancelOrder from '../Screens/CancelOrder';
import EditProfile from '../Screens/EditProfile';
import Notification from '../Screens/Notification';
import Order from '../Screens/Order';
import PrivacyPolicy from '../Screens/PrivacyPolicy';
import TermandCondition from '../Screens/TermandCondition';
import HelpandSupport from '../Screens/HelpandSupport';
import Chat from '../Screens/Chat';
import Wishlist from '../Screens/WishList';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserContext } from '../../App';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import { axiosApiInstance } from '../../App'
import AuthorisedStack from './AuthorisedStack';
import UnAuthorisedStack from './UnAuthorisedStack';

const RootStack = () => {

    const Stack = createNativeStackNavigator();
    const [user, setUser] = useContext(UserContext)
    const [loading, setLoading] = useState(false)
    const { height, width } = useWindowDimensions();


    useEffect(() => {
        getUserFromStorage()
    }, [user])

    const getUserFromStorage = async () => {
        setLoading(true)
        try {
            const userData = await AsyncStorage.getItem('userData');
            if (userData) {
                // If user data exists in AsyncStorage, set the user state

                setUser(true);
                setLoading(false)
            }
            else {
                setUser(false)
            }
        } catch (error) {
            console.error('Error retrieving user data:', error);
            setLoading(false)
        }
        // finally {
        //   setLoading(false); // Finished loading user data
        // }
    };

    const getAuth = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('userData');

            console.log(jsonValue + ">>>>>>>>>>>>>>>>>>>>>value")

            return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch (e) {
            console.error('Auth Error', e);
            return null;
        }
    };

    // useMemo(() => {

    //     axiosApiInstance.interceptors.request.use(
    //         async config => {
    //             const token = await getAuth();

    //             if (token) {

    //                 console.log(token + "Token is >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.. ztoken is")
    //                 // config.headers['authorization'] = 'Bearer ' + token?.token;
    //             }

    //             else {
    //                 console.log("Token >>>>>>>>>>>>>>>>> not >>>>>>>>>>>> Found")
    //             }
    //             // config.headers['Content-Type'] = 'application/json';
    //             return config;
    //         },
    //         error => {
    //             Promise.reject(error);
    //         },
    //     );
    //     axiosApiInstance.interceptors.response.use(
    //         res => {
    //             // Add configurations here
    //             return res;
    //         },
    //         async err => {
    //             console.log('INterceptor error++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
    //             console.log(JSON.stringify(err, null, 2), "")
    //             console.log('INterceptor error__________________________________________________________________________________');

    //             // await logoutUser()

    //             return Promise.reject(err);
    //         },
    //     );
    // }, []);
    return (
        <>

            <Stack.Navigator screenOptions={{ headerShown: false }} >
                {/* {
                    user ? ( */}
                <>
                    <Stack.Screen
                        options={{
                            headerShown: false,
                            gestureDirection: 'horizontal'
                        }}
                        name='AuthorisedStack'
                        component={AuthorisedStack}
                    />
                </>
                {/* ) : (
                        <Stack.Screen
                            options={{
                                headerShown: false,
                                gestureDirection: 'horizontal'
                            }}
                            name='UnAuthorisedStack'
                            component={UnAuthorisedStack}
                        />
                    )
                } */}

            </Stack.Navigator>






            {user && loading && <View style={{ height: height, width: width, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center' }}>
                <Image source={require('../../assets/img/logoname.png')}
                    style={{ width: widthPercentageToDP(80), height: heightPercentageToDP(20), resizeMode: 'contain' }} />
            </View>}
        </>
    )
}

export default RootStack