import React from 'react';
import {View, Image} from 'react-native';
import {Button, Icons, Text} from '../../general';
import {COLORS, FONTS} from '../../../../conts';
import {s} from 'react-native-size-matters';
import {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import LottieView from 'lottie-react-native';
import QRCode from 'react-native-qrcode-svg';
import {Copy} from '../../../../helper';
import ViewShot from 'react-native-view-shot';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import {NotifyYou} from './NotifyYou';
import {BottomSheets} from '../../general';
export const ExternalCryptoWallet = ({details}) => {
  const viewShotRef = React.useRef();

  const captureAndShareScreenshot = () => {
    viewShotRef?.current?.capture().then(uri => {
      RNFS.readFile(uri, 'base64').then(res => {
        let urlString = 'data:image/jpeg;base64,' + res;
        let options = {
          title: 'Wallet address',
          message: 'Your Wallet address',
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

  return (
    <View style={{height: '100%'}}>
      <BottomSheetScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 50, minHeight: '100%'}}>
        <View style={{marginTop: 20, alignItems: 'center', flex: 1}}>
          <Text textAlign="center">Scan the QR-Code to use wallet</Text>
          {details?.name == 'Tron' && (
            <Text
              style={{marginTop: 10}}
              medium
              color={COLORS.red}
              size={12}
              textAlign="center">
              Minimum TRON Value = $10{'\n'} Any amount sent less than $10 will
              be lost
            </Text>
          )}

          <ViewShot ref={viewShotRef} style={{marginTop: 20, marginBottom: 20}}>
            <QRCode value={details?.address} size={s(200)} />
          </ViewShot>

          <View
            style={{
              flex: 1,
              width: '100%',
              paddingHorizontal: 20,
              marginTop: 10,
            }}>
            <Text
              color={COLORS.primary}
              size={14}
              style={{marginBottom: 20, paddingHorizontal: 20}}>
              {details?.address}
            </Text>
            <Button
              titleStyle={{color: COLORS.primary}}
              title="Share Wallet Address"
              style={{backgroundColor: '#DCE1FA'}}
              rightIcon={<Icons.ShareBlue />}
              onPress={captureAndShareScreenshot}
            />
            <Button
              title="Copy Wallet Address"
              style={{marginTop: 10}}
              rightIcon={<Icons.Copy />}
              onPress={() => {
                Copy(details?.address, 'Address copied');
              }}
            />

            <Button
              style={{
                marginTop: 40,
                backgroundColor: COLORS.green,
              }}
              onPress={() => {
                BottomSheets.show({
                  component: <NotifyYou />,
                  customSnapPoints: [500, 500],
                });
              }}
              title={'Complete Transaction'}
              rightIcon={<Icons.CircleArrowWhite />}
            />
          </View>
        </View>
      </BottomSheetScrollView>
    </View>
  );
};
