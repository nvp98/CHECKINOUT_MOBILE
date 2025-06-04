import React, {useState, useEffect, memo, useCallback, useRef} from 'react';
import {
  Text,
  View,
  FlatList,
  TextInput,
  Button,
  TouchableOpacity,
  ScrollView,
  Alert,
  RefreshControl,
  ActivityIndicator,
  Modal,
  SafeAreaView,
} from 'react-native';
import {styles} from './History.styles';
import {useSelector} from 'react-redux';
import {getDiaryINOUT} from '../../Api';
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/Ionicons';
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

export const History = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [listHis, setListHis] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectData, setSelectData] = useState({});

  const [show, setShow] = useState(false);
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');

  const onChange = async (event, selectedDate) => {
    setShow(false);

    const currentDate = selectedDate || date;
    // setShow(Platform.OS === 'ios');
    if (mode == 'date') setDate(currentDate);
    // else setTime(currentDate);
    // console.log(currentDate, 'curen');
    var params = {
      ngay: moment(currentDate).format('YYYY-MM-DD'),
      IDCa: dataUser?.IDCa,
      IDVT: dataUser?.IDVT,
      // isOUT: 0,
    };
    const response = await getDiaryINOUT(params);
    if (response) setListHis(response?.data.items);
  };

  const showDatepicker = mode => {
    setShow(true);
    setMode(mode);
  };

  const {dataUser} = useSelector(state => state.userReducer);

  useEffect(() => {
    // console.log(dataUser, 'his use effect');
    initData();
  }, [dataUser]);

  const initData = async () => {
    try {
      // console.log('history');
      var params = {
        ngay: dataUser?.DateIN,
        IDCa: dataUser?.IDCa,
        IDVT: dataUser?.IDVT,
        // isOUT: 0,
      };
      // console.log(params, dataUser, 'par');
      const response = await getDiaryINOUT(params);
      if (response) setListHis(response?.data.items);
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
    <>
      <View style={{flexDirection: 'row', marginTop: 5}}>
        <Text
          style={{
            fontWeight: 'bold',
            justifyContent: 'center',
            alignSelf: 'center',
            color: 'red',
          }}>
          Ngày:{' '}
        </Text>
        <Icon
          name="calendar-outline"
          size={30}
          style={{margin: 2}}
          onPress={() => showDatepicker('date')}
        />
        <Text
          style={{
            marginLeft: 5,
            marginRight: 10,
            textAlignVertical: 'center',
            color: '#000',
            fontSize: 14,
            fontWeight: 'bold',
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
      <View style={[styles.container, {minHeight: 40}]}>
        <View style={[styles.item, {maxWidth: 40}]}>
          <Text style={[styles.tx]}>STT</Text>
        </View>
        <View style={[styles.item]}>
          <Text style={[styles.tx]}>Ticket</Text>
        </View>
        <View style={[styles.item]}>
          <Text style={[styles.tx]}>IN-OUT</Text>
        </View>
        <View style={[styles.item, {maxWidth: 50}]}>
          <Text style={[styles.tx]}>Status</Text>
        </View>
        <View style={[styles.item]}>
          <Text style={[styles.tx]}>Tàu</Text>
        </View>
      </View>
      {/* <SafeAreaView>
        <FlatList
          data={DATA}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          extraData={selectedId}
        />
      </SafeAreaView> */}
      <ScrollView
        keyboardShouldPersistTaps="always"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {listHis.map((item, key) => {
          return (
            <TouchableOpacity
              onPress={() => {
                setSelectData(item), setModalVisible(true);
              }}
              style={[styles.item]}
              key={key}>
              <View style={[styles.container, {marginTop: 0}]}>
                <View style={[styles.itemChil, {maxWidth: 40}]}>
                  <Text style={[styles.tx]}>{key + 1}</Text>
                </View>
                <View style={[styles.itemChil]}>
                  <Text style={[styles.tx]}>{item.titkeNum}</Text>
                </View>
                <View style={[styles.itemChil]}>
                  <Text style={[styles.tx]}>
                    {moment(item.gioVao).format('HH:mm')} {'-'}{' '}
                    {moment(item.gioRa).format('HH:mm')}
                  </Text>
                </View>
                <View style={[styles.itemChil, {maxWidth: 50}]}>
                  <Text style={[styles.tx]}>{item.isOUT}</Text>
                </View>
                <View style={[styles.itemChil]}>
                  <Text style={[styles.tx]}>{item.idTau}</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
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
              <Text
                style={[
                  styles.modalText,
                  {fontSize: 18, fontWeight: 'bold', marginBottom: 10},
                ]}>
                THÔNG TIN CHI TIẾT
              </Text>
              <View style={[styles.modelIte]}>
                <View style={{flex: 4}}>
                  <Text style={{fontWeight: '800', fontSize: 13}}>
                    Số Ticket:
                  </Text>
                </View>
                <View style={{flex: 6}}>
                  <Text>{selectData?.titkeNum}</Text>
                </View>
              </View>
              <View style={styles.modelIte}>
                <View style={{flex: 4}}>
                  <Text style={{fontWeight: '800', fontSize: 13}}>
                    Biển Số Xe:
                  </Text>
                </View>
                <View style={{flex: 6}}>
                  <Text>{selectData?.bienSoXe}</Text>
                </View>
              </View>
              <View style={styles.modelIte}>
                <View style={{flex: 4}}>
                  <Text style={{fontWeight: '800', fontSize: 13}}>
                    Tàu Nhận:
                  </Text>
                </View>
                <View style={{flex: 6}}>
                  <Text>{selectData?.tauNhan}</Text>
                </View>
              </View>
              <View style={styles.modelIte}>
                <View style={{flex: 4}}>
                  <Text style={{fontWeight: '800', fontSize: 13}}>
                    Giờ Vào:
                  </Text>
                </View>
                <View style={{flex: 6}}>
                  <Text>
                    {moment(selectData?.gioVao).format('DD/MM/YYYY HH:mm')}
                  </Text>
                </View>
              </View>
              <View style={styles.modelIte}>
                <View style={{flex: 4}}>
                  <Text style={{fontWeight: '800', fontSize: 13}}>Giờ Ra:</Text>
                </View>
                <View style={{flex: 6}}>
                  <Text>
                    {moment(selectData?.gioRa).format('DD/MM/YYYY HH:mm')}
                  </Text>
                </View>
              </View>
              <View style={styles.modelIte}>
                <View style={{flex: 4}}>
                  <Text style={{fontWeight: '800', fontSize: 13}}>
                    Định mức (phút):
                  </Text>
                </View>
                <View style={{flex: 6}}>
                  <Text>
                    {selectData?.tG_KH}
                    {' phút'}
                  </Text>
                </View>
              </View>
              <View style={styles.modelIte}>
                <View style={{flex: 4}}>
                  <Text style={{fontWeight: '800', fontSize: 13}}>
                    TG Làm hàng:
                  </Text>
                </View>
                <View style={{flex: 6}}>
                  <Text>
                    {selectData?.tG_LH}
                    {' phút'}
                  </Text>
                </View>
              </View>
              <View style={styles.modelIte}>
                <View style={{flex: 4}}>
                  <Text style={{fontWeight: '800', fontSize: 13}}>Lý do:</Text>
                </View>
                <View style={{flex: 6}}>
                  <Text>{selectData?.note}</Text>
                </View>
              </View>
              <View style={styles.modelIte}>
                <View style={{flex: 4}}>
                  <Text style={{fontWeight: '800', fontSize: 13}}>
                    Chuyến Tàu:
                  </Text>
                </View>
                <View style={{flex: 6}}>
                  <Text>{selectData?.idTau}</Text>
                </View>
              </View>
              <View style={styles.modelIte}>
                <View style={{flex: 4}}>
                  <Text style={{fontWeight: '800', fontSize: 13}}>
                    Tình trạng:
                  </Text>
                </View>
                <View style={{flex: 6}}>
                  <Text>{selectData?.isOUT}</Text>
                </View>
              </View>

              <View
                style={{display: 'flex', flexDirection: 'row', marginTop: 10}}>
                <View style={{width: 150}}>
                  <Button
                    title="Đóng"
                    onPress={() => setModalVisible(!modalVisible)}
                    color="red"
                  />
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </>
  );
};
