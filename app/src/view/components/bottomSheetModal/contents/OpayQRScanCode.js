import React from 'react';
import {View} from 'react-native';
import {BottomSheets, Button, Text} from '../../general';
import QRCode from 'react-native-qrcode-svg';
import Toast from '../../toast/Toast';
import ViewShot from 'react-native-view-shot';
import {COLORS} from '../../../../conts';
import Share from 'react-native-share';

export const OpayQRScanCode = ({qrCode}) => {
  const viewShotRef = React.useRef();
  const captureAndSaveScreenshot = async () => {
    try {
      const uri = await viewShotRef.current.capture();

      BottomSheets.hide();
      let options = {
        title: 'Qrcode',
        uri,
        message: '',
      };
      Share.open(options)
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
      Toast.show('error', 'Could not share');
    } finally {
    }
  };
  return (
    <View style={{paddingHorizontal: 24}}>
      <Text textAlign={'right'} size={18} fontWeight={800}>
        Opay Wallet
      </Text>
      <Text
        size={14}
        fontWeight={'500'}
        style={{marginTop: 30, paddingLeft: 10}}>
        Scan or Share QR Code
      </Text>
      <ViewShot ref={viewShotRef} style={{backgroundColor: COLORS.white}}>
        <View
          style={{
            flex: 1,
            marginTop: 30,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <QRCode size={150} value={qrCode} />
        </View>
      </ViewShot>
      <View style={{flexDirection: 'row', marginTop: 40}}>
        <Button
          onPress={() => {
            BottomSheets.hide();
          }}
          fontSize={14}
          type="lightGrey"
          style={{width: 122, marginRight: 10, paddingHorizontal: 0}}
          title={'Delete'}
        />
        <Button
          onPress={() => {
            captureAndSaveScreenshot();
          }}
          fontSize={14}
          style={{width: 'auto', flex: 1, paddingHorizontal: 0}}
          title={'Share QR Code'}
        />
      </View>
      <View style={{paddingTop: 20}}>
        <Text lineHeight={16} color={'#828282'} size={12} fontWeight={'400'}>
          You cannot proceed till a Virtual bank account is generated from the
          desired Bank.
        </Text>
      </View>
    </View>
  );
};
