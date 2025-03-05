import React from 'react';
import {ScrollView, View} from 'react-native';
import {COLORS, GENERAL} from '../../../../conts';
import {useLayouts} from '../../../../hooks';
import {Button, CustomSafeAreaView, Text} from '../../../components/general';
import {AppNav} from '../../../components/layouts';
export const BillsSummaryScreen = ({navigation, route}) => {
  const {summary, proceed = () => {}} = route?.params || {};
  const {minHeight} = useLayouts();
  return (
    <CustomSafeAreaView>
      <AppNav title={'Summary'} line />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: 10,
          paddingBottom: GENERAL.platform == 'ios' ? 40 : 20,
          paddingHorizontal: 20,
          minHeight: minHeight - 80,
        }}>
        <View style={{marginTop: 10}}>{summary}</View>
        <View
          style={{flex: 1, justifyContent: 'flex-end', paddingHorizontal: 0}}>
          <View
            style={{
              padding: 20,
              backgroundColor: '#F8F8F9',
              marginBottom: 20,
              borderRadius: 15,
            }}>
            <Text color={COLORS.primary} lineHeight={14} size={12}>
              <Text
                color={COLORS.primary}
                style={{textDecorationLine: 'underline'}}
                size={12}
                bold>
                PURCHASE TERMS:{' '}
              </Text>
              We are not liable for any error from you, please Review the
              details well before submitting this purchase
            </Text>
          </View>
          <View style={{paddingHorizontal: 30}}>
            <Button type="black" title={'Purchase'} onPress={proceed} />
          </View>
        </View>
      </ScrollView>
    </CustomSafeAreaView>
  );
};
