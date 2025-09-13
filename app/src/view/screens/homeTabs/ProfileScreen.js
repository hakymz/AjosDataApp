import React from 'react';
import {Platform, ScrollView, View} from 'react-native';
import {COLORS, GENERAL} from '../../../conts';
import {useUser} from '../../../hooks';

import {} from '../../components/bottomSheetModal/content';
import {
  CustomSafeAreaView,
  Icons,
  Text,
  ToggleInput,
} from '../../components/general';
import {MainHeader} from '../../components/layouts';
import {PageList} from '../../components/lists';

import {
  enableBiometric,
  fetchRequest,
  openLink,
  saveUserDetailsToKeyChain,
} from '../../../helper';
import Toast from '../../components/toast/Toast';

const List = ({title, icon, ...props}) => {
  return (
    <PageList {...props}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        {icon}
        <Text
          style={{marginLeft: 10}}
          size={16}
          color={COLORS.darkBlue}
          semiBold>
          {title}
        </Text>
      </View>
    </PageList>
  );
};

const validatePin = async transactionPin => {
  try {
    const response = fetchRequest({
      path: 'settings/verify-transaction-pin',
      data: {
        transactionPin,
      },
    });
  } catch (error) {}
};
export const ProfileScreen = ({navigation, route}) => {
  const {logoutUser, data, settings, updateUserData} = useUser();

  return (
    <CustomSafeAreaView>
      <MainHeader nav title={'Profile'} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 20,
          paddingBottom: 100,
        }}>
        <Text color={'#898A8D'} style={{marginBottom: 25}} size={12}>
          You can personalize your Ajebo experience.
        </Text>
        <List
          onPress={() => {
            navigation.navigate('ProfileDetailsScreen');
          }}
          title={'Account Details'}
          icon={<Icons.UserTag size={24} />}
        />
        <List
          onPress={() => {}}
          title={'Biometrics'}
          icon={<Icons.Scan size={24} />}
          rightIcon={
            <ToggleInput
              onValueChange={() => {}}
              click={async () => {
                try {
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
                } catch (error) {
                  console.log(error);
                }
              }}
              enableSwitch={settings?.biometric}
            />
          }
        />
        <List
          title={'Confirm transactions with biometrics'}
          icon={<Icons.Scan size={24} />}
          rightIcon={
            <ToggleInput
              onValueChange={() => {}}
              click={async () => {
                if (settings?.pinBiometric) {
                  updateUserData({
                    data: data,
                    settings: {
                      ...settings,
                      pinBiometric: false,
                      transactionPin: '',
                    },
                  });
                } else {
                  navigation.navigate('PinScreen', {
                    proceed: async pin => {
                      try {
                        await saveUserDetailsToKeyChain({
                          email: 'user_pin',
                          password: pin,
                          key: 'user_pin',
                        });
                        await validatePin?.(pin);
                        updateUserData({
                          data: data,
                          settings: {
                            ...settings,
                            pinBiometric: true,
                            transactionPin: pin,
                          },
                        });
                      } catch (error) {}
                    },
                  });
                }
              }}
              enableSwitch={settings?.pinBiometric}
            />
          }
        />
        <List
          onPress={() => {
            updateUserData({
              data: data,
              settings: {...settings, loginWithPin: !settings?.loginWithPin},
            });
          }}
          title={'Use PIN login'}
          icon={<Icons.AddCategory size={24} />}
          rightIcon={
            <ToggleInput
              onValueChange={() => {}}
              click={async () => {
                try {
                  updateUserData({
                    data: data,
                    settings: {
                      ...settings,
                      loginWithPin: !settings?.loginWithPin,
                    },
                  });
                } catch (error) {
                  console.log(error);
                }
              }}
              enableSwitch={settings?.loginWithPin}
            />
          }
        />
        <List
          onPress={() => {
            navigation.navigate('SecurityScreen');
          }}
          title={'Security'}
          icon={<Icons.Unlock size={24} />}
        />
        <List
          title={'Rate Us'}
          icon={<Icons.Like size={25} />}
          onPress={() => {
            openLink(
              Platform.OS == 'ios'
                ? GENERAL.appsLinkToStore.ios
                : GENERAL.appsLinkToStore?.android,
            );
          }}
        />
        <List
          onPress={() => {
            navigation.navigate('ContactScreen');
          }}
          title={'Contact us'}
          icon={<Icons.SMS2 size={24} />}
        />
        <List
          onPress={() => {
            navigation.navigate('DeleteScreen');
          }}
          title={
            <Text size={16} color={'#D12431'} fontWeight={'600'}>
              Delete Profile
            </Text>
          }
          icon={<Icons.Delete size={24} />}
        />
        <List
          onPress={() => {
            logoutUser();
          }}
          title={'Log-out'}
          icon={<Icons.Logout size={24} />}
        />
      </ScrollView>
    </CustomSafeAreaView>
  );
};
