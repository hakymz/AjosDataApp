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
import {COLORS, GENERAL, IMAGES} from '../../../../conts';
import {PageList} from '../../../components/lists';
import {useLayouts, useUser} from '../../../../hooks';
import {Copy} from '../../../../helper';
import Share from 'react-native-share';
import Line from '../../../components/general/others/Line';

const Btn = ({title, style}) => {
  return (
    <TouchableOpacity
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

export const ShareScreen = ({navigation}) => {
  const {
    data: {user = {}},
  } = useUser();

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
                  {GENERAL.nairaSign}0.00
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

            <View style={{paddingHorizontal: 15, marginTop: 10}}>
              <Text color={'#231F20'} medium size={16}>
                0
              </Text>
              <Text size={12} color={'#231F20'}>
                Total Referrals
              </Text>
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
            AJB-RFLC/Bankole193
          </Text>
          <Icons.Copy size={20} />
        </View>

        {/* <PageList style={{height: 68, flex: 0}}>
          <View>
            <Text size={16} fontWeight={'500'} color={COLORS.blue}>
              {user?.refCode}
            </Text>
          </View>

          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity
              onPress={() => {
                let options = {
                  title: 'Refferal Code',
                  message: user?.refCode,
                };
                Share.open(options)
                  .then(res => {
                    console.log(res);
                  })
                  .catch(err => {
                    console.log(err);
                  });
              }}
              style={{
                height: 36,
                width: 36,
                borderWidth: 1,
                borderColor: '#EAECF0',
                borderRadius: 12,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 5,
              }}>
              <Icons.Share size={15} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                Copy(user?.refCode);
              }}
              style={{
                height: 36,
                width: 36,
                borderWidth: 1,
                borderColor: '#EAECF0',
                borderRadius: 12,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Icons.Copy size={15} />
            </TouchableOpacity>
          </View>
        </PageList> */}
        <Text style={{paddingHorizontal: 5}} color={'#979797'} size={12} medium>
          Copy this code or share to your friends, family and acquaintances to
          help you start making money in your sleep. We remain your surest plug
          🔌
        </Text>

        <View style={{paddingHorizontal: 5}}>
          <Line />

          <View style={{flexDirection: 'row'}}>
            <Btn style={{width: 140, flex: 0}} title={'Share Code'} />
            <View style={{width: 10}} />
            <Btn
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
        </View>
      </ScrollView>
    </CustomSafeAreaView>
  );
};

const styles = StyleSheet.create({
  list: {
    height: 72,
    backgroundColor: '#F8F8F8',
    marginBottom: 10,
    borderRadius: 8,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
