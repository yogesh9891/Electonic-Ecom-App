import { View, Text } from 'react-native'
import React, { useContext } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import BottomTab from '../Navigators/BottomTab/BottomTab'
import AddAddress from '../Screens/AddAddress'
import NewAddress from '../Screens/NewAddress'
import ProductDetail from '../Screens/ProductDetail'
import ProductsSCR from '../Screens/ProductsSCR'
import OrderDetail from '../Screens/OrderDetail'
import CancelOrder from '../Screens/CancelOrder'
import EditProfile from '../Screens/EditProfile'
import Notification from '../Screens/Notification'
import Order from '../Screens/Order'
import PrivacyPolicy from '../Screens/PrivacyPolicy'
import TermandCondition from '../Screens/TermandCondition'
import HelpandSupport from '../Screens/HelpandSupport'
import Chat from '../Screens/Chat'
import Wishlist from '../Screens/WishList'
import SearchPage from '../Screens/SearchPage'
import Checkout from '../Screens/Checkout'
import Login from '../Screens/Login'
import { UserContext } from '../../App'
import ThankYou from '../Screens/ThankYou'
import ForgotPassword from '../Screens/ForgotPassword'
import OTPscreen from '../Screens/OTPscreen'
import PasswordChange from '../Screens/PasswordChange'
import Signup from '../Screens/Signup'
import SubCategory from '../Screens/SubCategory'
import GuestCheckout from '../Screens/GuestCheckout'

const AuthorisedRootStack = createNativeStackNavigator()
const AuthorisedStack = () => {

    const [user, setUser] = useContext(UserContext)
    return (
      <AuthorisedRootStack.Navigator initialRouteName="BottamTab">
        <AuthorisedRootStack.Screen
          options={{
            headerShown: false,
            gestureDirection: 'horizontal',
          }}
          name="BottamTab"
          component={BottomTab}
        />
        <AuthorisedRootStack.Screen
          options={{
            headerShown: false,
            gestureDirection: 'horizontal',
          }}
          name="Welcome"
          component={Login}
        />

        <AuthorisedRootStack.Screen
          options={{
            headerShown: false,
            gestureDirection: 'horizontal',
          }}
          name="ForgotPassword"
          component={ForgotPassword}
        />

        <AuthorisedRootStack.Screen
          options={{
            headerShown: false,
            gestureDirection: 'horizontal',
          }}
          name="Otp"
          component={OTPscreen}
        />

        <AuthorisedRootStack.Screen
          options={{
            headerShown: false,
            gestureDirection: 'horizontal',
          }}
          name="ChangePassword"
          component={PasswordChange}
        />

        <AuthorisedRootStack.Screen
          options={{
            headerShown: false,
            gestureDirection: 'horizontal',
          }}
          name="SignUp"
          component={Signup}
        />
        <AuthorisedRootStack.Screen
          options={{
            headerShown: false,
            gestureDirection: 'horizontal',
          }}
          name="AddAddress"
          component={AddAddress}
        />
        <AuthorisedRootStack.Screen
          options={{
            headerShown: false,
            gestureDirection: 'horizontal',
          }}
          name="NewAddress"
          component={NewAddress}
        />
        <AuthorisedRootStack.Screen
          options={{
            headerShown: false,
            gestureDirection: 'horizontal',
          }}
          name="ProductDetail"
          component={ProductDetail}
        />
        <AuthorisedRootStack.Screen
          options={{
            headerShown: false,
            gestureDirection: 'horizontal',
          }}
          name="ProductsSCR"
          component={ProductsSCR}
        />
        <AuthorisedRootStack.Screen
          options={{
            headerShown: false,
            gestureDirection: 'horizontal',
          }}
          name="SubCategory"
          component={SubCategory}
        />
        <AuthorisedRootStack.Screen
          options={{
            headerShown: false,
            gestureDirection: 'horizontal',
          }}
          name="OrderDetails"
          component={OrderDetail}
        />
        <AuthorisedRootStack.Screen
          options={{
            headerShown: false,
            gestureDirection: 'horizontal',
          }}
          name="CancelOrder"
          component={CancelOrder}
        />
        <AuthorisedRootStack.Screen
          options={{
            headerShown: false,
            gestureDirection: 'horizontal',
          }}
          name="EditProfile"
          component={EditProfile}
        />
        <AuthorisedRootStack.Screen
          options={{
            headerShown: false,
            gestureDirection: 'horizontal',
          }}
          name="Notification"
          component={Notification}
        />
        <AuthorisedRootStack.Screen
          options={{
            headerShown: false,
            gestureDirection: 'horizontal',
          }}
          name="Orderss"
          component={Order}
        />
        <AuthorisedRootStack.Screen
          options={{
            headerShown: false,
            gestureDirection: 'horizontal',
          }}
          name="PrivacyPolicy"
          component={PrivacyPolicy}
        />
        <AuthorisedRootStack.Screen
          options={{
            headerShown: false,
            gestureDirection: 'horizontal',
          }}
          name="T&C"
          component={TermandCondition}
        />
        <AuthorisedRootStack.Screen
          options={{
            headerShown: false,
            gestureDirection: 'horizontal',
          }}
          name="Help"
          component={HelpandSupport}
        />
        <AuthorisedRootStack.Screen
          options={{
            headerShown: false,
            gestureDirection: 'horizontal',
          }}
          name="Signup"
          component={Signup}
        />
        <AuthorisedRootStack.Screen
          options={{
            headerShown: false,
            gestureDirection: 'horizontal',
          }}
          name="Chat"
          component={Chat}
        />
        <AuthorisedRootStack.Screen
          options={{
            headerShown: false,
            gestureDirection: 'horizontal',
          }}
          name="Wishlist"
          component={Wishlist}
        />
        <AuthorisedRootStack.Screen
          options={{
            headerShown: false,
            gestureDirection: 'horizontal',
          }}
          name="SearchPage"
          component={SearchPage}
        />

        <AuthorisedRootStack.Screen
          options={{
            headerShown: false,
            gestureDirection: 'horizontal',
          }}
          name="Checkout"
          component={Checkout}
        />
        <AuthorisedRootStack.Screen
          options={{
            headerShown: false,
            gestureDirection: 'horizontal',
          }}
          name="GuestCheckout"
          component={GuestCheckout}
        />

        <AuthorisedRootStack.Screen
          options={{
            headerShown: false,
            gestureDirection: 'horizontal',
          }}
          name="ThankYou"
          component={ThankYou}
        />
      </AuthorisedRootStack.Navigator>
    );
}

export default AuthorisedStack