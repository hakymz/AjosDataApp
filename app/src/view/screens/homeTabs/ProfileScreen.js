import React from 'react';
import {Platform, ScrollView, TouchableOpacity, View} from 'react-native';
import {COLORS, GENERAL} from '../../../conts';
import {useUser} from '../../../hooks';

import {} from '../../components/bottomSheetModal/content';
import {
  BottomSheets,
  CustomSafeAreaView,
  Icons,
  Text,
} from '../../components/general';
import {MainHeader} from '../../components/layouts';
import {PageList} from '../../components/lists';

import {
  UserDetails,
  Settings,
  ContactUs,
  UpdateNotification,
} from '../../components/bottomSheetModal/contents';

import {BioMetricSettings} from '../../components/bottomSheetModal/contents/BioMetricSettings';
import {launchImageLibrary} from 'react-native-image-picker';
import {openLink} from '../../../helper';

const List = ({title, icon, ...props}) => {
  return (
    <PageList {...props}>
      <Text size={18} color={COLORS.blue} fontWeight={'500'}>
        {title}
      </Text>
      {icon}
    </PageList>
  );
};
export const ProfileScreen = ({navigation, route}) => {
  const {logoutUser, data, settings, updateUserData} = useUser();

  return (
    <CustomSafeAreaView>
      <MainHeader imageLink={null} editPhoto />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 20,
          paddingBottom: 40,
        }}>
        <Text style={{marginBottom: 25}} size={18} fontWeight={'700'}>
          Profile
        </Text>
        <List
          onPress={() => {
            BottomSheets.show({
              component: <UserDetails />,
              customSnapPoints: [500, 500],
            });
          }}
          title={'User details'}
          icon={<Icons.Person size={24} />}
        />
        <List
          onPress={() => {
            BottomSheets.show({
              component: <Settings />,
              customSnapPoints: [450, 450],
            });
          }}
          title={'Settings'}
          icon={<Icons.Settings size={24} />}
        />
        <List
          onPress={() => {
            BottomSheets.show({
              component: <UpdateNotification />,
              customSnapPoints: [450, 450],
            });
          }}
          title={'Turn off Alerts'}
          icon={<Icons.BellOff size={24} />}
        />
        <List
          onPress={() => {
            BottomSheets.show({
              component: <BioMetricSettings />,
              customSnapPoints: [450, 450],
            });
          }}
          title={'Biometrics'}
          icon={<Icons.Biometrics size={24} />}
        />

        <List
          title={'Rate Us'}
          icon={<Icons.Emojis size={75} />}
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
            BottomSheets.show({
              component: <ContactUs />,
            });
          }}
          title={'Contact us'}
          icon={<Icons.Chat size={24} />}
        />
        <List
          onPress={() => {
            navigation.navigate('ProductPricingScreen');
          }}
          title={'All Products + Pricing'}
          icon={<Icons.DollarCoin size={24} />}
        />
        <List
          onPress={() => {
            navigation.navigate('DeleteScreen');
          }}
          title={
            <Text size={18} color={'#898A8D'} fontWeight={'500'}>
              Delete Profile
            </Text>
          }
          icon={<Icons.DeleteGrey size={22} />}
        />
        <List
          onPress={() => {
            logoutUser();
          }}
          title={
            <Text size={18} color={'#D12431'} fontWeight={'500'}>
              Log-out
            </Text>
          }
          icon={<Icons.UserRight size={22} />}
        />
      </ScrollView>
    </CustomSafeAreaView>
  );
};
