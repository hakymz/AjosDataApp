import React from 'react';
import {Platform, ScrollView, StatusBar, View} from 'react-native';
import {COLORS, GENERAL} from '../../../conts';
import {useLayouts} from '../../../hooks';
import {Button, CustomSafeAreaView, Text} from '../../components/general';
import {AppNav} from '../../components/layouts';
import LottieView from 'lottie-react-native';
import {s} from 'react-native-size-matters';
import {TouchableOpacity} from 'react-native';

const Indicator = ({indicatorWidth}) => {
  return (
    <View
      style={{
        width: s(230),
        height: 5,
        backgroundColor: '#E1E1E1',
        borderRadius: 10,
        marginTop: 25,
      }}>
      <View
        style={{
          height: '100%',
          width: indicatorWidth,
          backgroundColor: COLORS.primary,
          borderRadius: 10,
        }}
      />
    </View>
  );
};
export const ErrorScreen = ({route, navigation}) => {
  const {
    title = 'We encountered some problems and we will love you to try again',
    btnTitle = 'Try Again',
    subTitle,
    proceed = () => {
      navigation.goBack();
    },
  } = route?.params || {};
  const {minHeight} = useLayouts();
  return (
    <CustomSafeAreaView>
      <StatusBar barStyle={'dark-content'} />
      <AppNav />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          minHeight: minHeight - 70,
          paddingBottom: GENERAL.platform == 'ios' ? 40 : 20,
        }}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 40,
          }}>
          <LottieView
            resizeMode="cover"
            style={{height: s(200), width: s(200)}}
            autoPlay
            source={require('../../../assets/lottieFiles/others/error.json')}
          />
          <View style={{paddingHorizontal: 20, marginTop: 40}}>
            <Text
              bk
              style={{paddingHorizontal: 20}}
              lineHeight={24}
              color={'#D12431'}
              textAlign={'center'}
              size={18}>
              {title}
            </Text>
          </View>
        </View>
        <View
          style={{
            paddingHorizontal: 50,
            marginTop: 50,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            onPress={proceed}
            style={{
              paddingHorizontal: 30,
              backgroundColor: COLORS.white,
              height: 56,
              borderRadius: 8,
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor:
                Platform.OS == 'ios' ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.8)',
              shadowOpacity: 1,
              shadowRadius: 20,
              elevation: 30,
              shadowOffset: {height: 10},
            }}>
            <Text size={18} color={'#231F20'} bd>
              {btnTitle}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </CustomSafeAreaView>
  );
};
