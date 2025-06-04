import React, {useState, useEffect, memo, useCallback, useRef} from 'react';
import {
  Text,
  View,
  TextInput,
  Button,
  TouchableOpacity,
  ScrollView,
  Alert,
  RefreshControl,
  ActivityIndicator,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {getDiaryINOUT, putDiaryINOUT, getLyDo} from '../../Api';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Autocomplete} from '../../components/AutoComplete/Autocomplete';
import {styles} from './ConfirmTrip.styles';
import {pickerSelectStyles} from '../CreateTrip/CreateTrip';
import moment from 'moment';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {getAsyncStorage} from '../../Utils';
import RNPickerSelect from 'react-native-picker-select';
import {useSelector, useDispatch} from 'react-redux';
import {listOUTs} from '../../redux/actions';

const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

export const ConfirmTrip = props => {
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const [DataSetLD, setDataSetLD] = useState([]);
  const [dataOUT, setDataOUT] = useState({});

  const [selectBSX, setSelectBSX] = useState({id: 0});
  const [listChuyen, setListChuyen] = useState([]);
  const [selectNote, setNote] = useState(null);
  const [selectLD, setLD] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [scan, setScan] = useState(false);

  const onSelc = (item, key) => {
    // setKey(key);
    // console.log(key,'key');
    if (item !== null) {
      // if (key == 'xe') {
      //   const setNT = DataSetNT.find(({id}) => id == item.IDNT);
      //   // setSelectNT(setNT);
      //   setSelectBSX(item);
      //   // setSelectNT(setNT);
      //   // setScan(false);
      // }
      switch (key) {
        case 'ld':
          return setLD(item);
        default:
          break;
      }
    }
  };

  const {name, age, listOUT, dataUser, listLD} = useSelector(
    state => state.userReducer,
  );
  const dispatch = useDispatch();
  // console.log(listOUT, 'lisstOUT');
  useEffect(() => {
    // console.log(listOUT, 'props');
    // fetchMyAPI();
    initData();
  }, [dataUser, props]);
  // useEffect(() => {
  //   initOnly();
  // }, [dataUser]);
  // const initOnly = async () => {
  //   try {
  //     // console.log('only confirm');
  //     const res = await getLyDo();
  //     const listLD = res?.data.map(item => ({
  //       value: item.idld,
  //       label: item.noiDung,
  //     }));
  //     setDataSetLD(listLD);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  const initData = async () => {
    try {
      // console.log('confirm');
      const timenow = new Date();
      //get token
      // const data = await getAsyncStorage('token');
      // const decode = jwt_decode(data);
      // var params = {
      //   ngay: dataUser?.DateIN,
      //   IDCa: dataUser?.IDCa,
      //   IDVT: dataUser?.IDVT,
      //   isOUT: 0,
      // };
      // console.log(params, 'parrr');
      // const response = await getDiaryINOUT(params);
      // // // console.log(response, 'reciver');
      // if (response) setListChuyen(response?.data);

      var params = {
        ngay: dataUser?.DateIN,
        IDCa: dataUser?.IDCa,
        IDVT: dataUser?.IDVT,
        isOUT: 0,
      };
      // console.log(params, 'confi');
      const response = await getDiaryINOUT(params);
      if (response) setListChuyen(response?.data.items);
      // const res = await getLyDo();
      // const listLD = res?.data.map(item => ({
      //   value: item.idld,
      //   label: item.noiDung,
      // }));
      // setDataSetLD(listLD);
      // if (response) dispatch(listOUTs(response?.data));
      // console.log(response?.data, 'jsjsj');
      // const vt = await getViTri({IDVT: dataUser?.IDVT});
      // const listvt = await getViTri({IDKho: vt?.IDKho});

      // // console.log(vt);
      // const listSet = listvt?.data.map(item => ({
      //   value: item.idvt,
      //   label: item.tenVT,
      // }));
      // setDataSetVT(listSet);
    } catch (error) {
      console.log(error);
    }
  };

  const onConfirm = async items => {
    const timenow = moment().utcOffset(7, true).format();
    const time = moment().utcOffset(7, true);
    // var a = timenow - items.gioVao;
    var gio = moment.duration(time.diff(items.gioVao)).hours();
    var phut = moment.duration(time.diff(items.gioVao)).minutes();
    // var hh = moment.utc(diff.as('milliseconds')).format('HH:mm');
    // console.log(gio * 60 + phut);
    const body = {
      id: items.id,
      titkeNum: items.titkeNum,
      bienSoXe: items.bienSoXe,
      idCa: items.idCa,
      idvt: items.idvt,
      tauNhan: items.tauNhan,
      chiNhanh: items.chiNhanh,
      idlh: items.idlh,
      idvc: items.idvc,
      gioVao: items.gioVao,
      gioRa: items.gioRa,
      tG_KH: items.tG_KH,
      tG_LH: items.tG_LH,
      note: items.note,
      khoiLuong: items.khoiLuong,
      idld: items.idld,
      isOUT: items.isOUT,
      dateIN: dataUser?.DateIN,
      idTau: items.idTau,
    };
    body.gioRa = timenow;
    body.tG_LH = parseFloat(gio * 60 + phut);
    body.isOUT = 1;
    // try {
    // console.log(body);
    Alert.alert('Thông báo', `${items.titkeNum}-${items.bienSoXe} check OUT?`, [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: async () => {
          try {
            setLoading(true);
            // console.log(body);
            const res = await putDiaryINOUT(body, items.id);
            // console.log(res);
            if (res.status == 201) {
              Alert.alert('Check OUT thành công');
              initData();
            }
          } catch (error) {
            console.log(error);
            Alert.alert('Check OUT thất bại');
          } finally {
            setLoading(false);
          }
        },
      },
      {
        text: 'Đình trệ',
        onPress: () => {
          setDataOUT(body), setModalVisible(true);
        },
        style: 'cancel',
      },
    ]);
    // const res = await UpdateChuyenXeID(IDChuyen, body);
    // if (res.status === 201) {
    //   Alert.alert('Xác nhận chuyến thành công');
    //   // setSelectBSX({id: 0});
    //   const {data} = await getChuyenXeID(selectBSX.id);
    //   if (data) setListChuyen(data);
    // }
    // } catch (error) {
    //   console.log(error);
    //   Alert.alert('Xác nhận chuyến thất bại');
    // }
  };

  const onSubmit = async () => {
    try {
      // console.log(dataOUT, selectNote, selectLD, 'dataOUT');
      try {
        setLoading(true);
        const body = dataOUT;
        body.idld = selectLD;
        body.note = selectNote;
        const res = await putDiaryINOUT(body, body.id);
        // console.log(res);
        if (res.status == 201) {
          // navigation.navigate('CHECK OUT');
          Alert.alert('Check OUT thành công');
          var params = {
            ngay: dataUser?.DateIN,
            IDCa: dataUser?.IDCa,
            IDVT: dataUser?.IDVT,
            isOUT: 0,
          };
          const response = await getDiaryINOUT(params);
          if (response) dispatch(listOUTs(response?.data.items));

          // initData();
        }
      } catch (error) {
        console.log(error);
        Alert.alert('Xác nhận chuyến thất bại');
      } finally {
        setLoading(false);
        setModalVisible(false);
        setNote('');
        setLD(null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onSuccess = async e => {
    Alert.alert(e.data);
    // if (DataSetXe) {
    //   const qrXe = DataSetXe.find(({title}) => title == e.data);
    //   if (qrXe) {
    //     setSelectBSX(qrXe);
    //     const {data} = await getChuyenXeID(qrXe.id);
    //     if (data) setListChuyen(data);
    //   }
    // }
    setScan(false);
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    initData();
    wait(2000).then(() => setRefreshing(false));
  }, [dataUser]);

  return (
    <ScrollView
      keyboardShouldPersistTaps="always"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      {!scan && (
        <>
          {isLoading ? (
            <ActivityIndicator />
          ) : (
            <View style={{minHeight: 500, margin: 10}}>
              <Text style={styles.item}>Danh sách Xe/Toa Tàu </Text>
              {listChuyen.map((item, key) => {
                return (
                  <View style={styles.tag} key={key}>
                    <Text style={styles.info}>
                      <Text style={{minHeight: 100}}>
                        <Text style={{fontSize: 15}}>
                          {item.titkeNum}
                          {'-'} {item.bienSoXe}
                          {'\n'}IN:
                          {moment(item.gioVao).format('DD/MM/YYYY HH:mm')}
                        </Text>{' '}
                      </Text>
                    </Text>
                    <View style={styles.button}>
                      <Button
                        title="CHECKOUT "
                        onPress={() => onConfirm(item)}
                        color="#ff2626"
                      />
                    </View>
                  </View>
                );
              })}
              {/* <View style={styles.tag}>
          <Text style={styles.info}>
            <Text ><Text style={{fontSize:15}}>Bãi A -{'>'} Bãi B aasssssssssss</Text> {"\n"}Thời gian xuất: 1/11/2021 13:00:00</Text>
          </Text>
          <View style={styles.button} >
            <Button title="Xác Nhận" onPress={onConfirm} color="#23577C"  />
          </View>
        </View> */}
              <View style={styles.centeredView}>
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
                      <Text style={styles.modalText}>Lý do đình trệ?</Text>
                      <RNPickerSelect
                        onValueChange={value => onSelc(value, 'ld')}
                        items={listLD}
                        placeholder={{
                          label: 'Lý Do đình trệ',
                          value: null,
                        }}
                        style={{
                          ...pickerSelectStyles,
                          placeholder: {
                            fontSize: 12,
                            fontWeight: 'bold',
                            // backgroundColor: 'rgba(0,0,0,0.2)',
                          },
                        }}
                      />
                      <TextInput
                        editable
                        placeholder="Ghi chú"
                        multiline
                        numberOfLines={3}
                        placeholderTextColor="#aaaaaa"
                        value={selectNote}
                        onChangeText={setNote}
                        style={{
                          borderWidth: 1,
                          width: '100%',
                          marginBottom: 15,
                        }}
                      />
                      <View style={{display: 'flex', flexDirection: 'row'}}>
                        <View style={{marginRight: 50}}>
                          <Button
                            title="Cancel"
                            onPress={() => setModalVisible(!modalVisible)}
                            color="red"
                          />
                        </View>

                        <Button
                          title="xác nhận"
                          onPress={onSubmit}
                          color="#23577C"
                        />
                      </View>
                    </View>
                  </View>
                </Modal>
              </View>
            </View>
          )}
        </>
      )}
      {scan && (
        <QRCodeScanner
          reactivate={true}
          showMarker={true}
          // ref={(node) => { scanner = node }}
          onRead={onSuccess}
          topContent={
            <Text style={styles.centerText}>
              Please move your camera {'\n'} over the QR Code
            </Text>
          }
          bottomContent={
            <View>
              <TouchableOpacity
                style={styles.buttonScan2}
                onPress={() => setScan(false)}>
                <Icon
                  name="close-circle"
                  size={35}
                  style={{width: '100%'}}
                  // color={'blue'}
                />
              </TouchableOpacity>
            </View>
          }
        />
      )}
    </ScrollView>
  );
};
