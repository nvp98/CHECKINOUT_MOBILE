import React, {useState, useEffect} from 'react';
import RNFS from 'react-native-fs';
import {Alert, NativeModules} from 'react-native';
// console.log(RNFS.ExternalStorageDirectoryPath, 'local');
// console.log(RNFS.DocumentDirectoryPath, 'docu');
// console.log(RNFS.DownloadDirectoryPath, 'dowload');
// export const API_URL = 'http://192.168.70.90:90/api';
// export const API_URL = 'http://192.168.240.3:83/api';
export const API_URL = 'http://10.192.39.98:8080/api';

// get a list of files and directories in the main bundle

// RNFS.readDir(folderPath) // On Android, use "RNFS.DocumentDirectoryPath" (MainBundlePath is not defined)
//   .then(result => {
//     console.log('GOT RESULT', result);

//     // stat the first file
//     return Promise.all([RNFS.stat(result[0].path), result[0].path]);
//   })
//   .then(statResult => {
//     if (statResult[0].isFile()) {
//       // if we have a file, read it
//       console.log('ss');
//       console.log(statResult[0], 'kk');
//       return RNFS.readFile(statResult[1], 'utf8');
//     }

//     return 'no file';
//   })
//   .then(contents => {
//     // log the file contents
//     const obj = JSON.parse(contents);
//     console.log(obj.url);
//     ArrUrl.push(obj.url);
//     // console.log(ArrUrl, 'ủl');
//   })
//   .catch(err => {
//     console.log(err.message, err.code);
//   });

// var path = RNFS.DownloadDirectoryPath + '/Urlapi.json';

// // write the file
// RNFS.writeFile(path, 'Lorem ipsum dolor sit amet', 'utf8')
//   .then(success => {
//     console.log('FILE WRITTEN!');
//   })
//   .catch(err => {
//     console.log(err.message);
//   });
export const URl = async () => {
  try {
    console.log('URL');
    const folderPath = RNFS.DownloadDirectoryPath + '/BPK/API_URL.json';
    return await RNFS.readFile(folderPath);
  } catch (error) {
    console.log(error);
    // Alert.alert(String(error));
    Alert.alert(
      'Thông báo',
      'Khởi động lại ?',
      [
        // {
        //   text: 'Cancel',
        //   onPress: () => console.log('Cancel Pressed'),
        //   style: 'cancel',
        // },
        {
          text: 'OK',
          onPress: () => {
            // PermissionsAndroid.request(
            //   PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            //   PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            // );
            NativeModules.DevSettings.reload();
          },
        },
      ],
      {cancelable: true},
    );
    // NativeModules.DevSettings.reload();
  }
};
