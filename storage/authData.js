import { AsyncStorage } from 'react-native';

exports.setAuthData = async (data) => {
    try {
        return await AsyncStorage.setItem('@authData', JSON.stringify(data));
    } catch (e) {
        console.log(`[ERROR] ${e}`);
    }
}

exports.getAuthData = async () => {
    try {
        return JSON.parse(await AsyncStorage.getItem('@authData'));
    } catch(e) {
        console.log(`[ERROR] ${e}`);
    }
}