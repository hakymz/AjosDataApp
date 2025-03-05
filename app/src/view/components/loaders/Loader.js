import React from 'react';
import {SafeAreaView, View} from 'react-native';
import {COLORS} from '../../../conts';
import {useSelector} from 'react-redux';
import {updatePreloader} from '../../../redux/slices/modals/loaderSlice';
import store from '../../../redux/store';
import LottieView from 'lottie-react-native';
import {s} from 'react-native-size-matters';
import {CircleButton, Text} from '../general';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

export const Loader = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  return (
    <View style={{flex: 1}}>
      <View
        style={{
          backgroundColor: COLORS.white,
          position: 'absolute',
          top: insets.top + 20,
          left: 20,
          zIndex: 10,
        }}>
        <CircleButton onPress={() => navigation.goBack()} />
      </View>
      <View
        style={{
          height: '100%',
          backgroundColor: COLORS.white,
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <LottieView
          resizeMode="cover"
          style={{width: s(350)}}
          loop={true}
          autoPlay
          source={require('../../../assets/lottieFiles/loaders/loader2.json')}
        />
      </View>
    </View>
  );
};
