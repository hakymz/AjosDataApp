import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {s} from 'react-native-size-matters';
import {COLORS} from '../../../../conts';
import {
  Button,
  CustomSafeAreaView,
  Icons,
  KeyboardAvoidingViewWrapper,
  Text,
} from '../../../components/general';
import {MainHeader} from '../../../components/layouts';

import {fetchRequest, openSuccessScreen} from '../../../../helper';
import {PageList} from '../../../components/lists';

export const ResetPasswordScreen = ({navigation}) => {
  const updatePassword = async values => {
    try {
      const response = await fetchRequest({
        path: 'settings/change-password',
        data: {
          oldPassword: values?.password,
          password: values?.newPassword,
          confirmPassword: values?.newPassword,
        },
        method: 'PATCH',
      });

      openSuccessScreen({
        navigation,
        title: 'Password Saved successfully',
        subTitle: 'You can go ahead use this to Login... 👌',
        btnTitle: 'Head back to Settings',
        indicatorWidth: null,
        proceed: () => {
          navigation.navigate('SettingsScreen');
        },
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <CustomSafeAreaView backgroundColor={COLORS.white}>
      <MainHeader
        backgroundColor={COLORS.white}
        nav
        title={<></>}
        icon={<Icons.Unlock size={30} />}
      />
      <KeyboardAvoidingViewWrapper
        addMinHeight
        contentContainerStyle={{paddingTop: 20, paddingHorizontal: 20}}>
        <Text size={18} bold color={COLORS.darkBlue}>
          Security
        </Text>
        <Text
          style={{marginTop: 5, marginBottom: 25}}
          size={12}
          medium
          color={'#979797'}>
          You can change or reset your password or PIN to enable a safer app
          experience
        </Text>
        <PageList rightIcon={<></>}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Icons.Key />
            <Text style={{marginLeft: 8}} size={14} semiBold>
              Reset Password
            </Text>
          </View>
        </PageList>
        <View
          style={{
            marginTop: 30,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            style={{height: 184, width: 184}}
            source={require('../../../../assets/images/others/askingQuestion.png')}
          />

          <Text medium size={18} style={{marginTop: 30}} textAlign={'center'}>
            <Text bold size={18} style={{marginTop: 30}} textAlign={'center'}>
              Can’t Remember?
            </Text>{' '}
            Let’s send you an OTP to get you started Edit
          </Text>
        </View>

        <View style={{flex: 1, justifyContent: 'flex-end'}}>
          <Button title={'Send me OTP'} />
        </View>
      </KeyboardAvoidingViewWrapper>
    </CustomSafeAreaView>
  );
};

const style = StyleSheet.create({
  iconCon: {
    height: s(40),
    width: s(40),
    backgroundColor: COLORS.light,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    marginRight: 10,
  },
});
