import {useFormik} from 'formik';
import React from 'react';
import {
  BigInput,
  Button,
  CustomSafeAreaView,
  KeyboardAvoidingViewWrapper,
  Text,
} from '../../../../components/general';
import {AppNav} from '../../../../components/layouts';
import {COLORS, IMAGES} from '../../../../../conts';
import {Image, View} from 'react-native';

export const PayoneerToCashNex1Screen = ({navigation, route}) => {
  const details = route?.params;

  return (
    <CustomSafeAreaView>
      <AppNav title={<Text semiBold>Payoneer to Cash</Text>} line />
      <KeyboardAvoidingViewWrapper
        addMinHeight
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 20,
        }}>
        <Text
          size={12}
          semiBold
          style={{marginTop: 25, paddingHorizontal: 20, marginBottom: 25}}>
          Make Payment to the Payoneer account details below and Click the
          button to proceed.
        </Text>
        <BigInput
          editable={false}
          customIcon={
            <Image
              style={{height: 22, width: 22, right: -5}}
              source={IMAGES.payoneer}
            />
          }
          currencyLogoBackground={{active: COLORS.black, blur: COLORS.black}}
          currencyLogoColor={{active: COLORS.white, blur: COLORS.white}}
          value={'tosin@snapi.ng'}
          textColor={{
            active: COLORS.black,
            blur: COLORS.inputGrey,
            placeholderTextColor: COLORS.inputGrey,
          }}
          backgroundColor={{
            active: COLORS.background,
            blur: COLORS.background,
          }}
          placeholder="0"
          title={'Snapi Technologies Limited'}
          type="background"
        />

        <View
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            paddingTop: 40,
            paddingHorizontal: 30,
          }}>
          <Button
            style={{marginBottom: 10}}
            textColor={'white'}
            type={'grey'}
            onPress={() => {
              navigation.navigate('HomeScreen');
            }}
            title="Cancel Transaction"
          />

          <Button
            textColor={'white'}
            type={'black'}
            onPress={() => {
              navigation.navigate('PayoneerToCashNex2Screen', {...details});
            }}
            title="I have made Payment"
          />
        </View>
      </KeyboardAvoidingViewWrapper>
    </CustomSafeAreaView>
  );
};
