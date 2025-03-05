import React from 'react';
import {
  Button,
  CustomSafeAreaView,
  KeyboardAvoidingViewWrapper,
} from '../../components/general';
import {AppNav} from '../../components/layouts';
import {View} from 'react-native';
import {Image} from '../../components/general/image';
import {COLORS} from '../../../conts';
import FastImage from 'react-native-fast-image';
export const PreviewImageScreen = ({navigation, route}) => {
  const {
    image,
    actionBtnTitle = 'Delete',
    actionBtn = null,
  } = route?.params || {};

  return (
    <CustomSafeAreaView>
      <AppNav title={'Preview'} line />

      <KeyboardAvoidingViewWrapper
        addMinHeight
        contentContainerStyle={{paddingBottom: 50}}>
        <View style={{flex: 1, marginTop: 100}}>
          <Image
            resizeMode={FastImage.resizeMode.contain}
            source={{uri: image}}
            style={{height: 300, width: '100%'}}
          />
        </View>
        {actionBtn && (
          <View style={{paddingHorizontal: 20, flexDirection: 'row'}}>
            <Button
              onPress={navigation.goBack}
              title={'Back'}
              style={{width: 'auto', flex: 1}}
            />
            <View style={{width: 10}} />
            <Button
              onPress={actionBtn}
              type="red"
              style={{width: 'auto', flex: 1}}
              title={actionBtnTitle}
            />
          </View>
        )}
      </KeyboardAvoidingViewWrapper>
    </CustomSafeAreaView>
  );
};
