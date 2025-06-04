import AsyncStorage from '@react-native-async-storage/async-storage';

export const getAsyncStorage=async(KEY)=>{
    try {
        return await AsyncStorage.getItem(KEY);
    } catch (error) {
        console.log(error);
    }
}
export const setAsyncStorage=async(KEY,value)=>{
    try {
        return await AsyncStorage.setItem(KEY,value);
    } catch (error) {
        console.log(error);
    }
}
export const removeAsyncStorage=async(KEY)=>{
    try {
        return await AsyncStorage.removeItem(KEY);
    } catch (error) {
        console.log(error);
    }
}