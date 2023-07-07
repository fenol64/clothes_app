import AsyncStorage from '@react-native-async-storage/async-storage';

export const extractNumbers = (str) => str.replace(/[^0-9]/g, '');

export const mysqlDateTime = (date) => {
    if (!date) date = new Date();

    return date.toISOString().slice(0, 19).replace('T', ' ');
}

export const priceMask = (value) => {
    if (!value) return 'R$ 0,00';

    value = value.toString().replace(/\D/g, '');
    value = value.toString().replace(/(\d)(\d{2})$/, '$1,$2');
    value = value.toString().replace(/(?=(\d{3})+(\D))\B/g, '.');
    value = `R$ ${value}`;

    return value;
}

export const dateMask = (value) => {
    if (!value) return '';
    console.log(value)
    const [date, time] = value.split("T");

    const [year, month, day] = date.split("-");
    const [hour, minute] = time.split(":");

    return `${day}/${month}/${year} ${hour}:${minute}`;
}

export const CheckoutDateMask = (value) => {
    if (!value) return '';

    const [date, time] = value.split("T");

    const [year, month, day] = date.split("-");
    const [hour, minute] = time.split(":");

    return `${day}/${month} ${hour}:${minute}`;
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