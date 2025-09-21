import React from 'react';
import {
  ScrollView,
  View,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import {COLORS, FONTS, GENERAL} from '../../../../conts';
import {useLayouts} from '../../../../hooks';
import {
  BalanceContainer,
  BottomSheets,
  Button,
  CustomSafeAreaView,
  PageIndicator,
  Text,
} from '../../../components/general';
import {AppNav, MainHeader} from '../../../components/layouts';
import {SectionList} from '../../../components/lists';
import {Image} from '../../../components/general/image';
import {
  fetchRequest,
  formatAmount,
  openSuccessScreen,
} from '../../../../helper';
import {s} from 'react-native-size-matters';
import {Preloader} from '../../../components/loaders';
import FastImage from 'react-native-fast-image';
import {
  GiftcardTradeTerms,
  TransactionSummary,
} from '../../../components/bottomSheetModal/modalContents';

const ImageButton = ({number = 1, item, onPress}) => {
  return (
    <TouchableOpacity
      style={{paddingRight: 5}}
      activeOpacity={0.7}
      onPress={onPress}>
      <View
        style={{
          height: 50,
          width: 50,
          backgroundColor: '#D5EAE0',
          borderRadius: 12,
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: 5,
          overflow: 'hidden',
        }}>
        <Image
          resizeMode={FastImage.resizeMode.cover}
          style={{height: 50, width: 50}}
          source={{uri: item?.uri}}
        />
      </View>
    </TouchableOpacity>
  );
};

export const SellGiftCardSummaryScreen = ({navigation, route}) => {
  const details = route?.params || {};

  const {width} = useWindowDimensions();

  const {minHeight} = useLayouts();

  const dataList = [
    {
      title: details?.cardSubCategory?.name,
      des: 'Gift Card Sub-category',
    },
    {
      title: `${details?.amount}`,
      des: 'Gift Card Amount - Sell',
    },
    {
      title: `${GENERAL.nairaSign}${formatAmount(
        details?.amount * details?.cardSubCategory?.rate,
      )}`,
      des: 'How much we will pay you',
      right: (
        <View
          style={{
            height: 34,
            backgroundColor: '#E9E6F7',
            justifyContent: 'center',
            paddingHorizontal: 10,
            borderRadius: 32,
          }}>
          <Text size={12} bold>
            Rate: ₦{details?.cardSubCategory?.rate}
          </Text>
        </View>
      ),
    },
    details?.ecode && {
      title: `${details?.ecode}`,
      des: 'Comment/Card E-Code',
      titleStyle: {color: COLORS.primary},
    },
    details?.selectedImages?.length > 0 && {
      title: ``,
      desStyle: {width: '100%'},
      desComponent: (
        <View style={{width: '100%'}}>
          <View
            style={{
              marginTop: 0,
              flex: 1,
              width: '100%',
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
  console.log(
    details?.cardSubCategory?.sub_category_id,
    'details?.cardSubCategory?.ixd',
  );

  const sellGiftCard = async () => {
    let imagesLink;
    Preloader.show();
    const formData = new FormData();
    formData.append('type', 'giftcard');

    try {
      if (details?.selectedImages?.length > 0) {
        details?.selectedImages?.forEach?.((element, index) => {
          console.log(element);
          const uri =
            GENERAL.platform == 'ios'
              ? element?.uri?.replace?.('file://', '')
              : element?.uri;
          console.log(element?.type);
          formData.append('file', {
            name: element?.fileName,
            type: element?.type,
            uri: uri,
          });
        });
      }

      const response1 = await fetchRequest({
        path: '/fileupload',
        headers: {'Content-Type': 'multipart/form-data'},
        data: formData,
        method: 'POST',
      });

      imagesLink = response1?.data;

      const response = await fetchRequest({
        path: 'giftcard/sell',
        data: {
          cardSubcategoryId: details?.cardSubCategory?.sub_category_id,
          purchaseAmount: details?.amount,
          ecode: details?.note,
          cardImage: imagesLink,
          currency: 'NGN',
          ecode: details?.ecode,
          cardProperty:
            details?.cardType?.value == 'E-code' ? 'ecode' : 'physical',
        },
        method: 'POST',
        pageError: {navigation},
      });

      navigation.navigate('HomeScreen');

      console.log(response);

      openSuccessScreen({
        navigation,
        btnTitle: 'Go To Receipt',
        titleComponent: (
          <Text textAlign={'center'} medium size={25}>
            We are{' '}
            <Text bold size={25}>
              Reviewing 📋
            </Text>{' '}
          </Text>
        ),
        subTitle:
          'We have successfully the card details and are currently reviewing it.',
        image: (
          <Image
            style={{height: 285, width: 285}}
            source={require('../../../../assets/images/others/giftcardSuccess.png')}
          />
        ),
        proceed: () => {
          BottomSheets.show({
            component: <TransactionSummary details={response?.data} />,
          });
        },
      });
    } catch (error) {
      Preloader.hide();
      console.log(error, 'error ....');
    }
  };

  return (
    <CustomSafeAreaView>
      <MainHeader title={'Sell Gift Card'} nav />

      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          marginBottom: 20,
          marginTop: 0,
          paddingHorizontal: 20,
          justifyContent: 'space-between',
        }}>
        {['100%', '50%'].map(per => (
          <PageIndicator
            style={{width: width / 2 - 25}}
            height={2}
            width={per}
          />
        ))}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: GENERAL.platform == 'ios' ? 40 : 20,
          paddingHorizontal: 20,
          minHeight: minHeight - 80,
        }}>
        <View style={{marginBottom: 30}}>
          <Text size={18} bold>
            Submission for inspection
          </Text>
          <Text style={{marginTop: 5}} medium size={12} color={'#979797'}>
            Please confirm all the details filled to avoid failed transactions
            or errors.
          </Text>
        </View>
        <View
          style={{
            marginTop: 10,
            backgroundColor: COLORS.white,
            borderRadius: 18,
          }}>
          <View
            style={{
              marginTop: 20,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: 20,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Image
                style={{height: 40, width: 40}}
                source={{uri: details?.cardCategory?.avatar}}
              />
              <View
                style={{
                  height: 34,
                  backgroundColor: '#E9E6F7',
                  paddingHorizontal: 10,
                  justifyContent: 'center',
                  borderRadius: 32,
                }}>
                <Text size={12} bold>
                  {details?.cardType?.value}
                </Text>
              </View>
            </View>
            <Text
              textAlign={'right'}
              numberOfLines={1}
              style={{flex: 1}}
              size={16}
              bold>
              {details?.cardCategory?.name}
            </Text>
          </View>
          <SectionList item={dataList} />
        </View>
        <View
          style={{
            flex: 1,
            paddingHoriontal: 0,
            paddingTop: 5,
          }}>
          <View style={{paddingHorizontal: 0, marginTop: 30}}>
            <Button
              onPress={() => {
                BottomSheets.show({
                  component: (
                    <GiftcardTradeTerms
                      data={details}
                      onPress={() => {
                        sellGiftCard();
                      }}
                    />
                  ),
                });
              }}
              title={'Sell Gift-card'}
            />
          </View>
        </View>
      </ScrollView>
    </CustomSafeAreaView>
  );
};
