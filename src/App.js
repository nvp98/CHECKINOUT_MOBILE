import React, {useEffect, useCallback, useMemo, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  Image,
  PermissionsAndroid,
  Alert,
  NativeModules,
  BackHandler,
} from 'react-native';
import Home from './screens/Home/Home';
import Header from './components/Header/Header';
import Login from './screens/Login/Login';
import logo from './assets/images/Logo.png';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  NavigationContainer,
  createNavigationContainerRef,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {getAsyncStorage, setAsyncStorage} from './Utils';
import {postLogin, getCa, getKho, getViTri} from './Api';
import {fetchAllApi} from './Utils';
import jwt_decode from 'jwt-decode';
import moment from 'moment';
// import DrawerNavigator from './components/CustomDrawer/CustomDrawer';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import {Provider} from 'react-redux';
import {Store} from './redux/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNRestart from 'react-native-restart';
// import TabBarTop from '@react-navigation/material-top-tabs/lib/typescript/src/views/MaterialTopTabBar';

const Stack = createNativeStackNavigator();

const ref = createNavigationContainerRef();
const Drawer = createDrawerNavigator();

const initialValue = {
  dateIN: '2022-01-01',
  user: '',
  IDCa: 0,
  IDVT: 0,
  TenCa: '',
  TenViTri: '',
};

