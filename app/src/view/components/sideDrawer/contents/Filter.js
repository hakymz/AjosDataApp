import {ScrollView, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {Text} from '../../general';
import {COLORS, FONTS} from '../../../../conts';
import {s} from 'react-native-size-matters';
import LottieView from 'lottie-react-native';
import {useWallet} from '../../../../hooks';

const filters = [
  {name: 'Bills Paid', value: 'Bill Payment'},
  {name: 'Gift Card transactions', value: 'Gift Card'},
  {name: 'Crypto transactions', value: 'Crypto'},
  {name: 'Top-Up transactions', value: 'Credit card'},
  {name: 'User-to-User transactions', value: 'User-User Transfer'},
  {name: 'Withdrawals', value: 'Withdrawal'},
  {name: 'Bank transfers', value: 'Bank Transfer'},
];

const checkForList = (setSelectedFilter, filter) => {
  filters.forEach((item, index) => {
    if (item?.value == filter) {
      setSelectedFilter(index);
    }
  });
};

const Filter = () => {
  const [selectedFilter, setSelectedFilter] = React.useState(null);
  const {updateFilter, filter} = useWallet();

  React.useEffect(() => {
    checkForList(setSelectedFilter, filter);
  }, [filter]);

  return (
    <ScrollView
      contentContainerStyle={{paddingBottom: 50}}
      showsVerticalScrollIndicator={false}>
      <Text
        fontType={FONTS.FREDOKA}
        size={18}
        color={COLORS.lightBlue}
        style={{textAlign: 'right', paddingTop: 20, paddingBottom: 10}}>
        Filter
      </Text>

      {filters.map((item, index) => (
        <TouchableOpacity
          index={'fil' + index}
          activeOpacity={0.7}
          onPress={() => {
            updateFilter(
              index == selectedFilter ? null : filters[index]?.value,
            );
            setSelectedFilter(index == selectedFilter ? null : index);
          }}
          style={{
            height: s(55),
            backgroundColor:
              index == selectedFilter
                ? COLORS.white
                : 'rgba(255, 255, 255, 0.4)',
            marginTop: 15,
            justifyContent: 'center',
            paddingHorizontal: 20,
            borderRadius: 60,
            marginHorizontal: 10,
          }}>
          <Text
            color={
              index == selectedFilter ? COLORS.voodoo : 'rgba(82, 52, 90, 0.4)'
            }>
            {item.name}
          </Text>
        </TouchableOpacity>
      ))}
      <View style={{marginTop: 40, alignItems: 'center'}}>
        <LottieView
          style={{
            width: s(38),
            transform: [{rotate: '90deg'}],
          }}
          autoPlay
          loop={true}
          source={require('../../../../assets/lottieFiles/others/arrowUp.json')}
        />
        <Text
          medium
          color={COLORS.lightBlue}
          style={{marginTop: 20, paddingHorizontal: 20}}>
          Select the fields you want filtered in your transactions and close to
          save
        </Text>
      </View>
    </ScrollView>
  );
};

export default Filter;
