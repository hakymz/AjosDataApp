import React from 'react';
import {StyleSheet, View} from 'react-native';
import {s} from 'react-native-size-matters';

import {COLORS} from '../../../../conts';
import {BottomSheets, Button, Text} from '../../general';

export const CardProccessing = ({}) => {
  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 20,
          paddingHorizontal: 30,
        }}>
        <Text
          style={{flex: 1}}
          bold
          textAlign={'center'}
          color={COLORS.primary}
          lineHeight={25}
          size={20}>
          View Gift Code(s)
        </Text>
      </View>
      <View style={{paddingHorizontal: 20}}>
        <Text style={{marginTop: 10}} size={14} semiBold textAlign={'center'}>
          We are generating your Gift-codes!
        </Text>
        <Text
          style={{marginTop: 20, paddingHorizontal: 10}}
          size={12}
          textAlign={'center'}>
          We will notify you in a few minutes when the code(s) is ready, just
          hang tight?
        </Text>
        <View style={{paddingHorizontal: 20}}>
          <Button
            onPress={() => {
              BottomSheets.hide();
            }}
            style={{marginTop: 40}}
            title={'Close'}
            type="black"
          />
        </View>
      </View>
    </View>
  );
};

const style = StyleSheet.create({
  search: {
    height: s(55),
    backgroundColor: '#F8F8F8',
    borderRadius: 30,
    flexDirection: 'row',
    paddingHorizontal: 30,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 30,
    marginTop: 20,
  },
});
