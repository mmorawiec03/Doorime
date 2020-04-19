import * as SecureStore from 'expo-secure-store';

exports.setAtHome = async (atHome) => {
    try {
        return await SecureStore.setItemAsync('storage.atHome', atHome);
    } catch (e) {
        console.log(`[SETATHOME ERROR] ${e}`);
    }
}

exports.getAtHome = async () => {
    try {
        return await SecureStore.getItemAsync('storage.atHome');
    } catch(e) {
        console.log(`[GETATHOME ERROR] ${e}`);
    }
}