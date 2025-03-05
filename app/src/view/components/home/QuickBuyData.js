import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from 'react-native';
import {s} from 'react-native-size-matters';
import {BottomSheets, Icons, MyIcons} from '../general';
import {Text} from '../general';
import {COLORS, MESSAGES} from '../../../conts';
import {
  ChooseAccountTopup,
  Country,
  CreateDollarCard,
  GiftCardOptions,
  Topup,
} from '../bottomSheetModal/content';
import {useNavigation} from '@react-navigation/native';
import {useLayouts, useOrientation} from '../../../hooks';
import Line from '../general/others/Line';
import Toast from '../toast/Toast';
import {TopupWallet} from '../bottomSheetModal/contents';
// import Intercom from '@intercom/intercom-react-native';
import {useQuery} from 'react-query';
import {fetchRequest} from '../../../helper';

const menus = [
  {
    name: 'Sell - 1GB SME',
    Icon: <Icons.PlusCircle size={22} />,
    onPress: () => {
      BottomSheets.show({
        component: <TopupWallet />,
        customSnapPoints: [580, 580],
      });
    },
  },
  {
    name: 'Sell - 1GB CG',
    Icon: <Icons.DoublePerson size={22} />,
    onPress: navigation => {
      navigation.navigate('CustomersScreen');
    },
  },
];

const Button = ({
  name,
  icon,
  network,
  variation_code,
  variation_code_data,
  initialData,
}) => {
  const {width} = useLayouts();
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('SellDataScreen', {
          network,
          variation_code,
          variation_code_data,
          initialData,
        });
      }}
      style={{
        flex: 1,
        flexDirection: 'row',
        height: 50,
        backgroundColor: '#FAFAFA',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#EAECF0',
        borderRadius: 10,
        justifyContent: 'center',
        paddingHorizontal: 10,
        marginTop: 10,
      }}>
      <Image
        source={require('../../../assets/images/others/fast.png')}
        style={{
          width: 25,
          height: 25,
          position: 'absolute',
          left: -10,
          top: -10,
        }}
      />
      <Image
        source={icon}
        style={{width: 38, height: 20, marginRight: 10, resizeMode: 'contain'}}
      />
      <Text
        textAlign={'center'}
        numberOfLines={2}
        color={COLORS.black}
        size={12}
        fontWeight={'700'}
        style={{}}>
        {name}
      </Text>
    </TouchableOpacity>
  );
};

const getPlans = async (network = 'MTN') => {
  try {
    const response = await fetchRequest({
      path: `billpayment/data/plans?network=${network?.toUpperCase?.()}&platform=apisubportal`,
      displayMessage: false,
      showLoader: false,
      method: 'GET',
    });

    return response?.data;
  } catch (error) {
    console.log(error, 'errrss');
    throw error;
  }
};
export const QuickBuyData = () => {
  const {data: plansData} = useQuery('getPlansQuickBuyData2', () =>
    getPlans('mtn'),
  );

  const {data: plansDataAirtel} = useQuery('getPlansQuickBuyDataAirtel1', () =>
    getPlans('airtel'),
  );

  const {data: plansDataGlo} = useQuery('getPlansQuickBuyDataGlo1', () =>
    getPlans('glo'),
  );

  const mtnQuickData = React.useMemo(() => {
    const plansDataFiltered = plansData?.filter(
      item => item?.type == 'SME' && item?.plan?.includes('1GB'),
    );

    const data = plansDataFiltered?.map?.(item => ({
      ...item,
      name: `${item?.network} ${item?.plan} ${item?.type}`,
    }));

    return data || [];
  }, [plansData]);

  const airtelQuickData = React.useMemo(() => {
    const plansDataFiltered = plansDataAirtel?.filter(
      item =>
        (item?.type == 'CG' ||
          item?.type == 'CGD' ||
          item?.type == 'COOPERATE') &&
        item?.plan?.includes('1GB'),
    );

    const data = plansDataFiltered?.map?.(item => ({
      ...item,
      name: `${item?.network} ${item?.plan} ${item?.type}`,
    }));

    return data || [];
  }, [plansDataAirtel]);

  const gloQuickData = React.useMemo(() => {
    const plansDataFiltered = plansDataGlo?.filter(
      item =>
        (item?.type == 'CG' ||
          item?.type == 'CGD' ||
          item?.type == 'COOPERATE') &&
        item?.plan?.includes('1GB'),
    );

    const data = plansDataFiltered?.map?.(item => ({
      ...item,
      name: `${item?.network} ${item?.plan} ${item?.type}`,
    }));

    return data || [];
  }, [plansDataGlo]);

  return (
    <View
      style={{
        ...style.con,
      }}>
      <ScrollView
        contentContainerStyle={{paddingHorizontal: 7}}
        showsHorizontalScrollIndicator={false}
        horizontal>
        <Button
          initialData={plansData}
          variation_code={mtnQuickData?.[0]}
          network="mtn"
          name={'Sell - 1GB SME'}
          icon={require('../../../assets/images/others/mtnLogoWhite.png')}
        />
        <View style={{width: 10}} />
        <Button
          initialData={plansDataAirtel}
          variation_code={airtelQuickData?.[0]}
          variation_code_data={{
            name: airtelQuickData?.[0]?.type,
            value: airtelQuickData?.[0]?.type,
          }}
          network="airtel"
          name={'Sell - 1GB CG'}
          icon={require('../../../assets/images/others/airtelLogoWhite.png')}
        />

        <View style={{width: 10}} />

        <Button
          initialData={plansDataAirtel}
          variation_code={gloQuickData?.[0]}
          variation_code_data={{
            name: gloQuickData?.[0]?.type,
            value: gloQuickData?.[0]?.type,
          }}
          network="glo"
          name={'Sell - 1GB CG'}
          icon={require('../../../assets/images/others/gloLogoWhite.png')}
        />
      </ScrollView>
    </View>
  );
};

const style = StyleSheet.create({
  con: {
    backgroundColor: COLORS.white,
    borderRadius: 30,
    justifyContent: 'space-between',
    marginTop: 20,
    flexDirection: 'row',
  },
  iconCon: {
    height: s(40),
    width: s(40),
    backgroundColor: COLORS.light,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btn: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 20,
    height: 53,
    width: 53,
    flex: 1,
    height: '100%',
  },
});
