import React, {useState, useEffect, memo, useCallback, useRef} from 'react';
import {
  Text,
  View,
  TextInput,
  Button,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Alert,
  RefreshControl,
  ActivityIndicator,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  postChuyenTau,
  postDiaryINOUT,
  getChuyenTau,
  putChuyenTau,
  getDiaryINOUT,
  putDiaryINOUT,
  getDM,
} from '../../Api';
import {styles} from './CreateTrain.styles';
import {pickerSelectStyles} from '../CreateTrip/CreateTrip';
import moment from 'moment';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {getAsyncStorage, setAsyncStorage} from '../../Utils';
import RNPickerSelect from 'react-native-picker-select';
import HoneywellScanner from 'react-native-honeywell-scanner-v2';
import {useSelector, useDispatch} from 'react-redux';
import XMLParser from 'react-xml-parser';
import {
  setName,
  setAge,
  increaseAge,
  dataUser,
  listTicke,
  LSTAU,
} from '../../redux/actions';

const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

export const CreateTrain = props => {
  let ArrTicke = [];
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const [dataOUT, setDataOUT] = useState({});
  const [selectNote, setNote] = useState(null);
  const [selectLD, setLD] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisTicke, setModalViTicke] = useState(false);
  const [listSelectTK, setListSelectTK] = useState([]);
  const [listDinhMuc, setListDinhMuc] = useState([]);

  const [scan, setScan] = useState(false);

  const onSelc = async (item, key) => {
    // console.log(key, 'key');
    try {
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
    } catch (error) {
      console.log(error);
    }
  };
  const {name, age, listTK, dataUser, listTAU, listLD} = useSelector(
    state => state.userReducer,
  );
  const dispatch = useDispatch();
  // console.log(listTK, 'useEffect');
  useEffect(() => {
    // console.log(listTK, 'lislistTicke');
    initData();
  }, [dataUser, listTK]);

  const initData = async () => {
    try {
      // const lis = await getAsyncStorage('Listticke');
      // console.log(JSON.parse(lis), 'async store');
      // setListTicke(Object.keys(JSON.parse(lis)).length);
      // console.log('train');
      const ls = listTAU;
      var params = {
        ngay: dataUser?.DateIN,
        IDCa: dataUser?.IDCa,
        IDVT: dataUser?.IDVT,
        isOUT: 0,
      };
      // console.log(params);
      const response = await getChuyenTau(params);
      // if (response) setListTau(response.data);
      if (response) dispatch(LSTAU(response?.data));
      const res = await getDM();
      if (res) setListDinhMuc(res?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const onCheckOUT = async item => {
    const timenow = moment().utcOffset(7, true).format();
    const time = moment().utcOffset(7, true);
    // var a = timenow - items.gioVao;
    var gio = moment.duration(time.diff(item.gioVao)).hours();
    var phut = moment.duration(time.diff(item.gioVao)).minutes();
    // var hh = moment.utc(diff.as('milliseconds')).format('HH:mm');
    // console.log(gio * 60 + phut);
    const body = {
      idTau: item.idTau,
      dateIN: dataUser?.DateIN,
      idCa: dataUser.IDCa,
      idvt: dataUser.IDVT,
      gioVao: item.gioVao,
      gioRa: timenow,
      isOUT: 1,
      idld: null,
      note: '',
      tG_KH: item.tG_KH,
      tG_LH: 0,
    };
    body.tG_LH = parseFloat(gio * 60 + phut);
    // console.log(body, 'body');
    // try {
    // console.log(body);
    Alert.alert('Thông báo', `${item.idTau}-${item.gioVao} check OUT?`, [
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
            const res = await putChuyenTau(body, item.idTau);
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
            // setLoading(true);
            // console.log(body);
            const res = await putDiaryINOUT(body, items.id);
            // console.log(res);
            if (res.status == 201) {
              // Alert.alert('Check OUT thành công');
              getListTK(items);
            }
          } catch (error) {
            console.log(error);
            Alert.alert('Check OUT thất bại');
          } finally {
            // setLoading(false);
          }
        },
      },
      // {
      //   text: 'Đình trệ',
      //   onPress: () => {
      //     setDataOUT(body), setModalVisible(true);
      //   },
      //   style: 'cancel',
      // },
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

  const onListTK = async item => {
    try {
      // setLoading(true);
      getListTK(item);
      setModalViTicke(true);
    } catch (error) {
      console.log(error);
      Alert.alert('get list error');
    } finally {
      // setLoading(false);
    }
  };

  const getListTK = async item => {
    var params = {
      ngay: item?.dateIN,
      IDCa: item?.idCa,
      IDVT: item?.idvt,
      IDTau: item?.idTau,
      isOUT: 0,
    };
    // console.log('param init', params);
    const respon = await getDiaryINOUT(params);
    // console.log(res);
    if (respon.status == 200) {
      setListSelectTK(respon?.data.items);
    }
  };

  const createTau = async items => {
    const li = listTK;
    // console.log(items.length, 'items');
    const timenow = moment().utcOffset(7, true).format();
    const time = moment().utcOffset(7, true);
    const body = {
      dateIN: dataUser?.DateIN,
      idCa: dataUser.IDCa,
      idvt: dataUser.IDVT,
      gioVao: timenow,
      gioRa: timenow,
      isOUT: 0,
      idld: null,
      note: '',
      tG_KH: 0,
      tG_LH: 0,
    };
    Alert.alert('Thông báo', `Tạo chuyến tàu?`, [
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
            if (items.length > 0) {
              const tgdmT = listDinhMuc.find(
                x => x.loai === 'ToaTau' || x.iddm == 1,
              )?.tGianDM;
              const tgkht =
                tgdmT * items.length +
                listDinhMuc.find(x => x.loai === 'DauKeo' || x.iddm == 3)
                  .tGianDM;
              body.tG_KH = tgkht || 0;
              const res = await postChuyenTau(body);
              // console.log(res.data, 'res');
              items.map(async (item, key) => {
                const body = {
                  dateIN: dataUser?.DateIN,
                  titkeNum: item.titkeNum,
                  bienSoXe: item.bienSoXe,
                  idCa: dataUser.IDCa,
                  idvt: dataUser.IDVT,
                  tauNhan: item?.tauNhan,
                  chiNhanh: '',
                  idlh: 0,
                  idvc: 0,
                  gioVao: timenow,
                  gioRa: timenow,
                  tG_KH: tgdmT || 0,
                  tG_LH: 0,
                  note: '',
                  khoiLuong: Number(item?.khoiLuong),
                  idld: null,
                  isOUT: 0,
                  iDtau: res?.data.idTau,
                };
                // console.log(body);
                return await postDiaryINOUT(body);
              });
              if (res.status == 201) {
                li.splice(0, li.length);
                dispatch(listTicke(li));
                initData();
                Alert.alert('Tạo thành công');
              }
            }
          } catch (error) {
            console.log(error);
            Alert.alert('Tạo thất bại');
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  const onDelete = (item, key) => {
    const li = listTK;
    Alert.alert('Thông báo', `Xóa ${item.titkeNum} ?`, [
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
            const a = li.splice(key, 1);
            dispatch(listTicke(li));
            Alert.alert('Xóa thành công');
            // console.log(res);
          } catch (error) {
            console.log(error);
            Alert.alert('Xóa thất bại');
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  const onSuccess = e => {
    // Alert.alert(e.data);
    try {
      var strData = e.data.split('<D>');
      var xmlDoc = new XMLParser().parseFromString(e.data); // Assume xmlText contains the example XML
      var xmlDoc2 = new XMLParser().parseFromString(strData[1]);
      var tickeNum = xmlDoc.getElementsByTagName('L2')[0]?.value;
      var bsx = xmlDoc.getElementsByTagName('L3')[0]?.value;
      //ma sub bsx
      var MaTike = bsx.substring(0, 2);
      Alert.alert(tickeNum);
      // var kl = Number(xmlDoc2.getElementsByTagName('T5')[0]?.value);

      // let LSChuyen = [];
      (async () => {
        const routeName = await getAsyncStorage('routeName');
        // console.log(routeName, 'ssss');
        const timenow = new Date();
        //get token
        // const data = await getAsyncStorage('token');
        // const decode = jwt_decode(data);

        var params = {
          ngay: dataUser?.DateIN,
          IDCa: dataUser?.IDCa,
          IDVT: dataUser?.IDVT,
          // isOUT: 0,
        };
        // console.log(params, 'param');
        const response = await getDiaryINOUT(params);
        // if (response) setListChuyen(response.data);
        // console.log(response.data, 'ress');
        let LSChuyen = [],
          LSChuyenTau = [],
          LSOUT = [];
        response.data.items.map((item, key) => {
          if (item.isOUT == 0) return LSChuyen.push(item.titkeNum);
          else if (item.isOUT == 1) return LSOUT.push(item.titkeNum);
        });
        // console.log(LSOUT, 'LSOUT');
        // response.data.items.map((item, key) => {
        //   if (item.idTau && item.isOUT == null)
        //     return LSChuyenTau.push(item);
        // });
        // setListChuyenTau(LSChuyenTau);

        // console.log(listChuyen, 'lschuyen');
        // console.log(listOUT, 'out');
        // console.log(props, 'prop');
        if (routeName == 'CreateTrain') {
          ArrTicke = listTK;
          // const tgToa = listDinhMuc.find(
          //   x => x.loai === 'ToaTau' || x.iddm == 1,
          // );
          if (
            tickeNum != null &&
            (LSOUT.includes(tickeNum) || LSChuyen.includes(tickeNum))
          ) {
            Alert.alert('Ticket đã được tạo');
          } else {
            let ite = {
              titkeNum: tickeNum,
              bienSoXe: xmlDoc.getElementsByTagName('L3')[0]?.value,
              tauNhan: xmlDoc.getElementsByTagName('L4')[0]?.value,
              khoiLuong: xmlDoc2.getElementsByTagName('T5')[0]?.value,
              // TGDM: tgToa?.tGianDM || 0,
            };
            ArrTicke.push(ite);
            // setListTicke(ArrTicke);
            console.log(ArrTicke);
            // setAsyncStorage('Listticke', JSON.stringify(ArrTicke));
            dispatch(listTicke(ArrTicke));
          }

          // console.log(ArrTicke, 'AyyTicke');
        }
      })();
    } catch (error) {
      console.log(error);
    } finally {
      setScan(false);
    }
  };

  const onSubmit = async () => {
    try {
      // console.log(dataOUT, selectNote, selectLD, 'dataOUT');
      try {
        setLoading(true);
        const body = dataOUT;
        body.idld = selectLD;
        body.note = selectNote;
        const res = await putChuyenTau(body, body.idTau);
        // console.log(res);
        if (res.status == 201) {
          Alert.alert('Check OUT thành công');
          initData();
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

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    initData();
    wait(1000).then(() => setRefreshing(false));
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
              <View style={{display: 'flex', flexDirection: 'row'}}>
                <View style={{width: '90%'}}>
                  <Button
                    title="TẠO CHUYẾN TÀU"
                    onPress={() => createTau(listTK)}
                    color="#23577C"
                  />
                </View>
                <View
                  style={{
                    width: '10%',
                    marginLeft: 5,
                    justifyContent: 'center',
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      setScan(true);
                    }}
                    style={styles.buttonScan}>
                    <Icon
                      name="qr-code-outline"
                      size={25}
                      style={{width: '100%'}}
                      // color={'blue'}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* {console.log(listTK, 'console.log(listTK)')} */}
              <Text style={styles.item}>Danh sách toa tàu </Text>
              {listTK?.map((item, key) => {
                return (
                  <View style={styles.tag} key={key}>
                    <Text style={styles.info}>
                      <Text style={{minHeight: 100}}>
                        <Text style={{fontSize: 15}}>
                          {item.titkeNum}
                          {'-'} {item.bienSoXe}
                        </Text>{' '}
                      </Text>
                    </Text>
                    <View style={styles.button}>
                      <Button
                        title="Xóa"
                        onPress={() => onDelete(item, key)}
                        color="#23577C"
                      />
                    </View>
                  </View>
                );
              })}
              <Text style={styles.item}>Danh sách Chuyến tàu </Text>
              {listTAU?.map((item, key) => {
                return (
                  <View style={styles.tag} key={key}>
                    <TouchableOpacity onPress={() => onListTK(item)}>
                      <Text style={styles.info}>
                        <Text style={{minHeight: 100}}>
                          <Text style={{fontSize: 15}}>
                            {item.idTau}
                            {'-'}{' '}
                            {moment(item.gioVao).format('DD/MM/YYYY HH:mm')}
                          </Text>{' '}
                        </Text>
                      </Text>
                    </TouchableOpacity>
                    <View style={styles.button}>
                      <Button
                        title="CHECKOUT"
                        onPress={() => onCheckOUT(item)}
                        color="#ff2626"
                      />
                    </View>
                  </View>
                );
              })}
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
              <View style={styles.centeredView}>
                <Modal
                  animationType="slide"
                  transparent={true}
                  visible={modalVisTicke}
                  onRequestClose={() => {
                    Alert.alert('Modal has been closed.');
                    setModalViTicke(!modalVisTicke);
                  }}>
                  <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                      <Text style={styles.modalText}>Danh sách toa tàu</Text>
                      {listSelectTK?.map((item, key) => {
                        return (
                          <View style={styles.tag} key={key}>
                            <Text style={styles.info}>
                              <Text style={{minHeight: 100}}>
                                <Text style={{fontSize: 10}}>
                                  {item.titkeNum}
                                  {'-'} {item.bienSoXe}
                                  {'\n'}IN:
                                  {moment(item.gioVao).format(
                                    'DD/MM/YYYY HH:mm',
                                  )}
                                </Text>{' '}
                              </Text>
                            </Text>
                            <View style={styles.buttonOUT}>
                              <Button
                                title="CHECKOUT"
                                onPress={() => onConfirm(item)}
                                color="#ff2626"
                              />
                            </View>
                          </View>
                        );
                      })}
                      <View style={{display: 'flex', flexDirection: 'row'}}>
                        <View
                          style={{marginRight: 0, width: 150, marginTop: 10}}>
                          <Button
                            title="Cancel"
                            onPress={() => setModalViTicke(!modalVisTicke)}
                            color="red"
                          />
                        </View>

                        {/* <Button
                          title="xác nhận"
                          onPress={onSubmit}
                          color="#23577C"
                        /> */}
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
