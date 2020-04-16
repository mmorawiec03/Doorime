import { StyleSheet } from 'react-native';


export const modalFormStyles = StyleSheet.create({
    closeButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        padding: 10
    },
    formContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    input: {
        height: 50,
        width: 300,
        borderBottomWidth: 1,
        borderColor: 'lightgrey',
        padding: 5,
        marginTop: 20,
        marginBottom: 2,
        fontSize: 20,
        color: 'lightgrey'
    },
    buttonContainer: {
        height: 50,
        width: 300,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        backgroundColor: '#00b6b6',
        marginVertical: 10
    },
    buttonText: {
        fontSize: 20
    },
    errorText: {
        alignSelf: 'center',
        color: 'lightgrey'
    },
    messageBox: {
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 44,
        width: '80%',
        padding: 10,
        borderWidth: 1,
        borderColor: '#00b6b6',
        marginBottom: 10,
        borderRadius: 5,
    },
    messageText: {
        color: '#00b6b6',
        fontSize: 16
    }
    
});