import moment from 'moment';
import React from 'react';
import {ScrollView, View, Dimensions, Image} from 'react-native';
import {COLORS, IMAGES} from '../../../../conts';
import {
  Button,
  CustomSafeAreaView,
  KeyboardAvoidingViewWrapper,
  Text,
} from '../../../components/general';
import {AppNav} from '../../../components/layouts';
import ViewShot from 'react-native-view-shot';
import Toast from '../../../components/toast/Toast';
import Share from 'react-native-share';
import {openLink} from '../../../../helper';
export const SummaryNextScreen = ({route}) => {
  const {width, height} = Dimensions.get('window');
  const {data} = route?.params || {};
  const captureRef = React.useRef();

  let date = moment(data?.date).format('MMM DD, YYYY - ss:mma');

  const shareReceipt = async () => {
    try {
      // on mount

      const uri = await captureRef.current.capture();
      Share.open({title: 'Payment receipt', url: uri});
    } catch (error) {
      console.log(error);
      Toast.show('error', 'Could not share receipt');
    } finally {
    }
  };

  return (
    <CustomSafeAreaView>
      <AppNav
        line
        title={
          <View style={{justifyContent: 'center', alignItems: 'flex-end'}}>
            <Text semiBold>{data?.pageTitle} Summary</Text>
            <Text color={'#868686'} lineHeight={13} size={12}>
              {date}
            </Text>
          </View>
        }
      />
      <KeyboardAvoidingViewWrapper
        addMinHeight
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 10,
        }}
        showsVerticalScrollIndicator={false}>
        {data?.section}
        {(data?.state == 'declined' &&
          data?.metaInfo?.purchaseStatus == 'sell') ||
        (data?.state == 'declined' &&
          data?.metaInfo?.type == 'USD Transfer') ? (
          <View
            style={{
              flex: 1,
              paddingHorizontal: 30,
              flexDirection: 'row',
              marginTop: 10,
            }}>
            <Button
              textColor={COLORS.primary}
              style={{
                width: 'auto',
                flex: 1,
                paddingHorizontal: 0,
                backgroundColor: '#F1F1F1',
              }}
              type="grey"
              title={'Ask Support'}
              onPress={() => {
                openLink('https://wa.link/8batl7');
              }}
            />
            <View style={{width: 10}} />
            <Button
              style={{width: 'auto', flex: 1, paddingHorizontal: 0}}
              type="black"
              title={'Share'}
              onPress={shareReceipt}
            />
          </View>
        ) : (
          <View
            style={{
              flex: 1,
              justifyContent: 'flex-end',
              paddingHorizontal: 30,
            }}>
            <Button
              type="black"
              title={'Share Receipt'}
              onPress={shareReceipt}
            />
          </View>
        )}
      </KeyboardAvoidingViewWrapper>
      <ViewShot
        ref={captureRef}
        style={{
          position: 'absolute',
          width: '100%',
          backgroundColor: COLORS.white,
          marginTop: 10,
          bottom: height * 2,
        }}>
        <AppNav
          btn={
            <View>
              <Image
                style={{height: 30, width: 100, resizeMode: 'contain'}}
                source={IMAGES.Logo}
              />
            </View>
          }
          line
          title={
            <View style={{justifyContent: 'center', alignItems: 'flex-end'}}>
              <Text semiBold>{data?.pageTitle} Summary</Text>
              <Text color={'#868686'} lineHeight={13} size={12}>
                {date}
              </Text>
            </View>
          }
        />
        <View
          style={{
            paddingHorizontal: 20,
            paddingTop: 15,
            paddingBottom: 40,
          }}>
          {data?.section}
        </View>
      </ViewShot>
    </CustomSafeAreaView>
  );
};
