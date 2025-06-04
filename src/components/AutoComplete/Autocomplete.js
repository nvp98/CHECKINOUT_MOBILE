import React, {memo, useState} from 'react';
import {Text, View} from 'react-native';
import {AutocompleteDropdown} from 'react-native-autocomplete-dropdown';

export const Autocomplete = memo(props => {
  const {dataSet, initValue, AutoKey} = props;
  const selecI = item => {
    props.parentCallback(item, AutoKey);
  };
  return (
    <View>
      <AutocompleteDropdown
        clearOnFocus={false}
        // closeOnBlur={true}
        selectedItem={true}
        initialValue={initValue} // or just '2'
        onSelectItem={selecI}
        dataSet={dataSet}
      />
    </View>
  );
});
