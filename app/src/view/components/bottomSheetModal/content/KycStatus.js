import React from 'react';
import {Image, View} from 'react-native';
import {COLORS, IMAGES} from '../../../../conts';
import {BottomSheets, Button, MyIcons, Text} from '../../general';
import {useUser} from '../../../../hooks';
import {useNavigation} from '@react-navigation/native';
export const KycStatus = () => {
  const navigation = useNavigation();
  const {data} = useUser();
  const kycStatus = data?.user?.kycStatus;
  console.log(kycStatus);

  const title =
    kycStatus == 'failed'
      ? 'KYC Verification Failed'
      : 'KYC Verification Pending';
  const subTitle =
    kycStatus == 'failed'
      ? 'Dear Customer, we need you to re-submit a few details for verification for you to proceed with further transactions.'
      : 'Dear Customer, we are still running checks on the documents submitted. We will notify you once the results are concluded.';
  return (
    <View style={{paddingHorizontal: 30, marginBottom: 30}}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 30,
        }}>
        <Text
          bold
          color={kycStatus == 'failed' ? COLORS.red : '#868686'}
          lineHeight={23}
          size={20}>
          {title}
        </Text>
        {kycStatus == 'failed' ? (
          <Image
            source={IMAGES.error}
            style={{height: 25, width: 28, resizeMode: 'contain'}}
          />
        ) : (
          <MyIcons.Time size={22} />
        )}
      </View>
      <Text color={'#666766'} lineHeight={16.5}>
        {subTitle}
      </Text>
      <View style={{paddingHorizontal: 15, marginTop: 40}}>
        <Button
          onPress={() => {
            BottomSheets.hide();
            navigation.navigate('KycScreen');
          }}
          titleStyle={{color: COLORS.white}}
          disabled={kycStatus != 'failed'}
          type={kycStatus != 'failed' ? 'grey' : 'black'}
          title={'Re-submit KYC'}
        />
      </View>
    </View>
  );
};
