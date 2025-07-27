import {SafeAreaView, View, StatusBar, Image} from 'react-native';
import React from 'react';
import {COLORS} from '../../../../conts';
import {
  Button,
  CircleButton,
  KeyboardAvoidingViewWrapper,
  Text,
} from '../../../components/general';

export const PinSuccessScreen = ({navigation, route}) => {
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLORS.white}}>
      <StatusBar backgroundColor={COLORS.white} barStyle="dark-content" />

      <KeyboardAvoidingViewWrapper
        // bounces={false}
        addMinHeight
        contentContainerStyle={{
          paddingBottom: 20,
          paddingHorizontal: 20,
        }}>
        <CircleButton />
        <View style={{marginTop: 0, flex: 1}}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 40,
            }}>
            <Image
              resizeMode="contain"
              style={{height: 311, width: 311}}
              source={require('../../../../assets/images/others/fitness-app.png')}
            />
          </View>

          <Text
            color={COLORS.darkBlue}
            semiBold
            size={25}
            style={{paddingTop: 30}}>
            Done, Let’s put a{' '}
            <Text
              color={COLORS.darkBlue}
              bold
              size={25}
              style={{paddingTop: 40}}>
              PIN in it 😂
            </Text>
          </Text>

          <Text size={14} color={'#868D95'} style={{marginTop: 10}}>
            We have successfully created your unique PIN to complete
            transactions or Sign-in.
          </Text>

          <View style={{marginTop: 40, width: '100%', flex: 1}}>
            <View style={{flex: 1}}>
              <View
                style={{
                  flex: 1,
                  marginBottom: 20,
                  marginTop: 60,
                }}>
                <Button
                  titleStyle={{color: COLORS.white}}
                  onPress={() => {
                    navigation.goBack();
                  }}
                  title="Continue"
                />
              </View>
            </View>
          </View>
        </View>
      </KeyboardAvoidingViewWrapper>
    </SafeAreaView>
  );
};
