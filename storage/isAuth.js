import { AsyncStorage } from 'react-native';

exports.setIsAuth = async (isAuth) => {
    try {
        return await AsyncStorage.setItem('@isAuth', isAuth.toString());
    } catch (e) {
        console.log(`[ERROR] ${e}`);
    }
}

exports.getIsAuth = async () => {
    try {
        return await AsyncStorage.getItem('@isAuth') === 'true';
    } catch(e) {
        console.log(`[ERROR] ${e}`);
    }
}