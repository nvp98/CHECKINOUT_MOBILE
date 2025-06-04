import axios from 'axios';
import {API_URL, URl} from '../constants';
import {Alert, NativeModules} from 'react-native';
import {
  getAsyncStorage,
  setAsyncStorage,
  removeAsyncStorage,
} from './AsyncStorage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNRestart from 'react-native-restart';

const instance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

instance.interceptors.request.use(
  async config => {
    // const val = await URl();
    // obj = JSON.parse(val);
    // if (obj?.url) config.baseURL = obj.url;
    // else config.baseURL = API_URL;
    // Do something before request is sent
    if (!config.headers.Authorization) {
      const token = await getAsyncStorage('token');

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        // config.headers.Cookie = `token= ${token}`;
        // config.headers.withCredentials = true;
        // console.log(config.headers.Cookie);
      }
      // console.log(config);
    }
    return config;
  },
  error => {
    // Do something with request error
    return Promise.reject(error);
  },
);

// // Add a response interceptor

instance.interceptors.response.use(
  async response => {
    // const val = await URl();
    // obj = JSON.parse(val);
    // if (obj?.url) response.config.baseURL = obj.url;
    // else response.config.baseURL = API_URL;
    return response;
  },
  async error => {
    if (error) {
      if (
        error.response.status == 401 &&
        error.response.data.message == 'Unauthorized access.'
      ) {
        // Alert.alert("Phiên bản hết hạn vui lòng đăng nhập lại")
        await AsyncStorage.clear();
        Alert.alert(
          'Thông báo',
          'Phiên đăng nhập hết hạn vui lòng đăng nhập lại',
          [
            {
              text: 'Cancel',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            {
              text: 'OK',
              onPress: () => {
                RNRestart.Restart();
                // NativeModules.DevSettings.reload();
              },
            },
          ],
        );
      } else {
        console.log(error);
        Alert.alert('Thông báo', 'Đã xảy ra lỗi vui lòng đăng nhập lại', [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {
            text: 'OK',
            onPress: async () => {
              await AsyncStorage.clear();
              // navigation.navigate('Login');
              RNRestart.Restart();
              // NativeModules.DevSettings.reload();
            },
          },
        ]);
      }
    }
  },
);

export async function fetchApi(
  endPoint,
  method = 'GET',
  body,
  params = {},
  sourceToken = null,
) {
  return instance({
    method: method,
    url: endPoint,
    data: body,
    params: params,
    sourceToken: sourceToken,
  });
}

// export async function uploadFile(
//   endpoint,
//   method = 'POST',
//   body,
//   params = {},
//   sourceToken = null
// ) {
//   return instance({ j
//     method: method,
//     headers: {
//       'Content-Type': 'multipart/form-data',
//     },
//     url: endpoint,
//     data: body,
//     params: params,
//     cancelToken: sourceToken,
//   });
// }

// export async function downloadFile(
//   endpoint,
//   method = 'POST',
//   body,
//   params = {},
//   sourceToken = null,
//   responseTypeConfig = {}
// ) {
//   return instance({
//     method: method,
//     url: endpoint,
//     data: body,
//     params: params,
//     cancelToken: sourceToken,
//     responseType: 'arraybuffer',
//     ...responseTypeConfig,
//   });
// }

export async function fetchAllApi(requests = []) {
  return axios.all(requests);
}
