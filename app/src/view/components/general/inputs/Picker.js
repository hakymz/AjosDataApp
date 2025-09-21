import React from 'react';
import {COLORS, FONTS, IMAGES} from '../../../../conts';
import {View, StyleSheet, Platform, useColorScheme, Image} from 'react-native';

import RNPickerSelect from 'react-native-picker-select';
import {scaleFont} from '../../../../helper';
import {Icons} from '../others';

export const CustomPicker = React.forwardRef(
  (
    {
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
      fontFamily = FONTS.PLUS_JAKARTA_SANS_FONTS.regular,
      setTouched = () => {},
      color,
      rightIcon,
      innerStyle,
      disabled,
    },
    ref,
  ) => {
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
        item?.name?.toString?.()?.trim?.() ||
        item?.plan?.toString?.()?.trim?.(),
      value: item ?? null,
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
              borderRadius: 16,
              borderWidth: 1,
              borderColor: error ? COLORS.error : '#E9F1FF',
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
              ref={ref}
              disabled={disabled}
              onClose={setTouched}
              useNativeAndroidPickerStyle={false}
              style={
                Platform.OS == 'ios'
                  ? {
                      inputIOSContainer: {pointerEvents: 'none'},
                      inputIOS: {
                        color: !showText
                          ? 'transparent'
                          : error
                          ? COLORS.error
                          : color || '#848A94',
                        fontSize: scaleFont(14),
                        fontFamily,

                        ...pickerStyle,

                        // height: '100%',
                        paddingRight: 48,
                      },
                      placeholder: {
                        color: !showText
                          ? 'transparent'
                          : error
                          ? COLORS.error
                          : color || '#848A94',
                      },
                    }
                  : {
                      inputAndroid: {
                        color: !showText
                          ? 'transparent'
                          : error
                          ? COLORS.error
                          : color || COLORS.blue,
                        fontSize: scaleFont(14),
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
                value: null,
                label: placeholder ?? null,
                color: itemColor,
              }}
              onValueChange={value => {
                onValueChange(value);
              }}
              items={dataSet ?? []}
            />
          </View>
          <View
            style={{
              right: 15,
              position: 'absolute',
            }}>
            {rightIcon || (
              <View
                style={{
                  height: 32,
                  width: 32,
                  borderWidth: 1,
                  borderColor: '#E9F1FF',
                  borderRadius: 32,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Icons.ChevronDown size={15.2} />
              </View>
            )}
          </View>
        </View>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  inputContainer: {
    backgroundColor: COLORS.white,
    height: '100%',
    borderColor: COLORS.grey,
    justifyContent: 'space-between',
    height: 60,
    borderRadius: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
