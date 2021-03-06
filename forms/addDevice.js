import React,  { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native'
import { Formik } from 'formik';
import * as yup from 'yup';
import { modalFormStyles } from '../styles/modalForm';
import { api } from '../api/apiHost';
import { getAuthToken } from '../storage/token';


const addDeviceSchema = yup.object({
    name: yup
        .string()
        .required('Name is a required field')
        .min(3, 'Must be at least 3 characters')
        .max(25, 'Name must be at most 25 characters'),
    id: yup
        .string()
        .required('Id is a required field')
});

export default function AddDevice({ colID, getUserData }) {

    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState('');

    const submitHandler = (name, id) => {
        console.log('[INFO] PUT request | Path: /add_device');
        getAuthToken().then(token => {
            api.put(
                '/add_device',
                {"collection": colID, "device": id, "name": name},
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
                    initialValues={{name: '', id: ''}}
                    validationSchema={addDeviceSchema}
                    onSubmit={(values, actions) => {
                        submitHandler(values.name, values.id);
                        actions.resetForm();
                        Keyboard.dismiss();
                    }}
                >
                    {formikProps => (
                        <View>
                            <TextInput 
                                style={modalFormStyles.input}
                                placeholder='Device name'
                                onChangeText={formikProps.handleChange('name')}
                                onBlur={formikProps.handleBlur('name')}
                                value={formikProps.values.name}
                            />
                            <Text style={modalFormStyles.errorText}>{formikProps.touched.name && formikProps.errors.name}</Text>

                            <TextInput 
                                style={modalFormStyles.input}
                                placeholder='Device identifier'
                                onChangeText={formikProps.handleChange('id')}
                                onBlur={formikProps.handleBlur('id')}
                                value={formikProps.values.id}
                            />
                            <Text style={modalFormStyles.errorText}>{formikProps.touched.id && formikProps.errors.id}</Text>

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
