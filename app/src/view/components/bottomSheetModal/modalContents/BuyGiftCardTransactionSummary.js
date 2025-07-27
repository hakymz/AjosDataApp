import React from 'react';
import {View} from 'react-native';
import {BottomSheets, Button, Text} from '../../general';
import {COLORS, GENERAL} from '../../../../conts';
import {Image} from '../../general/image';
import Line from '../../general/others/Line';
import {formatAmount} from '../../../../helper';

const List = ({name, details}) => {
  return (
    <View
      style={{
        height: 62,
        marginHorizontal: 20,
        justifyContent: 'flex-end',
        flex: 1,
        borderBottomWidth: 1,
        borderBottomColor: '#F5F5F5',
        paddingBottom: 10,
      }}>
      <Text size={16} bold>
        {details}
      </Text>
      <Text size={11} color={'#979797'}>
        {name}
      </Text>
    </View>
  );
};
export const BuyGiftCardTransactionSummary = ({data, proceed}) => {
  return (
    <View>
      <Text size={22} bold color={COLORS.darkBlue} textAlign={'center'}>
        Summary
      </Text>
      <View style={{paddingHorizontal: 20, marginTop: 20}}>
        <View
          style={{
            height: 56,
            backgroundColor: '#E9E6F7',
            borderRadius: 12,
            paddingHorizontal: 15,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 10,
          }}>
          <View
            style={{
              height: 40,
              width: 40,
              backgroundColor: COLORS.white,
              borderRadius: 40,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              style={{height: 30, width: 30}}
              source={{uri: data?.giftData?.logoUrls?.[0]}}
            />
          </View>
          <Text size={16} color={COLORS.darkBlue}>
            Gift Card
          </Text>
        </View>
      </View>
      <List
        name={'Card Units'}
        details={data?.amount?.value?.total || data?.amount}
      />
      <List details={`${data?.quantity} - Units`} name={'Quantity'} />
      <List details={`${formatAmount(data?.total)}`} name={'Amount'} />

      <View
        style={{
          height: 180,
          paddingHorizontal: 20,
          justifyContent: 'flex-end',
        }}>
        <Text style={{marginBottom: 15}} bold textAlign={'center'} size={20}>
          Total - {GENERAL.nairaSign}
          {formatAmount(data?.total)}
        </Text>
        <Button
          onPress={() => {
            BottomSheets.hide();
            proceed();
          }}
          title={'Make Payment'}
        />
      </View>
    </View>
  );
};
