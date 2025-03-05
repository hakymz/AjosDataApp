import React from 'react';
import {StyleSheet, View} from 'react-native';
import {s} from 'react-native-size-matters';
import {GENERAL} from '../../../../conts';
import {Text} from '../text';
export const FeeContainer = ({style, fee}) => {
  return (
    <View
      style={{
        alignItems: 'flex-start',
        width: '100%',
      }}>
      <View style={{...styles.con, ...style}}>
        <Text
          style={{color: '#9C9C9C', alignContent: 'center'}}
          numberOfLines={1}
          color={'#9C9C9C'}
          size={12}
          semiBold>
          {!fee ? 'No' : fee} = Fee
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  con: {
    height: s(24),
    backgroundColor: '#F1F1F1',
    borderRadius: 20,
    marginBottom: 10,
    paddingHorizontal: 15,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
