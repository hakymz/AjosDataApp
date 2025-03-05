import React from 'react';

import {View, Image} from 'react-native';
import {FONTS, COLORS} from '../../../conts';
import {SvgUri} from 'react-native-svg';

import {s} from 'react-native-size-matters';
import CurrencyInput from 'react-native-currency-input';
import {CustomPicker, MyIcons, Text} from '../general';
import {scaleFont} from '../../../helper';

const Logos = ({
  focused,
  background = {
    blur: '#1F7D55',
    active: '#1F7D55',
  },
  cardLogo,
  countryLogo,
  conutryCode,
}) => {
  const image = cardLogo?.uri;
  return (
    <View style={{flexDirection: 'row'}}>
      {image.includes?.('.svg') ? (
        <SvgUri width={38} height={38} uri={image} />
      ) : (
        <Image
          style={{height: 38, width: 38, borderRadius: 100}}
          source={{uri: image}}
        />
      )}

      {conutryCode && (
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
            width: 78,
          }}>
          <View
            style={{
              borderRadius: 50,
              height: s(20),
              width: s(20),
              overflow: 'hidden',
            }}>
            {typeof countryLogo == 'string' ? (
              <SvgUri width="100%" height="100%" uri={countryLogo} />
            ) : (
              countryLogo
            )}
          </View>

          <View style={{width: 5}} />
          <Text size={13} color={COLORS.white} bold>
            {conutryCode}
          </Text>
        </View>
      )}
    </View>
  );
};

export const GiftCardBigInput = ({
  title,
  value,
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
  cardLogo,
  countryLogo,
  conutryCode,
  data,
  type,
  ...props
}) => {
  const [focused, setFocused] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState();

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
    <View>
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
          {type == 'FIXED' && (
            <CustomPicker
              pickerStyle={{
                width: '100%',
                height: '100%',
                paddingHorizontal: 0,
              }}
              innerStyle={{
                paddingHorizontal: 0,
                paddingRight: 0,
                paddingLeft: 0,
              }}
              value={selectedValue}
              onValueChange={value => {
                setSelectedValue(value);
                onChangeText(value?.value);
              }}
              placeholder={'Select amonut'}
              showText={false}
              rightIcon={<></>}
              conStyle={{
                width: '100%',
                zIndex: 100,
                position: 'absolute',
                borderColor: null,
                borderColor: null,
                borderWidth: 0,
                paddingHorizontal: 0,
              }}
              data={data}
              style={{
                backgroundColor: 'transparent',
                borderColor: null,
                borderWidth: 0,
                paddingHorizontal: 0,
              }}
            />
          )}
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text numberOfLines={1} color={'#969696'} semiBold size={12}>
              {title}
            </Text>

            {type == 'FIXED' && (
              <MyIcons.ArrowGrey size={13} style={{marginLeft: 8}} />
            )}
          </View>

          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <CurrencyInput
              placeholderTextColor={getTextColor(true)}
              value={value}
              onChangeValue={value => {
                onChangeText(value || '');
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
          </View>
        </View>

        <Logos
          countryLogo={countryLogo}
          cardLogo={cardLogo}
          conutryCode={conutryCode}
        />
      </View>
      {error && (
        <Text
          color={COLORS.red}
          semiBold
          size={12}
          style={{position: 'absolute', bottom: -25, paddingHorizontal: 20}}>
          {error}
        </Text>
      )}
    </View>
  );
  7;
};
