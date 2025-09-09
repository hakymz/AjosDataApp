import React from 'react';
import {View, Image} from 'react-native';
import {BottomSheets, Button, Icons, Text} from '../../general';
import {useNavigation} from '@react-navigation/native';
import {PageList} from '../../lists';
import {Copy} from '../../../../helper';

const List = ({details, name}) => {
  return (
    <View
      style={{
        height: 40,

        marginBottom: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}>
      <View>
        <Text size={12} color={'#848A94'}>
          {name}
        </Text>
        <Text
          numberOfLines={1}
          style={{flex: 1, marginRight: 10}}
          size={14}
          bold>
          {details}
        </Text>
      </View>

      <Icons.Copy
        onPress={() => {
          Copy(details);
        }}
        size={20}
      />
    </View>
  );
};
export const DollarCardDetails = ({card}) => {
  let cardDetails =
    typeof card?.body == 'string' ? JSON.parse(card?.body) : card?.body?.card;

  const navigation = useNavigation();

  return (
    <View>
      <View style={{paddingHorizontal: 20}}>
        <Text bold size={22} textAlign={'center'}>
          Card Details
        </Text>
        <Text
          style={{paddingHorizontal: 20}}
          color={'#868D95'}
          size={14}
          textAlign={'center'}>
          Copy any of the details below to use this card
        </Text>
      </View>

      <View
        style={{
          marginTop: 20,
          paddingHorizontal: 20,
          marginBottom: 0,
        }}>
        <List details={cardDetails?.card?.name} name={'Card Name'} />
        <List details={cardDetails?.card?.number} name={'Card Number'} />
        <List details={cardDetails?.card?.ccv} name={'CVV'} />
        <List details={cardDetails?.card?.expiry} name={'Expiry Date'} />
        <List
          details={`${cardDetails?.card?.billing?.city} ${cardDetails?.card?.billing?.state}, ${cardDetails?.card?.billing?.country}`}
          name={'Expiry Date'}
        />
        <List
          details={cardDetails?.card?.billing?.postal_code}
          name={'ZipCode'}
        />
      </View>
    </View>
  );
};
