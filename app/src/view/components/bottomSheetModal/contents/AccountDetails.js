import React from 'react';
import {Image, View} from 'react-native';
import {Button, Icons, Text} from '../../general';
import LottieView from 'lottie-react-native';
import {PageList} from '../../lists';
import {COLORS, IMAGES} from '../../../../conts';
import {Copy} from '../../../../helper';

const List = ({name, details}) => {
  return (
    <View>
      <Text
        fontWeight={'500'}
        size={14}
        style={{marginBottom: 10, paddingHorizontal: 10}}>
        {name}
      </Text>
      <PageList onPress={() => {}}>
        <Text
          style={{flex: 1}}
          numberOfLines={1}
          size={16}
          fontWeight={'500'}
          color={COLORS.blue}>
          {details}
        </Text>
        <View
          style={{
            height: 36,
            width: 36,
            borderWidth: 1,
            borderColor: '#EAECF0',
            borderRadius: 12,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Icons.Copy
            onPress={() => {
              Copy(details);
            }}
            size={15}
          />
        </View>
      </PageList>
    </View>
  );
};
export const AccountDetails = ({details}) => {
  return (
    <View style={{paddingHorizontal: 24}}>
      <Text textAlign={'right'} size={18} fontWeight={800}>
        Top-up Wallet
      </Text>

      <View style={{marginTop: 30, flexDirection: 'row', alignItems: 'center'}}>
        <Image style={{height: 50, width: 50}} source={details?.image} />
        <Text
          color={COLORS.blue}
          size={25}
          fontWeight={'500'}
          style={{paddingLeft: 10}}>
          {details?.name}
        </Text>
      </View>

      <View style={{flex: 1, marginTop: 30}}>
        <List name={'Account Name'} details={details?.accountName} />
        <List name={'Bank Name'} details={details?.bankName} />
        <List name={'Account Number'} details={details?.accountNumber} />
      </View>

      <View style={{paddingTop: 20, paddingHorizontal: 10}}>
        {details?.name == 'Opay' ? (
          <Text lineHeight={16} color={'#828282'} size={12} fontWeight={'400'}>
            Do NOT save this account number, it changes periodically. Kindly
            transfer exact amount inputted in previous page to avoid loss of
            funds.
          </Text>
        ) : (
          <Text lineHeight={16} color={'#828282'} size={12} fontWeight={'400'}>
            This is your personal fixed account details, you can save this for
            future deposits.
          </Text>
        )}
      </View>
    </View>
  );
};
