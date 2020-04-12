import React, { useState } from 'react';
import { View } from 'react-native';
import Navigator from './homeStack';
import LoginScreen from '../screens/loginScreen';


export default function AuthNavigator() {
    const [isAuth, setIsAuth] = useState(true);

  return (
    <View style={{flex: 1}}>
        {isAuth ? (<Navigator />) : (<LoginScreen />)}
    </View>
  );
}