import { StyleSheet } from 'react-native';


export const loginStyles = StyleSheet.create({
    container: {
        backgroundColor: 'skyblue',
        height: '100%'
    },
    iconContainer: {
        height: '50%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    icon: {
        width: '100%',
        resizeMode:'contain',
        maxWidth: 300,
        position: 'absolute'
    },
    buttonContainer: {
        backgroundColor: '#3c97bf', //#b6e4f7
        height: 50,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 0
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    
});