export function App() {
  const [routeName, setRouteName] = useState(null);
  const [dataUser, setDataUser] = useState(initialValue);
    console.log("HHHHH");
  const startReload = () => RNRestart.Restart();
  // const onLogout = async props => {
  //   try {
  //     // console.log(props., 'ppp');
  //     // await AsyncStorage.clear();
  //     // navigation.navigate('Login');
  //     // StackActions.push('Login');
  //   } catch (error) {
  //     console.log(error, 'logout');
  //   }
  // };

  useEffect(() => {
        console.log("HHHHH");
    getData();
    // return () => {
    //   setDataUser(initialValue);
    // };
    const backAction = () => {
      Alert.alert('Hold on!', 'Are you sure you want to go back?', [
        {
          text: 'Cancel',
          onPress: () => null,
          style: 'cancel',
        },
        {text: 'YES', onPress: () => BackHandler.exitApp()},
        {text: 'Reload APP', onPress: () => RNRestart.Restart()},
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, [routeName]);

  // useEffect(() => {
  //   getPermision();
  // }, []);

  // const getPermision = async () => {
  //   try {
  //     console.log('permisson');
  //     if (Platform.OS == 'android') {
  //       const permissionAndroid = await PermissionsAndroid.check(
  //         'android.permission.READ_EXTERNAL_STORAGE',
  //       );
  //       console.log(permissionAndroid);
  //       if (permissionAndroid == false) {
  //         PermissionsAndroid.request(
  //           PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
  //           PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
  //         );
  //       }
  //     }
  //   } catch (error) {}
  // };
  const fetchMyAPI = useCallback(async () => {
    try {
      console.log('call');
      const data = await getAsyncStorage('token');
      const decode = jwt_decode(data);
      // console.log(decode);
      if (decode) {
        const response = await fetchAllApi([
          getCa({IDCa: decode?.IDCa}),
          getViTri({IDVT: decode?.IDVT}),
        ]);
        if (response) {
          setDataUser(prevState => ({
            ...prevState,
            TenCa: response[0]?.data[0].tenCa,
          }));
          setDataUser(prevState => ({
            ...prevState,
            TenViTri: response[1]?.data[0].tenVT,
          }));
        }
        setDataUser(prevState => ({
          ...prevState,
          user: decode?.user,
        }));
        setDataUser(prevState => ({
          ...prevState,
          dateIN: decode?.DateIN,
        }));
        // console.log(decode, 'us');
      }
    } catch (error) {
      console.log(error);
    }
  }, []); // if userId changes, useEffect will run again
  const getData = async () => {
    try {
      // if (Platform.OS == 'android') {
      //   const permissionAndroid = await PermissionsAndroid.check(
      //     'android.permission.READ_EXTERNAL_STORAGE',
      //   );
      //   console.log(permissionAndroid);
      //   if (permissionAndroid == false) {
      //     PermissionsAndroid.request(
      //       PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      //       PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      //     );
      //   }
      // }
      const data = await getAsyncStorage('token');
      const decode = jwt_decode(data);
      // console.log(dataUser.dateIN, decode?.DateIN);
      if (
        decode &&
        (dataUser.IDCa != decode?.IDCa ||
          dataUser.IDVT != decode?.IDVT ||
          dataUser.dateIN.toString() !== decode?.DateIN.toString())
      ) {
        // console.log('APP');
        const response = await fetchAllApi([
          getCa({IDCa: decode?.IDCa}),
          getViTri({IDVT: decode?.IDVT}),
        ]);
        if (response) {
          setDataUser(prevState => ({
            ...prevState,
            TenCa: response[0]?.data[0].tenCa,
          }));
          setDataUser(prevState => ({
            ...prevState,
            TenViTri: response[1]?.data[0].tenVT,
          }));
        }
        setDataUser(prevState => ({
          ...prevState,
          user: decode?.user,
        }));
        setDataUser(prevState => ({
          ...prevState,
          dateIN: decode?.DateIN,
        }));
        setDataUser(prevState => ({
          ...prevState,
          IDCa: decode?.IDCa,
        }));
        setDataUser(prevState => ({
          ...prevState,
          IDVT: decode?.IDVT,
        }));

        // console.log(decode, 'us');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const CustomDrawerContent = props => {
        console.log("HHHHH");
    // console.log('drawer', routeName);
    // return useMemo(() => {
    //   console.log('drawer', routeName);
    //   return (
    //     <DrawerContentScrollView {...props}>
    //       {/* <DrawerContentScrollView> */}
    //       <DrawerItem
    //         label={() => (
    //           <>
    //             <View style={{alignItems: 'center'}}>
    //               <Image source={logo} style={{width: 150, height: 40}}></Image>
    //             </View>
    //             <View style={{marginBottom: 10}}>
    //               <Text>
    //                 <Icon
    //                   name="person"
    //                   size={25}
    //                   style={{width: '100%'}}
    //                   // color={'blue'}
    //                 />
    //                 <View style={{paddingLeft: 20}}>
    //                   <Text>{dataUser.user}</Text>
    //                 </View>
    //               </Text>
    //             </View>
    //             <View style={{marginBottom: 10}}>
    //               <Text>
    //                 <Icon
    //                   name="share"
    //                   size={25}
    //                   style={{width: '100%'}}
    //                   // color={'blue'}
    //                 />
    //                 <View style={{paddingLeft: 20}}>
    //                   <Text>{dataUser.TenCa}</Text>
    //                 </View>
    //               </Text>
    //             </View>
    //             <View style={{marginBottom: 10}}>
    //               <Text>
    //                 <Icon
    //                   name="location"
    //                   size={25}
    //                   style={{width: '100%'}}
    //                   // color={'blue'}
    //                 />
    //                 <View style={{paddingLeft: 20}}>
    //                   <Text>{dataUser.TenViTri}</Text>
    //                 </View>
    //               </Text>
    //             </View>
    //             <View style={{marginBottom: 10}}>
    //               <Text>
    //                 <Icon
    //                   name="calendar"
    //                   size={25}
    //                   style={{width: '100%'}}
    //                   // color={'blue'}
    //                 />
    //                 <View style={{paddingLeft: 20}}>
    //                   <Text>
    //                     {moment(dataUser?.dateIN).format('DD-MM-YYYY')}
    //                   </Text>
    //                 </View>
    //               </Text>
    //             </View>
    //           </>
    //         )}
    //         // style={{}}
    //         // onPress={() => {}}
    //       />
    //       <DrawerItemList {...props} />
    //       <DrawerItem
    //         label={() => (
    //           <Text
    //             style={{
    //               // backgroundColor: 'red',
    //               borderRadius: 5,
    //             }}>
    //             <Icon
    //               name="log-out"
    //               size={25}
    //               style={{
    //                 width: '100%',
    //                 textAlign: 'center',
    //                 color: 'red',
    //               }}
    //               // color={'blue'}
    //             />
    //             <View
    //               style={{
    //                 position: 'absolute',
    //                 top: 0,
    //                 left: 0,
    //                 right: 0,
    //                 bottom: 0,
    //                 justifyContent: 'center',
    //                 alignItems: 'center',
    //                 marginLeft: 100,
    //                 width: 100,
    //               }}>
    //               <Text style={{fontWeight: 'bold', color: 'red'}}>
    //                 Đăng Xuất
    //               </Text>
    //             </View>
    //           </Text>
    //         )}
    //         labelStyle={{color: '#fbae41', fontSize: 10}}
    //         onPress={async () => {
    //           await AsyncStorage.clear();
    //           props.navigation.navigate('Login');
    //           // navigation.navigate('Login');
    //           // props.navigation.closeDrawer();
    //         }}
    //       />
    //       {/* <TouchableOpacity style={styles.BtnLogin} onPress={onLogout}>
    //         <Text style={styles.BtnText}>Đăng Xuất</Text>
    //       </TouchableOpacity> */}
    //     </DrawerContentScrollView>
    //   );
    // }, []);
    return (
      <DrawerContentScrollView {...props}>
        <DrawerItem
          label={() => (
            <>
              <View style={{alignItems: 'center'}}>
                <Image source={logo} style={{width: 150, height: 40}}></Image>
              </View>
              <View style={{marginBottom: 10}}>
                <Text>
                  <Icon
                    name="person"
                    size={25}
                    style={{width: '100%'}}
                    // color={'blue'}
                  />
                  <View style={{paddingLeft: 20}}>
                    <Text>{dataUser.user}</Text>
                  </View>
                </Text>
              </View>
              <View style={{marginBottom: 10}}>
                <Text>
                  <Icon
                    name="share"
                    size={25}
                    style={{width: '100%'}}
                    // color={'blue'}
                  />
                  <View style={{paddingLeft: 20}}>
                    <Text>{dataUser.TenCa}</Text>
                  </View>
                </Text>
              </View>
              <View style={{marginBottom: 10}}>
                <Text>
                  <Icon
                    name="location"
                    size={25}
                    style={{width: '100%'}}
                    // color={'blue'}
                  />
                  <View style={{paddingLeft: 20}}>
                    <Text>{dataUser.TenViTri}</Text>
                  </View>
                </Text>
              </View>
              <View style={{marginBottom: 10}}>
                <Text>
                  <Icon
                    name="calendar"
                    size={25}
                    style={{width: '100%'}}
                    // color={'blue'}
                  />
                  <View style={{paddingLeft: 20}}>
                    <Text>{moment(dataUser?.dateIN).format('DD-MM-YYYY')}</Text>
                  </View>
                </Text>
              </View>
            </>
          )}
          // style={{}}
          // onPress={() => {}}
        />
        <DrawerItemList {...props} />

        <DrawerItem
          label={() => (
            <Text
              style={{
                // backgroundColor: 'red',
                borderRadius: 5,
              }}>
              <Icon
                name="log-out"
                size={25}
                style={{
                  width: '100%',
                  textAlign: 'center',
                  color: 'red',
                }}
                // color={'blue'}
              />
              <View
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginLeft: 100,
                  width: 100,
                }}>
                <Text style={{fontWeight: 'bold', color: 'red'}}>
                  Đăng Xuất
                </Text>
              </View>
            </Text>
          )}
          labelStyle={{color: '#fbae41', fontSize: 10}}
          onPress={async () => {
            await AsyncStorage.clear();
            props.navigation.navigate('Login');
            // props.navigation.closeDrawer();
          }}
        />
        {/* <TouchableOpacity style={styles.BtnLogin} onPress={onLogout}>
          <Text style={styles.BtnText}>Đăng Xuất</Text>
        </TouchableOpacity> */}
      </DrawerContentScrollView>
    );
  };

  return (
    <>
      {/* <ImageBackground
          style={{width: '100%', height: '100%'}}
          source={require('./assets/images/vien.png')}>
          <Header />
          <Home />
          <Login />
        </ImageBackground>  */}
      <ImageBackground
        style={{width: '100%', height: '100%'}}
        source={require('./assets/images/vien.png')}>
        <Provider store={Store}>
          <NavigationContainer
            ref={ref}
            onReady={() => {
              setRouteName(ref.getCurrentRoute().name);
            }}
            onStateChange={async () => {
              const previousRouteName = routeName;
              const currentRouteName = ref.getCurrentRoute().name;
              setRouteName(currentRouteName);
              setAsyncStorage('routeName', currentRouteName);
            }}>
            <Drawer.Navigator
              initialRouteName="Login"
              screenOptions={{
                headerShown: false,
              }}
              drawerContent={props => <CustomDrawerContent {...props} />}>
              <Drawer.Screen name="Login" component={Login} />
              <Drawer.Screen name="Home" component={Home} />
              {/* <DrawerItemList {...props} /> */}
            </Drawer.Navigator>
            {/* <Stack.Navigator
              screenOptions={{
                headerShown: false,
              }}>
              <Stack.Screen name="Login" component={Login} />
              <Stack.Screen name="Home" component={Home} />
            </Stack.Navigator> */}
            {/* <DrawerNavigator /> */}
          </NavigationContainer>
        </Provider>
      </ImageBackground>
    </>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    // flex: 1,
  },
  container: {
    padding: 20,
  },
  title: {
    textAlign: 'center',
    fontSize: 25,
    marginBottom: 50,
  },
  section: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 3,
  },
});
