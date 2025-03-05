import React from 'react';
import {ActivityIndicator, Image, StyleSheet, View} from 'react-native';
import {COLORS, GENERAL, IMAGES} from '../../../../conts';
import {
  Copy,
  fetchRequest,
  formatAmount,
  openSuccessScreen,
  uploadImage,
} from '../../../../helper';
import {useTradeData, useUser} from '../../../../hooks';
import {BottomSheets, Button, CopyIcon, MyIcons, Text} from '../../general';
import Line from '../../general/others/Line';
import {SectionList} from '../../lists';
import {useQuery} from 'react-query';
import {
  selectNGNWallet,
  selectUSDWallet,
} from '../../../../selectors.js/index.js';
import {s} from 'react-native-size-matters';
import {UploadImage} from '../../giftCard';
import {useNavigation} from '@react-navigation/native';
import Toast from '../../toast/Toast';
import {Preloader} from '../../loaders';
export const UploadProfOfPayment = ({amount}) => {
  console.log(amount);
  const navigation = useNavigation();
  const [state, setState] = React.useState({selectedImages: []});
  const {settings, data} = useUser();

  const {allRates} = useTradeData();
  const uploadProf = async () => {
    Preloader.show();
    let file;

    const filteredImages = [];

    if (state?.selectedImages) {
      state?.selectedImages?.forEach?.((element, index) => {
        const uri =
          GENERAL.platform == 'ios'
            ? element?.uri?.replace?.('file://', '')
            : element?.uri;
        filteredImages.push({
          name: element?.fileName,
          type: element?.type,
          uri: uri,
        });
      });
      file = await uploadImage(filteredImages);
    }

    console.log(file, 'file filefile vv');

    try {
      const response = await fetchRequest({
        path: 'wallet/payment-proof',
        method: 'POST',
        data: {
          rate: allRates?.currency_swap?.rate * 1,
          amount: amount * 1,
          file,
        },
        pageError: {navigation},
      });
      if (response?.status == 'success') {
        BottomSheets.hide();
        openSuccessScreen({
          navigation,
          indicatorWidth: '80%',
          indicatorText: '80% complete',
          indicatorTextColor: '#9C9C9C',
        });
      }
    } catch (error) {
      Preloader.hide();
      console.log(error);
      throw error;
      //send the request after some seconds
    } finally {
      BottomSheets.hide();
    }
  };

  return (
    <View style={{marginBottom: 30, minHeight: '85%'}}>
      <View style={styles.headerCon}>
        <Image
          style={{height: 20, width: 20, marginRight: 7}}
          source={settings?.currency == 'USD' ? IMAGES.usaLogo : IMAGES.ngLogo}
        />
        <Text bold color={COLORS.primary} lineHeight={25} size={20}>
          {settings?.currency == 'USD' ? 'Dollar Account' : 'Naira Account'}
        </Text>
        <Text size={12} color={COLORS.primary}>
          {settings?.currency == 'USD' ? ' (USD)' : ' (NGN)'}
        </Text>
      </View>

      <Line />
      <View style={styles.balanceCon}>
        <View>
          <Text color={'#0F1819'} style={{flex: 1}} numberOfLines={1} size={12}>
            Send this Amount
          </Text>
          {settings.currency == 'USD' && (
            <Text
              color={'#0F1819'}
              style={{flex: 1}}
              numberOfLines={1}
              size={12}>
              Rate -{' '}
              <Text size={12} semiBold color={COLORS.primary}>
                {allRates?.currency_swap?.rate}/$
              </Text>
            </Text>
          )}
        </View>

        <Text
          textAlign={'right'}
          style={{flex: 1, paddingLeft: 20}}
          numberOfLines={1}
          semiBold
          lineHeight={25}
          color={COLORS.primary}
          size={20}>
          {settings?.currency == 'USD' ? GENERAL.dollarSign : GENERAL.nairaSign}

          {formatAmount(amount)}
        </Text>
      </View>
      <View style={{paddingHorizontal: 30}}>
        <Text lineHeight={15} size={12} semiBold style={{marginBottom: 20}}>
          Please send a screenshot of the transaction from your end for Quick
          payment.
        </Text>
        <UploadImage
          title="Upload Payment Proof"
          updateImages={images => {
            setState(prevState => ({...prevState, selectedImages: images}));
          }}
          selectedImages={state.selectedImages}
        />

        <View style={{paddingHorizontal: 30, marginTop: 30}}>
          <Button
            type="black"
            title={'Submit Details'}
            onPress={() => {
              if (state.selectedImages?.length > 0) {
                uploadProf();
              } else {
                Toast.show('error', 'Upload image to continue');
              }
            }}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerCon: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 5,
    alignItems: 'center',
  },
  balanceCon: {
    paddingHorizontal: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
    marginBottom: 20,
  },
});
