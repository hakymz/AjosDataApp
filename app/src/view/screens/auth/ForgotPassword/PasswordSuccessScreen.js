import {SafeAreaView, View, StatusBar, Keyboard} from 'react-native';
import React from 'react';
import {COLORS, FONTS} from '../../../../conts';
import {
  Button,
  CircleButton,
  Icons,
  KeyboardAvoidingViewWrapper,
  NavigationButton,
  Text,
} from '../../../components/general';
import LottieView from 'lottie-react-native';
import {s} from 'react-native-size-matters';

import * as yup from 'yup';
import {useLayouts} from '../../../../hooks';
import {AppNav} from '../../../components/layouts';

const validationSchema = yup.object().shape({
  email: yup
    .string()
    .required('Please input email')
    .email('Please input a valid email'),
});
export const PasswordSuccessScreen = ({navigation}) => {
  const timeIntervalRef = React.useRef();
  const formikRef = React.useRef();
  const [state, setState] = React.useState({
    showButton: false,
    lastTimeInputWasUpdated: null,
    email: null,
  });

  const {minHeight} = useLayouts();

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLORS.white}}>
      <StatusBar backgroundColor={COLORS.white} barStyle="dark-content" />

      <AppNav onPress={() => navigation.goBack()} />

      <KeyboardAvoidingViewWrapper
        // bounces={false}
        contentContainerStyle={{
          paddingBottom: 20,
          paddingHorizontal: 30,
          minHeight: minHeight - 70,
        }}>
        <View style={{alignItems: 'center', marginTop: 0, flex: 1}}>
          <View style={{flex: 1, alignItems: 'center'}}>
            <LottieView
              resizeMode="cover"
              style={{
                width: s(190),
                height: s(190),
                marginTop: 10,
              }}
              autoPlay
              loop={true}
              source={require('../../../../assets/lottieFiles/others/successCheck.json')}
            />

            <Text
              lineHeight={23}
              size={20}
              bold
              color={COLORS.primary}
              style={{paddingTop: 80, textAlign: 'center'}}>
              Password Saved successfully
            </Text>

            <Text
              size={14}
              color={'#0F1819'}
              style={{paddingTop: 10, textAlign: 'center'}}>
              You can go ahead to Login... Take the new password for a spin, it
              has to work 🤣
            </Text>
          </View>

          <View style={{marginTop: 50, width: '100%', flex: 1}}>
            <View
              style={{
                flex: 1,
                justifyContent: 'flex-end',
                marginBottom: 20,
                paddingHorizontal: 10,
              }}>
              <Button
                onPress={() => {
                  handleSubmit();
                  navigation.navigate('ForgotPasswordOtpScreen');
                }}
                type="black"
                title="Log into account"
              />
            </View>
          </View>
        </View>
      </KeyboardAvoidingViewWrapper>
    </SafeAreaView>
  );
};
