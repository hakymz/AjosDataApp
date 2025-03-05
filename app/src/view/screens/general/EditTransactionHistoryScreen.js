import React from 'react';
import {
  Platform,
  StatusBar,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  Button,
  CustomSafeAreaView,
  Icons,
  KeyboardAvoidingViewWrapper,
  Text,
} from '../../components/general';
import {COLORS, FONTS, GENERAL, IMAGES} from '../../../conts';
import {fetchRequest, formatAmount} from '../../../helper';
import moment from 'moment';
// import Intercom from '@intercom/intercom-react-native';
import {Image} from '../../components/general/image';
import {launchImageLibrary} from 'react-native-image-picker';
import ViewShot from 'react-native-view-shot';
import Share from 'react-native-share';
import FastImage from 'react-native-fast-image';
import {useQueryClient} from 'react-query';

const EditPenIcon = ({style}) => {
  return (
    <Image
      style={{
        height: 24,
        width: 24,
        borderRadius: 24,
        ...style,
      }}
      source={require('../../../assets/images/others/editPen.png')}
    />
  );
};

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
      {desCom ?? (
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

export const EditTransactionHistoryScreen = ({route, navigation}) => {
  const details = route?.params || {};

  const customize = details?.customize;

  const viewShotRef = React.useRef();
  const queryClient = useQueryClient();

  const [state, setState] = React.useState({
    saved: false,
    amount: details?.amount,
    image: customize?.logo,
    name: customize?.businessName,
  });

  const getImages = async () => {
    try {
      const deviceImages = await launchImageLibrary({
        selectionLimit: 1,
        mediaType: 'photo',
        quality: 0.5,
      });

      const selectedImage = deviceImages?.assets?.[0];

      const uri =
        GENERAL.platform == 'ios'
          ? selectedImage?.uri?.replace?.('file://', '')
          : selectedImage?.uri;

      const imageObj = {
        name: selectedImage?.fileName,
        type: selectedImage?.type,
        uri: uri,
      };
      if (imageObj?.name) {
        setState(prevState => ({...prevState, image: imageObj}));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const uploadImage = async () => {
    let body = new FormData();
    body.append('file', state?.image);

    // console.log(body);

    try {
      let response;
      if (typeof state?.image == 'object') {
        response = await fetchRequest({
          path: '/fileupload',
          headers: {'Content-Type': 'multipart/form-data'},
          data: body,
        });
      }

      const response2 = await fetchRequest({
        path: `/transaction/update/${details?._id}`,
        data: {
          logo: response?.data || state?.image,
          businessName: state?.name,
          amount: state?.amount * 1,
        },
      });
      queryClient.invalidateQueries({queryKey: ['getWalletHistory']});

      setState(prevState => ({...prevState, saved: true}));
    } catch (error) {
      console.log(error);
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
      title: 'Data + Validity',
      details: details?.receiptDetails?.metaInfo?.receiver,
    },
    {
      title: 'Amount',
      // details: `${GENERAL.nairaSign}${formatAmount(details?.amount)}`,
      desCom: state?.saved ? (
        <Text md size={16} color={'#179338'}>
          {GENERAL.nairaSign}
          {formatAmount(state?.amount)}
        </Text>
      ) : (
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text md size={16} color={'#179338'}>
            {GENERAL.nairaSign}
          </Text>
          <TextInput
            onChangeText={value => {
              setState(prevState => ({...prevState, amount: value}));
            }}
            style={{
              fontSize: 16,
              fontFamily: FONTS.AIRBNBCEREAL_FONTS.Md,
              color: '#179338',
              paddingRight: 20,
            }}
            value={`${state?.amount}`}
          />
          <EditPenIcon
            size={24}
            style={{position: 'absolute', right: -7, bottom: -10}}
          />
        </View>
      ),
    },
    {
      title: 'Date | Time',
      details: moment(details?.created_at).format('DD - MMM - YY | hh:mm:a'),
    },
  ];

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
    }
  };
  React.useEffect(() => {
    Intercom.setLauncherVisibility('GONE');
    return () => {
      Intercom.setLauncherVisibility('VISIBLE');
    };
  }, []);
  return (
    <CustomSafeAreaView>
      <StatusBar barStyle={'dark-content'} />
      {/* <AppNav /> */}
      <KeyboardAvoidingViewWrapper
        style={{}}
        addMinHeight
        contentContainerStyle={{paddingBottom: 20}}
        showsVerticalScrollIndicator={false}>
        <ViewShot ref={viewShotRef} style={{backgroundColor: COLORS.white}}>
          <View
            style={{paddingHorizontal: 20, marginBottom: 30, paddingTop: 40}}>
            {state?.saved ? (
              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <Image
                  resizeMode={FastImage.resizeMode.cover}
                  style={{
                    height: 96,
                    width: 96,
                    marginBottom: 15,
                    borderRadius: 100,
                  }}
                  source={{uri: state?.image?.uri || state?.image}}
                />
                <Text size={18} blk textAlign={'center'}>
                  {state?.name}
                </Text>
              </View>
            ) : (
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View style={{alignItems: 'center'}}>
                  <TouchableOpacity
                    onPress={getImages}
                    style={{
                      height: 82,
                      width: 82,
                      borderWidth: 1,
                      borderColor: '#EAECF0',
                      borderRadius: 32,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Image
                      resizeMode={FastImage.resizeMode.cover}
                      style={{height: 50, width: 50, borderRadius: 100}}
                      source={
                        !state?.image
                          ? IMAGES.logoIcon
                          : {uri: state?.image?.uri || state?.image}
                      }
                    />
                    <EditPenIcon
                      size={24}
                      style={{position: 'absolute', bottom: -20, right: -50}}
                    />
                  </TouchableOpacity>
                  <Text
                    style={{top: 5}}
                    fontWeight={'500'}
                    size={12}
                    color={'#4961AC'}>
                    Edit Logo
                  </Text>
                </View>

                <View
                  style={{
                    height: 50,
                    borderWidth: 1,
                    borderColor: '#EAECF0',
                    flex: 1,
                    marginLeft: 20,
                    borderRadius: 16,
                    top: -10,
                    justifyContent: 'center',
                    paddingHorizontal: 15,
                  }}>
                  <TextInput
                    value={state?.name}
                    onChangeText={value => {
                      setState(prevState => ({...prevState, name: value}));
                    }}
                    placeholderTextColor={COLORS.blue}
                    style={{
                      fontFamily: FONTS.AIRBNBCEREAL_FONTS.Md,
                      fontSize: 15,
                      color: COLORS.blue,
                    }}
                    placeholder="Business Name"
                  />

                  <EditPenIcon
                    size={24}
                    style={{
                      position: 'absolute',
                      right: 0,
                      bottom: Platform.OS == 'ios' ? -2 : 10,
                    }}
                  />
                </View>
              </View>
            )}
          </View>
          <View
            style={{
              marginBottom: 20,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: 20,
            }}>
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
            <Text fontWeight={800} size={16}>
              Transaction Summary
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
            <Text fontWeight={'500'} size={13} color={'#979797'}>
              Remark
            </Text>
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
              <List
                title={item?.title}
                details={`${item?.details}`}
                desCom={item?.desCom}
              />
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
                </View>
              }
            />
          </View>
        </ViewShot>

        {!state?.saved ? (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingHorizontal: 20,
              marginTop: 30,
            }}>
            <View style={{flex: 1}}>
              <Text
                style={{marginRight: 10}}
                size={12}
                color={'#898A8D'}></Text>
            </View>

            <TouchableOpacity
              onPress={() => {
                uploadImage();
              }}
              style={{
                height: 80,
                width: 80,
                backgroundColor:
                  state?.name && state?.image && state?.amount
                    ? COLORS.primary
                    : '#7A7A7A',
                borderRadius: 100,
                justifyContent: 'center',
                alignItems: 'center',

                shadowColor:
                  state?.name && state?.image && state?.amount
                    ? '#820300'
                    : '#7A7A7A',
                shadowOpacity: 0.5,
                shadowRadius: 15,
                elevation: 15,
                shadowOffset: {width: 10, height: 10},
                zIndex: 10,
              }}>
              <Text md size={14} color={COLORS.white}>
                SAVE
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View
            style={{
              flexDirection: 'row',
              marginTop: 30,
              flex: 1,
              paddingHorizontal: 20,
            }}>
            <Button
              onPress={() => {
                setState(prevState => ({...prevState, saved: false}));
              }}
              type="lightGrey"
              style={{
                flex: 1,
                paddingHorizontal: 0,
              }}
              fontSize={14}
              title={'Edit Again'}
            />
            <View style={{width: 10}} />
            <Button
              onPress={() => {
                captureAndShareScreenshot();
              }}
              style={{flex: 1, paddingHorizontal: 0}}
              fontSize={14}
              title={`Share Receipt`}
            />
          </View>
        )}
      </KeyboardAvoidingViewWrapper>
    </CustomSafeAreaView>
  );
};
