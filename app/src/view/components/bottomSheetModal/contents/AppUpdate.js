import React from 'react';
import {Image, View} from 'react-native';
import {BottomSheets, Button, Text} from '../../general';
import LottieView from 'lottie-react-native';
import {openBrowser} from '../../../../helper';
import {GENERAL} from '../../../../conts';
export const AppUpdate = () => {
  return (
    <View style={{paddingHorizontal: 24}}>
      <Text textAlign={'right'} size={18} fontWeight={800}>
        App update
      </Text>
      <Text
        size={16}
        fontWeight={'500'}
        style={{marginTop: 30}}
        textAlign={'center'}>
        Your App Update is here
      </Text>
      <View style={{alignItems: 'center'}}>
        <LottieView
          autoPlay
          style={{height: 250, width: 250}}
          source={require('../../../../assets/lottieFiles/others/appUpdate.json')}
        />
      </View>
      <View>
        <Button
          onPress={() => {
            BottomSheets.hide();
            openBrowser(
              GENERAL.platform == 'ios'
                ? GENERAL.appsLinkToStore.ios
                : GENERAL.appsLinkToStore.android,
            );
          }}
          fontSize={14}
          title={'Update App Now'}
        />
      </View>
      <View style={{paddingTop: 15}}>
        <Text color={'#828282'} size={13} fontWeight={'700'}>
          Features:
        </Text>
        <Text color={'#828282'} size={13} fontWeight={'400'}>
          Minor Bug fixes
        </Text>
        <Text color={'#828282'} size={13} fontWeight={'400'}>
          Security firmware update
        </Text>
      </View>
    </View>
  );
};
