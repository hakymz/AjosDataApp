import React from 'react';
import {ScrollView, RefreshControl, AppState, View} from 'react-native';
import {COLORS, GENERAL} from '../../../conts';
import {
  BottomSheets,
  CustomSafeAreaView,
  LiveChatButton,
} from '../../components/general';
import {MainHeader} from '../../components/layouts';

import {useTradeData, useUser} from '../../../hooks';

import {useIsFocused} from '@react-navigation/native';

import {
  checkForAppUpdate,
  openErrorScreen,
  openSuccessScreen,
  pushNotificationHelper,
} from '../../../helper';
import {useQuery} from 'react-query';
import {
  AccountBalance,
  MenuButtons,
  QuickBuyData,
  Services,
  TourGuide,
} from '../../components/home';
import {AppUpdate} from '../../components/bottomSheetModal/contents/AppUpdate';
import {
  Biometric,
  CopyNumberFromClipboard,
  CreatePin,
  openClipboardNumberModal,
} from '../../components/bottomSheetModal/contents';

// import Intercom from '@intercom/intercom-react-native';

export const HomeScreen = ({navigation}) => {
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
    // pushNotificationHelper();
  }, []);

  React.useEffect(() => {
    (async () => {
      const thereIsUpdate = await checkForAppUpdate();
      const hasValidclipboardNumber = await openClipboardNumberModal();

      setTimeout(() => {
        if (thereIsUpdate && tour) {
          BottomSheets.show({
            component: <AppUpdate />,
            customSnapPoints: [600, 600],
            canClose: false,
          });
        } else if (!data?.user?.setTransactionPin && tour) {
          BottomSheets.show({
            component: <CreatePin />,
            customSnapPoints: [600, 600],
            canClose: false,
          });
        } else if (!settings?.biometric && tour) {
          BottomSheets.show({
            component: <Biometric />,
            customSnapPoints: [600, 600],
          });
        }
      }, 500);
    })();
  }, []);

  React.useEffect(() => {
    autoLogout('check');
    const subscription = AppState.addEventListener(
      'change',
      async nextAppState => {
        autoLogout(nextAppState);
        console.log(nextAppState);

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

  React.useEffect(() => {}, []);

  return (
    <CustomSafeAreaView>
      {/* <TourGuide /> */}
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
      </ScrollView>
      <LiveChatButton />
    </CustomSafeAreaView>
  );
};
