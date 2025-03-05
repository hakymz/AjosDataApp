import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {View} from 'react-native';
import {COLORS} from '../../../../conts';
import {BottomSheets, Button, MyIcons, Text} from '../../general';
export const CreateDollarCard = () => {
  const navigation = useNavigation();
  return (
    <View style={{paddingHorizontal: 30, marginBottom: 30}}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 30,
        }}>
        <Text bold color={COLORS.primary} lineHeight={25} size={20}>
          Create New Card
        </Text>
        <MyIcons.DollarCardGreen size={23} />
      </View>
      <Text color={'#666766'} lineHeight={17}>
        To create a Virtual Dollar card you must have a minimum of{' '}
        <Text color={'#666766'} bold>
          $7
        </Text>{' '}
        in your Dollar account.
        {'\n\n'}A fee of{' '}
        <Text color={'#666766'} bold>
          $2
        </Text>{' '}
        will be required.
      </Text>
      <View style={{paddingHorizontal: 15, marginTop: 40}}>
        <Button
          type="black"
          title={'Create Card'}
          onPress={() => {
            BottomSheets.hide();
            navigation.navigate('DollarCardScreen');
          }}
        />
      </View>
    </View>
  );
};
