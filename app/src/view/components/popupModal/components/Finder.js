import React from 'react';
import {Image, View} from 'react-native';
import {s} from 'react-native-size-matters';
import {SearchInput, Text} from '../../general';
import {COLORS} from '../../../../conts';
import {useNavigation} from '@react-navigation/native';

export const Finder = ({}) => {
  const navigation = useNavigation();
  const getScreen = search => {
    const searchL = search?.toLowerCase();
    if (searchL == 'electricity') {
      navigation.navigate('ElectricityScreen');
    } else if (searchL == 'data') {
      navigation.navigate('SellDataScreen');
    } else if (searchL == 'airtime') {
      navigation.navigate('SellAirtimeScreen');
    } else if (searchL == 'sms') {
      navigation.navigate('BulkSmsScreen');
    } else if (searchL == 'tv' || searchL == 'cable') {
      navigation.navigate('TvScreen');
    }
  };
  return (
    <View>
      <Text
        bold
        color={COLORS.primary}
        style={{}}
        numberOfLines={2}
        size={16}
        medium
        lineHeight={28}>
        Finder
      </Text>
      <Text medium size={14}>
        Search and find anything on the Ajebo app.
      </Text>
      <SearchInput />
      <View
        style={{justifyContent: 'center', alignItems: 'center', marginTop: 20}}>
        <Image
          style={{height: 153, width: 153}}
          source={require('../../../../assets/images/others/search.png')}
        />
      </View>
    </View>
  );
};
