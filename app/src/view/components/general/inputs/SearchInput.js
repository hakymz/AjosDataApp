import {StyleSheet, TextInput, View} from 'react-native';
import {FONTS} from '../../../../conts';
import {s} from 'react-native-size-matters';
import {MyIcons} from '../others';

export const SearchInput = ({style, onChangeText, title = 'Search Bank'}) => {
  return (
    <View style={{...styles.search, ...style}}>
      <TextInput
        placeholderTextColor={'#969696'}
        onChangeText={onChangeText}
        style={{
          fontSize: s(14),
          fontFamily: FONTS.EINA04_FONTS.regular,
          color: '#969696',
        }}
        placeholder={title}
      />
      <MyIcons.Search size={20} />
    </View>
  );
};

const styles = StyleSheet.create({
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
