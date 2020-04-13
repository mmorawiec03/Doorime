import React from 'react'
import { View, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native'
import { Formik } from 'formik';
import * as yup from 'yup';
import { modalFormStyles } from '../styles/modalForm';


const addDeviceSchema = yup.object({
    name: yup
        .string()
        .required('Name is a required field')
        .min(3, 'Must be at least 3 characters'),
    id: yup
        .string()
        .required('Id is a required field')
});

export default function AddDevice() {

    const submitHandler = () => {
        console.log('add device');
        // get collection name from props
        // api.put
        // close modal
        // alert(message)
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={modalFormStyles.formContainer}>
                <Formik 
                    initialValues={{name: '', id: ''}}
                    validationSchema={addDeviceSchema}
                    onSubmit={(values, actions) => {
                        submitHandler();
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
