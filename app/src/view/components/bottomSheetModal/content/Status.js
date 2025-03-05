import React from 'react';
import {View, Image} from 'react-native';
import {Button, Icons, Text} from '../../general';
import {COLORS, FONTS} from '../../../../conts';
import {s} from 'react-native-size-matters';
import {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import LottieView from 'lottie-react-native';
export const Status = ({type, message}) => {
  return (
    <BottomSheetScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{paddingBottom: 50, minHeight: '100%'}}>
      <View
        style={{
          marginTop: 20,
          alignItems: 'center',
          flex: 1,
        }}>
        <View style={{height: 300, justifyContent: 'center'}}>
          <LottieView
            resizeMode="cover"
            style={{
              height: type == 'error' ? 200 : '100%',
              width: type == 'error' ? 200 : '100%',
            }}
            autoPlay
            loop
            source={
              type == 'error'
                ? require('../../../../assets/lottieFiles/others/error.json')
                : require('../../../../assets/lottieFiles/others/success.json')
            }
          />
        </View>

        <View
          style={{
            justifyContent: 'flex-end',
          }}>
          <Text
            color={COLORS.lightBlue}
            fontType={FONTS.FREDOKA}
            lineHeight={21}
            size={18}
            textAlign="center"
            style={{paddingHorizontal: 40}}>
            {message
              ? message
              : type == 'error'
              ? 'Something went wrong Try again!'
              : 'Another Successful Transaction!'}
          </Text>
        </View>
      </View>
    </BottomSheetScrollView>
  );
};
