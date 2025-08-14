import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {
  BottomSheets,
  Button,
  CircleButton,
  CloseButton,
  Text,
} from '../../general';
import {AVATAR} from '../../../../conts';
export const DeleteCustomer = ({item, deleteCustomers}) => {
  return (
    <View>
      <Text bold size={22} textAlign={'center'}>
        Delete Customer
      </Text>

      <View
        style={{
          marginTop: 20,
        }}>
        <View
          style={{
            ...styles.list,
          }}>
          <Image
            style={{height: 50, width: 50, borderRadius: 100, marginRight: 10}}
            source={AVATAR.avatar}
          />
          <View style={{flex: 1}}>
            <Text size={14} fontWeight={'700'} color={'#231F20'}>
              {item?.fullname}
            </Text>
            <Text
              style={{marginTop: 3}}
              size={12}
              fontWeight={800}
              color={'#231F20'}>
              {item?.phone_number}
            </Text>
          </View>
        </View>
        <View style={{marginHorizontal: 20, marginBottom: 20}}>
          <Text size={12} color={'#7F8192'} style={{}}>
            Are you sure? You will need to create a new account to add this
            customer in the future.
          </Text>
          <Button
            onPress={deleteCustomers}
            title={'Yes, Delete customer'}
            style={{marginTop: 50}}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  list: {
    height: 70,
    marginBottom: 10,
    borderRadius: 8,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#F5F5F5',
  },
});
