import React from 'react';
import {Text as RNText} from 'react-native';
import {s} from 'react-native-size-matters';
import {FONTS, COLORS} from '../../../../conts';
import {scaleFont} from '../../../../helper';

export const Text = ({
  light,
  regular,
  medium,
  bold,
  boldItalic,
  semiBold,
  fontType = 'AirbnbCereal',
  size = 14,
  color,
  style,
  textAlign,
  lineHeight,
  children,
  bk,
  bd,
  lt,
  md,
  blk,
  fontWeight,
  ...props
}) => {
  const getFontFamily = () => {
    if (bd || fontWeight == '700') {
      return FONTS.AIRBNBCEREAL_FONTS.Bd;
    } else if (lt || fontWeight == '300') {
      return FONTS.AIRBNBCEREAL_FONTS.Lt;
    } else if (md || fontWeight == '500') {
      return FONTS.AIRBNBCEREAL_FONTS.Md;
    } else if (blk) {
      return FONTS.AIRBNBCEREAL_FONTS.Blk;
    } else if (fontWeight == '800') {
      return FONTS.AIRBNBCEREAL_FONTS.XBd;
    } else {
      return FONTS.AIRBNBCEREAL_FONTS.Bk;
    }
  };
  return (
    <RNText
      style={
        Array.isArray(style)
          ? [
              {
                fontFamily: getFontFamily(),
                color: color || COLORS.black,
                lineHeight: s(lineHeight) || s(size * 1.25),
                fontSize: scaleFont(size),
                textAlign,
              },
              ...style,
            ]
          : {
              fontFamily: getFontFamily(),
              color: color || COLORS.black,
              lineHeight: s(lineHeight) || s(size * 1.25),
              fontSize: scaleFont(size),
              textAlign,
              ...style,
            }
      }
      {...props}>
      {children}
    </RNText>
  );
};
