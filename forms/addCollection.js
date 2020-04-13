import React from 'react'
import { View, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native'
import { Formik } from 'formik';
import * as yup from 'yup';
import { modalFormStyles } from '../styles/modalForm';


const addCollectionSchema = yup.object({
    name: yup
        .string()
        .required('Name is a required field')
        .min(3, 'Must be at least 3 characters')
});

export default function AddCollection() {

    const submitHandler = () => {
        console.log('add collection');
        // api.put
        // close modal
        // alert(message)
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={modalFormStyles.formContainer}>
                <Formik 
                    initialValues={{name: ''}}
                    validationSchema={addCollectionSchema}
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
