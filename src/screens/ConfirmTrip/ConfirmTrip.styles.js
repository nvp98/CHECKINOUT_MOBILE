import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    // width: 100,
    justifyContent: 'center',
    // padding: 0,
    // backgroundColor: 'green',
    flex: 1,
    // margin: 5,
  },
  info: {
    height: 50,
    fontSize: 12,
    flex: 2,
    // backgroundColor: 'blue',
    fontWeight: 'bold',
    color: '#23577C',
    // margin: 5,
    textAlignVertical: 'center',
    flexDirection: 'row',
  },
  tag: {
    display: 'flex',
    flexDirection: 'row',
    height: 50,
    // backgroundColor: '#fff',
    marginBottom: 5,
    // borderRadius: 10,
    // borderStyle:'solid 5px #000',
    borderWidth: 1,
    borderColor: '#23577C',
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 9,
    // },
    // shadowOpacity: 0.48,
    // shadowRadius: 11.95,

    // elevation: 18,
  },
  item: {
    color: '#05418a',
    fontWeight: 'bold',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    width: '90%',
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
  // button: {
  //   borderRadius: 20,
  //   padding: 10,
  //   elevation: 1,
  // },
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
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
  },
});
