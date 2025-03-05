import {useFormik} from 'formik';
import React from 'react';
import {
  BigInput,
  Button,
  CopyIcon,
  CustomSafeAreaView,
  KeyboardAvoidingViewWrapper,
  Text,
} from '../../../../components/general';
import {AppNav} from '../../../../components/layouts';
import {COLORS, IMAGES} from '../../../../../conts';
import {Image, View} from 'react-native';
import {SectionList} from '../../../../components/lists';
import Share from 'react-native-share';
import {useUser} from '../../../../../hooks';

export const PaypalLinkNextScreen = ({navigation, route}) => {
  const {links} = route?.params || {};
  const {data} = useUser();
  console.log(data?.user?.firstName);

  const sectionListData = [
    {
      title: `${data?.user?.firstName} ${data?.user?.lastName}`,
      des: `@${data?.user?.userTag} `,
      right: (
        <View
          style={{
            height: 43,
            width: 43,
            backgroundColor: COLORS.primary,
            borderRadius: 100,
            justifyContent: 'center',
            alignItems: 'center',
            paddingTop: 5,
          }}>
          <Text lineHeight={0} color={COLORS.white} size={20} bold>
            {data?.user?.firstName?.split?.('')[0]}
          </Text>
        </View>
      ),
    },
    {
      title: links?.[1]?.href,
      des: 'Unique Link',
      right: <CopyIcon text={links?.[1]?.href} />,
    },
  ];

  return (
    <CustomSafeAreaView>
      <AppNav title={<Text semiBold>Generate PayPal Link</Text>} line />
      <KeyboardAvoidingViewWrapper
        addMinHeight
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 20,
        }}>
        <Text
          textAlign={'center'}
          lineHeight={24}
          color={COLORS.primary}
          size={20}
          bold
          style={{marginTop: 25, paddingHorizontal: 40, marginBottom: 25}}>
          Get Paid via a Unique Link
        </Text>
        <Text
          size={12}
          semiBold
          style={{
            marginTop: 0,
            paddingHorizontal: 20,
            marginBottom: 25,
          }}>
          Share this link to get paid by only a PayPal user
        </Text>

        <View>
          <SectionList item={sectionListData} />
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            paddingTop: 40,
            paddingHorizontal: 30,
          }}>
          <Button
            textColor={'white'}
            type={'black'}
            onPress={async () => {
              try {
                Share.open({
                  title: 'Paypal payment link',
                  url: links?.[1]?.href,
                });
              } catch (error) {}
            }}
            title="Share Link"
          />
        </View>
      </KeyboardAvoidingViewWrapper>
    </CustomSafeAreaView>
  );
};
