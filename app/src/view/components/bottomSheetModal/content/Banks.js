import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {s} from 'react-native-size-matters';
import {useQuery} from 'react-query';
import {COLORS, FONTS} from '../../../../conts';
import {fetchRequest} from '../../../../helper';
import {
  BottomSheets,
  KeyboardAvoidingViewWrapper,
  MyIcons,
  Text,
} from '../../general';
import Line from '../../general/others/Line';
import {ScrollView} from 'react-native-gesture-handler';

const List = ({item, ...rest}) => {
  return (
    <TouchableOpacity {...rest}>
      <Text semiBold style={{marginVertical: 20, flex: 1}}>
        {item?.name}
      </Text>
    </TouchableOpacity>
  );
};

const SearchInput = ({onChangeText}) => {
  return (
    <View style={style.search}>
      <TextInput
        placeholderTextColor={'#969696'}
        onChangeText={onChangeText}
        style={{fontSize: s(14), fontFamily: FONTS.EINA04_FONTS.regular}}
        placeholder="Search Bank"
      />
      <MyIcons.Search size={20} />
    </View>
  );
};
export const Banks = ({onChange}) => {
  const navigation = useNavigation();

  const [search, setSearch] = React.useState('');

  const getAllBanks = async () => {
    try {
      const response = await fetchRequest({
        path: 'bank',
        method: 'GET',
        displayMessage: false,
        showLoader: false,
      });

      if (response?.status == 'success' && response?.data?.length > 0) {
        return response?.data;
      }
    } catch (error) {
      throw error;
      //send the request after some seconds
    }
  };

  const {data, error} = useQuery('getAllBanks', getAllBanks);
  // console.log(data);

  const filteredBankList = React.useMemo(() => {
    return data
      ?.sort((a, b) =>
        a?.name?.toLowerCase().localeCompare(b?.name?.toLowerCase()),
      )
      ?.filter(item =>
        item?.name?.toLowerCase?.()?.includes?.(search?.toLowerCase?.()),
      );
  }, [data, search]);

  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 20,
          paddingHorizontal: 30,
        }}>
        <Text
          style={{flex: 1}}
          bold
          textAlign={'center'}
          color={COLORS.primary}
          lineHeight={25}
          size={20}>
          Select Bank
        </Text>
      </View>

      <Line style={{marginVertical: 0}} />
      <SearchInput onChangeText={value => setSearch(value)} />
      {!data && (
        <View style={{paddingTop: 40, paddingBottom: 40}}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      )}

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 30,
          paddingTop: 20,
          paddingBottom: 200,
          minHeight: '100%',
        }}>
        {filteredBankList?.map(item => (
          <List
            item={item}
            onPress={() => {
              onChange(item);
              BottomSheets.hide();
            }}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const style = StyleSheet.create({
  search: {
    height: s(55),
    backgroundColor: '#F8F8F8',
    borderRadius: 30,
    flexDirection: 'row',
    paddingHorizontal: 30,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 30,
    marginTop: 20,
  },
});
