import {ScrollView, View} from 'react-native';
import React from 'react';
import {Button, DisplayAmount, Icons, Text} from '../../general';
import {COLORS, FONTS} from '../../../../conts';
import {s} from 'react-native-size-matters';
import ViewShot from 'react-native-view-shot';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import {Image} from '../../general/image';
import moment from 'moment';
const List = ({title, subTitle}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        width: '100%',
        paddingHorizontal: 10,
        justifyContent: 'space-between',
        paddingBottom: 30,
      }}>
      <Text
        color={COLORS.lightBlue}
        style={{width: '40%', textAlign: 'left'}}
        numberOfLines={1}>
        {title}
      </Text>
      <Text
        color={COLORS.primary}
        style={{width: '50%', textAlign: 'right'}}
        numberOfLines={2}>
        {subTitle}
      </Text>
    </View>
  );
};

export const TransactionDetails = ({data}) => {
  const viewShotRef = React.useRef();
  const captureAndShareScreenshot = () => {
    viewShotRef?.current?.capture().then(uri => {
      RNFS.readFile(uri, 'base64').then(res => {
        let urlString = 'data:image/jpeg;base64,' + res;
        let options = {
          title: 'Transations',
          message: 'Transaction reciept',
          url: urlString,
          type: 'image/jpeg',
        };
        Share.open(options)
          .then(res => {
            console.log(res);
          })
          .catch(err => {
            err && console.log(err);
          });
      });
    });
  };

  const imageSize =
    data?.category == 'Crypto' || data?.category == 'Gift Card' ? s(74) : s(41);

  let currentImage = null;
  if (data?.category == 'Credit card' || data?.category == 'Wallet') {
    currentImage = <Icons.TopUpBlue size={45} />;
  } else if (data?.category == 'User-User Transfer') {
    currentImage = (
      <Image
        style={{
          height: imageSize,
          width: imageSize,
          resizeMode: 'contain',
        }}
        source={require('../../../../assets/images/others/onemUser.png')}
      />
    );
  } else {
    currentImage = (
      <Image
        style={{
          height: imageSize,
          width: imageSize,
          resizeMode: 'contain',
        }}
        source={{uri: data?.imageUrl}}
      />
    );
  }
  const category = data?.category?.toLowerCase?.();
  const status = data?.status?.toLowerCase?.();

  let action = null;
  let shortDetails = data?.summary;

  if (category == 'user-user transfer' || category == 'bank transfer') {
    if (data?.status == 'debit') {
      action = 'You sent';
    } else {
      action = 'You received';
    }

    if (category == 'user-user transfer') {
    } else {
      shortDetails = '';
    }
  } else if (category == 'crypto') {
    if (status == 'credit') {
      action = 'You received';
    } else {
      action = 'You sold';
    }
  } else if (category == 'gift card') {
    if (status == 'debit') {
      action = 'You bought';
    } else {
      action = 'You sold';
    }
  } else if (category == 'bill payment') {
    action = 'You bought';
  } else if (category == 'credit card' || category == 'wallet') {
    action = 'You received';
  }

  const time = moment(data?.created_at)?.format('dddd, D MMM - hh:mma');

  return (
    <ScrollView
      contentContainerStyle={{paddingBottom: 50}}
      showsVerticalScrollIndicator={false}>
      <ViewShot ref={viewShotRef} style={{backgroundColor: COLORS.lightGrey}}>
        <Text
          fontType={FONTS.FREDOKA}
          size={16}
          color={COLORS.lightBlue}
          style={{textAlign: 'center', paddingTop: 20, paddingBottom: 10}}>
          {time}
        </Text>
        <View
          style={{
            alignItems: 'center',
            marginTop: 10,
            flex: 1,
            minHeight: '80%',
          }}>
          <View
            style={{
              height: s(80),
              width: s(80),
              backgroundColor: COLORS.white,
              borderRadius: 80,
              justifyContent: 'center',
              alignItems: 'center',
              overflow: 'hidden',
            }}>
            {currentImage}
          </View>
          <Text medium style={{marginTop: 10}}>
            {action}
          </Text>
          <View style={{marginTop: 40}}>
            {data?.receiptDetails?.name ? (
              <Text size={18} medium style={{textAlign: 'center'}}>
                {data?.receiptDetails?.name}
              </Text>
            ) : null}

            <Text
              size={14}
              color={COLORS.lightBlue}
              style={{textAlign: 'center', paddingTop: 2}}>
              {shortDetails}
            </Text>
          </View>

          <View style={{marginTop: 30}}>
            <DisplayAmount
              iconColor={COLORS.voodoo}
              iconSize={18}
              textStyle={{paddingTop: 10, paddingRight: 10}}
              iconConStyle={{paddingLeft: 0}}
              color={COLORS.voodoo}
              amount={data?.amount ?? 0}
              mainSize={28}
              decimalSize={20}
            />

            {data?.receiptDetails?.transactionFee ? (
              <Text
                size={14}
                color={COLORS.lightBlue}
                style={{textAlign: 'center', paddingTop: 2}}>
                Transaction fee - ₦{data?.receiptDetails?.transactionFee}
              </Text>
            ) : null}
          </View>

          <View style={{marginTop: 50, width: '100%'}}>
            <Text
              size={14}
              color={COLORS.black}
              style={{textAlign: 'center', paddingTop: 2}}>
              Transaction Details
            </Text>
            <View style={{marginTop: 30}}>
              {data?.category ? (
                <List title="Transfer type" subTitle={data?.category ?? ''} />
              ) : null}

              {data?.receiptDetails?.transactionId ?? data?._id ? (
                <List
                  title="Transaction ID"
                  subTitle={data?.receiptDetails?.transactionId ?? data?._id}
                />
              ) : null}
            </View>
          </View>
        </View>
      </ViewShot>
      <View
        style={{
          marginTop: 40,
          alignItems: 'center',
          width: '100%',
          flex: 1,
          justifyContent: 'flex-end',
        }}>
        <Button
          title="Share Receipt"
          rightIcon={<Icons.Share />}
          size={35}
          onPress={captureAndShareScreenshot}
        />
      </View>
    </ScrollView>
  );
};

export default TransactionDetails;
