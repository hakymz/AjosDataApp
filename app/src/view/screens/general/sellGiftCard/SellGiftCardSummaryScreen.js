import React from 'react';
import {ScrollView, View, TouchableOpacity} from 'react-native';
import {COLORS, FONTS, GENERAL} from '../../../../conts';
import {useLayouts} from '../../../../hooks';
import {
  BalanceContainer,
  Button,
  CustomSafeAreaView,
  Text,
} from '../../../components/general';
import {AppNav} from '../../../components/layouts';
import {SectionList} from '../../../components/lists';
import {Image} from '../../../components/general/image';
import {
  fetchRequest,
  formatAmount,
  openSuccessScreen,
  uploadImage,
} from '../../../../helper';
import {s} from 'react-native-size-matters';
import {Preloader} from '../../../components/loaders';

const ImageButton = ({number = 1, item, onPress}) => {
  return (
    <TouchableOpacity
      style={{paddingRight: 5}}
      activeOpacity={0.7}
      onPress={onPress}>
      <View
        style={{
          height: s(41),
          width: s(41),
          backgroundColor: '#D5EAE0',
          borderRadius: 50,
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: 5,
          overflow: 'visible',
        }}>
        <Text color={COLORS.primary} semiBold size={14}>
          {number}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export const SellGiftCardSummaryScreen = ({navigation, route}) => {
  const details = route?.params || {};

  const {minHeight} = useLayouts();

  const dataList = [
    {
      title: details?.name,
      des: 'Gift Card Brand',
      right: (
        <View>
          <Image
            style={{height: 38, width: 38, borderRadius: 100}}
            source={{uri: details?.avatar}}
          />
        </View>
      ),
    },
    {
      title: details?.cardSubCategory?.name,
      des: 'Gift Card Sub-category',
    },
    {
      title: `${details?.amount}`,
      des: 'Amount',
      right: (
        <Text semiBold lineHeight={24} size={20}>
          ₦{formatAmount(details?.amount * details?.cardSubCategory?.rate)}
        </Text>
      ),
    },
    {
      title: `${details?.note || ''}`,
      desStyle: {width: '100%'},
      desComponent: (
        <View style={{width: '100%'}}>
          {details?.note && (
            <Text color={'#868686'} size={12} numberOfLines={1}>
              E-Code | Notes
            </Text>
          )}

          <View
            style={{
              marginTop: 10,
              alignItems: 'flex-end',
              flex: 1,
              width: '100%',
              right: -20,
            }}>
            <ScrollView showsHorizontalScrollIndicator={false} horizontal>
              {details?.selectedImages?.map?.((item, index) => (
                <ImageButton
                  number={index + 1}
                  item={item}
                  onPress={() => {
                    navigation.navigate('PreviewImageScreen', {
                      image: item?.uri,
                    });
                  }}
                />
              ))}
            </ScrollView>
          </View>
        </View>
      ),
      right: null,
    },
  ];

  const sellGiftCard = async () => {
    let imagesLink;
    Preloader.show();
    const filteredImages = [];

    if (details?.selectedImages) {
      details?.selectedImages?.forEach?.((element, index) => {
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

      imagesLink = await uploadImage(filteredImages);
    }

    try {
      const response = await fetchRequest({
        path: 'giftcard/sell',
        data: {
          cardSubcategoryId: details?.cardSubCategory?._id,
          purchaseAmount: details?.amount,
          ecode: details?.note,
          uploadPath: imagesLink,
        },
        method: 'POST',
        pageError: {navigation},
      });

      navigation.navigate('HomeScreen');

      openSuccessScreen({
        navigation,
        btnTitle: 'View Transaction History',
        indicatorWidth: '80%',
        indicatorText: '80% complete',
        indicatorTextColor: '#9C9C9C',
        subTitle:
          'We would credit your Naira (NGN) account in a few minutes. Let finish all our checks.',
        proceed: () => navigation.navigate('HistoryNavigation'),
      });
    } catch (error) {
      console.log(error, 'error ....');
    }
  };

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
        <View style={{marginTop: 10}}>
          <SectionList item={dataList} />
        </View>
        <View
          style={{
            flex: 1,
            paddingHoriontal: 0,
            paddingTop: 5,
          }}>
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
              This card only works in the currency selected above. And can’t be
              returned in cases of errors on the users’ part. So check that
              everything entered is correct, because we would not be liable for
              <Text color={COLORS.primary} size={12} bold>
                {' '}
                negligences{' '}
              </Text>
              as these are digital assets.
            </Text>
          </View>
          <View style={{paddingHorizontal: 30}}>
            <Button
              onPress={sellGiftCard}
              type="black"
              title={'Review then click here'}
            />
          </View>
        </View>
      </ScrollView>
    </CustomSafeAreaView>
  );
};
