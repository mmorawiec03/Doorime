import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native'
import { Formik } from 'formik';
import * as yup from 'yup';
import { modalFormStyles } from '../styles/modalForm';
import { api } from '../api/apiHost';
import { getAuthToken } from '../storage/token';


const renameSchema = yup.object({
    newName: yup
        .string()
        .required('Enter new name')
});

export default function Rename({ idKey, id, path, getUserData }) {

    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState('');

    const submitHandler = (newName) => {
        console.log('[INFO] PUT request | Path: /rename_collection or /rename_device');
        let content = {'new name': newName}
        content[idKey] = id;
        getAuthToken().then(token => {
            api.put(
                path,
                content,
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
                    initialValues={{newName: ''}}
                    validationSchema={renameSchema}
                    onSubmit={(values, actions) => {
                        submitHandler(values.newName);
                        actions.resetForm();
                        Keyboard.dismiss();
                    }}
                >
                    {formikProps => (
                        <View>
                            <TextInput 
                                style={modalFormStyles.input}
                                placeholder='New name'
                                onChangeText={formikProps.handleChange('newName')}
                                onBlur={formikProps.handleBlur('newName')}
                                value={formikProps.values.newName}
                            />
                            <Text style={modalFormStyles.errorText}>{formikProps.touched.newName && formikProps.errors.newName}</Text>

                            <TouchableOpacity style={modalFormStyles.buttonContainer} onPress={formikProps.handleSubmit}>
                                <Text style={modalFormStyles.buttonText}>RENAME</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                </Formik>
            </View>
        </TouchableWithoutFeedback>
    )
}
