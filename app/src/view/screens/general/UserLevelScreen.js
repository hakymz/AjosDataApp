import React from 'react';
import {View, Image} from 'react-native';

import {s} from 'react-native-size-matters';
import {AVATAR, COLORS} from '../../../conts';
import {
  Button,
  CircleButton,
  CustomSafeAreaView,
  Icons,
  Input,
  Text,
} from '../../components/general';

export const UserLevelScreen = ({navigation, route}) => {
  return (
    <CustomSafeAreaView style={{flex: 1}}>
      <View style={{paddingHorizontal: 20, marginTop: 20}}>
        <CircleButton onPress={() => navigation.goBack()} />
      </View>
      <View
        style={{
          height: s(55),
          backgroundColor: '#FAFAFA',
          marginTop: 20,
          marginHorizontal: 40,
          borderRadius: 50,
          paddingHorizontal: 20,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Text color={COLORS.voodoo} size={14} medium>
          User Level
        </Text>
        <Icons.Girl size={35} />
      </View>

      <View
        style={{
          paddingHorizontal: 30,
          marginTop: 20,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <Image
          source={AVATAR.boy1}
          style={{height: s(68), width: s(68), resizeMode: 'contain'}}
        />
        <Text
          lineHeight={14}
          color={COLORS.primary}
          size={12}
          style={{flex: 1, marginLeft: 10}}>
          This feature is coming soon!
        </Text>
      </View>
    </CustomSafeAreaView>
  );
};
