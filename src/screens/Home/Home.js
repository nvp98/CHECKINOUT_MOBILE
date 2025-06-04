import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  BackHandler,
  Alert,
  Button,
  Image,
} from 'react-native';
import logo from '../../assets/images/Logo.png';
import avata from '../../assets/images/avatar.png';
import {styles, styleHeaders} from './Home.styles';
import Icon from 'react-native-vector-icons/Ionicons';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {
  useRoute,
  useNavigationState,
  useNavigation,
  createNavigationContainerRef,
  NavigationContainer,
} from '@react-navigation/native';
// import {API_URL} from "../../constants";
import {CreateTrip} from '../CreateTrip/CreateTrip';
import {ConfirmTrip} from '../ConfirmTrip/ConfirmTrip';
import {CreateTrain} from '../CreateTrain/CreateTrain';
import {History} from '../History/History';
// import Header from '../../components/Header/Header';
import {getAsyncStorage} from '../../Utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from 'jwt-decode';
import {useSelector, useDispatch} from 'react-redux';
import {
  setName,
  setAge,
  increaseAge,
  dataUser,
  listTicke,
  clearTicke,
} from '../../redux/actions';
import moment from 'moment';
import {createDrawerNavigator} from '@react-navigation/drawer';

const Tab = createMaterialTopTabNavigator();

const ref = createNavigationContainerRef();
const Drawer = createDrawerNavigator();

export default function Home({navigation}) {
  // const [routeName, setRouteName] = useState();

  const [user, setUser] = useState('');
  const [idUser, setIdUser] = useState(0);
  const state = useNavigationState(state => state.routes.length);
  // console.log(state);
  // const route = useRoute();
  // console.log(route);
  // console.log(navigation.getState().routes);
  // const navigation = useNavigation();
  // console.log(navigation);

  const {name, age, listTK, dataUser} = useSelector(state => state.userReducer);
  const dispatch = useDispatch();

  useEffect(() => {
    getData();
    // const backAction = () => {
    //   Alert.alert('Hold on!', 'Are you sure you want to go back?', [
    //     {
    //       text: 'Cancel',
    //       onPress: () => null,
    //       style: 'cancel',
    //     },
    //     {text: 'YES', onPress: () => BackHandler.exitApp()},
    //   ]);
    //   return true;
    // };

    // const backHandler = BackHandler.addEventListener(
    //   'hardwareBackPress',
    //   backAction,
    // );

    // return () => backHandler.remove();
  }, []);

  const getData = async () => {
    try {
      // console.log('home');
      const data = await getAsyncStorage('token');
      if (data) {
        const decode = jwt_decode(data);
        if (decode) {
          setUser(decode.user);
          setIdUser(decode.user);
        }
      }
      // const routeName = await getAsyncStorage('routeName');
      // console.log('home', routeName);
    } catch (error) {
      console.log(error);
    }
  };

  const onLogout = async () => {
    try {
      await AsyncStorage.clear();
      navigation.navigate('Login');
    } catch (error) {
      console.log(error, 'logout');
    }
  };

  return (
    <>
      {/* <Header /> */}
      <View style={styleHeaders.container}>
        <Image source={logo} style={styleHeaders.img}></Image>
        <Text style={styleHeaders.tx}>
          CÔNG TY CỔ PHẦN {'\n'}THÉP HÒA PHÁT DUNG QUẤT
        </Text>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Image source={avata} style={styleHeaders.avata}></Image>
        </TouchableOpacity>
      </View>

      {/* <Drawer.Navigator> */}
      {/* <Button onPress={() => navigation.openDrawer()} title="show" /> */}
      <Tab.Navigator
        // tabBarOp
        screenOptions={{
          tabBarStyle: {height: 40},
          // tabBarIconStyle: {height: 0, marginTop: -20},
          tabBarActiveTintColor: 'white',
          tabBarInactiveTintColor: 'gray',
          tabBarIndicatorStyle: {
            // backgroundColor:'#0097d0',
            backgroundColor: '#00529C',
            height: '100%',
          },
        }}>
        <Tab.Screen
          name="CHECKIN"
          // component={CreateTrip}
          children={() => <CreateTrip />}
          options={{
            tabBarLabel: color => (
              <View style={{margin: -15}}>
                <Text style={{fontSize: 12, color: color, fontWeight: 'bold'}}>
                  CHECK IN
                </Text>
              </View>
            ),
            tabBarStyle: {
              height: 40,
            },
            tabBarIcon: ({color, size}) => (
              <View style={{margin: -10, marginLeft: 0}}>
                <Icon name="log-in" size={25} color={color} style={{}} />
              </View>
            ),
          }}
        />

        <Tab.Screen
          name="CHECKOUT"
          // component={ConfirmTrip}
          children={() => <ConfirmTrip idUser={idUser} />}
          listeners={{
            // tabPress: e => {
            //   console.log(e, 'CHECK iiiiiiiiiiiiiii');
            // },
            focus: e => {
              // dispatch(setAge('CHECKOUT'));
            },
          }}
          options={{
            tabBarLabel: color => (
              <View style={{margin: -15}}>
                <Text style={{fontSize: 12, color: color, fontWeight: 'bold'}}>
                  CHECK OUT
                </Text>
              </View>
            ),
            tabBarStyle: {height: 40},
            tabBarIcon: ({color, size}) => (
              <View style={{margin: -10, marginLeft: 0}}>
                <Icon name="log-out" size={25} color={color} style={{}} />
              </View>
            ),
          }}
        />
        <Tab.Screen
          name="CreateTrain"
          // component={CreateTrain}
          children={() => <CreateTrain />}
          options={{
            tabBarLabel: color => (
              <View style={{margin: -15}}>
                <Text style={{fontSize: 12, color: color, fontWeight: 'bold'}}>
                  Chuyến Tàu
                </Text>
              </View>
            ),
            tabBarStyle: {height: 40},
            tabBarIcon: ({color, size}) => (
              <View style={{margin: -10, marginLeft: 0}}>
                <Icon name="subway" size={25} color={color} style={{}} />
              </View>
            ),
          }}
        />
        <Tab.Screen
          name="History"
          // component={CreateTrain}
          children={() => <History />}
          options={{
            tabBarLabel: color => (
              <View style={{margin: -15}}>
                <Text style={{fontSize: 12, color: color, fontWeight: 'bold'}}>
                  History
                </Text>
              </View>
            ),
            tabBarStyle: {height: 40},
            tabBarIcon: ({color, size}) => (
              <View style={{margin: -10, marginLeft: 0}}>
                <Icon name="list" size={25} color={color} style={{}} />
              </View>
            ),
          }}
        />
      </Tab.Navigator>

      {/* <View style={{flexDirection: 'row'}}>
        <TouchableOpacity style={styles.BtnLogin} onPress={onLogout}>
          <Text style={styles.BtnText}>Đăng Xuất</Text>
        </TouchableOpacity>
        <Text
          style={{
            marginRight: 10,
            flex: 2,
            textAlign: 'right',
            fontWeight: 'bold',
            textAlignVertical: 'bottom',
          }}>
          {moment(dataUser?.DateIN).format('DD-MM-YYYY')}
          {' - '}
          {user}
        </Text>
      </View> */}
    </>
  );
}
