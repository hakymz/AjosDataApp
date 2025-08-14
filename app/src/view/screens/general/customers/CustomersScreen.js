import React from 'react';
import {
  BottomSheets,
  CustomSafeAreaView,
  Icons,
  InfiniteFlatList,
  SearchInput,
  Text,
} from '../../../components/general';
import {MainHeader} from '../../../components/layouts';
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {AVATAR, COLORS} from '../../../../conts';

import {useBillsData} from '../../../../hooks';
import {useQuery} from 'react-query';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {DeleteCustomer} from '../../../components/bottomSheetModal/modalContents';
const List = ({item, deleteCustomers}) => {
  const navigation = useNavigation();
  let customerNumber = item?.phone_number?.split('+234');
  if (customerNumber?.[1]) {
    customerNumber =
      customerNumber?.[1]?.[0] == '0'
        ? customerNumber?.[1]
        : '0' + customerNumber?.[1];
  } else {
    customerNumber = item?.phone_number;
  }

  return (
    <View
      style={{
        // ...styles.list,
        width: '100%',
      }}>
      <View
        style={{
          ...styles.list,
        }}>
        <Image
          style={{height: 50, width: 50, borderRadius: 100, marginRight: 10}}
          source={AVATAR.avatar}
        />
        <View style={{flex: 1}}>
          <Text size={14} fontWeight={'700'} color={'#231F20'}>
            {item?.fullname}
          </Text>
          <Text
            style={{marginTop: 3}}
            size={12}
            fontWeight={800}
            color={'#231F20'}>
            {customerNumber}
          </Text>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Icons.EditPenCircle
            onPress={() => {
              navigation.navigate('EditCustomersScreen', {...item});
            }}
            style={{marginRight: 5}}
            size={37}
          />
          <Icons.DeletePen
            onPress={() => {
              BottomSheets.show({
                component: (
                  <DeleteCustomer
                    deleteCustomers={() => deleteCustomers(item?.id)}
                    item={item}
                  />
                ),
              });
            }}
            size={27}
          />
        </View>
      </View>
    </View>
  );
};
export const CustomersScreen = ({navigation, route}) => {
  const {onPress} = route?.params || {};
  const {getCustomers, deleteCustomers} = useBillsData();
  const isFocused = useIsFocused();

  const {
    data: customersData,
    status,
    refetch,
    isSuccess,

    error,
  } = useQuery('getCustomersDataCustomerScreen', getCustomers);

  const deleteCustomersData = async id => {
    try {
      const response = await deleteCustomers(id);
      BottomSheets.hide();
      setTimeout(() => {
        refetch();
      }, 1000);
    } catch (error) {}
  };

  React.useEffect(() => {
    refetch();
  }, [isFocused]);
  return (
    <CustomSafeAreaView backgroundColor={COLORS.white}>
      <MainHeader
        backgroundColor={COLORS.white}
        nav
        title={<></>}
        icon={
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('AddCustomersScreen');
            }}
            style={{flexDirection: 'row', alignItems: 'center'}}>
            <View
              style={{
                height: 30,
                width: 30,
                borderWidth: 1,
                borderRadius: 100,
                borderColor: COLORS.darkBlue,
                marginRight: 5,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Icons.Plus size={12} />
            </View>
            <Text medium size={14} color={'#5D55E0'}>
              Add Customer
            </Text>
          </TouchableOpacity>
        }
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: 20,
          paddingBottom: 40,
        }}>
        <View style={{paddingHorizontal: 20}}>
          <Text size={16} fontWeight={'700'} color={'#002055'}>
            Customers
          </Text>
          <Text medium style={{marginTop: 5}} size={12} color={'#979797'}>
            Here is a compilation of all the customers you have saved over time.
          </Text>
        </View>
        <View style={{paddingHorizontal: 20}}>
          <SearchInput style={{backgroundColor: COLORS.white}} />
        </View>

        <InfiniteFlatList
          request={getCustomers}
          contentContainerStyle={{marginTop: 10}}
          renderItem={({item}) => (
            <List
              onPress={onPress}
              item={item}
              deleteCustomers={deleteCustomersData}
            />
          )}
        />
      </ScrollView>
    </CustomSafeAreaView>
  );
};

const styles = StyleSheet.create({
  list: {
    height: 70,
    marginBottom: 10,
    borderRadius: 8,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#F5F5F5',
  },
});
