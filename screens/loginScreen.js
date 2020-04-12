import React, { useState } from 'react';
import { Alert, View, Text, Image, KeyboardAvoidingView, TouchableOpacity, TouchableWithoutFeedback, Keyboard, TextInput } from 'react-native';
import { loginStyles } from '../styles/login';
import NetInfo from '@react-native-community/netinfo';
import { api } from '../api/apiHost';
import base64 from 'base-64';
import { AsyncStorage } from 'react-native';

class LoginScreen extends React.Component {

    state = {
        username: '',
        password: '',
        date: '',
        token: '',
        isAuth: false
      };

    _storeData = async (token) => {
        console.log('trying to save token');
    try {
        await AsyncStorage.setItem('stored:token', token);
        console.log('token saved');
    } catch (error) {
        console.log('token NOT saved');
        console.log(error);
    }
    };

    _retrieveData = async () => {
        try {
            console.log('trying to get the token fron storage');
          const value = await AsyncStorage.getItem('stored:token');
          if (value !== null) {
            console.log('we have our stored token!');
            console.log(value);
          }
        } catch (error) {
            console.log('we dont have a token');
            console.log(error);
        }
      };

    getToken(method) {
        const { username, password } = this.state;
        var basicAuth = 'Basic ' + base64.encode(username + ':' + password);
        console.log('Username and  pass used: '+ username + ':' + password);
        console.log('Base64 auth created: '+ basicAuth);

        api.get('/login', { headers: { 'Authorization': basicAuth }}).then(res => {
        
        //console.log(res.data.token);
        console.log(res.headers.date);
        //console.log(res);
        var date = res.headers.date;
        var token = res.data.token;
        var message = res.data.message;
        Alert.alert('Info',
        `Username: ${username}
        Password: ${password}
        Action: ${method}
        Message: ${message}
        Date: ${date}
        Token: ${token}`);

        this._storeData(token);
        this.setState({ 
            token: token, 
            date: date,
            isAuth: true
         });
        }).catch(err => {
            //console.log(err.response);
            if(err.response != undefined && 401 === err.response.status){
                Alert.alert(`${err.response.data.message}`);
                console.log(`[ERROR] ${err.response.data.message}`);
            }
            else{
                Alert.alert(`${err}`);
                console.log(`[ERROR] ${err}`);
            }
            

            this.setState({
                refreshing: false,
                loading: false
            });
        });
        
    }
    
    onLogin() {
        var method = 'Login';
        this.getToken(method);
        console.log("Executed onLogin");
    }

    onSignin() {
        var method = 'Signin';
        //this.getToken(method);
        console.log("Executed onSignin");
        this._retrieveData();
    }
    
    render (){
        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                
                <View style={loginStyles.container}>
                    {/* <KeyboardAvoidingView behavior='padding'> */}
                        <View style={loginStyles.iconContainer}>
                            <Image source={require('../assets/doorime-logo.png')} style={loginStyles.icon} />
                        </View>
                    {/* </KeyboardAvoidingView> */}

                    {/* <KeyboardAvoidingView behavior='position'> */}
                    <View style={loginStyles.inputContainer}>
                        <TextInput
                            value={this.state.username}
                            onChangeText={(username) => this.setState({ username })}
                            placeholder={'Username'}
                            style={loginStyles.input}
                            placeholderTextColor="#000" 
                        />
                        <TextInput
                            value={this.state.password}
                            onChangeText={(password) => this.setState({ password })}
                            placeholder={'Password'}
                            secureTextEntry={true}
                            style={loginStyles.input}
                            placeholderTextColor="#000" 
                        />
                    </View> 
                    {/* </KeyboardAvoidingView> */}
                   
                    <View style={loginStyles.buttonContainer}>
                        <TouchableOpacity style={loginStyles.buttonLogin} onPress={this.onLogin.bind(this)}>
                            <Text style={loginStyles.buttonText}>Log in</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={loginStyles.buttonSignin} onPress={this.onSignin.bind(this)}>
                            <Text style={loginStyles.buttonText}>Sign up</Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </TouchableWithoutFeedback>
        );
    }

}

export default LoginScreen;