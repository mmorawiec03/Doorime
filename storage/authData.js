import * as SecureStore from 'expo-secure-store';

exports.setAuthData = async (data) => {
    try {
        return await SecureStore.setItemAsync('storage.authData', JSON.stringify(data));
    } catch (e) {
        console.log(`[SETAUTHDATA ERROR] ${e}`);
    }
}

exports.getAuthData = async () => {
    try {
        return JSON.parse(await SecureStore.getItemAsync('storage.authData'));
    } catch(e) {
        console.log(`[GETAUTHDATA ERROR] ${e}`);
    }
}