import React from 'react';
import {View, TextInput, StyleSheet, ActivityIndicator} from 'react-native';
import {COLORS, FONTS, GENERAL} from '../../../../conts';
import {Text} from '..';
import {s} from 'react-native-size-matters';
import {scaleFont} from '../../../../helper';
import {useTheme} from '../../../../hooks';
import {Icons} from '../others';
import {TouchableOpacity} from '@gorhom/bottom-sheet';
import {PageList} from '../../lists';
import wordsCount from 'words-count';

export const TextArea = React.forwardRef(
  (
    {
      error = null,
      type = 'grey',
      fontFamily,
      fontSize = 14,
      name,
      style,
      conStyle,
      inputStyle,
      backgroundColor,
      textColor,
      onFocus = () => {},
      onBlur = () => {},
      centerText,
      editable = true,
      password,
      light,
      big,
      value,
      rightIcon,
      leftIcon,
      border = true,
      onChangeText,
      loading,
      ...props
    },
    ref,
  ) => {
    const [focused, setFocused] = React.useState(false);

    const totalWords = wordsCount(value);
    const maxWords = 160;

    const inputStyleConfig = {
      white: {
        backgroundColor: {
          active: COLORS.white,
          blur: 'rgba(255, 255, 255, 0.1)',
        },
        textColor: {active: COLORS.voodoo, blur: 'rgba(82, 52, 90, 0.5)'},
      },
      grey: {
        backgroundColor: {
          active: '#EFF1FB',
          blur: '#F8F8F8',
        },
        textColor: {active: COLORS.blue, blur: '#7F8192', focused: COLORS.blue},
      },
    };

    const getTextColor = () => {
      if (textColor) {
        if (typeof textColor == 'object') {
          return error && !focused
            ? COLORS.primary
            : focused
            ? textColor.active
            : !focused
            ? textColor.blur
            : COLORS.black;
        } else {
          return textColor;
        }
      } else {
        return error && !focused
          ? COLORS.primary
          : focused
          ? inputStyleConfig[type].textColor.active
          : inputStyleConfig[type].textColor.blur;
      }
    };

    return (
      <View>
        <View
          style={{
            height: 236,
            flexDirection: 'colunm',
            paddingVertical: 20,
            backgroundColor: COLORS.white,
            paddingHorizontal: 20,
            borderRadius: 16,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
            }}>
            <Text color={'#5D55E0'} semiBold size={16}>
              Message
            </Text>
            <Text
              size={10}
              bold
              color={totalWords >= maxWords ? COLORS.red : '#303437'}>
              {totalWords}/{maxWords}
            </Text>
          </View>
          <View
            style={[
              styles.inputContainer,
              {
                flex: 1,
                backgroundColor: COLORS.white,
                borderColor: !border
                  ? COLORS.white
                  : focused
                  ? COLORS.blue
                  : error
                  ? COLORS.red
                  : 'rgba(208, 208, 208, 0)',
                marginTop: 20,
                ...style,
              },
            ]}>
            <TextInput
              multiline
              onFocus={() => {
                onFocus();
                setFocused(true);
              }}
              onBlur={() => {
                onBlur();
                setFocused(false);
              }}
              autoComplete={'off'}
              onChangeText={value => {
                if (value.split(' ')?.length <= maxWords) {
                  onChangeText(value);
                }
              }}
              placeholderTextColor={'#303437'}
              style={{
                fontSize,
                ...styles.input,
                color: '#303437',
                textAlign: centerText ? 'center' : 'left',
                fontFamily: FONTS.PLUS_JAKARTA_SANS_FONTS.medium,

                ...inputStyle,
              }}
              ref={ref}
              editable={editable}
              value={value?.trimStart?.() ?? ''}
              {...props}
            />
          </View>
        </View>
        {error && (
          <Text md color={COLORS.red} style={{top: 5}}>
            {error}
          </Text>
        )}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  inputContainer: {
    borderRadius: 8,
    width: '100%',
  },
  input: {
    color: COLORS.grey,
    minHeight: 50,
  },
});
