import moment from 'moment';
import React from 'react';
import {ScrollView} from 'react-native';
import {COLORS} from '../../../../conts';
import {CustomSafeAreaView, Text} from '../../../components/general';
import {AppNav} from '../../../components/layouts';
export const NotificationExpandedScreen = ({route}) => {
  const details = route?.params;

  return (
    <CustomSafeAreaView>
      <AppNav title={'Notifications'} />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 30,
          paddingTop: 20,
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={false}>
        <Text fontWeight={'500'}>{details?.description}</Text>
      </ScrollView>
    </CustomSafeAreaView>
  );
};
