import { View, Text } from 'react-native'
import React, { useContext } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Login from '../Screens/Login'
import ForgotPassword from '../Screens/ForgotPassword'
import OTPscreen from '../Screens/OTPscreen'
import PasswordChange from '../Screens/PasswordChange'
import Signup from '../Screens/Signup'
import BottomTab from '../Navigators/BottomTab/BottomTab'
import Checkout from '../Screens/Checkout'
import { UserContext } from '../../App'
import ProductsSCR from '../Screens/ProductsSCR'
import SubCategory from '../Screens/SubCategory'
import GuestCheckout from '../Screens/GuestCheckout'
const UnAuthorisedRootStack = createNativeStackNavigator()
const UnAuthorisedStack = () => {
    const [user, setUser] = useContext(UserContext)
    return (
      <UnAuthorisedRootStack.Navigator
        initialRouteName={user ? 'BottamTab' : 'Welcome'}>
        <UnAuthorisedRootStack.Screen
          options={{
            headerShown: false,
            gestureDirection: 'horizontal',
          }}
          name="Welcome"
          component={Login}
        />
        <UnAuthorisedRootStack.Screen
          options={{
            headerShown: false,
            gestureDirection: 'horizontal',
          }}
          name="BottamTab"
          component={BottomTab}
        />

        <UnAuthorisedRootStack.Screen
          options={{
            headerShown: false,
            gestureDirection: 'horizontal',
          }}
          name="ForgotPassword"
          component={ForgotPassword}
        />

        <UnAuthorisedRootStack.Screen
          options={{
            headerShown: false,
            gestureDirection: 'horizontal',
          }}
          name="Otp"
          component={OTPscreen}
        />

        <UnAuthorisedRootStack.Screen
          options={{
            headerShown: false,
            gestureDirection: 'horizontal',
          }}
          name="ChangePassword"
          component={PasswordChange}
        />

        <UnAuthorisedRootStack.Screen
          options={{
            headerShown: false,
            gestureDirection: 'horizontal',
          }}
          name="Signup"
          component={Signup}
        />

        <UnAuthorisedRootStack.Screen
          options={{
            headerShown: false,
            gestureDirection: 'horizontal',
          }}
          name="BottamTab"
          component={BottomTab}
        />
        <UnAuthorisedRootStack.Screen
          options={{
            headerShown: false,
            gestureDirection: 'horizontal',
          }}
          name="Checkout"
          component={Checkout}
        />
        <UnAuthorisedRootStack.Screen
          options={{
            headerShown: false,
            gestureDirection: 'horizontal',
          }}
          name="ProductsSCR"
          component={ProductsSCR}
        />
        <UnAuthorisedRootStack.Screen
          options={{
            headerShown: false,
            gestureDirection: 'horizontal',
          }}
          name="SubCategory"
          component={SubCategory}
        />
        <UnAuthorisedRootStack.Screen
          options={{
            headerShown: false,
            gestureDirection: 'horizontal',
          }}
          name="GuestCheckout"
          component={GuestCheckout}
        />
      </UnAuthorisedRootStack.Navigator>
    );
}

export default UnAuthorisedStack