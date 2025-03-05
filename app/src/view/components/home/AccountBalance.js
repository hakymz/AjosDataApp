import React from 'react';
import {Modal, ScrollView, TouchableOpacity, View} from 'react-native';
import {COLORS, GENERAL} from '../../../conts';
import {Icons, Text} from '../general';
import {useUser} from '../../../hooks';
import {fetchRequest, formatAmount} from '../../../helper';
import {useQuery} from 'react-query';
import {Image} from '../general/image';

export const AccountBalance = () => {
  const {data, settings, updateUserData} = useUser();
  const [state, setState] = React.useState({showModal: false});
  const getDetails = async () => {
    try {
      const response = await fetchRequest({
        path: '/customer/app-update',
        showLoader: false,
        method: 'GET',
      });
      return response?.data;
    } catch (error) {
      throw error;
    }
  };

  const {data: details} = useQuery('getDetails', getDetails);

  return (
    <View
      style={{
        height: 135,
        backgroundColor: COLORS.primary,
        borderRadius: 10,
        paddingHorizontal: 20,
        paddingVertical: 20,
        paddingLeft: 30,
      }}>
      {state?.showModal && (
        <Modal transparent>
          <View
            style={{
              height: '100%',
              width: '100%',
              backgroundColor: 'rgba(0,0,0,0.7)',
              paddingHorizontal: 20,
              justifyContent: 'center',
            }}>
            <View
              style={{
                backgroundColor: COLORS.white,
                padding: 20,
                borderRadius: 10,
                maxHeight: 500,
              }}>
              <ScrollView>
                <Text textAlign={'center'} color={COLORS.primary} blk size={18}>
                  {details?.subject}
                </Text>
                {details?.image && (
                  <Image
                    style={{height: 88, width: '100%', marginTop: 20}}
                    source={{uri: details?.image}}
                  />
                )}

                <Text
                  style={{marginTop: 20, marginBottom: 10}}
                  fontWeight={500}
                  size={12}>
                  {details?.message}
                </Text>
              </ScrollView>
            </View>

            <View
              style={{
                marginTop: 20,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Icons.CloseCircle
                onPress={() => {
                  setState(prevState => ({...prevState, showModal: false}));
                }}
              />
            </View>
          </View>
        </Modal>
      )}

      <View
        style={{
          backgroundColor: '#C2202C',
          height: 32,
          width: '80%',
          borderRadius: 8,
          justifyContent: 'center',
          paddingHorizontal: 15,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <Text
          size={16}
          fontWeight={'700'}
          color={COLORS.orange}
          textAlign={'center'}>
          {GENERAL.nairaSign}
          {formatAmount(data?.wallet?.cashback?.balance)}
        </Text>
        <Text
          size={11}
          fontWeight={'500'}
          color={COLORS.orange}
          textAlign={'center'}>
          {' '}
          - Cashback Balance
        </Text>
      </View>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 10,
        }}>
        <View
          style={{
            backgroundColor: '#EC2B27',
            height: 49,
            width: '80%',
            borderRadius: 8,
            // paddingHorizontal: 15,
            justifyContent: 'center',
            zIndex: 0,
            overflow: 'hidden',
          }}>
          {settings?.hideBalance && (
            <View
              style={{
                height: 100,
                width: '100%',
                borderRadius: 8,
                position: 'absolute',
                zIndex: 1,
              }}>
              <Image
                style={{
                  height: '100%',
                  width: '100%',
                }}
                source={require('../../../assets/images/others/blurOverlay.png')}
              />
            </View>
          )}
          <Text
            textAlign={'center'}
            size={28}
            fontWeight={'800'}
            color={COLORS.white}>
            {GENERAL.nairaSign}
            {formatAmount(data?.wallet?.naira?.balance)}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            updateUserData({
              data: data,
              settings: {...settings, hideBalance: !settings?.hideBalance},
            });
          }}
          style={{
            height: 40,
            width: 40,
            backgroundColor: '#B92724',
            borderRadius: 40,
            left: -5,
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 10,
          }}>
          <Text textAlign={'center'} style={{paddingTop: 1}} size={30}>
            {settings?.hideBalance ? '🫣' : '🤑'}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={{position: 'absolute', right: 10, top: 10}}>
        <Icons.Info
          size={15}
          onPress={() => {
            setState(prevState => ({...prevState, showModal: true}));
          }}
        />
      </View>
    </View>
  );
};
