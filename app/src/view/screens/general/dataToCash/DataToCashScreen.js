import React from 'react';
import {
  BottomSheets,
  CustomSafeAreaView,
  Icons,
  Switch,
  Text,
} from '../../../components/general';
import {AppNav} from '../../../components/layouts';
import {
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {COLORS, GENERAL} from '../../../../conts';
import {useLayouts, useUser} from '../../../../hooks';
import {fetchRequest} from '../../../../helper';
import {AccountBalance, MenuButtons} from '../../../components/dataToCash';
import {useQuery, useQueryClient} from 'react-query';
import {
  AddNumberDataToCash,
  ConvertDataToCash,
  DataToCashTransactionHistory,
  DeleteDataToCashNumber,
  RefreshDataToCash,
} from '../../../components/bottomSheetModal/contents';
import {useNavigation} from '@react-navigation/native';

const DataCard = ({item}) => {
  console.log(item?.refreshStatus);
  const queryClient = useQueryClient();
  const navigation = useNavigation();

  const refreshSim = async () => {
    try {
      const response = await fetchRequest({
        path: 'billpayment/reseller/sim/refresh/' + item?._id,
      });
      queryClient.invalidateQueries({queryKey: ['getSimLinks']});
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const updateStatus = async () => {
    try {
      const response = await fetchRequest({
        path: `billpayment/reseller/sim/${item?._id}?status=${false}`,
        method: 'PATCH',
      });

      queryClient.invalidateQueries({queryKey: ['getSimLinks']});
    } catch (error) {
      console.log(error);
    }
  };

  const Btn = ({icon, onPress, style}) => {
    return (
      <TouchableOpacity
        onPress={onPress}
        style={{
          height: 32,
          width: 32,
          backgroundColor: COLORS.white,
          borderRadius: 30,
          marginRight: 5,
          justifyContent: 'center',
          alignItems: 'center',
          ...style,
        }}>
        {icon}
      </TouchableOpacity>
    );
  };

  const Section = ({title, des, refresh}) => {
    return (
      <View
        style={{
          backgroundColor: '#FBE3E3',
          borderRadius: 5,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 10,
          marginBottom: 5,
          height: 32,
        }}>
        <Text size={10} md color={'#484848'}>
          {title}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1,
            paddingLeft: 10,
            justifyContent: 'flex-end',
          }}>
          {refresh && (
            <Icons.Edit
              size={20}
              onPress={() => {
                BottomSheets.show({
                  component: <RefreshDataToCash data={item} />,
                });
              }}
            />
          )}

          <Text
            textAlign={'right'}
            numberOfLines={1}
            style={{marginLeft: 10}}
            bd
            size={14}
            color={COLORS.primary}>
            {des}
          </Text>
        </View>
      </View>
    );
  };
  return (
    <View
      style={{
        height: 178,
        borderRadius: 10,
        backgroundColor: '#FFF2F2',
        paddingVertical: 10,
        paddingLeft: 20,
        paddingRight: 20,
        marginBottom: 10,
      }}>
      <View style={{flexDirection: 'row'}}>
        <View
          style={{
            paddingHorizontal: 15,
            height: 32,
            backgroundColor: COLORS.white,
            borderRadius: 5,
            justifyContent: 'center',
          }}>
          <Text color={COLORS.primary} bd>
            {item?.phoneNumber}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1,
            justifyContent: 'flex-end',
          }}>
          <Btn
            icon={<Icons.Coins size={20} />}
            onPress={() => {
              BottomSheets.show({
                component: <DataToCashTransactionHistory data={item} />,
                disableScrollIfPossible: false,
              });
            }}
          />

          <Btn
            icon={<Icons.Convert size={20} />}
            onPress={() => {
              if (item?.refreshStatus) {
                refreshSim();
              } else {
                BottomSheets.show({
                  component: <RefreshDataToCash data={item} />,
                });
              }
            }}
          />
          <Btn
            onPress={() => {
              BottomSheets.show({
                component: <DeleteDataToCashNumber item={item} />,
              });
            }}
            icon={<Icons.DeleteIcon size={20} />}
            style={{backgroundColor: '#FBE3E3'}}
          />
          <Switch
            onPress={() => {
              if (item?.status) {
                updateStatus();
              } else {
                BottomSheets.show({
                  component: <ConvertDataToCash data={item} />,
                });
              }
            }}
            enabled={item?.status}
            style={{height: 24}}
            backgroundColors={[COLORS.primary, '#DFCACB']}
          />
        </View>
      </View>
      <View style={{paddingTop: 10, flexDirection: 'row'}}>
        <Image
          source={require('../../../../assets/images/others/mtn.png')}
          style={{height: 32, width: 32, borderRadius: 6}}
        />
        <View style={{flex: 1, paddingLeft: 10}}>
          <Section
            title={'Data Available'}
            refresh={item?.refreshStatus}
            des={`${item?.availableData}`}
          />

          <Section title={'Sold Today - Data'} des={`${item?.soldToday}`} />
          <Section
            title={'Sold Today - Naira'}
            des={`${GENERAL.nairaSign}${item?.soldTodayNaira}`}
          />
        </View>
      </View>
    </View>
  );
};

