import React from 'react';
import {Modal, ScrollView, TouchableOpacity, View} from 'react-native';
import {COLORS, GENERAL, IMAGES} from '../../../conts';
import {Icons, Text} from '../general';
import {useUser} from '../../../hooks';
import {fetchRequest, formatAmount} from '../../../helper';
import {useQuery} from 'react-query';
import {Image} from '../general/image';

const Btn = ({icon, title, style}) => {
  return (
    <TouchableOpacity
      style={{flex: 1, flexDirection: 'row', alignItems: 'center', ...style}}>
      <View
        style={{
          height: 25,
          width: 25,
          borderWidth: 1,
          borderRadius: 100,
          borderColor: COLORS.darkBlue,
          marginRight: 10,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {' '}
         {icon}
      </View>
      <Text medium size={13} color={'#151521'}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

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
        height: 253,
        backgroundColor: '#4961AC',
        borderRadius: 26,
        paddingHorizontal: 10,
        paddingVertical: 10,

        justifyContent: 'space-between',
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
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 15,
          justifyContent: 'space-between',
          marginTop: 15,
        }}>
        <View
          style={{
            height: 32,
            justifyContent: 'center',
          }}>
          <Text size={16} semiBold color={COLORS.white}>
            {GENERAL.nairaSign}
            {formatAmount(data?.wallet?.cashback?.balance)}
          </Text>
          <Text size={12} color={COLORS.white}>
            Available Cashback for use
          </Text>
        </View>

        <View
          style={{
            height: 36,
            backgroundColor: '#384874',
            borderRadius: 18,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 10,
          }}>
          <Image
            source={IMAGES.ngLogo}
            style={{height: 22, width: 22, marginRight: 5}}
          />
          <Text color={COLORS.white} size={12} medium>
            NGN
          </Text>
        </View>
      </View>

      {/* 
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
            justifyContent: 'center',
            zIndex: 0,
            overflow: 'hidden',
          }}>
          <Text
            textAlign={'center'}
            size={28}
            fontWeight={'800'}
            color={COLORS.white}>
            {GENERAL.nairaSign}
            {formatAmount(data?.wallet?.naira?.balance)}
          </Text>
        </View>
      </View> */}

      <View
        style={{
          height: 160,
          backgroundColor: COLORS.white,
          borderRadius: 18,
        }}>
        <View style={{paddingHorizontal: 10, paddingVertical: 15}}>
          <Text size={12} medium color={'#231F20'}>
            Available Funds
          </Text>
          <Text size={34} fontWeight={'500'} color={'#151521'}>
            {GENERAL.nairaSign}
            {formatAmount(data?.wallet?.naira?.balance)}
          </Text>
        </View>
        <View
          style={{
            height: 1,
            backgroundColor: COLORS.backgroundColor,
            marginHorizontal: 5,
          }}
        />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1,
            paddingHorizontal: 20,
          }}>
          <Btn title={'Add Funds'} icon={<Icons.Plus size={12} />} />
          <View
            style={{
              height: '100%',
              width: 1,
              backgroundColor: COLORS.backgroundColor,
            }}
          />
          <Btn
            title={'Customers'}
            style={{marginLeft: 20}}
            icon={<Icons.StickMan size={12} />}
          />
        </View>
      </View>
    </View>
  );
};
