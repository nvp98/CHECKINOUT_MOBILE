import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
    // marginTop: 10,
    maxHeight: 40,
    display: 'flex',
    flexDirection: 'row',
  },
  img: {
    width: 100,
    height: 30,
    resizeMode: 'stretch',
    // marginTop: -20,
  },
  tx: {
    marginTop: 0,
    fontSize: 10,
    color: '#05428C',
    fontWeight: 'bold',
    // marginLeft: 10,
    textAlign: 'center',
  },
});
