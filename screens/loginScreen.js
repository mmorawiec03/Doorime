import React, { useState } from 'react';
import { Alert, View, Text, Image, KeyboardAvoidingView, TouchableOpacity, TouchableWithoutFeedback, Keyboard, TextInput } from 'react-native';
import { loginStyles } from '../styles/login';
import { ScrollView } from 'react-native-gesture-handler';

class LoginScreen extends React.Component {

    state = {
        username: '',
        password: '',
        action: '',
      };
    
    onLogin() {
        this.setState({action: 'login'});
        const { username, password, action } = this.state;
        Alert.alert('Credentials', `Username: \'${username}\' + Password: \'${password}\' + Action used: ${action}`);
    }

    onSignin() {
        this.setState({action: 'signin'});
        const { username, password, action } = this.state;
        Alert.alert('Credentials', `Username: \'${username}\' + Password: \'${password}\' + Action used: ${action}`);
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