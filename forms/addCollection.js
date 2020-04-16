import React, { useState, useContext } from 'react'
import { View, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native'
import { Formik } from 'formik';
import * as yup from 'yup';
import { modalFormStyles } from '../styles/modalForm';
import { getAuthToken } from '../storage/token';
import { api } from '../api/apiHost';
import { AuthContext } from '../contexts/authContext';
import base64 from 'base-64';


const addCollectionSchema = yup.object({
    name: yup
        .string()
        .required('Name is a required field')
        .min(3, 'Name must be at least 3 characters')
        .max(25, 'Name must be at most 25 characters')
});

export default function AddCollection({ getUserData }) {
    const { authData } = useContext(AuthContext);
    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState('');

    const submitHandler = (name) => {
        console.log('[INFO] PUT request | Path: /add_collection');
        getAuthToken().then(token => {
            api.put(
                '/add_collection',
                {"collection": base64.encode(authData.username + ':' + name), "name": name},
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
                    initialValues={{name: ''}}
                    validationSchema={addCollectionSchema}
                    onSubmit={(values, actions) => {
                        submitHandler(values.name);
                        actions.resetForm();
                        Keyboard.dismiss();
                    }}
                >
                    {formikProps => (
                        <View>
                            <TextInput 
                                style={modalFormStyles.input}
                                placeholder='Collection name'
                                onChangeText={formikProps.handleChange('name')}
                                onBlur={formikProps.handleBlur('name')}
                                value={formikProps.values.name}
                            />
                            <Text style={modalFormStyles.errorText}>{formikProps.touched.name && formikProps.errors.name}</Text>

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
