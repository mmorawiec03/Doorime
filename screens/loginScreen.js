import React, { useState } from 'react';
import { View, Text, Image, KeyboardAvoidingView, TouchableOpacity, TouchableWithoutFeedback, Keyboard, TextInput } from 'react-native';
import LoginForm from '../forms/loginForm';
import RegisterForm from '../forms/registerForm';
import { loginStyles } from '../styles/login';


export default function LoginScreen() {

    const [register, setRegister] = useState(false);

    // const credentials = {
    //     username: '',
    //     password: '',
    // }
    
    const handleLogin = () => {
        setRegister(!register);
    }

    const handleSignin = () => {
        setRegister(!register);
    }
    
    //               <KeyboardAvoidingView behavior='padding' contentContainerStyle={{backgroundColor: 'red'}}>
    //                 <View style={loginStyles.iconContainer}>
    //                     <Text style={loginStyles.title}>Sport Event Search</Text>
    //                 </View>
    //                 
    //             </KeyboardAvoidingView> 
    //             <TouchableOpacity style={loginStyles.buttonContainer} onPress={handlePress}>
    //                 <Text style={loginStyles.buttonText}>{register ? ('Login page') : ('Sign up')}</Text>
    //             </TouchableOpacity>

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={loginStyles.container}>
                <KeyboardAvoidingView behavior='padding'>
                    <View style={loginStyles.iconContainer}>
                        <Image source={require('../assets/doorime-logo.png')} style={loginStyles.icon} />
                    </View>
                </KeyboardAvoidingView>
                <View style={loginStyles.inputContainer}>
                    <TextInput
                        //value={credentials.username}
                        //onChangeText={(username) => this.setState({ username })}
                        placeholder={'Username'}
                        style={loginStyles.input}
                        placeholderTextColor="#000" 
                    />
                    <TextInput
                        //value={credentials.password}
                        //onChangeText={(password) => this.setState({ password })}
                        placeholder={'Password'}
                        secureTextEntry={true}
                        style={loginStyles.input}
                        placeholderTextColor="#000" 
                    />
                </View> 
                <View style={loginStyles.buttonContainer}>
                    <TouchableOpacity style={loginStyles.buttonLogin} onPress={handleLogin}>
                        <Text style={loginStyles.buttonText}>Log in</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={loginStyles.buttonSignin} onPress={handleSignin}>
                        <Text style={loginStyles.buttonText}>Sign up</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
}