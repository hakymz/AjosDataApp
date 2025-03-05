import React from 'react';
import {Image, View} from 'react-native';
import {BottomSheets, Button, Text} from '../../general';
import LottieView from 'lottie-react-native';
import {enableBiometric} from '../../../../helper';
import {useUser} from '../../../../hooks';
import Toast from '../../toast/Toast';
import {useNavigation} from '@react-navigation/native';
export const CreatePin = () => {
  const {data, settings, updateUserData} = useUser();
  const navigation = useNavigation();
  return (
    <View style={{paddingHorizontal: 24}}>
      <Text textAlign={'right'} size={18} fontWeight={800}>
        Create PIN
      </Text>
      <Text
        size={16}
        fontWeight={'500'}
        style={{marginTop: 30}}
        textAlign={'center'}>
        You need to create a PIN to proceed
      </Text>
      <View style={{alignItems: 'center'}}>
        <LottieView
          autoPlay
          style={{height: 250, width: 250}}
          source={require('../../../../assets/lottieFiles/others/createPin.json')}
        />
      </View>
      <View style={{flexDirection: 'row', marginTop: 40}}>
        <Button
          style={{flex: 1}}
          fontSize={14}
          title={'Create PIN'}
          onPress={async () => {
            BottomSheets.hide();
            navigation.navigate('SetPinScreen');
          }}
        />
      </View>
    </View>
  );
};
