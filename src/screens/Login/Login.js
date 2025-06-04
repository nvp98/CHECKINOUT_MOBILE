import React, {useState, useEffect} from 'react';
import {
  TextInput,
  View,
  Image,
  TouchableOpacity,
  Text,
  ImageBackground,
  Alert,
  Modal,
  Button,
  ActivityIndicator,
} from 'react-native';
import {styles, pickerSelectStyles} from './Login.styles';
import {fetchAllApi} from '../../Utils';
import Icon from 'react-native-vector-icons/Ionicons';
import {Autocomplete} from '../../components/AutoComplete/Autocomplete';
import {postLogin, getCa, getKho, getViTri} from '../../Api';
import {getAsyncStorage, setAsyncStorage} from '../../Utils';
import RNPickerSelect from 'react-native-picker-select';
import DateTimePicker from '@react-native-community/datetimepicker';
import {useSelector, useDispatch} from 'react-redux';
import {setName, setAge, increaseAge, dataUser} from '../../redux/actions';
import moment from 'moment';
import jwt_decode from 'jwt-decode';

function Login({navigation}) {
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [linkAPI, setLinkAPI] = useState(null);
  const [showPass, setShowPass] = useState(true);
  const [press, setPress] = useState(false);
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');

  const [dataSetCa, setDataSetCa] = useState([]);
  const [selectCa, setSelectCa] = useState(null);
  const [dataSetVT, setDataSetVT] = useState([]);
  const [selectVT, setSelectVT] = useState(null);

  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  const [dataLogin, setDataLogin] = useState({
    name: null,
    password: null,
    idCa: 0,
    idvt: 0,
    dateIN: '2022-06-09',
  });

  const onSelc = (item, key) => {
    // console.log(key, 'key');
    try {
      if (item != null) {
        // console.log(key, item);
        switch (key) {
          case 'ca':
            setDataLogin(prevState => ({...prevState, idCa: item}));
            break;
          case 'vt':
            setDataLogin(prevState => ({...prevState, idvt: item}));
            break;
          default:
            break;
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  // const {name, age} = useSelector(state => state.userReducer);
  const dispatch = useDispatch();

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      // console.log('login');
      const data = await getAsyncStorage('token');
      if (data) {
        const decode = jwt_decode(data);
        if (decode) {
          const us = {
            IDCa: Number(decode?.IDCa),
            IDVT: Number(decode?.IDVT),
            DateIN: moment(decode.DateIN).format('YYYY-MM-DD'),
            user: decode?.user,
          };
          // console.log(us, 'us');
          dispatch(dataUser(us));
        }
        navigation.navigate('Home');
      }
      const response = await fetchAllApi([getCa(), getViTri()]);

      // const response = await getCa();
      if (response) {
        // const listCa = response.data.map(item => ({
        //   id: item.idCa,
        //   title: item.tenCa,
        // }));
        const listCa = response[0].data.map(item => ({
          value: item.idCa,
          label: item.tenCa,
        }));
        const listVT = response[1].data.map(item => ({
          value: item.idvt,
          label: item.tenVT,
        }));
        // console.log(listCa);
        setDataSetCa(listCa);
        setDataSetVT(listVT);
        // console.log(listCa, listVT, 'hhhh');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onShowPass = async () => {
    // const item =await AsyncStorage.getItem('token')
    if (press == false) {
      setPress(true);
      setShowPass(false);
    } else {
      setShowPass(true);
      setPress(false);
    }
  };
  const onLogin = async () => {
    // const body = {
    //   username: user,
    //   password: password,
    // };
    const body = dataLogin;
    body.name = user;
    body.password = password;
    body.dateIN = moment(date).format('YYYY-MM-DD');
    // console.log(body);
    try {
      setIsLoading(true);
      const {data} = await postLogin(body);
      if (data) {
        const decode = jwt_decode(data?.token);
        if (decode) {
          const us = {
            IDCa: Number(decode?.IDCa),
            IDVT: Number(decode?.IDVT),
            DateIN: decode?.DateIN,
            user: decode?.user,
          };
          console.log(us, 'us');
          dispatch(dataUser(us));
        }
        // console.log(data.token);
        setAsyncStorage('token', data.token);
        navigation.navigate('Home');
      }
    } catch (error) {
      if (error) Alert.alert('Kiểm tra lại tài khoản hoặc mật khẩu');
    } finally {
      setIsLoading(false);
    }
  };

  const onChange = (event, selectedDate) => {
    setShow(false);

    const currentDate = selectedDate || date;
    // setShow(Platform.OS === 'ios');
    if (mode == 'date') setDate(currentDate);
    else setTime(currentDate);
    // console.log(selectedDate, 'select');
  };
  const showDatepicker = mode => {
    setShow(true);
    setMode(mode);
  };

  const onConfig = async () => {
    // console.log(linkAPI);
    try {
      if (linkAPI) setAsyncStorage('URL', linkAPI);
      Alert.alert('URL_API thêm Thành công');
    } catch (error) {
      if (error) Alert.alert('Kiểm tra lại thông tin');
    }
  };

  const onReset = async () => {
    console.log(linkAPI);
    try {
      const data = await getAsyncStorage('URL');
      console.log(data, 'data login');
      Alert.alert('Reset Thành công');
    } catch (error) {
      if (error) Alert.alert('Kiểm tra lại thông tin');
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/images/bg_bpkho.jpg')}
      style={{width: '100%', height: '100%'}}>
      <View style={styles.BgContainer}>
        <View style={styles.LogoContainer}>
          <Image
            source={require('../../assets/images/Logo.png')}
            style={styles.logo}></Image>
        </View>
        <View style={styles.inputsContainer}>
          <Icon
            name="person-circle-outline"
            size={25}
            style={styles.inputsIcon}
          />
          {/* <TextInput
            style={styles.input}
            placeholder="Enter your name"
            value={name}
            onChangeText={value => dispatch(setName(value))}
          /> */}
          <TextInput
            placeholder={'User name'}
            placeholderTextColor={'rgba(255,255,255,0.7)'}
            underlineColorAndroid="transparent"
            style={styles.inputs}
            onChangeText={setUser}
            value={user}
          />
        </View>
        <View style={styles.inputsContainer}>
          <Icon
            name="lock-closed-outline"
            size={25}
            style={styles.inputsIcon}
          />
          <TextInput
            placeholder={'Password'}
            secureTextEntry={showPass}
            placeholderTextColor={'rgba(255,255,255,0.7)'}
            underlineColorAndroid="transparent"
            style={styles.inputs}
            onChangeText={setPassword}
            value={password}
          />
          <TouchableOpacity style={styles.eyeBtn} onPress={onShowPass}>
            <Icon
              name={press ? 'eye-outline' : 'eye-off-outline'}
              size={26}
              color={'rgba(255,255,255,0.7)'}
            />
          </TouchableOpacity>
        </View>
        <View style={{width: '90%'}}>
          {/* <Autocomplete
            dataSet={dataSetCa}
            initValue={selectCa}
            AutoKey={'ca'}
            parentCallback={(item, key) => onSelc(item, key)}
          /> */}
          <RNPickerSelect
            onValueChange={value => onSelc(value, 'ca')}
            items={dataSetCa}
            placeholder={{
              label: 'Chọn Ca',
              value: null,
            }}
            style={{
              ...pickerSelectStyles,
              placeholder: {
                color: 'black',
                fontSize: 12,
                fontWeight: 'bold',
                // backgroundColor: 'red',
              },
            }}
            // placeholderTextColor="red"
          />
        </View>
        <View style={{width: '90%'}}>
          {/* <Autocomplete
            dataSet={dataSetCa}
            initValue={selectCa}
            AutoKey={'ca'}
            parentCallback={(item, key) => onSelc(item, key)}
          /> */}
          <RNPickerSelect
            onValueChange={value => onSelc(value, 'vt')}
            items={dataSetVT}
            placeholder={{
              label: 'Chọn Vị trí',
              value: null,
            }}
            style={{
              ...pickerSelectStyles,
              placeholder: {
                color: 'black',
                fontSize: 12,
                fontWeight: 'bold',
                // backgroundColor: 'rgba(0,0,0,0.2)',
              },
            }}
          />
        </View>
        <View style={{width: '90%'}}>
          <Text style={{color: 'red', fontWeight: 'bold'}}>Ngày Làm việc</Text>
          <View style={{flexDirection: 'row'}}>
            <Icon
              name="calendar-outline"
              size={25}
              style={{margin: 2}}
              onPress={() => showDatepicker('date')}
            />
            <Text
              style={{
                marginLeft: 5,
                marginRight: 10,
                textAlignVertical: 'center',
                color: '#000',
              }}>
              {moment(date).format('DD-MM-YYYY')}
            </Text>
          </View>
          {show && (
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode={mode}
              is24Hour={true}
              display="default"
              onChange={onChange}
            />
          )}
        </View>
        <TouchableOpacity
          style={{
            ...styles.BtnLogin,
            backgroundColor: isLoading ? '#01475C' : '#00529C',
          }}
          onPress={onLogin}>
          {isLoading && <ActivityIndicator size="large" color="#15C3FB" />}
          <Text style={styles.BtnText}>Đăng Nhập</Text>
        </TouchableOpacity>
      </View>
      {/* <View>
        <Text>Config</Text>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            setModalVisible(!modalVisible);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Button title="Reset API_URL" onPress={onReset} color="#23577C" />
              <Text style={styles.modalText}>API URL</Text>
              <TextInput
                // style={{width: 200}}
                placeholder="Nhập API_URL"
                placeholderTextColor="#aaaaaa"
                value={linkAPI}
                onChangeText={text => {
                  setLinkAPI(text);
                }}
              />
              <Button title="Xác nhận" onPress={onConfig} color="#23577C" />
              <Button
                title="Cancel"
                onPress={() => setModalVisible(!modalVisible)}
                color="#23577C"
              />
            </View>
          </View>
        </Modal>
        <View style={styles.button}>
          <Button
            title="Config"
            onPress={() => setModalVisible(true)}
            color="#23577C"
          />
        </View>
      </View> */}
    </ImageBackground>
  );
}

export default Login;
