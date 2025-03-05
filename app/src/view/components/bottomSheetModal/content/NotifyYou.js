import React from 'react';
import {View, Image} from 'react-native';
import {Button, Icons, Text} from '../../general';
import {COLORS, FONTS} from '../../../../conts';
import {s} from 'react-native-size-matters';
import {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import LottieView from 'lottie-react-native';
export const NotifyYou = ({message}) => {
  return (
    <View style={{height: '100%'}}>
      <BottomSheetScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 50, minHeight: '100%'}}>
        <View style={{marginTop: 20, alignItems: 'center', flex: 1}}>
          <View style={{height: s(250), justifyContent: 'center'}}>
            <LottieView
              resizeMode="cover"
              style={{
                height: s(300),
                width: s(300),
              }}
              autoPlay
              loop
              source={require('../../../../assets/lottieFiles/others/bell.json')}
            />
          </View>

          <View
            style={{
              flex: 1,
            }}>
            {message || (
              <Text
                color={COLORS.lightBlue}
                fontType={FONTS.FREDOKA}
                lineHeight={21}
                size={18}
                textAlign="center"
                style={{paddingHorizontal: 50}}>
                We will notify you when it hits your wallet
              </Text>
            )}
          </View>
        </View>
      </BottomSheetScrollView>
    </View>
  );
};
