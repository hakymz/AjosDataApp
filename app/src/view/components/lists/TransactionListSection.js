import moment from 'moment';
import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {s} from 'react-native-size-matters';
import {COLORS} from '../../../conts';
import {Text} from '../general/text';
import Line from '../general/others/Line';

const List = ({item, onPress = () => {}, icon, iconConStyle}) => {
  return (
    <TouchableOpacity
      onPress={() => {
        onPress(item);
      }}
      style={{paddingHorizontal: 20, flexDirection: 'row'}}>
      <View
        style={{
          height: s(34),
          width: s(34),
          backgroundColor: COLORS.yellow,
          borderRadius: 100,
          justifyContent: 'center',
          alignItems: 'center',
          ...iconConStyle,
        }}>
        {icon || item?.icon}
      </View>
      <View style={{paddingHorizontal: 10, flex: 1}}>
        <Text semiBold size={13} numberOfLines={1}>
          {item?.title}
        </Text>
        {item?.des && (
          <Text size={12} numberOfLines={1}>
            {item?.des}
          </Text>
        )}

        <Text color={'#939393'} semiBold size={12} numberOfLines={1}>
          {moment(item?.date).format('h:mm:ssa')}
        </Text>
      </View>
      {item?.right && <View>{item?.right}</View>}
    </TouchableOpacity>
  );
};
export const TransactionListSection = ({item, onPress, ...props}) => {
  let date = moment(item[0]?.date).format('MMM DD, YYYY');
  if (moment(item[0]?.date).calendar().includes('Today')) {
    date = 'Today';
  }

  if (moment(item[0]?.date).calendar().includes('Yesterday')) {
    date = 'Yesterday';
  }
  return (
    <View
      style={{
        borderRadius: 20,
        ...styles.con,
      }}>
      <Text
        size={12}
        color={'#868686'}
        style={{paddingHorizontal: 20, marginBottom: 10}}>
        {date}
      </Text>
      {item?.map((data, index) => (
        <View key={'list' + index}>
          <List item={data} {...props} onPress={() => onPress(data)} />
          {index < item?.length - 1 && (
            <Line style={{backgroundColor: '#F1F1F1', marginVertical: 20}} />
          )}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  con: {
    backgroundColor: COLORS.background,
    paddingVertical: 20,
    marginBottom: 10,
  },
});
