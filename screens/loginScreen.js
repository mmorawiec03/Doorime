import React from 'react';
import { View, Text, Image, TouchableOpacity, TouchableWithoutFeedback, Keyboard, TextInput } from 'react-native';
import { loginStyles } from '../styles/login';
import { api } from '../api/apiHost';
import base64 from 'base-64';
import { setAuthToken } from '../storage/token';
import { setAuthData } from '../storage/authData';
import { AuthContext } from '../contexts/authContext';
import * as Haptics from 'expo-haptics';

class LoginScreen extends React.Component {

    messageColor = (isBad) => {
        return isBad ? ('darkred') : ('darkgreen');
    }
    

    state = {
        username: '',
        password: '',
        errorMessage: '',
        showError: false,
        isBad: ''
    };

    static contextType = AuthContext;

    login = () => {
        console.log('[INFO] GET request | Path: /login');
        const { username, password } = this.state;
        var basicAuth = 'Basic ' + base64.encode(username + ':' + password);

        if(username.length<5 || password.length<5){
            this.setState({
                errorMessage: 'Password and login must be at least 5 characters long.',
                showError: true,
                isBad: true
            });
        }
        else{
            api.get('/login', { headers: { 'Authorization': basicAuth }}).then(res => {
                setAuthToken(res.data.token);
                setAuthData({"username": username, "basicAuth": basicAuth, "isAuth": true});
                this.context.dispatch({type: 'LOGIN', username });
            }).catch(err => {
                if(err.response != undefined && err.response.status === 401){
                    this.setState({
                        errorMessage: err.response.data.message,
                        showError: true,
                        isBad: true
                    });
                } else if (String(err).includes('Network Error')){
                    this.setState({
                        errorMessage: 'Network Error!',
                        showError: true,
                        isBad: true
                    });
                } else {
                    this.setState({
                        errorMessage: err,
                        showError: true,
                        isBad: true
                    });
                }
            });
        }
    }

    
    signup = () => {
        console.log('[INFO] POST request | Path: /create_user');

        const { username, password } = this.state;
        if(username.length<5 || password.length<5){
            this.setState({
                errorMessage: 'Password and login must be at least 5 characters long.',
                showError: true,
                isBad: true
            });
        }
        else{
            api.post('/create_user ',
            {"username": username, "password": password},
            ).then(res => {
            console.log(res.data.message);
            if(String(res.data.message).includes('created')){
                this.setState({
                    errorMessage: res.data.message,
                    showError: true,
                    isBad: false
                });
            }
            else{
                this.setState({
                    errorMessage: res.data.message,
                    showError: true,
                    isBad: true
                });
            }
            }).catch(err => {
            if (String(err).includes('Network Error')){
                this.setState({
                    errorMessage: 'Network Error!',
                    showError: true,
                    isBad: true
                });
            } else {
                this.setState({
                    errorMessage: err,
                    showError: true,
                    isBad: true
                });
            }
        });
        }
    }
    
    render (){
        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={loginStyles.container}>
                    <View style={loginStyles.iconContainer}>
                        <Image source={require('../assets/doorime-logo.png')} style={loginStyles.icon} />
                    </View>
                    <View style={loginStyles.inputContainer}>
                        
                        {this.state.showError &&
                            <TouchableOpacity style={[loginStyles.errorBox, { borderColor: this.messageColor(this.state.isBad) }]} onPress={() => this.setState({showError: false})} onPressIn={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}>
                                <Text style={[loginStyles.errorText, { color: this.messageColor(this.state.isBad) }]}>{this.state.errorMessage}</Text>
                            </TouchableOpacity>
                        }
                        
                        <TextInput
                            value={this.state.username}
                            onChangeText={(username) => this.setState({ username })}
                            placeholder={'Username'}
                            style={loginStyles.input}
                            placeholderTextColor="#000"
                            onFocus={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                        />
                        <TextInput
                            value={this.state.password}
                            onChangeText={(password) => this.setState({ password })}
                            placeholder={'Password'}
                            secureTextEntry={true}
                            style={loginStyles.input}
                            placeholderTextColor="#000" 
                            onFocus={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                        />
                    </View> 
                    <View style={loginStyles.buttonContainer}>
                        <TouchableOpacity style={loginStyles.buttonLogin} onPress={this.login.bind(this)} onPressIn={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}>
                            <Text style={loginStyles.buttonText}>Log in</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={loginStyles.buttonSignin} onPress={this.signup.bind(this)} onPressIn={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}>
                            <Text style={loginStyles.buttonText}>Sign up</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        );
    }

}

export default LoginScreen;