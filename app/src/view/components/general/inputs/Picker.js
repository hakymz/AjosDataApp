import React from 'react';
import {COLORS, FONTS, IMAGES} from '../../../../conts';
import {View, StyleSheet, Platform, useColorScheme, Image} from 'react-native';
import {Icons, MyIcons} from '..';
import {s} from 'react-native-size-matters';
import RNPickerSelect from 'react-native-picker-select';
import {scaleFont} from '../../../../helper';

export const CustomPicker = ({
  onValueChange = () => {},
  error,
  data = [],
  style,
  pickerStyle,
  placeholder,
  conStyle,
  value = '',
  defaultValue = '',
  showText = true,
  fontFamily = FONTS.AIRBNBCEREAL_FONTS.Md,
  setTouched = () => {},
  color,
  rightIcon,
  innerStyle,
  disabled,
}) => {
  const colorScheme = useColorScheme();
  const [selectedValue, setSelectedValue] = React.useState(value);

  let itemColor =
    colorScheme == 'dark'
      ? Platform.OS == 'ios'
        ? COLORS.grey
        : COLORS.white
      : COLORS.black;

  const dataSet = (data ?? [])?.map?.(item => ({
    ...item,
    label:
      item?.name?.toString?.()?.trim?.() || item?.plan?.toString?.()?.trim?.(),
    value: item,
    color: itemColor,
  }));

  React.useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  return (
    <View
      style={{
        marginBottom: 10,
        flex: 1,
        ...conStyle,
      }}>
      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: COLORS.white,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: error ? COLORS.error : COLORS.white,
            ...style,
          },
        ]}>
        <View
          style={{
            flex: 1,
            paddingLeft: 20,
            // paddingRight: 48,

            ...innerStyle,
          }}>
          <RNPickerSelect
            disabled={disabled}
            onClose={setTouched}
            useNativeAndroidPickerStyle={false}
            style={
              Platform.OS == 'ios'
                ? {
                    inputIOS: {
                      color: !showText
                        ? 'transparent'
                        : error
                        ? COLORS.error
                        : color || COLORS.blue,
                      fontSize: scaleFont(18),
                      fontFamily,
                      ...pickerStyle,

                      height: '100%',
                      paddingRight: 48,
                    },
                    placeholder: {
                      color: !showText
                        ? 'transparent'
                        : error
                        ? COLORS.error
                        : color || COLORS.blue,
                    },
                  }
                : {
                    inputAndroid: {
                      color: !showText
                        ? 'transparent'
                        : error
                        ? COLORS.error
                        : color || COLORS.blue,
                      fontSize: scaleFont(18),
                      paddingRight: 48,
                      fontFamily,
                      ...pickerStyle,
                    },
                    placeholder: {
                      color: !showText
                        ? 'transparent'
                        : error
                        ? COLORS.error
                        : color || COLORS.inputGrey,
                    },
                    inputAndroidContainer: {
                      textAlign: 'center',
                    },
                  }
            }
            value={selectedValue}
            placeholder={{
              value: '',
              label: placeholder,
              color: itemColor,
            }}
            onValueChange={value => {
              onValueChange(value);
            }}
            items={dataSet}
          />
        </View>
        <View
          style={{
            right: 10,
            position: 'absolute',
            zIndex: -1,
          }}>
          {rightIcon || (
            <View
              style={{
                height: 36,
                width: 36,
                borderWidth: 1,
                borderColor: '#EAECF0',
                borderRadius: 12,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image source={IMAGES.chevron} />
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    backgroundColor: COLORS.white,
    height: '100%',
    borderColor: COLORS.grey,
    justifyContent: 'space-between',
    height: s(55),
    borderRadius: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
