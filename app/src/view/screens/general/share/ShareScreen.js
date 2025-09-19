import React from 'react';
import {
  Button,
  CustomSafeAreaView,
  Icons,
  Text,
} from '../../../components/general';
import {AppNav, MainHeader} from '../../../components/layouts';
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {AVATAR, COLORS, GENERAL, IMAGES} from '../../../../conts';
import {PageList} from '../../../components/lists';
import {useLayouts, useUser} from '../../../../hooks';
import {Copy, fetchRequest, formatAmount} from '../../../../helper';
import Share from 'react-native-share';
import Line from '../../../components/general/others/Line';
import {useQuery} from 'react-query';
import Toast from '../../../components/toast/Toast';

const List = ({item}) => {
  return (
    <View
      style={{
        // ...styles.list,
        width: '100%',
      }}>
      <View
        style={{
          ...styles.list,
        }}>
        <Image
          style={{height: 50, width: 50, borderRadius: 100, marginRight: 10}}
          source={AVATAR.avatar}
        />
        <View style={{flex: 1}}>
          <Text size={14} fontWeight={'700'} color={'#231F20'}>
            {item?.firstName} {item?.firstName}
          </Text>
          <Text
            style={{marginTop: 3}}
            size={12}
            fontWeight={800}
            color={'#231F20'}>
            {item?.phoneNumber}
          </Text>
        </View>
      </View>
    </View>
  );
};

const Btn = ({title, style, onPress}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        height: 50,
        backgroundColor: '#CBDB31',
        borderRadius: 32,
        paddingHorizontal: 15,
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        ...style,
      }}>
      <Icons.Share size={26} />
      <Text size={12} bold style={{marginLeft: 8}} color={COLORS.darkBlue}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const getReferred = async () => {
  try {
    const response = await fetchRequest({
      path: 'refer',
      method: 'GET',
      showLoader: false,
    });
    return response?.data;
  } catch (error) {
    throw error;
  }
};

const claimPoints = async () => {
  try {
    const response = await fetchRequest({
      path: 'refer/claim-reward',
    });
    Toast.show('success', 'Success');
  } catch (error) {
    throw error;
  }
};

export const ShareScreen = ({navigation}) => {
  const {user} = useUser();

  const {data} = useQuery({queryFn: getReferred, queryKey: ['getReferred']});

  const referStats = data?.referStats || {};

  const referred = data?.referred || [];

  const {minHeight} = useLayouts();
  return (
    <CustomSafeAreaView>
      <MainHeader
        title={
          <Text size={25} semiBold color={'#002055'} textAlign={'right'}>
            Refer and Earn
          </Text>
        }
        nav
        icon={<></>}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: 0,
          paddingBottom: 40,
          paddingHorizontal: 20,
          minHeight: minHeight - 70,
        }}>
        <View style={{borderRadius: 26, height: 200}}>
          <Image
            source={require('../../../../assets/images/others/refBg.png')}
            style={{
              height: 200,
              borderRadius: 26,
              position: 'absolute',
              width: '100%',
            }}
          />
          <View
            style={{
              height: 160,
              backgroundColor: COLORS.white,
              marginTop: 32,
              zIndex: 10,
              borderRadius: 26,
              marginHorizontal: 8,
              paddingVertical: 15,
            }}>
            <View style={{paddingHorizontal: 15}}>
              <Text size={12} medium color={'#231F20'}>
                Total Earnings
              </Text>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Text size={34} medium>
                  {GENERAL.nairaSign}
                  {formatAmount(referStats?.totalEarned)}
                </Text>

                <View
                  style={{
                    height: 36,
                    backgroundColor: '#DDDDDD',
                    paddingHorizontal: 10,
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderRadius: 18,
                  }}>
                  <Image
                    style={{height: 20, width: 20}}
                    source={IMAGES.ngLogo}
                  />
                  <Text
                    style={{marginLeft: 3}}
                    color={'#231F20'}
                    size={12}
                    medium>
                    NGN
                  </Text>
                </View>
              </View>
            </View>
            <View
              style={{
                width: '100%',
                backgroundColor: '#F5F5F5',
                height: 1,
                marginTop: 15,
              }}
            />

            <View
              style={{
                paddingHorizontal: 15,
                marginTop: 10,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <View>
                <Text color={'#231F20'} medium size={16}>
                  {referStats?.totalReferred || 0}
                </Text>
                <Text size={12} color={'#231F20'}>
                  Total Referrals
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => {
                  claimPoints();
                }}
                style={{
                  height: 40,
                  backgroundColor: '#CBDB31',
                  borderRadius: 32,
                  paddingHorizontal: 15,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text
                  size={11}
                  bold
                  style={{marginLeft: 8}}
                  color={COLORS.darkBlue}>
                  Claim Point
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 40,
            marginBottom: 10,
            justifyContent: 'space-between',
            paddingHorizontal: 5,
          }}>
          <Text color={'#002055'} fontWeight={'700'} size={16} style={{}}>
            AJB-RFLC/{user?.refCode}
          </Text>
          <Icons.Copy
            size={20}
            onPress={() => {
              Copy(user?.refCode);
            }}
          />
        </View>

        <Text style={{paddingHorizontal: 5}} color={'#979797'} size={12} medium>
          Copy this code or share to your friends, family and acquaintances to
          help you start making money in your sleep. We remain your surest plug
          🔌
        </Text>

        <View style={{paddingHorizontal: 5}}>
          <Line />

          <View style={{flexDirection: 'row'}}>
            <Btn
              onPress={() => {
                Share.open({
                  message: user?.refCode,
                  title: `Copy this code or share to your friends, family and acquaintances to
          help you start making money in your sleep. We remain your surest plug
          🔌`,
                });
              }}
              style={{width: 140, flex: 0}}
              title={'Share Code'}
            />
            <View style={{width: 10}} />
            <Btn
              onPress={() => {
                Share.open({
                  url:
                    GENERAL.platform == 'ios'
                      ? GENERAL.appsLinkToStore.ios
                      : GENERAL.appsLinkToStore.android,
                  message: `Copy this code or share to your friends, family and acquaintances to
          help you start making money in your sleep. We remain your surest plug
          🔌`,
                });
              }}
              style={{backgroundColor: '#FFC849'}}
              title={'App download link'}
            />
          </View>

          <Line />
        </View>

        <View style={{paddingHorizontal: 5}}>
          <Text bold size={18} color={COLORS.darkBlue}>
            Your Referrals
          </Text>
          <Text color={'#979797'} size={12} medium>
            Here is a compilation of all persons that have signed up with your
            link or code.
          </Text>
          {referred?.length > 0 ? (
            <View style={{marginTop: 10}}>
              {referred?.map(item => (
                <List item={item} />
              ))}
            </View>
          ) : (
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 20,
              }}>
              <Image
                style={{height: 153, width: 153}}
                source={require('../../../../assets/images/others/noRef.png')}
              />
              <Text style={{marginTop: 10}} size={11}>
                No one yet... start with your friend.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </CustomSafeAreaView>
  );
};

const styles = StyleSheet.create({
  list: {
    height: 70,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#DEDEDE',
  },
});
