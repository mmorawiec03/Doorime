import React, { useState } from 'react';
import { View, Text, Image, KeyboardAvoidingView, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native';
import LoginForm from '../forms/loginForm';
import RegisterForm from '../forms/registerForm';
import { loginStyles } from '../styles/login';


export default function LoginScreen() {
    const [register, setRegister] = useState(false);
    
    const handlePress = () => {
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
                {register ? (<RegisterForm />) : (<LoginForm />)}
                <TouchableOpacity style={loginStyles.buttonContainer} onPress={handlePress}>
                    <Text style={loginStyles.buttonText}>{register ? ('Login page') : ('Sign up')}</Text>
                </TouchableOpacity>
            </View>
        </TouchableWithoutFeedback>
    )
}