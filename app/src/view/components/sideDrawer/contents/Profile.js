import React from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {PERMISSIONS} from 'react-native-permissions';
import {s} from 'react-native-size-matters';
import {COLORS, FONTS} from '../../../../conts';
import {
  enableBiometric,
  fetchRequest,
  getVersionNo,
  requestPermission,
} from '../../../../helper';
import grantPermission from '../../../../helper/other/grantPermission';
import {useUser} from '../../../../hooks';
import {Icons, Text, ToggleInput} from '../../general';
import {Image} from '../../general/image';
import {SideDrawer} from '../SideDrawer';
import {useQueryClient} from 'react-query';

const InputList = ({value}) => {
  return (
    <View style={style.inputList}>
      <Text
        numberOfLines={1}
        semiBold
        color="#0F1819"
        style={{paddingHorizontal: 30}}>
        {value}
      </Text>
    </View>
  );
};

export const Profile = () => {
  const {data, settings, updateUserData, logoutUser, getUserImage} = useUser();

  const queryClient = useQueryClient();

  const [state, setState] = React.useState({
    notification:
      data?.user?.notificationSettings?.[0]?.sms_notification || false,
    hideBalance: settings?.hideBalance,
    biometric: settings?.biometric,
  });

  const updateNotification = async value => {
    try {
      const response = await fetchRequest({
        path: '/settings/notificationsettings',
        data: {
          status: !value,
          type: 'sms_notification',
        },
        showLoader: false,
        method: 'PATCH',
      });

      queryClient.invalidateQueries({queryKey: ['userData']});
    } catch (error) {
      console.log(error, 'errr');
    }
  };

  const updateSettings = async setting => {
    if (setting == 'notification') {
      updateNotification(state?.[setting]);
    }
    if (setting == 'biometric') {
      if (!state?.[setting]) {
        const res = await enableBiometric();
        if (res) {
          updateUserData({
            data: data,
            settings: {...settings, [setting]: !state?.[setting]},
          });
          setState(prevState => ({
            ...prevState,
            [setting]: !prevState?.[setting],
          }));
        }
      } else {
        updateUserData({
          data: data,
          settings: {...settings, [setting]: false},
        });
        setState(prevState => ({...prevState, [setting]: false}));
      }
    } else {
      updateUserData({
        data: data,
        settings: {...settings, [setting]: !state?.[setting]},
      });
      setState(prevState => ({...prevState, [setting]: !state?.[setting]}));
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{paddingBottom: 50}}
      showsVerticalScrollIndicator={false}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Image
          source={getUserImage()}
          style={{
            height: s(90),
            width: s(90),
            resizeMode: 'contain',
            marginTop: 20,
            borderRadius: 100,
          }}
        />
        <View style={{paddingLeft: 15}}>
          <Text lineHeight={20} size={16} bold color={COLORS.dark}>
            {data?.user?.firstName} {data?.user?.lastName}
          </Text>
          <Text
            style={{marginTop: 5}}
            lineHeight={14}
            size={12}
            color={COLORS.dark}>
            Username - @{data?.user?.userTag}
          </Text>
        </View>
      </View>

      <View style={{marginTop: 40}}>
        <InputList value={data?.user?.phoneNumber} />
        <InputList value={data?.user?.email} />

        <ToggleInput
          click={() => updateSettings('hideBalance')}
          title="Hide Balance"
          enableSwitch={state?.hideBalance}
        />
        <ToggleInput
          click={() => updateSettings('notification')}
          title="Turn Off Notifications"
          enableSwitch={state?.notification}
        />
        <ToggleInput
          click={() => updateSettings('biometric')}
          title="Biometrics"
          enableSwitch={state?.biometric}
        />
      </View>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => {
          logoutUser();
        }}
        style={style.logoutBtn}>
        <Text semiBold size={16} color={COLORS.primary}>
          Logout
        </Text>
      </TouchableOpacity>
      <Text style={{textAlign: 'center', marginTop: 50}}>
        App Version {getVersionNo()}
      </Text>
    </ScrollView>
  );
};

const style = StyleSheet.create({
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    height: s(55),
    backgroundColor: COLORS.white,
    width: s(100),
    justifyContent: 'center',
    borderRadius: 50,
  },
  inputList: {
    height: s(55),
    backgroundColor: COLORS.lightGrey,
    borderRadius: 100,
    marginBottom: 10,
    justifyContent: 'center',
    opacity: 0.3,
  },
});
