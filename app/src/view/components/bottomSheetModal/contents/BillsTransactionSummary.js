import React from 'react';
import {View} from 'react-native';
import {BottomSheets, Button, Text} from '../../general';
import {COLORS, GENERAL} from '../../../../conts';
import {formatAmount} from '../../../../helper';
import {Image} from '../../general/image';
import {useNavigation} from '@react-navigation/native';

const List = ({title, details}) => {
  return (
    <View
      style={{
        height: 54,
        borderRadius: 8,
        backgroundColor: '#F8F8F8',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        justifyContent: 'space-between',
        marginBottom: 7,
      }}>
      <Text
        numberOfLines={1}
        style={{paddingRight: 10, maxWidth: 200}}
        fontWeight={'500'}
        size={13}
        color={'#979797'}>
        {title}
      </Text>
      <Text
        textAlign={'right'}
        numberOfLines={1}
        size={16}
        color={COLORS.blue}
        fontWeight={'500'}
        style={{flex: 1}}>
        {details}
      </Text>
    </View>
  );
};

const Cashback = () => {
  return (
    <View style={{height: 32, marginTop: 10, flexDirection: 'row'}}>
      <View
        style={{
          backgroundColor: '#F8F8F8',
          flex: 1,
          borderRadius: 6,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 10,
        }}>
        <Text fontWeight="700" size={15} color={COLORS.primary}>
          {GENERAL.nairaSign}1,349.35
        </Text>
        <Text
          numberOfLines={1}
          style={{flex: 1}}
          color={COLORS.primary}
          fontWeight={'500'}
          size={10}>
          {' '}
          - Cashback Balance
        </Text>
      </View>
      <View
        style={{
          width: 121,
          borderWidth: 1,
          borderColor: '#7F8192',
          borderRadius: 6,
          marginLeft: 10,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text size={13} fontWeight={'800'} color={'#7F8192'}>
          Use Cashback
        </Text>
      </View>
    </View>
  );
};
export const BillsTransactionSummary = ({
  data = [{}],
  image,
  proceed,
  btnTitle = 'Data',
  title,
  serviceName,
  amount,
}) => {
  const navigation = useNavigation();
  return (
    <View style={{paddingHorizontal: 24, flex: 1}}>
      <Text textAlign={'right'} size={18} fontWeight={800}>
        {title}
      </Text>

      <View style={{marginTop: 20, marginBottom: 30, paddingHorizontal: 20}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 30,
          }}>
          <Image
            style={{height: 47, width: 47}}
            source={typeof image == 'number' ? image : {uri: image}}
          />
          <Text
            numberOfLines={1}
            style={{marginLeft: 10, flex: 1}}
            fontWeight={'500'}
            size={25}
            color={COLORS.blue}>
            {serviceName}
          </Text>
        </View>
        <Text color={COLORS.dark} size={14} fontWeight={'500'}>
          Here is a summary of your purchase, please look through carefully.
        </Text>
      </View>

      <View>
        {data?.map(
          item =>
            item?.title && (
              <List title={item?.title} details={`${item?.details}`} />
            ),
        )}
      </View>
      <View style={{flex: 1, paddingBottom: 20}}>
        <View
          style={{
            height: 54,
            flex: 0,
            backgroundColor: '#EFF1FB',
            marginTop: 17,
            borderRadius: 8,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 20,
            justifyContent: 'space-between',
          }}>
          <Text fontWeight={'500'} size={13} color={COLORS.blue}>
            New Total
          </Text>
          <Text color={COLORS.blue} size={20} fontWeight={'500'}>
            {GENERAL.nairaSign}
            {formatAmount(amount)}
          </Text>
        </View>
        <View style={{flexDirection: 'row', marginTop: 20}}>
          <Button
            type="lightGrey"
            style={{
              width: 122,
              paddingHorizontal: 10,
            }}
            fontSize={14}
            title={'Cancel'}
          />
          <View style={{width: 10}} />
          <Button
            onPress={() => {
              BottomSheets.hide();
              navigation.navigate('PinScreen', {
                proceed: pin => {
                  proceed(pin);
                },
              });
            }}
            style={{flex: 1, paddingHorizontal: 10}}
            fontSize={14}
            title={`${btnTitle}`}
          />
        </View>
      </View>
    </View>
  );
};
