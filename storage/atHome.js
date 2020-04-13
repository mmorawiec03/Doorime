import { AsyncStorage } from 'react-native';

exports.setAtHome = async (atHome) => {
    try {
        return await AsyncStorage.setItem('@atHome', atHome);
    } catch (e) {
        console.log(`[ERROR] ${e}`);
    }
}

exports.getAtHome = async () => {
    try {
        return await AsyncStorage.getItem('@atHome');
    } catch(e) {
        console.log(`[ERROR] ${e}`);
    }
}