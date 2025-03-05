import React from 'react';
import {View, ScrollView, TouchableOpacity} from 'react-native';

import {s} from 'react-native-size-matters';
import {AVATAR, COLORS, FONTS, GENERAL} from '../../../conts';
import {
  Button,
  CircleButton,
  CustomSafeAreaView,
  Icons,
  Text,
} from '../../components/general';

import {useLayouts, usePayments, useUser} from '../../../hooks';
import LottieView from 'lottie-react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import GestureRecognizer from 'react-native-swipe-gestures';
import {AddBank} from '../../components/bottomSheetModal/content';
import {
  BottomSheets,
  TransactionStatusModal,
} from '../../components/bottomSheetModal';
import Toast from '../../components/toast/Toast';
import {fetchRequest} from '../../../helper';
import {Image} from '../../components/general/image';

const List = ({item, deleteBank = () => {}}) => {
  const {width} = useLayouts();
  const conLeftPosition = useSharedValue(0);
  const [showButton, setShowButton] = React.useState(false);
  const swipe = direction => {
    if (direction == 'left') {
      setShowButton(true);
      conLeftPosition.value = withTiming(-80, {
        duration: 300,
      });
    } else {
      setShowButton(true);
      conLeftPosition.value = withTiming(0, {
        duration: 300,
      });
      setTimeout(() => {
        setShowButton(false);
      }, 200);
    }
  };
  return (
    <Animated.View
      style={[
        {
          paddingHorizontal: 20,
          flexDirection: 'row',
        },
        useAnimatedStyle(() => {
          return {
            left: conLeftPosition.value,
          };
        }),
      ]}>
      <GestureRecognizer
        style={{flex: 1, flehhhxDirection: 'row'}}
        onSwipeLeft={() => {
          swipe('left');
        }}
        onSwipeRight={() => {
          swipe('right');
        }}>
        <View
          style={{
            height: s(95),
            backgroundColor: '#F7F7F9',
            marginBottom: 10,
            borderRadius: 15,
            flexDirection: 'row',
            alignItems: 'center',
            paddingLeft: 15,
            justifyContent: 'space-between',
            width: width - 40,
          }}>
          <View
            style={{
              height: s(53),
              width: s(53),
              borderColor: '#DCE1FA',
              borderWidth: 2,
              borderRadius: 50,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: COLORS.white,
            }}>
            <Image
              source={{uri: item?.logo}}
              style={{height: s(27), width: s(27), resizeMode: 'contain'}}
            />
          </View>
          <View style={{alignItems: 'flex-end', marginRight: 20, flex: 1}}>
            <Text
              textAlign="right"
              numberOfLines={1}
              medium
              color={COLORS.primary}
              style={{width: '90%'}}>
              {item.accountName}
            </Text>
            <Text
              color={COLORS.lightBlue}
              style={{
                textAlign: 'right',
              }}>
              {item.accountNumber}
            </Text>
          </View>
        </View>
        {showButton && (
          <TouchableOpacity
            onPress={() => {
              swipe('right');
              setTimeout(() => {
                deleteBank(item);
              }, 300);
            }}
            activeOpacity={0.7}
            style={{
              width: s(60),
              backgroundColor: COLORS.darkRed,
              height: s(95),
              marginLeft: 10,
              borderRadius: 15,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Icons.CancelWhiteCircle />
          </TouchableOpacity>
        )}
      </GestureRecognizer>
    </Animated.View>
  );
};

const AddButton = ({onPress}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        marginTop: 10,
        paddingHorizontal: 10,
        flexDirection: 'row',
        flex: 1,
        alignItems: 'flex-end',
      }}>
      <View
        style={{
          height: s(55),
          backgroundColor: '#FAFAFA',
          borderRadius: 70,
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
        }}>
        <Text color={COLORS.voodoo} medium>
          Add New Bank
        </Text>
      </View>
      <View
        style={{
          height: s(60),
          width: s(60),
          backgroundColor: '#DCE1FA',
          borderRadius: 15,
          justifyContent: 'center',
          alignItems: 'center',
          marginLeft: 10,
        }}>
        <Icons.TopUp size={35} />
      </View>
    </TouchableOpacity>
  );
};

