import React from 'react';
import {Text, View, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {styles} from './Header.Styles';
import logo from '../../assets/images/Logo.png';
import CustomDrawer from '../CustomDrawer/CustomDrawer';
import {DrawerActions} from '@react-navigation/native';
// import Picker from '@react-native-picker/picker';
// import DatePicker from 'react-native-date-picker'

export default function Header() {
  return (
    <View style={styles.container}>
      <TouchableOpacity>
        <Image source={logo} style={styles.img}></Image>
      </TouchableOpacity>
      <Text style={styles.tx}>
        CÔNG TY CỔ PHẦN {'\n'}THÉP HÒA PHÁT DUNG QUẤT
      </Text>
      {/* <DatePicker
        // modal
        // open={open}
        // date={date}
        // onConfirm={(date) => {
        //   setOpen(false)
        //   setDate(date)
        // }}
        // onCancel={() => {
        //   setOpen(false)
        // }}
      /> */}
    </View>
  );
}
