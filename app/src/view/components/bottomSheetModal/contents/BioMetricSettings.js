import React from 'react';
import {Image, View} from 'react-native';
import {BottomSheets, Button, Icons, Text, ToggleInput} from '../../general';
import LottieView from 'lottie-react-native';
import {PageList} from '../../lists';
import {COLORS, IMAGES} from '../../../../conts';
import {ChangePassword} from './ChangePassword';
import {useNavigation} from '@react-navigation/native';
import {useUser} from '../../../../hooks';
import {enableBiometric, fetchRequest} from '../../../../helper';
import Toast from '../../toast/Toast';
{
  /* <List
          title={
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text size={18} color={COLORS.blue} fontWeight={'500'}>
                Biometrics
              </Text>
              <ToggleInput
                click={async () => {
                  if (!settings?.biometric) {
                    const res = await enableBiometric();
                    if (res) {
                      updateUserData({
                        data: data,
                        settings: {...settings, biometric: true},
                      });
                    } else {
                      Toast.show(
                        'error',
                        'Please enable your device biometric to continue',
                      );
                    }
                  } else {
                    updateUserData({
                      data: data,
                      settings: {...settings, biometric: false},
                    });
                  }
                }}
                onValueChange={() => {}}
                enableSwitch={settings?.biometric}
              />
            </View>
          }
          icon={<Icons.Biometrics size={24} />}
        /> */
}

const List = ({title, icon, enableSwitch, click, ...props}) => {
  return (
    <PageList {...props}>
      <Text size={18} color={COLORS.blue} fontWeight={'500'}>
        {title}
      </Text>

      <ToggleInput
        click={click}
        onValueChange={() => {}}
        enableSwitch={enableSwitch}
      />
    </PageList>
  );
};

export const BioMetricSettings = ({activate}) => {
  const navigation = useNavigation();
  const {data, settings, updateUserData} = useUser();
  const validatePin = async transactionPin => {
    try {
      const response = await fetchRequest({
        path: `settings/verify-transaction-pin`,
        data: {transactionPin},
      });

      Toast.show('success', 'Biometrics enabled.');
      updateUserData({
        data: data,
        settings: {...settings, pinBiometric: true, transactionPin},
      });
      // navigation.goBack();
    } catch (error) {
      console.log(error, 'errrss');
      throw error;
    }
  };

  return (
    <View style={{paddingHorizontal: 24}}>
      <Text textAlign={'right'} size={18} fontWeight={800}>
        Biometrics{' '}
      </Text>
      <View style={{marginTop: 20, marginBottom: 30}}>
        <Text lineHeight={17} color={'#828282'} size={12} fontWeight={'400'}>
          You can enable Biometrics for Login or for approval purposes, with pin
          confirmation.
        </Text>
      </View>
      <View style={{flex: 1}}>
        <List
          click={async () => {
            if (!settings?.biometric) {
              const res = await enableBiometric();
              if (res) {
                updateUserData({
                  data: data,
                  settings: {...settings, biometric: true},
                });
              } else {
                Toast.show(
                  'error',
                  'Please enable your device biometric to continue',
                );
              }
            } else {
              updateUserData({
                data: data,
                settings: {...settings, biometric: false},
              });
            }
          }}
          enableSwitch={settings?.biometric}
          title={'Biometric Login'}
        />

        <List
          click={async () => {
            if (!settings?.pinBiometric) {
              const res = await enableBiometric();
              navigation.navigate('PinScreen', {
                proceed: pin => {
                  validatePin(pin);
                },
                type: 'validate',
              });
              BottomSheets.hide();

              // if (res) {
              //   updateUserData({
              //     data: data,
              //     settings: {...settings, pinBiometric: true},
              //   });
              // } else {
              //   Toast.show(
              //     'error',
              //     'Please enable your device biometric to continue',
              //   );
              // }
            } else {
              updateUserData({
                data: data,
                settings: {...settings, pinBiometric: false},
              });
            }
          }}
          enableSwitch={settings?.pinBiometric}
          title={'Biometric Confirmation'}
        />

        <Text lineHeight={17} color={'#828282'} size={12} fontWeight={'400'}>
          Approve Transactions with just your biometrics
        </Text>
      </View>
    </View>
  );
};
