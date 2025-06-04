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
import RNFS from 'react-native-fs';
import {
  getVanChuyen,
  getLoaiXuatBan,
  postDiaryINOUT,
  getDiaryINOUT,
  putDiaryINOUT,
  getLyDo,
  getDM,
} from '../../Api';
import {fetchAllApi, fetchApi} from '../../Utils';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Autocomplete} from '../../components/AutoComplete/Autocomplete';
import {styles, pickerSelectStyles} from './CreateTrip.styles';
import CheckBox from '@react-native-community/checkbox';
import moment from 'moment';
import {setAsyncStorage, getAsyncStorage} from '../../Utils';
import jwt_decode from 'jwt-decode';
import QRCodeScanner from 'react-native-qrcode-scanner';
import HoneywellScanner from 'react-native-honeywell-scanner-v2';
import XMLParser from 'react-xml-parser';
import RNPickerSelect from 'react-native-picker-select';
import {useSelector, useDispatch} from 'react-redux';
import {
  setName,
  setAge,
  increaseAge,
  listTicke,
  dataUser,
  listOUTs,
  LSTAU,
  LISTLDO,
} from '../../redux/actions';

const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

const initialValue = {
  titkeNum: null,
  bienSoXe: null,
  idCa: null,
  idvt: null,
  tauNhan: null,
  chiNhanh: null,
  idlh: null,
  idvc: null,
  gioVao: '2022-05-29T09:49:43.787Z',
  gioRa: '2022-05-29T09:49:43.787Z',
  tG_KH: 0,
  tG_LH: 0,
  note: '',
  khoiLuong: 0,
  idld: null,
  isOUT: 0,
  dateIN: '2022-01-01',
  iDtau: null,
};
export const CreateTrip = (props, route) => {
  let ArrTicke = [];
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const [DataSetVC, setDataSetVC] = useState([]);
  const [DataSetLD, setDataSetLD] = useState([]);
  const [DataSetLXB, setDataSetLXB] = useState([]);
  const [listChuyenTau, setListChuyenTau] = useState([]);
  const [listDinhMuc, setListDinhMuc] = useState([]);

  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  const [selectTicke, setSelectTicke] = useState(null);
  const [selectBSX, setSelectBSX] = useState(null);
  const [selectTau, setSelectTau] = useState(null);
  const [selectKL, setSelectKL] = useState(null);
  const [selectNote, setNote] = useState(null);
  const [selectLD, setLD] = useState(null);

  const [modalVisible, setModalVisible] = useState(false);

  const [dataCheckIN, setDataCheckIN] = useState(initialValue);

  const [dataOUT, setDataOUT] = useState({});

  const [scan, setScan] = useState(false);

  const onChange = (event, selectedDate) => {
    setShow(false);

    const currentDate = selectedDate || date;
    // setShow(Platform.OS === 'ios');
    if (mode == 'date') setDate(currentDate);
    else setTime(currentDate);
    // console.log(selectedDate, 'select');
  };

  const clearState = () => {
    setDataCheckIN({...initialValue});
    setSelectTicke(null);
    setSelectBSX(null);
    setSelectTau(null);
    setSelectKL(null);
  };

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
        case 'lxb':
          return setDataCheckIN(prevState => ({...prevState, idlh: item}));
        case 'vc':
          return setDataCheckIN(prevState => ({...prevState, idvc: item}));
        case 'ld':
          return setLD(item);
        default:
          break;
      }
    }
  };
  const folderPath = RNFS.ExternalStorageDirectoryPath + '/API';
  const makeDirectory = async folderPath => {
    await RNFS.mkdir(folderPath); //create a new folder on folderPath
  };
  const {name, age, listOUT, dataUser, listTAU, listTK} = useSelector(
    state => state.userReducer,
  );
  const dispatch = useDispatch();
  // ArrTicke = listTK;
  // console.log(ArrTicke, 'list arr');
  useEffect(() => {
    // makeDirectory(folderPath);
    // baseData();
    initData();
  }, [listTAU, dataUser, props]);

  useEffect(() => {
    initOnly();
  }, [dataUser]);

  const fetchMyAPI = useCallback(async () => {
    const response = await fetchAllApi([getVanChuyen(), getLoaiXuatBan()]);
    const listVC = response[0].data.map(item => ({
      value: item.idvc,
      label: item.tenVC,
    }));
    setDataSetVC(listVC);
    const listLXB = response[1].data.map(item => ({
      value: item.idlh,
      label: item.tenLH,
    }));
    setDataSetLXB(listLXB);
  }, []); // if userId changes, useEffect will run again

  const initOnly = async () => {
    try {
      // console.log('only create');
      const response = await fetchAllApi([
        getVanChuyen(),
        getLoaiXuatBan(),
        getLyDo(),
        getDM(),
      ]);
      const listVC = response[0].data.map(item => ({
        value: item.idvc,
        label: item.tenVC,
      }));
      setDataSetVC(listVC);
      const listLXB = response[1].data.map(item => ({
        value: item.idlh,
        label: item.tenLH,
      }));
      setDataSetLXB(listLXB);
      const listLD = response[2].data.map(item => ({
        value: item.idld,
        label: item.noiDung,
      }));
      setDataSetLD(listLD);
      dispatch(LISTLDO(listLD));
      setListDinhMuc(response[3].data);
    } catch (error) {
      console.log(error);
      // Alert.alert(error)
    }
  };

  const initData = async () => {
    try {
      // console.log('create');
      // const response = await fetchAllApi([
      //   getVanChuyen(),
      //   getLoaiXuatBan(),
      //   getLyDo(),
      // ]);
      // const listVC = response[0].data.map(item => ({
      //   value: item.idvc,
      //   label: item.tenVC,
      // }));
      // setDataSetVC(listVC);
      // const listLXB = response[1].data.map(item => ({
      //   value: item.idlh,
      //   label: item.tenLH,
      // }));
      // setDataSetLXB(listLXB);
      // const listLD = response[2].data.map(item => ({
      //   value: item.idld,
      //   label: item.noiDung,
      // }));
      // setDataSetLD(listLD);
      var params = {
        ngay: dataUser?.DateIN,
        IDCa: dataUser?.IDCa,
        IDVT: dataUser?.IDVT,
        // isOUT: 0,
      };
      // console.log('param init', params);
      const respon = await getDiaryINOUT(params);
      // if (response) setListChuyen(response.data);
      // console.log(response.data, 'ress');
      let LSChuyen = [],
        LSChuyenTau = [];
      respon.data.items.map((item, key) => {
        if (item.idTau && item.isOUT == null) return LSChuyenTau.push(item);
      });
      setListChuyenTau(LSChuyenTau);

      // const data = await getAsyncStorage('token');
      // if (data) {
      //   const decode = jwt_decode(data);
      //   if (decode) {
      //     setDataCheckIN(prevState => ({
      //       ...prevState,
      //       idCa: parseInt(dataUser?.IDCa),
      //     }));
      //     setDataCheckIN(prevState => ({
      //       ...prevState,
      //       idvt: parseInt(dataUser?.IDVT),
      //     }));
      //   }
      // }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (HoneywellScanner.isCompatible) {
      HoneywellScanner.startReader().then(claimed => {
        console.log(
          claimed ? 'Barcode reader is claimed' : 'Barcode reader is busy',
        );

        // const response = await getDiaryINOUT(params);
        // const LSChuyen = [];

        // console.log(listChuyen, 'reciver');
        // if (response) setListChuyen(response.data);

        HoneywellScanner.onBarcodeReadSuccess(event => {
          // console.log(event.data);
          var strData = event.data.split('<D>');
          var xmlDoc = new XMLParser().parseFromString(event.data); // Assume xmlText contains the example XML
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
                setAsyncStorage('Listticke', JSON.stringify(ArrTicke));
                dispatch(listTicke(ArrTicke));
              }

              // console.log(ArrTicke, 'AyyTicke');
            } else {
              if (
                tickeNum != null &&
                !LSChuyen.includes(tickeNum) &&
                !LSOUT.includes(tickeNum)
              ) {
                setSelectTicke(tickeNum);
                setSelectBSX(xmlDoc.getElementsByTagName('L3')[0]?.value);
                setSelectTau(xmlDoc.getElementsByTagName('L4')[0]?.value);
                setSelectKL(xmlDoc2.getElementsByTagName('T5')[0]?.value);
              } else if (tickeNum != null && LSOUT.includes(tickeNum)) {
                Alert.alert('Ticket đã được CheckOUT');
              } else if (tickeNum != null) {
                response.data.items.map((item, key) => {
                  if (item.titkeNum == tickeNum && item.isOUT == 0)
                    return onConfirm(item);
                });
                // listOUT.map((item, key) => {
                //   if (item.titkeNum == tickeNum) return onConfirm(item);
                // });
              }
            }
          })();

          // console.log(xmlDoc.getElementsByTagName('L2')[0]?.value);
          // console.log('Received data', xmlDoc);
          // console.log('Received data', xmlDoc2);

          // setSelectBaiXuat(xmlDoc.getElementsByTagName('L2')[0]?.value);
          // setSelectVT(xmlDoc.getElementsByTagName('L4')[0]?.value);
        });
      });

      return () => {
        HoneywellScanner.stopReader().then(() => {
          console.log('Freedom!!');
          HoneywellScanner.offBarcodeReadSuccess();
        });
      };
    }
  }, [HoneywellScanner.isCompatible, dataUser]);

  const onConfirm = async items => {
    const timenow = moment().utcOffset(7, true).format();
    const time = moment().utcOffset(7, true);
    var a = timenow - items.gioVao;
    var diff = moment.duration(time.diff(items.gioVao));
    var gio = moment.duration(time.diff(items.gioVao)).hours();
    var phut = moment.duration(time.diff(items.gioVao)).minutes();
    var hh = moment.utc(diff.as('milliseconds')).format('HH:mm');
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
  };

  const getDataOUT = async () => {
    try {
      var params = {
        ngay: dataUser?.DateIN,
        IDCa: dataUser?.IDCa,
        IDVT: dataUser?.IDVT,
        isOUT: 0,
      };
      const response = await getDiaryINOUT(params);
      if (response) dispatch(listOUTs(response?.data.items));
    } catch (error) {
      console.log(error);
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

  const onCreate = async () => {
    // try {
    const tgkh = listDinhMuc.find(x => x.loai === 'XE' || x.iddm == 2);
    const timenow = moment().utcOffset(7, true).format();

    const body = dataCheckIN;
    body.dateIN = dataUser?.DateIN;
    body.idCa = dataUser?.IDCa;
    body.idvt = dataUser?.IDVT;
    body.titkeNum = selectTicke;
    body.bienSoXe = selectBSX;
    body.tauNhan = selectTau;
    body.khoiLuong = Number(selectKL);
    body.gioVao = timenow;
    body.tG_KH = tgkh?.tGianDM || 0;
    // console.log(body);
    // const res = await postDiaryINOUT(body);
    // if (res.status === 201) {
    //   Alert.alert('Tạo mới thành công');
    // }
    Alert.alert('Thông báo', 'Bạn có đồng ý xác nhận tạo mới?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: async () => {
          try {
            if (body.titkeNum) {
              setLoading(true);
              // console.log(listChuyenTau, selectTicke, 'listChuyenTau');
              if (
                listChuyenTau.filter(e => e.titkeNum === selectTicke) &&
                listChuyenTau.length > 0
              ) {
                let idT = listChuyenTau.find(
                  e => e.titkeNum === selectTicke && e.isOUT == null,
                );
                // console.log(listChuyenTau, selectTicke, 'listChuyenTau');
                // console.log(listTAU, 'idT');
                var params = {
                  TitkeNum: selectTicke,
                  ngay: dataUser?.DateIN,
                  IDCa: dataUser?.IDCa,
                  IDVT: dataUser?.IDVT,
                  IDTau: idT?.idTau,
                };
                const response = await getDiaryINOUT(params);
                // console.log(response, 'listChuyenTau');
                if (response) {
                  body.id = response.data.items[0].id;
                  body.iDtau = response.data.items[0].idTau;
                  body.isOUT = 0;
                  // console.log(body, 'body');
                  const res = await putDiaryINOUT(
                    body,
                    response.data.items[0].id,
                  );
                  if (res.status == 201) {
                    Alert.alert('Chỉnh sửa thành công');
                    // getDataOUT();
                    initData();
                    clearState();
                  }
                }
              } else {
                // console.log(body, 'body');
                const res = await postDiaryINOUT(body);
                if (res.status == 201) {
                  Alert.alert('Tạo mới thành công');
                  // getDataOUT();
                  initData();
                  clearState();
                }
              }
              // console.log(body);
              // const res = await postDiaryINOUT(body);
              // console.log(res);
              // if (res.status == 201) {
              //   Alert.alert('Tạo mới thành công');
              //   initData();
              //   clearState();
              // }
            } else {
              Alert.alert('Kiểm tra lại thông tin');
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
    // } catch (error) {
    //   console.log(error);
    //   Alert.alert('Tạo thất bại');
    // }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    initData();
    wait(1000).then(() => setRefreshing(false));
  }, [dataUser]);

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
          // ArrTicke = listTK;
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
            setAsyncStorage('Listticke', JSON.stringify(ArrTicke));
            dispatch(listTicke(ArrTicke));
          }

          // console.log(ArrTicke, 'AyyTicke');
        } else {
          if (
            tickeNum != null &&
            !LSChuyen.includes(tickeNum) &&
            !LSOUT.includes(tickeNum)
          ) {
            setSelectTicke(tickeNum);
            setSelectBSX(xmlDoc.getElementsByTagName('L3')[0]?.value);
            setSelectTau(xmlDoc.getElementsByTagName('L4')[0]?.value);
            setSelectKL(xmlDoc2.getElementsByTagName('T5')[0]?.value);
          } else if (tickeNum != null && LSOUT.includes(tickeNum)) {
            Alert.alert('Ticket đã được CheckOUT');
          } else if (tickeNum != null) {
            response.data.items.map((item, key) => {
              if (item.titkeNum == tickeNum && item.isOUT == 0)
                return onConfirm(item);
            });
            // listOUT.map((item, key) => {
            //   if (item.titkeNum == tickeNum) return onConfirm(item);
            // });
          }
        }
      })();
    } catch (error) {
      console.log(error);
    } finally {
      setScan(false);
    }
  };

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
                        items={DataSetLD}
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
                          color="#00529C"
                        />
                      </View>
                    </View>
                  </View>
                </Modal>
              </View>

              <View style={styles.mg_bot}>
                <Text style={styles.item}>Số Ticket</Text>
                <TextInput
                  editable={false}
                  placeholder="Nhập số ticket"
                  placeholderTextColor="#aaaaaa"
                  value={selectTicke}
                  // onChangeText={text => {
                  //   console.log(text);
                  // }}
                />
              </View>

              <View style={styles.mg_bot}>
                <Text style={styles.item}>Biển số xe</Text>
                <View style={{flexDirection: 'row'}}>
                  <View style={{width: '90%'}}>
                    <TextInput
                      placeholder="Nhập Biển số xe"
                      placeholderTextColor="#aaaaaa"
                      value={selectBSX}
                      // onChangeText={text => {
                      //   console.log(text);
                      // }}
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
              </View>
              <View style={styles.mg_bot}>
                <Text style={styles.item}>Tàu nhận hàng</Text>
                <TextInput
                  placeholder="Tàu Nhận hàng"
                  placeholderTextColor="#aaaaaa"
                  value={selectTau}
                  onChangeText={setSelectTau}
                />
              </View>
              <View style={styles.mg_bot}>
                <Text style={styles.item}>Khối lượng</Text>
                <TextInput
                  placeholder="Khối lượng hàng"
                  placeholderTextColor="#aaaaaa"
                  value={selectKL}
                  onChangeText={setSelectKL}
                />
              </View>
              <View style={styles.mg_bot}>
                <Text style={styles.item}>Loại Xuất Bán</Text>
                <RNPickerSelect
                  onValueChange={value => onSelc(value, 'lxb')}
                  items={DataSetLXB}
                  placeholder={{
                    label: 'Loại xuất bán',
                    value: null,
                  }}
                  style={{
                    ...pickerSelectStyles,
                    placeholder: {
                      // color: 'black',
                      fontSize: 12,
                      fontWeight: 'bold',
                      // backgroundColor: 'rgba(0,0,0,0.2)',
                    },
                  }}
                  // placeholder={'Chọn Ca'}
                />
              </View>
              <View style={styles.mg_bot}>
                <Text style={styles.item}>Vận Chuyển</Text>
                <RNPickerSelect
                  onValueChange={value => onSelc(value, 'vc')}
                  items={DataSetVC}
                  placeholder={{
                    label: 'Vận chuyển',
                    value: null,
                  }}
                  style={{
                    ...pickerSelectStyles,
                    placeholder: {
                      // color: 'black',
                      fontSize: 12,
                      fontWeight: 'bold',
                      // backgroundColor: 'rgba(0,0,0,0.2)',
                    },
                  }}
                  // placeholder={'Chọn Ca'}
                />
              </View>
              {/* <Text style={{fontSize: 12, fontStyle: 'italic', color: 'red'}}>
              *Xác nhận chuyến?
            </Text>
            <CheckBox
              disabled={false}
              value={isStatus}
              onValueChange={setStatus}
              // style={{color:'#05428C'}}
            /> */}
              <View style={styles.button}>
                <Button title="Xác Nhận" onPress={onCreate} color="#00529C" />
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
