import React from 'react';
import {Image, ScrollView, StatusBar, View} from 'react-native';
import {COLORS, GENERAL} from '../../../conts';
import {useLayouts} from '../../../hooks';
import {
  Button,
  CircleButton,
  CustomSafeAreaView,
  Text,
} from '../../components/general';

export const ErrorScreen = ({route, navigation}) => {
  const {
    btnTitle = 'Try Again',
    subTitle,
    image,
    proceed = () => {},
  } = route?.params || {};
  const {minHeight} = useLayouts();
  return (
    <CustomSafeAreaView backgroundColor={COLORS.white}>
      <StatusBar barStyle={'dark-content'} />
      <View style={{paddingHorizontal: 20}}>
        <CircleButton />
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          minHeight: minHeight - 70,
          paddingBottom: GENERAL.platform == 'ios' ? 40 : 20,
        }}>
        <View
          style={{
            justifyContent: 'center',

            marginTop: 40,
          }}>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            {image || (
              <Image
                source={require('../../../assets/images/others/errorImage.png')}
                style={{height: 285, width: 285}}
              />
            )}
          </View>

          <View style={{paddingHorizontal: 20, marginTop: 40}}>
            <Text size={23}>
              Yikes!{' '}
              <Text bold size={23}>
                An error occurred ⚠
              </Text>{' '}
            </Text>

            <Text size={14} color={'#868D95'}>
              {subTitle}
            </Text>
          </View>
        </View>
        <View
          style={{
            paddingHorizontal: 20,
            marginTop: 50,
            justifyContent: 'flex-end',
            flex: 1,
          }}>
          <Button
            title={btnTitle}
            onPress={() => {
              proceed();
              navigation.goBack?.();
            }}
          />
        </View>
      </ScrollView>
    </CustomSafeAreaView>
  );
};
