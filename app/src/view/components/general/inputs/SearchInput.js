import {StyleSheet, TextInput, View} from 'react-native';
import {FONTS} from '../../../../conts';
import {s} from 'react-native-size-matters';
import {MyIcons} from '../others';

export const SearchInput = ({
  style,
  onChangeText,
  title = 'Search',
  ...props
}) => {
  return (
    <View style={{...styles.search, ...style}}>
      <MyIcons.Search size={20} />
      <TextInput
        placeholderTextColor={'#969696'}
        onChangeText={onChangeText}
        style={{
          fontSize: s(14),
          fontFamily: FONTS.PLUS_JAKARTA_SANS_FONTS.semiBold,
          color: '#848A94',
          marginHorizontal: 15,
          flex: 1,
        }}
        placeholder={title}
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  search: {
    height: 48,
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    flexDirection: 'row',
    paddingHorizontal: 15,
    alignItems: 'center',
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#E9F1FF',
  },
});
