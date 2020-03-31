import { StyleSheet } from 'react-native';


export const loginStyles = StyleSheet.create({
    container: {
        backgroundColor: 'skyblue',
        height: '100%',
    },
    iconContainer: {
        height: '50%',
        justifyContent: 'center',
        alignItems: 'center',
        //backgroundColor: 'green'
    },
    icon: {
        width: '100%',
        resizeMode:'contain',
        maxWidth: 300,
        position: 'absolute'
    },
    buttonLogin: {
        backgroundColor: '#61accd', //#b6e4f7 //#61accd
        height: 70,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        //position: 'absolute',
        bottom: 0
    },
    buttonSignin: {
        backgroundColor: '#3c97bf', //#b6e4f7 //#61accd
        height: 70,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        //position: 'absolute',
        bottom: 0,

    },
    buttonContainer: {
        height: 140,
        width: '100%',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        flexDirection: 'column',
        position: 'absolute',
        bottom: 0,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    input: {
        width: '60%',
        height: 44,
        padding: 10,
        borderWidth: 1,
        borderColor: 'black',
        marginBottom: 10,
    },
    inputContainer: {
        width: '100%',
        alignItems: 'center',
        //borderWidth:3,
        //backgroundColor: 'yellow',
        flexDirection: 'column',
    }
    
});