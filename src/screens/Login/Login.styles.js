import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  BgContainer: {
    flex: 1,
    width: null,
    height: null,
    justifyContent: 'center',
    alignItems: 'center',
  },
  LogoContainer: {
    // height: 100,
    alignItems: 'center',
    marginTop: 0,
    // position:'absolute',
    top: 0,
  },
  logo: {
    width: 200,
    height: 60,
  },
  inputsContainer: {
    marginTop: 10,
  },
  inputs: {
    width: 300,
    height: 45,
    borderRadius: 25,
    fontSize: 16,
    paddingLeft: 45,
    backgroundColor: 'rgba(0,0,0,0.2)',
    color: '#011027',
    fontWeight: 'bold',
    marginHorizontal: 25,
  },
  inputsIcon: {
    position: 'absolute',
    top: 8,
    left: 40,
  },
  eyeBtn: {
    position: 'absolute',
    top: 8,
    right: 40,
  },
  BtnLogin: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: 200,
    height: 45,
    borderRadius: 25,
    justifyContent: 'center',
    marginTop: 20,
    // backgroundColor: '#23577C',
  },
  BtnText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#73D3F9',
    textAlign: 'center',
  },

  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    width: 300,
  },
  modalView: {
    margin: 20,
    width: 300,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
export const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'red',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});
