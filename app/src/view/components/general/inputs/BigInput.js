import React from 'react';
import {Text} from '../text';
import {View, TextInput, Image} from 'react-native';
import {COLORS, FONTS, IMAGES} from '../../../../conts';
import {formatInput, scaleFont} from '../../../../helper';
import {s} from 'react-native-size-matters';
import CurrencyInput from 'react-native-currency-input';
import {MyIcons} from '../others';

const CurrencyLogo = ({
  focused,
  background = {
    blur: '#E7E7E7',
    active: '#272727',
  },
  color = {blur: COLORS.black, active: COLORS.white},
  currencyArrow,
  currency = 'NGN',
}) => {
  return (
    <View
      style={{
        height: 40,
        backgroundColor: focused ? background.active : background.blur,
        borderRadius: 30,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        right: -10,
      }}>
      <Image
        style={{height: s(20), width: s(20)}}
        source={currency == 'USD' ? IMAGES.usaLogo : IMAGES.ngLogo}
      />
      <View style={{width: 5}} />
      <Text size={13} color={focused ? color.active : color.blur} bold>
        {currency === true ? 'NGN' : currency}
      </Text>
      {currencyArrow && <MyIcons.ArrowGrey style={{marginLeft: 5}} size={15} />}
    </View>
  );
};

export const BigInput = ({
  title,
  value,
  type = 'white',
  onFocus = () => {},
  onBlur = () => {},
  backgroundColor,
  currency,
  conStyle,
  inputStyle,
  textColor,
  style,
  error,
  onChangeText = () => {},
  right,
  showCurrencyLogo,
  currencyLogoBackground,
  currencyLogoColor,
  currencyArrow,
  customIcon,
  ...props
}) => {
  const [focused, setFocused] = React.useState(false);
  const [state, setState] = React.useState({value: ''});

  const inputStyleConfig = {
    white: {
      backgroundColor: COLORS.white,
      textColorActive: '#B7B7B7',
      textColorBlur: '#B7B7B7',
      placeholderTextColor: '#B7B7B7',
    },
    background: {
      backgroundColor: COLORS.background,
      textColorActive: COLORS.inputGrey,
      textColorBlur: COLORS.inputGrey,
      placeholderTextColor: COLORS.inputGrey,
    },
  };

  const getBackgroundColor = () => {
    if (backgroundColor) {
      if (typeof backgroundColor == 'object') {
        return error && !focused
          ? backgroundColor.blur
          : focused || value
          ? backgroundColor.active
          : backgroundColor.blur;
      } else {
        return backgroundColor;
      }
    } else {
      return error && !focused
        ? inputStyleConfig[type].backgroundColor.blur
        : focused || value
        ? inputStyleConfig[type].backgroundColor.active
        : inputStyleConfig[type].backgroundColor.blur;
    }
  };

  const getTextColor = placeholderTextColor => {
    if (textColor) {
      if (typeof textColor == 'object') {
        if (placeholderTextColor) {
          return focused
            ? textColor?.active
            : textColor.placeholderTextColor ?? textColor.active;
        }
        return error && !focused
          ? textColor.placeholderTextColor
          : focused || value
          ? textColor.active
          : textColor.blur;
      } else {
        return textColor;
      }
    } else {
      if (placeholderTextColor) {
        return focused
          ? inputStyleConfig[type].textColorActive
          : inputStyleConfig[type].placeholderTextColor;
      }
      return error && !focused
        ? inputStyleConfig[type].placeholderTextColor
        : focused || value
        ? inputStyleConfig[type].textColorActive
        : inputStyleConfig[type].textColorBlur;
    }
  };

  return (
    <View
      style={{
        height: s(85),
        borderRadius: 20,
        paddingHorizontal: 30,
        backgroundColor: getBackgroundColor(),
        borderWidth: 1.5,
        borderColor: !focused && error ? COLORS.red : getBackgroundColor(),
        alignItems: 'center',
        flexDirection: 'row',
        ...style,
      }}>
      <View style={{flex: 1}}>
        <Text
          numberOfLines={1}
          color={!focused && error ? COLORS.red : '#969696'}
          semiBold
          size={12}>
          {!focused && error ? error : title}
        </Text>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          {currency ? (
            <CurrencyInput
              placeholderTextColor={getTextColor(true)}
              value={value}
              onChangeValue={value => {
                onChangeText(!value ? '' : value);
              }}
              delimiter=","
              separator="."
              precision={2}
              onFocus={() => {
                onFocus();
                setFocused(true);
              }}
              onBlur={() => {
                onBlur();
                setFocused(false);
              }}
              style={{
                marginTop: 0,
                fontSize: scaleFont(25),
                fontFamily: FONTS.EINA04_FONTS.bold,
                color: getTextColor(),
                flex: 1,
              }}
              {...props}
            />
          ) : (
            <TextInput
              value={value}
              onChangeText={value => {
                onChangeText(!value ? '' : value);
              }}
              onFocus={() => {
                onFocus();
                setFocused(true);
              }}
              onBlur={() => {
                onBlur();
                setFocused(false);
              }}
              placeholderTextColor={getTextColor(true)}
              style={{
                marginTop: 0,
                fontSize: scaleFont(25),
                fontFamily: FONTS.EINA04_FONTS.bold,
                color: getTextColor(),
                flex: 1,
              }}
              {...props}
            />
          )}
        </View>
      </View>
      {customIcon}
      {showCurrencyLogo && (
        <CurrencyLogo
          currency={currency}
          currencyArrow={currencyArrow}
          color={currencyLogoColor}
          background={currencyLogoBackground}
          focused={focused || value}
        />
      )}

      {right && <View>{right}</View>}
    </View>
  );
};
