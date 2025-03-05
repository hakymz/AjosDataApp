import React from 'react';
import {COLORS} from '../../../../conts';
import {View} from 'react-native';
import {MyIcons} from './MyIcons';
export const StatusComponent = ({status}) => {
  let color = '#8F8F8F';
  if (status == 'successful' || status == 'processed') {
    color = COLORS.primary;
  }
  if (status == 'failed' || status == 'declined') {
    color = '#FF0000';
  }
  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
      }}>
      <View
        style={{
          height: 16,
          width: 16,
          backgroundColor: color,
          borderRadius: 16,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {(status == 'failed' || status == 'declined') && (
          <MyIcons.CancelWhite size={8} />
        )}
        {(status == 'successful' || status == 'processed') && (
          <MyIcons.Check size={8} />
        )}
      </View>
      <View
        style={{
          width: 86,
          backgroundColor: '#E1E1E1',
          height: 5,
          borderRadius: 20,
          marginLeft: 5,
          overflow: 'hidden',
        }}>
        <View
          style={{
            backgroundColor: color,
            borderRadius: 20,
            height: '100%',
            width: status == 'pending' ? '70%' : '100%',
          }}
        />
      </View>
    </View>
  );
};