export const BanksScreen = ({navigation, route}) => {
  const {data} = useUser();
  const {myBanks, getMyBanks} = usePayments();
  React.useEffect(() => {
    getMyBanks();
  }, []);

  const [state, setState] = React.useState({banks: myBanks ?? []});

  const addBankToList = bank => {
    //Check if bank is already in the list
    let bankAlreadyExists = false;
    const currentBank = {...bank, ...bank?.bank};

    state?.banks?.forEach(element => {
      if (element.accountNumber == bank.accountNumber) {
        bankAlreadyExists = true;
      }
    });
    if (!bankAlreadyExists) {
      setState(prevState => ({
        ...prevState,
        banks: [...prevState.banks, currentBank],
      }));
    } else {
      Toast.show('error', 'Bank already exist');
    }
  };

  const saveAllBanks = async () => {
    try {
      const filteredBanks = state?.banks?.map(item => {
        return {
          accountNumber: item?.accountNumber,
          bankCode: item?.code || item?.bankCode,
        };
      });

      const response = await fetchRequest({
        path: '/bank/addmultiple',
        data: {details: JSON.stringify(filteredBanks)},
      });

      if (response.status == 'success' && response?.data) {
        Toast.show('success', response?.message);
        getMyBanks();
      } else {
        TransactionStatusModal({type: 'error', message: response?.message});
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteBank = bank => {
    const newBanks = state?.banks?.filter(item => {
      // console.log(item?.accountNumber != bank?.accountNumber);
      return item?.accountNumber != bank?.accountNumber;
    });
    console.log('delete');
    setState(prevState => ({...prevState, banks: newBanks}));
  };
  return (
    <CustomSafeAreaView style={{flex: 1}}>
      <View style={{paddingHorizontal: 20, marginTop: 20}}>
        <CircleButton onPress={() => navigation.goBack()} />
      </View>
      <View
        style={{
          height: s(55),
          backgroundColor: '#FAFAFA',
          marginTop: 20,
          marginHorizontal: 40,
          borderRadius: 50,
          paddingHorizontal: 20,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Text color={COLORS.voodoo} size={14} medium>
          Bank Details
        </Text>
        <Icons.BankFront size={33} />
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: 20,
          paddingBottom: GENERAL.platform == 'ios' ? 40 : 60,
          minHeight: '80%',
        }}>
        {state?.banks?.length == 0 && (
          <View style={{alignItems: 'center', marginTop: 50}}>
            <Text size={16} fontType={FONTS.FREDOKA} color={'#AAAAAA'}>
              Nothing to see here... lol
            </Text>
            <LottieView
              resizeMode="cover"
              style={{
                height: s(284),
              }}
              autoPlay
              loop={true}
              source={require('../../../assets/lottieFiles/others/empty.json')}
            />
          </View>
        )}

        {state?.banks?.map((item, index) => (
          <List item={item} deleteBank={deleteBank} />
        ))}
        {state?.banks?.length > 0 && (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingHorizontal: 30,
              marginVertical: 10,
            }}>
            <LottieView
              style={{
                width: s(42),
                transform: [{rotate: '45deg'}],
              }}
              autoPlay
              loop={true}
              source={require('../../../assets/lottieFiles/others/arrowUp.json')}
            />
            <Text color={COLORS.darkRed} size={16} fontType={FONTS.FREDOKA}>
              Swipe left to delete
            </Text>
          </View>
        )}

        {state?.banks?.length > 0 && (
          <Text
            color={COLORS.primary}
            size={12}
            style={{marginTop: 20, paddingHorizontal: 40}}>
            To Edit your bank details on an already saved tab, just click on the
            bank of choice.
          </Text>
        )}

        <View
          style={{
            flex: 1,
            marginTop: 40,
            justifyContent: 'center',
            alignItems: 'flex-end',
            paddingHorizontal: 40,
          }}>
          <AddButton
            onPress={() => {
              BottomSheets.show({
                component: (
                  <AddBank
                    getDetails={bank => {
                      addBankToList(bank);
                    }}
                  />
                ),
                backgroundColor: COLORS.lightGrey,
                customSnapPoints: [600, 600],
              });
            }}
          />
          {(myBanks?.length > 0 || state?.banks?.length > 0) && (
            <Button
              onPress={saveAllBanks}
              title="Save all"
              style={{
                backgroundColor: COLORS.green,
                marginTop: 50,
              }}
              rightIcon={<Icons.CircleArrowWhite />}
            />
          )}
        </View>
      </ScrollView>
    </CustomSafeAreaView>
  );
};
