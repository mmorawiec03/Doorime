import React, { useContext, useState, useEffect } from 'react';
import { View, Image, ActivityIndicator } from 'react-native';
import Navigator from './homeStack';
import LoginScreen from '../screens/loginScreen';
import { AuthContext } from '../contexts/authContext';
import { globalStyles } from '../styles/global';
import { loginStyles } from '../styles/login';
import { getAuthToken } from '../storage/token';
import { getAuthData } from '../storage/authData';
import { api } from '../api/apiHost';


export default function AuthNavigator() {

  const [loaded, setLoaded] = useState(false);

  const { authData, dispatch } = useContext(AuthContext);

  useEffect(() => {
    validateToken();
  }, []);

  const validateToken = () => {
    console.log('[INFO] GET request | Path: /validate');
    getAuthToken().then(token => {
        api.get(
            '/validate',
            { headers: { 'x-access-token': token }}
        ).then(res => {
          getAuthData().then(data => {
            dispatch({type: 'LOGIN', username: data.username });
            setLoaded(true);
          });
        }).catch(err => {
            console.log(`[ERROR] ${err}`);
            setLoaded(true);
        });
    });
  }

  return (
    <View style={{flex: 1}}>
      { loaded ? (
        authData.isAuth ? (<Navigator />) : (<LoginScreen />)
      ) : (
        <View style={loginStyles.container}>
            <View style={loginStyles.iconContainer}>
                <Image source={require('../assets/doorime-logo.png')} style={loginStyles.icon} />
            </View>
            <View style={globalStyles.contextCenter}>
              <ActivityIndicator size="large" color='black' />
            </View>
        </View>
      )}

        
    </View>
  );
}