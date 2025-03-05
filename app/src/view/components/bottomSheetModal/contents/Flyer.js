import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import {BottomSheets, Button, Icons, Text} from '../../general';
import {COLORS} from '../../../../conts';
import {TabsIcons} from '../../general/others/TabsIcons';
import {useNavigation} from '@react-navigation/native';
import {openLink} from '../../../../helper';

const List = ({title, icon, onPress}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        height: 54,
        backgroundColor: '#F8F8F8',
        paddingHorizontal: 20,
        marginBottom: 10,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
      <Text size={16} md color={COLORS.blue}>
        {title}
      </Text>
      {icon}
    </TouchableOpacity>
  );
};

export const Flyer = ({}) => {
  const navigation = useNavigation();
  return (
    <View style={{paddingHorizontal: 24}}>
      <Text textAlign={'right'} size={18} fontWeight={800}>
        Get a Flyer
      </Text>

      <View style={{marginTop: 30, marginBottom: 25, paddingHorizontal: 20}}>
        <Text color={'#828282'} size={12} bk>
          You can click the button below to design your own flyer with your own
          rates and prices to share with your customers.
        </Text>
      </View>

      <View>
        <List
          onPress={() => {
            // navigation.navigate('NewFlyersScreen');

            openLink('https://app.dataresell.com');
            BottomSheets.hide();
          }}
          title={'Design Flyer'}
          icon={<TabsIcons.FlayerActive size={22} />}
        />
        <List
          onPress={() => {
            openLink('https://app.dataresell.com');
            BottomSheets.hide();
          }}
          title={'View saved flyers'}
          icon={<Icons.Galary size={22} />}
        />
      </View>
      <View style={{flexDirection: 'row', marginTop: 20}}>
        <Button
          onPress={() => {
            BottomSheets.hide();
            navigation.navigate('HomeScreen');
          }}
          textColor={COLORS.white}
          type="lightGrey"
          style={{
            paddingHorizontal: 10,
            backgroundColor: '#848484',
          }}
          fontSize={14}
          title={'Cancel'}
        />
      </View>
    </View>
  );
};
