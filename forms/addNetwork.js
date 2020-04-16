import React,  { useState, useEffect } from 'react'
import { View, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native'
import { Formik } from 'formik';
import * as yup from 'yup';
import { modalFormStyles } from '../styles/modalForm';
import Card from '../shared/Card';
import { api } from '../api/apiHost';
import { getAuthToken } from '../storage/token';
import NetInfo from '@react-native-community/netinfo';


const addNetworkSchema = yup.object({
    ssid: yup
        .string()
        .required('Enter ssid')
});

export default function AddNetwork({ getUserData }) {

    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState('');
    const [ssid, setSsid] = useState('');


    const setCurrentNetwork = (formikProps) => {
        NetInfo.fetch().then(state => {
            if (state.type = 'wifi')
                formikProps.setFieldValue('ssid', state.details.ssid)
        });
    }

    const submitHandler = (ssid) => {
        console.log('[INFO] PUT request | Path: /add_wifi', ssid);
        getAuthToken().then(token => {
            api.put(
                '/add_wifi',
                {"ssid": ssid},
                { headers: { 'x-access-token': token }}
            ).then(res => {
                setMessage(res.data.message);
                setShowMessage(true);
                getUserData();
            }).catch(err => {
                console.log(`[ERROR] ${err}`);
                setMessage(err.data.message);
                setShowMessage(true);
            });
        });
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={modalFormStyles.formContainer}>
                
                {showMessage &&
                    <TouchableOpacity style={modalFormStyles.messageBox} onPress={() => setShowMessage(false)}>
                        <Text style={modalFormStyles.messageText}>{message}</Text>
                    </TouchableOpacity>
                }
                
                <Formik 
                    initialValues={{ssid: ssid}}
                    validationSchema={addNetworkSchema}
                    onSubmit={(values, actions) => {
                        submitHandler(values.ssid);
                        actions.resetForm();
                        Keyboard.dismiss();
                    }}
                >
                    {formikProps => (
                        <View>
                            <TextInput 
                                style={modalFormStyles.input}
                                placeholder='Network identifier'
                                onChangeText={formikProps.handleChange('ssid')}
                                onBlur={formikProps.handleBlur('ssid')}
                                value={formikProps.values.ssid}
                            />
                            <Text style={modalFormStyles.errorText}>{formikProps.touched.ssid && formikProps.errors.ssid}</Text>

                            <TouchableOpacity style={modalFormStyles.buttonContainer} onPress={() => setCurrentNetwork(formikProps)}>
                                <Text style={modalFormStyles.buttonText}>CURRENT WIFI</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={modalFormStyles.buttonContainer} onPress={formikProps.handleSubmit}>
                                <Text style={modalFormStyles.buttonText}>ADD</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                </Formik>
            </View>
        </TouchableWithoutFeedback>
    )
}
