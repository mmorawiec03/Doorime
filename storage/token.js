import * as SecureStore from 'expo-secure-store';

exports.getAuthToken = async () => {
    try {
        return await SecureStore.getItemAsync('storage.token');
    } catch (e) {
        console.log(`[GETAUTHTOKEN ERROR] ${e}`);
        return null;
    }
};

exports.setAuthToken = async (token) => {
    try {
        return await SecureStore.setItemAsync('storage.token', token);
    } catch (e) {
        console.log(`[SETAUTHTOKEN ERROR] ${e}`);
    }
};