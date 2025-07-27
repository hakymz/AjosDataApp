import React from 'react';
import {Image, Platform, TouchableOpacity, View} from 'react-native';
import {BottomSheets, Button, Icons, Text} from '../../general';
import {COLORS, GENERAL, IMAGES} from '../../../../conts';
import {
  Copy,
  fetchRequest,
  formatAmount,
  openSuccessScreen,
} from '../../../../helper';
import {useNavigation} from '@react-navigation/native';
import moment from 'moment';
import ViewShot from 'react-native-view-shot';
import {PERMISSIONS} from 'react-native-permissions';
import grantPermission from '../../../../helper/other/grantPermission';
import Toast from '../../toast/Toast';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';
const OsVer = Platform.constants['Release'];
import Share from 'react-native-share';

const List = ({title, details, desCom}) => {
  return (
    <View
      style={{
        minHeight: 54,
        borderRadius: 8,
        backgroundColor: '#F8F8F8',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        justifyContent: 'space-between',
        marginBottom: 7,
      }}>
      <Text
        numberOfLines={1}
        style={{paddingRight: 10, maxWidth: 200}}
        fontWeight={'500'}
        size={13}
        color={'#979797'}>
        {title}
      </Text>
      {desCom || (
        <Text
          textAlign={'right'}
          numberOfLines={1}
          size={16}
          color={COLORS.blue}
          fontWeight={'500'}
          style={{flex: 1}}>
          {details}
        </Text>
      )}
    </View>
  );
};

