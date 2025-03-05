import React from 'react';
import {Image, View} from 'react-native';
import {BottomSheets, Button, Text} from '../../general';
import LottieView from 'lottie-react-native';
import {enableBiometric} from '../../../../helper';
import {useUser} from '../../../../hooks';
import Toast from '../../toast/Toast';
export const Biometric = () => {
  const {data, settings, updateUserData} = useUser();
  return (
    <View style={{paddingHorizontal: 24}}>
      <Text textAlign={'right'} size={18} fontWeight={800}>
        Biometrics
      </Text>
      <Text
        size={16}
        fontWeight={'500'}
        style={{marginTop: 30}}
        textAlign={'center'}>
        Do you want to Activate Biometrics?
      </Text>
      <View style={{alignItems: 'center'}}>
        <LottieView
          autoPlay
          style={{height: 250, width: 250}}
          source={require('../../../../assets/lottieFiles/others/biometric.json')}
        />
      </View>
      <View style={{flexDirection: 'row'}}>
        <Button
          onPress={() => {
            BottomSheets.hide();
          }}
          type="lightGrey"
          style={{width: 130}}
          fontSize={14}
          title={'Cancel'}
        />
        <View style={{width: 10}} />
        <Button
          style={{flex: 1}}
          fontSize={14}
          title={'Activate Biometrics'}
          onPress={async () => {
            BottomSheets.hide();
            if (!settings?.biometric) {
              const res = await enableBiometric();
              if (res) {
                updateUserData({
                  data: data,
                  settings: {...settings, biometric: true},
                });
              } else {
                Toast.show(
                  'error',
                  'Please enable your device biometric to continue',
                );
              }
            } else {
              updateUserData({
                data: data,
                settings: {...settings, biometric: false},
              });
            }
          }}
        />
      </View>
      <View style={{paddingTop: 20}}>
        <Text color={'#828282'} size={13} fontWeight={'400'}>
          This will help you Login easily and Approve transactions with ease.
        </Text>
      </View>
    </View>
  );
};
