import React from 'react';
import {ScrollView, RefreshControl, AppState, View} from 'react-native';
import {COLORS, GENERAL} from '../../../conts';
import {
  BottomSheets,
  CustomSafeAreaView,
  LiveChatButton,
} from '../../components/general';
import {MainHeader} from '../../components/layouts';

import {useUser} from '../../../hooks';

import {useIsFocused} from '@react-navigation/native';

import {checkForAppUpdate, pushNotificationHelper} from '../../../helper';
import {useQuery} from 'react-query';
import {
  AccountBalance,
  MenuButtons,
  RecentCustomers,
  Services,
  TourGuide,
} from '../../components/home';

import {openClipboardNumberModal} from '../../components/bottomSheetModal/contents';
import {AppUpdate} from '../../components/bottomSheetModal/modalContents/AppUpdate';

import {Finder} from '../../components/popupModal';

// import Intercom from '@intercom/intercom-react-native';

export const HomeScreen = ({navigation, route}) => {
  const {
    data,
    tour,
    getAndUpdateUserData,
    settings,
    autoLogout,
    getAndUpdateUserWallet,
  } = useUser();

  const [refreshing, setRefreshing] = React.useState(false);

  const scrollRef = React.useRef();

  const isFocused = useIsFocused();

  React.useEffect(() => {
    if (isFocused) {
    } else {
      scrollRef?.current?.scrollTo?.({scrollY: 0});
    }
  }, [isFocused]);

  React.useEffect(() => {
    // Intercom.loginUserWithUserAttributes({
    //   email: data?.user?.email,
    //   userId: data?.user?._id,
    // });
    pushNotificationHelper();
  }, []);

  React.useEffect(() => {
    (async () => {
      if (route?.name == 'HomeScreen') {
        const thereIsUpdate = await checkForAppUpdate();
        const hasValidclipboardNumber = await openClipboardNumberModal();

        if (!data?.user?.setTransactionPin && tour) {
          navigation.navigate('SetPinScreen');
        } else if (thereIsUpdate && tour) {
          BottomSheets.show({
            component: <AppUpdate />,
            customSnapPoints: [600, 600],
            canClose: false,
          });
        } else if (!settings?.biometric && tour) {
          // BottomSheets.show({
          //   component: <Biometric />,
          //   customSnapPoints: [600, 600],
          // });
        }
      }
    })();
  }, [route?.name]);

  React.useEffect(() => {
    autoLogout('check');
    const subscription = AppState.addEventListener(
      'change',
      async nextAppState => {
        autoLogout(nextAppState);

        if (nextAppState == 'active') {
          Intercom.handlePushMessage();
          console.log('yess nooow');
        }
      },
    );
    return () => {
      subscription?.remove?.();
    };
  }, []);

  const {
    data: userData,
    error,
    refetch,
  } = useQuery({
    queryKey: 'userData',
    queryFn: getAndUpdateUserData,
    refetchInterval: 1000 * 10,
  });
  const {
    data: userWalletData,
    error: walletDataError,
    refetch: walletRefetch,
  } = useQuery({
    queryKey: 'userDataWallet',
    queryFn: getAndUpdateUserWallet,
    refetchInterval: 1000 * 10,
  });

  const refresh = async () => {
    setRefreshing(true);
    await walletRefetch();
    await refetch();
    setRefreshing(false);
  };

  return (
    <>
      {route?.name == 'FinderScreen' && <Finder />}
      <CustomSafeAreaView>
        <TourGuide />
        <MainHeader />
        <ScrollView
          bouncesZoom={false}
          ref={scrollRef}
          refreshControl={
            <RefreshControl
              tintColor={COLORS.lightBlue}
              colors={[COLORS.primary, COLORS.lightBlue]}
              refreshing={refreshing}
              onRefresh={refresh}
            />
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: GENERAL.platform == 'ios' ? 80 : 100,
            paddingTop: 20,
          }}
          onMomentumScrollEnd={({nativeEvent}) => {}}>
          <View style={{paddingHorizontal: 20}}>
            <AccountBalance />
          </View>

          <MenuButtons />

          <Services />
          <View style={{paddingHorizontal: 20}}>
            <RecentCustomers />
          </View>
        </ScrollView>
        <LiveChatButton />
      </CustomSafeAreaView>
    </>
  );
};