export const TransactionSummary = ({proceed, btnTitle = 'Data', details}) => {
  const navigation = useNavigation();
  const [state, setState] = React.useState({showBtn: true});

  console.log(details);

  const viewShotRef = React.useRef();

  const buyAgain = async transactionPin => {
    try {
      const response = await fetchRequest({
        path: `billpayment/buy-again/${details?.transactionId}`,
        data: {transactionPin},
        method: 'POST',
        pageError: {
          navigation,
        },
      });
      openSuccessScreen({
        navigation,
        proceed: () => {
          navigation.navigate('HistoryScreen');
        },
      });
    } catch (error) {}
  };

  const captureAndSaveScreenshot = async () => {
    setState(prevState => ({...prevState, showBtn: false}));
    try {
      const uri = await viewShotRef.current.capture();

      let permision = true;

      if (Platform.OS == 'android' && OsVer < 12) {
        permision = await grantPermission([
          PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
          PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
        ]);
      }

      if (permision) {
        await CameraRoll.save(uri);
        Toast.show('success', 'Receipt downloaded');
        BottomSheets.hide();
      }
    } catch (error) {
      Toast.show('error', 'Could not download receipt');
    } finally {
      setState(prevState => ({...prevState, showBtn: true}));
    }
  };

  const captureAndShareScreenshot = async () => {
    setState(prevState => ({...prevState, showBtn: false}));
    try {
      const uri = await viewShotRef.current.capture();

      let options = {
        title: 'Transations',
        message: 'Transaction reciept',
        url: uri,
        type: 'image/jpeg',
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
    } finally {
      setState(prevState => ({...prevState, showBtn: true}));
    }
  };

  const lists = [
    {
      title: 'Transaction type',
      details:
        details?.receiptDetails?.info == 'Data Transfer'
          ? 'Data to Cash'
          : details?.receiptDetails?.info || details?.type,
    },
    {
      title: 'Customer’s No',
      details: details?.receiptDetails?.metaInfo?.receiver,
    },
    {
      title: 'Amount',
      details: `${GENERAL.nairaSign}${formatAmount(details?.amount)}`,
    },
    {
      title: 'Date | Time',
      details: moment(details?.created_at).format('DD - MMM - YY | hh:mm:a'),
    },
    {
      title: 'Initial Balance',
      details: `${GENERAL.nairaSign}${formatAmount(details?.previousBalance)}`,
    },
    {
      title: 'Post-purchase Balance',
      details: `${GENERAL.nairaSign}${formatAmount(details?.newBalance)}`,
    },
  ];
  return (
    <View style={{flex: 1}}>
      <ViewShot ref={viewShotRef} style={{backgroundColor: COLORS.white}}>
        <View style={{marginTop: 20, marginBottom: 30, paddingHorizontal: 20}}>
          <View
            style={{
              marginBottom: 20,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <View style={{flexDirection: 'row'}}>
              <View
                style={{
                  height: 26,
                  borderWidth: 1,
                  borderColor: '#179338',
                  width: 83,
                  borderRadius: 6,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text fontWeight="700" color={COLORS.green} size={12}>
                  {details?.state}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  BottomSheets.hide();
                  navigation.navigate('PinScreen', {
                    proceed: pin => {
                      buyAgain(pin, state?.useCashback);
                    },
                  });
                }}
                style={{
                  height: 26,
                  backgroundColor: '#179338',
                  width: 83,
                  borderRadius: 6,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginLeft: 10,
                }}>
                <Text fontWeight="700" color={COLORS.white} size={12}>
                  Buy Again
                </Text>
              </TouchableOpacity>
            </View>

            <Text fontWeight={800} size={18}>
              Summary
            </Text>
          </View>
          <Text color={'#828282'} size={12}>
            Here is a Summary of the selected Transaction and it can be share if
            desired.
          </Text>
        </View>

        <View
          style={{
            height: 100,
            borderRadius: 8,
            backgroundColor: '#F8F8F8',
            paddingHorizontal: 20,
            justifyContent: 'center',
            marginBottom: 7,
            marginHorizontal: 30,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text fontWeight={'500'} size={13} color={'#979797'}>
              Remark
            </Text>
            <Icons.Copy
              size={20}
              onPress={() => {
                Copy(details?.summary);
              }}
            />
          </View>

          <Text
            style={{marginTop: 5}}
            fontWeight={'500'}
            size={11}
            color={'#979797'}>
            {details?.summary}
          </Text>
        </View>

        <View style={{paddingHorizontal: 30}}>
          {lists?.map(item => (
            <List title={item?.title} details={`${item?.details}`} />
          ))}
        </View>
        <View style={{paddingHorizontal: 10}}>
          <List
            title={'Transaction ID'}
            desCom={
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  width: '100%',
                  flex: 1,
                }}>
                <Text
                  style={{flex: 1, marginRight: 10}}
                  textAlign={'right'}
                  numberOfLines={2}
                  size={16}
                  color={COLORS.blue}
                  fontWeight={'500'}>
                  {details?.transactionId}
                </Text>
                <Icons.Copy
                  size={20}
                  onPress={() => {
                    Copy(details?.transactionId);
                  }}
                />
              </View>
            }
          />
        </View>
        <View style={{paddingHorizontal: 30}}>
          {!state?.showBtn && (
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 20,
                marginBottom: 20,
              }}>
              <Image style={{width: 99, height: 43}} source={IMAGES.Logo} />
            </View>
          )}
        </View>
      </ViewShot>
      <View style={{flex: 1, paddingBottom: 20}}>
        {state?.showBtn && (
          <View
            style={{
              flexDirection: 'row',
              marginTop: 20,
              paddingHorizontal: 24,
            }}>
            <Button
              onPress={() => {
                captureAndShareScreenshot();
              }}
              type="lightGrey"
              style={{
                flex: 1,
                paddingHorizontal: 0,
              }}
              fontSize={14}
              title={'Share Receipt'}
            />
            <View style={{width: 10}} />
            <Button
              onPress={() => {
                BottomSheets.hide();
                navigation.navigate('EditTransactionHistoryScreen', details);
              }}
              style={{flex: 1, paddingHorizontal: 0}}
              fontSize={14}
              title={`Edit Receipt`}
            />
          </View>
        )}
      </View>
    </View>
  );
};
