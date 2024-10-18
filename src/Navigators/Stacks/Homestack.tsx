import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import Home from '../../Screens/Home';
import AllBrands from '../../Screens/AllBrands';
const Stack = createNativeStackNavigator();

export default function QrCodeStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen options={{ headerShown: false }}
                name="Home" component={Home} />
                 <Stack.Screen options={{ headerShown: false }}
                name="Brands" component={AllBrands} />
        </Stack.Navigator>
    )
}