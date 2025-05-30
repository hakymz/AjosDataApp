import React from 'react';
import {TouchableOpacity} from 'react-native';
import {Icons} from '../others';
export const CheckBox = ({isChecked, ...props}) => {
  return (
    <TouchableOpacity style={{}} {...props}>
      {isChecked ? <Icons.PlugActive size={32} /> : <Icons.Plug size={32} />}
    </TouchableOpacity>
  );
};
