import React from 'react';
import {View} from 'react-native';
import {s} from 'react-native-size-matters';
import {AVATAR, FONTS, COLORS} from '../../../conts';
import LottieView from 'lottie-react-native';
import {Text} from '../general';
import {useUser} from '../../../hooks';
import {Image} from '../general/image';

export const HeaderImage = () => {
  const {data, getUserImage} = useUser();

  return (
    <View style={{alignItems: 'center', marginTop: 10}}>
      <Image
        source={getUserImage()}
        style={{
          width: 170,
          height: 170,
          resizeMode: 'contain',
          borderRadius: 100,
        }}
      />
      <Text style={{marginTop: 30}} color={COLORS.black}>
        Welcome back
      </Text>
      <Text color={COLORS.primary} size={25} semiBold style={{paddingTop: 20}}>
        {data?.user?.userTag || 'Chief'}
      </Text>
    </View>
  );
};
