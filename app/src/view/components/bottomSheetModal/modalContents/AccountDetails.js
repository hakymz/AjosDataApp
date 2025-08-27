import React from 'react';
import {View, Image} from 'react-native';
import {BottomSheets, Button, Icons, Text} from '../../general';
import {useNavigation} from '@react-navigation/native';
import {PageList} from '../../lists';
import {Copy} from '../../../../helper';

const List = ({name}) => {
  return (
    <View
      style={{
        height: 40,
        borderBottomWidth: 1,
        borderBottomColor: '#F5F5F5',
        marginBottom: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}>
      <Text numberOfLines={1} style={{flex: 1, marginRight: 10}} size={16} bold>
        {name}
      </Text>
      <Icons.Copy
        onPress={() => {
          Copy(name);
        }}
        size={20}
      />
    </View>
  );
};
export const AccountDetails = ({data}) => {
  const navigation = useNavigation();

  return (
    <View>
      <View style={{paddingHorizontal: 20}}>
        <Text textAlign={'center'} size={22} bold>
          {data?.bankName}
        </Text>

        <PageList
          style={{height: 56, marginTop: 20}}
          children={
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                flex: 1,
              }}>
              {data?.image}
              <Text medium size={16}>
                {data?.name}
              </Text>
            </View>
          }
          rightIcon={<></>}
        />
      </View>

      <View
        style={{
          marginTop: 20,
          paddingHorizontal: 20,
          marginBottom: 20,
        }}>
        <List name={data?.accountName} />
        <List name={data?.accountNumber} />
        <List name={data?.bankName} />
      </View>
    </View>
  );
};
