import {SafeAreaView, View, StatusBar, ScrollView} from 'react-native';
import React from 'react';
import {COLORS, FONTS} from '../../../conts';
import {CircleButton, Text} from '../../components/general';
import LottieView from 'lottie-react-native';
import {s} from 'react-native-size-matters';
import {AppNav} from '../../components/layouts';
import {useLayouts} from '../../../hooks';
export const EmailSentSuccessScreen = ({navigation, route}) => {
  const {toScreen = 'SignInScreen'} = route?.params || {};
  const {minHeight} = useLayouts();
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLORS.white}}>
      <StatusBar backgroundColor={COLORS.white} barStyle="dark-content" />
      <AppNav onPress={() => navigation.goBack()} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 20,
          minHeight: minHeight - 70,
          paddingHorizontal: 30,
        }}>
        <Text
          lineHeight={35}
          semiBold
          size={30}
          color={COLORS.primary}
          style={{paddingTop: 40, textAlign: 'center'}}>
          Check your {'\n'} Mail-Box
        </Text>
        <View style={{alignItems: 'center', marginTop: 20}}>
          <LottieView
            style={{
              width: s(180),
              height: s(180),
              marginTop: 10,
            }}
            autoPlay
            loop={true}
            source={require('../../../assets/lottieFiles/others/email.json')}
          />
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            paddingTop: 60,
            paddingBottom: 80,
          }}>
          <Text
            style={{
              textAlign: 'center',
              paddingHorizontal: 40,
            }}>
            Please check your email inbox and click on the link to verify email
            address
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
