import React from 'react';
import {View, Image} from 'react-native';
import {BottomSheets, Button, Text} from '../../general';
import {useNavigation} from '@react-navigation/native';
import {PageList} from '../../lists';

export const NoAccountNumber = ({data}) => {
  const navigation = useNavigation();
  console.log(data);

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
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Image
          style={{height: 153, width: 153}}
          source={require('../../../../assets/images/others/noAccount.png')}
        />
      </View>

      <Text
        size={14}
        medium
        style={{marginTop: 20, paddingHorizontal: 20, marginBottom: 30}}
        textAlign={'center'}>
        You currently don’t have an {data?.bankName} account, dive... below to
        generate one.
      </Text>
      <View style={{paddingHorizontal: 20}}>
        <Button
          onPress={() => {
            BottomSheets.hide();
            navigation.navigate('ProfileDetailsScreen');
          }}
          title={'Generate Account'}
        />
      </View>
    </View>
  );
};
