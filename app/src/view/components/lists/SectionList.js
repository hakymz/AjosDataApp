import React from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import {s} from 'react-native-size-matters';
import {COLORS} from '../../../conts';
import {Text} from '../general';
import Line from '../general/others/Line';

const List = ({
  title,
  left,
  des,
  right,
  onPress,
  icon,
  titleStyle,
  desStyle,
  rightStyle,
  desComponent,
  rightComponent,
}) => {
  return (
    <TouchableOpacity
      disabled={!onPress}
      onPress={() => {
        onPress();
      }}
      style={{
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
      }}>
      {icon && <View style={styles.iconCon}>{icon}</View>}

      {left}

      <View
        style={{
          paddingHorizontal: 10,
          flex: 1,
          justifyContent: 'center',
        }}>
        {title && (
          <Text style={{...titleStyle}} semiBold size={13} numberOfLines={1}>
            {title}
          </Text>
        )}

        {desComponent || (
          <Text
            color={'#868686'}
            size={12}
            numberOfLines={1}
            style={{...desStyle}}>
            {des}
          </Text>
        )}
      </View>
      {rightComponent && rightComponent}
      {right && <View style={{height: '100%', ...rightStyle}}>{right}</View>}
    </TouchableOpacity>
  );
};
export const SectionList = ({style, item}) => {
  const filterItem = item?.filter(item => item);

  return (
    <View
      style={{
        borderRadius: 20,
        ...styles.con,
        ...style,
      }}>
      {filterItem?.map(
        (data, index) =>
          data && (
            <View key={'list' + index}>
              <List {...data} />
              {index < filterItem?.length - 1 && (
                <Line
                  style={{backgroundColor: '#F1F1F1', marginVertical: 20}}
                />
              )}
            </View>
          ),
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  con: {
    backgroundColor: COLORS.background,
    paddingVertical: 20,
    marginBottom: 10,
  },
  iconCon: {
    height: s(40),
    width: s(40),
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
  },
});
