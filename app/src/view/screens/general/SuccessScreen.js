import React from 'react';
import {Image, StatusBar, TouchableOpacity, View} from 'react-native';
import {
  Button,
  CircleButton,
  CloseButton,
  CustomSafeAreaView,
  KeyboardAvoidingViewWrapper,
  Text,
} from '../../components/general';
import {COLORS, GENERAL} from '../../../conts';
import {useNavigation} from '@react-navigation/native';

export const SuccessShadowBtn = ({title, onPress}) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('HomeScreen');
        onPress();
      }}
      style={{
        paddingHorizontal: 20,
        backgroundColor: COLORS.white,
        height: 56,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: 'rgba(0,0,0,0.2)',
        shadowOpacity: 1,
        shadowRadius: 20,
        shadowOffset: {height: 10},
        elevation: 10,
        flex: 0,
      }}>
      <Text size={17} color={'#231F20'} bd>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export const SuccessHomeBtn = ({title, onPress}) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('HomeScreen');
      }}
      style={{
        paddingHorizontal: 20,
        backgroundColor: '#D8D8D8',
        height: 56,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: 'rgba(0,0,0,0.2)',
        flex: 0,
        marginRight: 10,
      }}>
      <Text size={17} color={'#231F20'} bd>
        {title}
      </Text>
    </TouchableOpacity>
  );
};
export const SuccessScreen = ({route, navigation}) => {
  const {
    title = 'BVN Successfully Verified, click below to Access account details',
    titleComponent,
    btnTitle = 'Get Started',
    subTitle,
    btnComponent,
    image,
    proceed = () => {
      navigation.goBack();
    },
  } = route?.params || {};

  return (
    <CustomSafeAreaView backgroundColor={COLORS.white}>
      <StatusBar barStyle={'dark-content'} />
      <View style={{paddingHorizontal: 20}}>
        <CircleButton />
      </View>
      <KeyboardAvoidingViewWrapper
        addMinHeight
        showsVerticalScrollIndicator={false}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 40,
          }}>
          {image || (
            <Image
              source={require('../../../assets/images/others/successImage.png')}
              style={{height: 285, width: 285}}
            />
          )}

          <View style={{paddingHorizontal: 20, marginTop: 40}}>
            {titleComponent ||
              (!title ? (
                <Text semiBold size={25}>
                  You are a sure{' '}
                  <Text bold size={25}>
                    Plug🔌
                  </Text>
                </Text>
              ) : (
                <Text
                  bold
                  style={{paddingHorizontal: 20, marginTop: 40}}
                  textAlign={'center'}
                  size={25}>
                  {title}
                </Text>
              ))}
            <Text textAlign={'center'} color={'#868D95'}>
              {subTitle}
            </Text>
          </View>
        </View>
        <View
          style={{flex: 1, justifyContent: 'flex-end', alignItems: 'center'}}>
          {btnComponent || (
            <View
              style={{
                paddingHorizontal: 20,
                marginTop: 50,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Button title={btnTitle} onPress={proceed} />
            </View>
          )}
          <CloseButton />
        </View>

        {/* {number && (
          <View
            style={{
              paddingHorizontal: 20,
              marginTop: 20,
            }}>
            <Button
              onPress={() => {
                navigation.goBack();
                BottomSheets.show({
                  component: <AddCustomer number={number} />,
                });
              }}
              title={'Save this Customer'}
              style={{backgroundColor: '#4961AC'}}
            />
          </View>
        )} */}
      </KeyboardAvoidingViewWrapper>
    </CustomSafeAreaView>
  );
};
