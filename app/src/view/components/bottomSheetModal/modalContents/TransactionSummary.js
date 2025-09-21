import React from 'react';
import {Image, Platform, TouchableOpacity, View} from 'react-native';
import {BottomSheets, CloseButton, Icons, Text} from '../../general';
import {COLORS, GENERAL, IMAGES} from '../../../../conts';
import {Copy, formatAmount} from '../../../../helper';
import {useNavigation} from '@react-navigation/native';
import moment from 'moment';
import ViewShot from 'react-native-view-shot';
import {PERMISSIONS} from 'react-native-permissions';
import grantPermission from '../../../../helper/other/grantPermission';
import Toast from '../../toast/Toast';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';
const OsVer = Platform.constants['Release'];
import Share from 'react-native-share';

const List = ({name, details, copy}) => {
  return (
    <View
      style={{
        minHeight: 62,
        justifyContent: 'space-between',
        flex: 1,
        borderBottomWidth: 1,
        borderBottomColor: '#F5F5F5',
        paddingBottom: 10,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
      }}>
      <View style={{justifyContent: 'flex-end', flex: 1}}>
        <Text numberOfLines={2} size={16} bold>
          {details}
        </Text>
        <Text size={11} color={'#979797'}>
          {name}
        </Text>
      </View>
      {copy && (
        <Icons.Copy
          size={20}
          onPress={() => {
            Copy(details);
          }}
        />
      )}
    </View>
  );
};
export const TransactionSummary = ({details}) => {
  const navigation = useNavigation();
  const [state, setState] = React.useState({showBtn: true});

  const viewShotRef = React.useRef();

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

  const receiptDetails =
    typeof details?.receiptDetails === 'string'
      ? JSON.parse(details?.receiptDetails)
      : details?.receiptDetails;
  const category = details?.category?.toLowerCase?.();

  const electricityToken = receiptDetails?.metaInfo?.purchased_code;
  let digitName = 'Transaction Mobile Number';
  if (category == 'electricity') {
    digitName = 'Meter Number';
  } else if (category == 'tv subscription') {
    digitName = 'Cable Number';
  } else if (category == 'virtual dollar card') {
    digitName = 'Card Number';
  }

  const lists = [
    {
      title: details?.summary,
      details: 'Remark',
    },

    {
      title: digitName,
      details: receiptDetails?.metaInfo?.receiver,
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
      title: 'Electricity Token',
      details: electricityToken,
      copy: true,
    },
    {
      title: 'Transaction ID/Marker',
      details: `${receiptDetails?.metaInfo?.transactionId}`,
      copy: true,
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
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View
                style={{
                  height: 23,
                  borderColor: '#179338',
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'absolute',
                  backgroundColor: '#37D6A3',
                  borderRadius: 32,
                  paddingHorizontal: 10,
                }}>
                <Text medium color={'#151521'} size={12}>
                  {details?.state}
                </Text>
              </View>
            </View>

            <Text style={{flex: 1}} textAlign={'center'} bold size={22}>
              Receipt
            </Text>
          </View>
          <View style={{marginBottom: 20}}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                height: 56,
                backgroundColor: '#E9E6F7',
                paddingHorizontal: 15,
                borderRadius: 12,
              }}>
              <Image
                style={{height: 43, width: 43, borderRadius: 50}}
                source={{uri: receiptDetails.metaInfo?.image}}
              />
              <Text medium size={16} color={COLORS.darkBlue}>
                {details?.category}
              </Text>
            </View>
          </View>
        </View>

        <View style={{paddingHorizontal: 30}}>
          {lists?.map(
            item =>
              item?.details && (
                <List
                  name={item?.title}
                  details={`${item?.details}`}
                  copy={item?.copy}
                />
              ),
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
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              onPress={captureAndShareScreenshot}
              style={{
                backgroundColor: '#CBDB31',
                height: 50,
                borderRadius: 32,
                paddingHorizontal: 15,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Icons.Share size={26} />
              <Text style={{marginLeft: 5}} size={12} bold>
                Share this Receipt
              </Text>
            </TouchableOpacity>
            <View style={{width: 10}} />
            <CloseButton
              style={{marginTop: 0}}
              onPress={() => {
                BottomSheets.hide();
              }}
              fontSize={14}
              title={`Edit Receipt`}
            />
          </View>
        )}
      </View>
    </View>
  );
};
