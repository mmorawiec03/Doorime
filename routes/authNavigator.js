import React, { useContext } from 'react';
import { View } from 'react-native';
import Navigator from './homeStack';
import LoginScreen from '../screens/loginScreen';
import { AuthContext } from '../contexts/authContext';


export default function AuthNavigator() {
  const { authData } = useContext(AuthContext);

  return (
    <View style={{flex: 1}}>
        {authData.isAuth ? (<Navigator />) : (<LoginScreen />)}
    </View>
  );
}