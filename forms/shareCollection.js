import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native'
import { Formik } from 'formik';
import * as yup from 'yup';
import { modalFormStyles } from '../styles/modalForm';
import { getAuthToken } from '../storage/token';
import { api } from '../api/apiHost';


const shareCollectionSchema = yup.object({
    login: yup
        .string()
        .required('Enter the successor username')
});

export default function ShareCollection({ getUserData, colID }) {
    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState('');

    const submitHandler = (login) => {
        console.log('[INFO] POST request | Path: /share_collection');
        getAuthToken().then(token => {
            api.post(
                '/share_collection',
                {"collection": colID, "successor": login},
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
                    initialValues={{login: ''}}
                    validationSchema={shareCollectionSchema}
                    onSubmit={(values, actions) => {
                        submitHandler(values.login);
                        actions.resetForm();
                        Keyboard.dismiss();
                    }}
                >
                    {formikProps => (
                        <View>
                            <TextInput 
                                style={modalFormStyles.input}
                                placeholder='Successor username'
                                onChangeText={formikProps.handleChange('login')}
                                onBlur={formikProps.handleBlur('login')}
                                value={formikProps.values.login}
                            />
                            <Text style={modalFormStyles.errorText}>{formikProps.touched.login && formikProps.errors.login}</Text>

                            <TouchableOpacity style={modalFormStyles.buttonContainer} onPress={formikProps.handleSubmit}>
                                <Text style={modalFormStyles.buttonText}>SHARE</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                </Formik>
            </View>
        </TouchableWithoutFeedback>
    )
}
