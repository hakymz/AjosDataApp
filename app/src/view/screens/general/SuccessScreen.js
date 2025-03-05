import React from 'react';
import {ScrollView, StatusBar, TouchableOpacity, View} from 'react-native';
import {
  BottomSheets,
  Button,
  CustomSafeAreaView,
  KeyboardAvoidingViewWrapper,
  Text,
} from '../../components/general';
import LottieView from 'lottie-react-native';
import {AppNav} from '../../components/layouts';
import {s} from 'react-native-size-matters';
import {useLayouts} from '../../../hooks';
import {COLORS, GENERAL} from '../../../conts';
import {useNavigation} from '@react-navigation/native';
import {
  AddCustomer,
  SavedCustomers,
} from '../../components/bottomSheetModal/contents';

const Indicator = ({indicatorWidth}) => {
  return (
    <View
      style={{
        width: s(230),
        height: 5,
        backgroundColor: '#E1E1E1',
        borderRadius: 10,
        marginTop: 25,
      }}>
      <View
        style={{
          height: '100%',
          width: indicatorWidth,
          backgroundColor: COLORS.primary,
          borderRadius: 10,
        }}
      />
    </View>
  );
};

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
    number,
    proceed = () => {
      navigation.goBack();
    },
  } = route?.params || {};

  const {minHeight} = useLayouts();
  return (
    <CustomSafeAreaView>
      <StatusBar barStyle={'dark-content'} />
      <AppNav />
      <KeyboardAvoidingViewWrapper
        addMinHeight
        showsVerticalScrollIndicator={false}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 40,
          }}>
          <LottieView
            resizeMode="cover"
            style={{height: s(200), width: s(200)}}
            autoPlay
            source={require('../../../assets/lottieFiles/others/successCheck.json')}
          />
          <View style={{paddingHorizontal: 20, marginTop: 40}}>
            {titleComponent || (
              <Text
                bk
                style={{paddingHorizontal: 20, marginTop: 40}}
                lineHeight={24}
                color={'#27A770'}
                textAlign={'center'}
                size={18}>
                {title}
              </Text>
            )}
          </View>
        </View>
        {btnComponent || (
          <View
            style={{
              paddingHorizontal: 50,
              marginTop: 50,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <SuccessShadowBtn title={btnTitle} onPress={proceed} />
          </View>
        )}

        {number && (
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
        )}
      </KeyboardAvoidingViewWrapper>
    </CustomSafeAreaView>
  );
};
