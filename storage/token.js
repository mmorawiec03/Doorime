import { AsyncStorage } from 'react-native';

exports.getAuthToken = async () => {
    try {
        return await AsyncStorage.getItem('stored:token');
    } catch (e) {
        console.log(`[ERROR] ${e}`);
        return null;
    }
};

exports.setAuthToken = async (token) => {
    try {
        return await AsyncStorage.setItem('stored:token', token);
    } catch (e) {
        console.log(`[ERROR] ${e}`);
    }
};