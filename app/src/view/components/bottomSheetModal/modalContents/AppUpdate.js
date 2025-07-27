import React from 'react';
import {Image, View} from 'react-native';
import {BottomSheets, Button, Text} from '../../general';
import LottieView from 'lottie-react-native';
import {openBrowser} from '../../../../helper';
import {GENERAL} from '../../../../conts';
export const AppUpdate = () => {
  return (
    <View style={{paddingHorizontal: 24}}>
      <Text textAlign={'center'} size={25} semiBold>
        Update Available
      </Text>
      <Text
        size={14}
        color={'#868D95'}
        style={{marginTop: 10}}
        textAlign={'center'}>
        Please click the button below to get the latest version of our app.
      </Text>
      <View style={{alignItems: 'center', marginBottom: 40, marginTop: 20}}>
        <Image
          style={{height: 230, width: 230}}
          source={require('../../../../assets/images/others/update.png')}
        />
        {/* <LottieView
          autoPlay
          style={{height: 230, width: 250}}
          source={require('../../../../assets/lottieFiles/others/appUpdate.json')}
        /> */}
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
          title={'Update my app'}
        />
      </View>
    </View>
  );
};
