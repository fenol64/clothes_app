import AsyncStorage from '@react-native-async-storage/async-storage';

export const extractNumbers = (str) => str.replace(/[^0-9]/g, '');

export const mysqlDateTime = (date) => {
    if (!date) date = new Date();

    return date.toISOString().slice(0, 19).replace('T', ' ');
}

const isJson = (str) => {
    try {
        JSON.parse(str); 2
        return true;
    } catch (e) {
        return false;
    }
}

export const storage = {
    set: async (key, value) => {
        try {

            if (isJson(value) || typeof value === 'object') {
                value = JSON.stringify(value)
            }

            await AsyncStorage.setItem(key, value)
        } catch (e) {
            console.log(e)
        }
    },
    get: async (key) => {
        try {
            const value = await AsyncStorage.getItem(key)
            if (value !== null) {
                if (isJson(value)) {
                    return JSON.parse(value)
                }
                return value
            }
        } catch (e) {
            console.log(e)
        }
    },
    remove: async (key) => {
        try {
            await AsyncStorage.removeItem(key)
        } catch (e) {
            console.log(e)
        }
    }
}