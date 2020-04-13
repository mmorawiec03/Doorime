import { StyleSheet } from 'react-native';


export const loginStyles = StyleSheet.create({
    container: {
        backgroundColor: 'skyblue',
        height: '100%',
    },
    iconContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        flex: 1,
        resizeMode:'contain',
        maxHeight: 70,
        margin: 20
    },
    buttonLogin: {
        backgroundColor: '#61accd', //#b6e4f7 //#61accd
        height: 60,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        //position: 'absolute',
        bottom: 0
    },
    buttonSignin: {
        backgroundColor: '#3c97bf', //#b6e4f7 //#61accd
        height: 60,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        //position: 'absolute',
        bottom: 0,

    },
    buttonContainer: {
        height: 120,
        width: '100%',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        flexDirection: 'column',
        //position: 'absolute',
        bottom: 0,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    input: {
        width: '80%',
        height: 44,
        padding: 10,
        borderWidth: 1,
        borderColor: 'black',
        marginBottom: 10,
        borderRadius: 5,
        fontSize: 16
    },
    inputContainer: {
        flex: 1,
        alignItems: 'center',
    },
    errorBox: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 44,
        width: '80%',
        padding: 10,
        borderWidth: 1,
        borderColor: 'darkred',
        marginBottom: 10,
        borderRadius: 5,
    },
    errorText: {
        color: 'darkred',
        fontSize: 16
    }
    
});