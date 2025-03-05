import React from 'react';
import {
  BottomSheets,
  CustomSafeAreaView,
  Icons,
  Text,
} from '../../../components/general';
import {AppNav} from '../../../components/layouts';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import {COLORS} from '../../../../conts';
import {AddCustomer} from '../../../components/bottomSheetModal/contents';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {useBillsData} from '../../../../hooks';
import {useQuery} from 'react-query';
import {useIsFocused, useNavigation} from '@react-navigation/native';
const List = ({item, deleteCustomers, onPress}) => {
  const {width} = useWindowDimensions();
  const [state, setState] = React.useState({showDelete: false});
  const rightPosition = useSharedValue(25);
  const navigation = useNavigation();

  let customerNumber = item?.customerNumber?.split('+234');
  if (customerNumber[1]) {
    customerNumber =
      customerNumber?.[1]?.[0] == '0'
        ? customerNumber?.[1]
        : '0' + customerNumber?.[1];
  } else {
    customerNumber = item?.customerNumber;
  }

  const animatedStyle = useAnimatedStyle(() => {
    return {
      right: rightPosition.value,
    };
  });
  const slide = async () => {
    if (!state?.showDelete) {
      setState(prevState => ({
        ...prevState,
        showDelete: !prevState?.showDelete,
      }));
      rightPosition.value = withTiming(10, {
        duration: 200,
      });
    } else {
      rightPosition.value = withTiming(27, {
        duration: 200,
      });
      setTimeout(() => {
        setState(prevState => ({
          ...prevState,
          showDelete: !prevState?.showDelete,
        }));
      }, 250);
    }
  };
  return (
    <TouchableOpacity
      disabled={!onPress}
      onPress={() => {
        onPress(customerNumber);
        navigation.goBack();
      }}
      style={{
        // ...styles.list,
        width: '100%',
      }}>
      {state?.showDelete && (
        <Animated.View
          style={[
            {
              height: 72,
              position: 'absolute',
              backgroundColor: COLORS.primary,
              zIndex: 10,
              width: width - 50,
              borderRadius: 8,
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 15,
              justifyContent: 'space-between',
            },
            animatedStyle,
          ]}>
          <Icons.CloseCircle
            onPress={() => {
              slide();
            }}
          />
          <Text size={12} color={COLORS.white} bk>
            Are you sure you want to delete?
          </Text>
          <TouchableOpacity
            onPress={() => {
              deleteCustomers(item?._id);
            }}
            style={{
              height: 32,
              width: 32,
              backgroundColor: COLORS.white,
              borderRadius: 40,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Icons.DeleteIcon size={15} />
          </TouchableOpacity>
        </Animated.View>
      )}

      <View
        style={{
          ...styles.list,
          marginHorizontal: 20,
        }}>
        <View style={{flex: 1}}>
          <Text size={14} fontWeight={'500'} color={'#7F8192'}>
            {item?.customerName}
          </Text>
          <Text
            style={{marginTop: 3}}
            size={18}
            fontWeight={800}
            color={'#7F8192'}>
            {item?.customerNumber}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            slide();
          }}
          style={{
            backgroundColor: '#FCDCD3',
            height: 32,
            width: 32,
            borderRadius: 100,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Icons.DeleteIcon size={15} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
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
      console.log(response, 'response response');

      setTimeout(() => {
        refetch();
      }, 1000);
    } catch (error) {}
  };

  React.useEffect(() => {
    refetch();
  }, [isFocused]);
  return (
    <CustomSafeAreaView>
      <AppNav title="Customers" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: 20,
          paddingBottom: 40,
        }}>
        <View style={{paddingHorizontal: 20}}>
          <Text
            size={14}
            fontWeight={'500'}
            color={COLORS.dark}
            textAlign={'center'}>
            Here is a list of your beneficiaries/Customers
          </Text>
          <TouchableOpacity
            onPress={() => {
              BottomSheets.show({
                component: <AddCustomer />,
                customSnapPoints: [550, 550],
              });
            }}
            style={{
              marginTop: 20,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Icons.AddCircle size={18} />
            <Text
              style={{textDecorationLine: 'underline', paddingLeft: 10}}
              textAlign={'center'}
              size={14}
              fontWeight={'800'}
              color={COLORS.dark}>
              ADD NEW CUSTOMER
            </Text>
          </TouchableOpacity>
        </View>

        <FlatList
          contentContainerStyle={{marginTop: 30}}
          data={customersData}
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
    height: 72,
    backgroundColor: '#F8F8F8',
    marginBottom: 10,
    borderRadius: 8,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
