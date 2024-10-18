import { View, Text, Dimensions, Image } from 'react-native'
import React, { useContext } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Cart from '../../Screens/Cart';
import Order from '../../Screens/Order';
import Profile from '../../Screens/Profile';
import Category from '../../Screens/Category';
import Homestack from '../../Navigators/Stacks/Homestack'
import { UserContext } from '../../../App';
import Login from '../../Screens/Login';
import Wishlist from '../../Screens/WishList';

const { height, width } = Dimensions.get('window')
const Botmtab = createBottomTabNavigator();
const BottomTab = () => {
    const [user, setUser] = useContext(UserContext)
    return (
        <Botmtab.Navigator screenOptions={{
            tabBarStyle: { height: hp(7.2), elevation: 5 },
            tabBarShowLabel: false,
            headerShown: false,

        }}>
            <Botmtab.Screen name='Home' component={Homestack}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={{
                            height: 60
                        }}>
                            {focused ? <Image source={require('../../../assets/img/Home.png')}
                                style={{
                                    height: wp(6),
                                    width: wp(6),
                                    alignSelf: 'center',
                                    marginTop: hp(1), tintColor: '#CE3436'
                                }}
                            /> : <Image source={require('../../../assets/img/Home.png')}
                                style={{
                                    height: wp(6),
                                    width: wp(6),
                                    alignSelf: 'center',
                                    marginTop: hp(1)
                                }}
                            />}
                            <Text style={{
                                color: focused ? '#CE3436' : 'grey',
                                alignSelf: 'center',
                                textAlign: 'center'
                            }}>
                                Home
                            </Text>

                        </View>
                    )
                }}
            />
            <Botmtab.Screen name='Cart' component={Cart}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={{
                            height: 60
                        }}>
                            {focused ? <Image source={require('../../../assets/img/Bag.png')}
                                style={{
                                    height: wp(6),
                                    width: wp(6),
                                    alignSelf: 'center',
                                    marginTop: hp(1), tintColor: '#CE3436'
                                }}
                            /> : <Image source={require('../../../assets/img/Bag.png')}
                                style={{
                                    height: wp(6),
                                    width: wp(6),
                                    alignSelf: 'center',
                                    marginTop: hp(1)
                                }}
                            />}
                            <Text style={{
                                color: focused ? '#CE3436' : 'grey',
                                alignSelf: 'center',
                                textAlign: 'center'
                            }}>
                                Cart
                            </Text>

                        </View>
                    )
                }}
            />
            <Botmtab.Screen name='Category' component={Category}
                options={{



                    tabBarIcon: ({ focused }) => (
                        <View style={{
                            height: 60
                        }}>

                            <View style={{ width: wp(15), height: wp(15), backgroundColor: 'white', borderRadius: wp(15), marginTop: hp(-4), elevation: 1, alignItems: 'center' }}>
                                <Image source={require('../../../assets/img/cat.png')}
                                    style={{
                                        height: wp(25),
                                        width: wp(25), resizeMode: 'contain',
                                        marginTop: hp(-2.5)
                                    }}
                                />
                            </View>
                        </View>
                    )
                }}
            />
            {user ? <Botmtab.Screen name='Order' component={Order}
                options={{



                    tabBarIcon: ({ focused }) => (
                        <View style={{
                            height: 60
                        }}>
                            {focused ? <Image source={require('../../../assets/img/order.png')}
                                style={{
                                    height: wp(6),
                                    width: wp(6),
                                    alignSelf: 'center',
                                    marginTop: hp(1), tintColor: '#CE3436'
                                }}
                            /> : <Image source={require('../../../assets/img/order.png')}
                                style={{
                                    height: wp(6),
                                    width: wp(6),
                                    alignSelf: 'center',
                                    marginTop: hp(1)
                                }}
                            />}
                            <Text style={{
                                color: focused ? '#CE3436' : 'grey',
                                alignSelf: 'center',
                                textAlign: 'center'
                            }}>
                                Order
                            </Text>

                        </View>
                    )
                }}
            />
                :
                <Botmtab.Screen name='Order' component={Wishlist}
                    options={{



                        tabBarIcon: ({ focused }) => (
                            <View style={{
                                height: 60
                            }}>
                                {focused ? <Image source={require('../../../assets/img/like.png')}
                                    style={{
                                        height: wp(6),
                                        width: wp(6),
                                        alignSelf: 'center',
                                        marginTop: hp(1), tintColor: '#CE3436'
                                    }}
                                /> : <Image source={require('../../../assets/img/like.png')}
                                    style={{
                                        height: wp(6),
                                        width: wp(6),
                                        alignSelf: 'center',
                                        marginTop: hp(1)
                                    }}
                                />}
                                <Text style={{
                                    color: focused ? '#CE3436' : 'grey',
                                    alignSelf: 'center',
                                    textAlign: 'center'
                                }}>
                                    Wishlist
                                </Text>

                            </View>
                        )
                    }}
                />


            }
            <Botmtab.Screen name='Profile' component={Profile}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={{
                            height: 60
                        }}>


                            {focused ? <Image source={require('../../../assets/img/User.png')}
                                style={{
                                    height: wp(6),
                                    width: wp(6),
                                    alignSelf: 'center',
                                    marginTop: hp(1), tintColor: '#CE3436'
                                }}
                            /> : <Image source={require('../../../assets/img/User.png')}
                                style={{
                                    height: wp(6),
                                    width: wp(6),
                                    alignSelf: 'center',
                                    marginTop: hp(1)
                                }}
                            />}
                            <Text style={{
                                color: focused ? '#CE3436' : 'grey',
                                alignSelf: 'center',
                                textAlign: 'center'
                            }}>
                                Profile
                            </Text>

                        </View>
                    )
                }}
            />
        </Botmtab.Navigator>
    )
}

export default BottomTab