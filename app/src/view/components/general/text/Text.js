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
  fontType = 'Jakarta',
  size = 14,
  color,
  style,
  textAlign,
  lineHeight,
  children,
  blk,
  fontWeight,
  ...props
}) => {
  const getFontFamily = () => {
    if (bold || fontWeight == '700') {
      return fontType == 'Montserrat'
        ? FONTS.MONTSERRAT_FONTS.bold
        : FONTS.PLUS_JAKARTA_SANS_FONTS.bold;
    } else if (light || fontWeight == '300') {
      return fontType == 'Montserrat'
        ? FONTS.MONTSERRAT_FONTS.light
        : FONTS.PLUS_JAKARTA_SANS_FONTS.light;
    } else if (medium || fontWeight == '500') {
      return fontType == 'Montserrat'
        ? FONTS.MONTSERRAT_FONTS.medium
        : FONTS.PLUS_JAKARTA_SANS_FONTS.medium;
    } else if (semiBold || fontWeight == '600') {
      return fontType == 'Montserrat'
        ? FONTS.MONTSERRAT_FONTS.semiBold
        : FONTS.PLUS_JAKARTA_SANS_FONTS.semiBold;
    } else if (blk) {
      return FONTS.PLUS_JAKARTA_SANS_FONTS.Blk;
    } else if (fontWeight == '800') {
      return FONTS.PLUS_JAKARTA_SANS_FONTS.XBd;
    } else {
      return FONTS.PLUS_JAKARTA_SANS_FONTS.regular;
    }
  };
  return (
    <RNText
      style={
        Array.isArray(style)
          ? [
              {
                fontFamily: getFontFamily(),
                color: color || COLORS.darkBlue,
                lineHeight: s(lineHeight) || s(size * 1.25),
                fontSize: scaleFont(size),
                textAlign,
              },
              ...style,
            ]
          : {
              fontFamily: getFontFamily(),
              color: color || COLORS.darkBlue,
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
