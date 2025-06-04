import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
    // marginTop: 10,
    maxHeight: 40,
    flexDirection: 'row',
    marginTop: 5,
  },
  img: {
    width: 100,
    height: 30,
    resizeMode: 'stretch',
    // marginTop: -20,
  },
  tx: {
    // marginTop: 0,
    // fontSize: 10,
    // color: '#05428C',
    color: 'white',
    fontWeight: 'bold',
    // marginLeft: 10,
    textAlign: 'center',
  },
  item: {
    flex: 1,
    height: 40,
    justifyContent: 'center',
    backgroundColor: '#23577C',
    borderRightColor: 'white',
    borderRightWidth: 1,
    // fontSize: 12,
  },
  itemChil: {
    flex: 1,
    height: 40,
    justifyContent: 'center',
    backgroundColor: 'gray',
    borderColor: 'white',
    borderWidth: 1,
    // fontSize: 12,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    // maxHeight: 100,
  },
  modalView: {
    margin: 20,
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
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
  modelIte: {
    width: '100%',
    flexDirection: 'row',
    marginBottom: 5,
  },
  //   modelLeft:{
  //     flex:3
  //   }
});
