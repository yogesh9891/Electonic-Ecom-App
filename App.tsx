import React, { createContext, useState } from 'react';
import type { PropsWithChildren } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Login from './src/Screens/Login';
import ForgotPassword from './src/Screens/ForgotPassword';
import OTPscreen from './src/Screens/OTPscreen';
import PasswordChange from './src/Screens/PasswordChange';
import Signup from './src/Screens/Signup';
import BottomTab from './src/Navigators/BottomTab/BottomTab';
import AddAddress from './src/Screens/AddAddress';
import NewAddress from './src/Screens/NewAddress';
import ProductDetail from './src/Screens/ProductDetail';
import ProductsSCR from './src/Screens/ProductsSCR';
import OrderDetail from './src/Screens/OrderDetail';
import CancelOrder from './src/Screens/CancelOrder';
import EditProfile from './src/Screens/EditProfile';
import Notification from './src/Screens/Notification';
import Order from './src/Screens/Order';
import PrivacyPolicy from './src/Screens/PrivacyPolicy';
import TermandCondition from './src/Screens/TermandCondition';
import HelpandSupport from './src/Screens/HelpandSupport';
import Chat from './src/Screens/Chat';
import Wishlist from './src/Screens/WishList';
import RootStack from './src/Stack/RootStack';
import axios from 'axios';


export const wishlistcntxt = createContext<any>(null);
export const cartcntxt = createContext<any>(null);
export const UserContext = createContext<any>(null);
export const axiosApiInstance = axios.create();
function App(): JSX.Element {
  const Stack = createNativeStackNavigator();
  const [itmincart, setitmincart] = useState([])
  const [itminwishlst, setitminwishlst] = useState(0)
  const [user, setUser] = useState(false)
  return (
    <UserContext.Provider value={[user, setUser]}>
      <cartcntxt.Provider value={[itmincart, setitmincart]}>
        <wishlistcntxt.Provider value={[itminwishlst, setitminwishlst]}>
          <NavigationContainer>
            <RootStack />
          </NavigationContainer>
        </wishlistcntxt.Provider>
      </cartcntxt.Provider>
    </UserContext.Provider>
  );
}



export default App;
