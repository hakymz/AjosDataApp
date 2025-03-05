import React from 'react';
import {
  Button,
  CustomSafeAreaView,
  Icons,
  Text,
} from '../../../components/general';
import {AppNav} from '../../../components/layouts';
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {COLORS, GENERAL, IMAGES} from '../../../../conts';

import {PageList} from '../../../components/lists';
import {useLayouts, useUser} from '../../../../hooks';
import {
  Copy,
  fetchRequest,
  formatAmount,
  openSuccessScreen,
} from '../../../../helper';
import {useQuery} from 'react-query';
import Share from 'react-native-share';

export const ShareProfileScreen = ({navigation}) => {
  const {data} = useUser();

  const {user} = data || {};
  const {minHeight} = useLayouts();

  const refDetails = async values => {
    try {
      const response = await fetchRequest({
        path: 'refer',
        showLoader: false,
        displayMessage: false,
        method: 'GET',
      });

      return response?.data;
    } catch (error) {
      console.log(error);
    }
  };
  const {data: refData, error} = useQuery('refDetails', refDetails);

  const withdrawEarnings = async values => {
    try {
      const response = await fetchRequest({
        path: 'refer/claim',
        data: {
          oldPassword: values?.password,
          password: values?.newPassword,
          confirmPassword: values?.newPassword,
        },
        pageError: {navigation},
      });

      BottomSheets.hide();
      openSuccessScreen({
        navigation,
        title: 'Widthdrawal was successful',
        btnTitle: 'Head back to Profile',
        proceed: () => {
          navigation.navigate('ProfileScreen');
        },
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <CustomSafeAreaView>
      <AppNav
        line
        icon={
          <Text size={14} lineHeight={20} fontWeight={'500'}>
            Hello,{' '}
            <Text size={18} lineHeight={20} fontWeight={'800'}>
              {data?.user?.firstName}
            </Text>
          </Text>
        }
        title="Share | Earn"
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: 20,
          paddingBottom: 40,
          paddingHorizontal: 20,
          minHeight: minHeight - 70,
        }}>
        <View
          style={{
            height: 153,
            backgroundColor: '#007920',
            marginBottom: 30,
            borderRadius: 10,

            paddingHorizontal: 20,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              height: 32,
              width: 239,
              backgroundColor: '#CBDB31',
              borderRadius: 5,
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
            }}>
            <Text
              fontWeight={'700'}
              lineHeight={20}
              color={'#231F20'}
              size={16}>
              {refData?.totalReferred}
            </Text>
            <Text lineHeight={20} fontWeight={'500'} size={11}>
              {' '}
              - Total Referred Accounts
            </Text>
          </View>
          <View
            style={{
              height: 49,
              width: 239,
              backgroundColor: '#009327',
              borderRadius: 10,
              marginTop: 10,
              marginBottom: 10,
              justifyContent: 'center',
            }}>
            <Text
              fontWeight={'800'}
              size={28}
              color={COLORS.white}
              textAlign={'center'}>
              {GENERAL.nairaSign}
              {formatAmount(refData?.totalEarned)}
            </Text>
          </View>
          <Text size={12} color={COLORS.white} fontWeight={'500'}>
            Earnings - {refData?.points} Points
          </Text>
        </View>

        <Text
          fontWeight={'500'}
          size={14}
          style={{marginTop: 20, paddingHorizontal: 10, marginBottom: 10}}>
          Referral Code
        </Text>
        <PageList style={{height: 68, flex: 0}}>
          <View>
            <Text size={16} fontWeight={'500'} color={COLORS.blue}>
              {user?.refCode}
            </Text>
          </View>

          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity
              onPress={() => {
                let options = {
                  title: 'Refferal Code',
                  message: user?.refCode,
                };
                Share.open(options)
                  .then(res => {
                    console.log(res);
                  })
                  .catch(err => {
                    console.log(err);
                  });
              }}
              style={{
                height: 36,
                width: 36,
                borderWidth: 1,
                borderColor: '#EAECF0',
                borderRadius: 12,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 5,
              }}>
              <Icons.Share size={15} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                Copy(user?.refCode);
              }}
              style={{
                height: 36,
                width: 36,
                borderWidth: 1,
                borderColor: '#EAECF0',
                borderRadius: 12,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Icons.Copy size={15} />
            </TouchableOpacity>
          </View>
        </PageList>
        <Text
          style={{marginTop: 20}}
          lineHeight={22}
          color={'#828282'}
          size={14}
          fontWeight={'700'}>
          1 Point = 10 NGN
        </Text>
        <Text
          style={{marginTop: 20}}
          lineHeight={22}
          color={'#828282'}
          size={16}
          fontWeight={'400'}>
          <Text fontWeight={'700'} color={'#828282'} size={16}>
            Commissions:
          </Text>{' '}
          These are based on your referred accounts and a percentage of their
          spendings on the Data resell app.
        </Text>
        <Text
          style={{marginTop: 20}}
          lineHeight={22}
          color={'#828282'}
          size={16}
          fontWeight={'400'}>
          <Text fontWeight={'700'} color={'#828282'} size={16}>
            Referral Code:
          </Text>{' '}
          This is the sharable code you can send to your friends and loved ones
          to also join the Data Resell club.
        </Text>
        <View style={{}}>
          <Button
            onPress={() => {
              withdrawEarnings();
            }}
            title={'Withdraw Earnings'}
            style={{marginTop: 40}}
          />
        </View>
        <View
          style={{
            justifyContent: 'flex-end',
            flex: 1,
            alignItems: 'center',
            paddingTop: 70,
          }}>
          <Image source={IMAGES.Logo} style={{width: 99, height: 43}} />
        </View>
      </ScrollView>
    </CustomSafeAreaView>
  );
};

const styles = StyleSheet.create({
  list: {
    height: 72,
    backgroundColor: '#F8F8F8',
    marginBottom: 10,
    borderRadius: 8,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