const getSimLinks = async values => {
  try {
    const response = await fetchRequest({
      path: 'billpayment/reseller/linked-sims',
      method: 'GET',
      showLoader: false,
    });

    return response?.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const DataToCashScreen = ({navigation}) => {
  const {
    data: {user = {}},
  } = useUser();
  const [refreshing, setRefreshing] = React.useState(false);

  const {minHeight} = useLayouts();
  const {
    data: simLinksData,
    status,
    refetch,
  } = useQuery('getSimLinks', getSimLinks);
  const [balance, setBalance] = React.useState(0);

  const refresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  return (
    <CustomSafeAreaView>
      <AppNav
        line
        comp={
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              flex: 1,
            }}>
            <View style={{flex: 1, alignItems: 'center'}}>
              <Text size={18} fontWeight={'800'}>
                MTN Data - Cash
              </Text>
            </View>

            <Image
              style={{height: 34, width: 34}}
              source={require('../../../../assets/images/others/mtn.png')}
            />
          </View>
        }
      />
      <ScrollView
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
          paddingTop: 20,
          paddingBottom: 40,
          paddingHorizontal: 20,
          minHeight: minHeight - 70,
        }}>
        <AccountBalance setBalance={setBalance} />
        <MenuButtons balance={balance} />
        {status == 'success' && simLinksData?.length == 0 && (
          <View
            style={{
              flex: 1,
              justifyContent: 'space-between',
            }}>
            <View
              style={{
                height: 120,
                backgroundColor: '#FFF2F2',
                borderRadius: 10,
                marginTop: 40,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Icons.Folder size={20} />
              <Text md size={11}>
                Nothing to see
              </Text>
            </View>
            <View style={{alignItems: 'center'}}>
              <TouchableOpacity
                onPress={() => {
                  BottomSheets.show({
                    component: <AddNumberDataToCash />,
                    customSnapPoints: [420, 420],
                  });
                }}
                style={{
                  paddingHorizontal: 20,
                  backgroundColor: COLORS.white,
                  height: 56,
                  borderRadius: 8,
                  alignItems: 'center',
                  justifyContent: 'center',
                  shadowColor: 'rgba(0,0,0,0.2)',
                  shadowOpacity: 1,
                  shadowRadius: 20,
                  shadowOffset: {height: 10},
                  elevation: 10,
                  flex: 0,
                  width: 185,
                }}>
                <Text size={17} color={'#231F20'} bd>
                  Get started
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <FlatList
          contentContainerStyle={{paddingTop: 30}}
          data={simLinksData}
          renderItem={({item}) => <DataCard item={item} />}
        />
      </ScrollView>
    </CustomSafeAreaView>
  );
};

const styles = StyleSheet.create({});
