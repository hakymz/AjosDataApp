import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Image,
} from 'react-native';
import {COLORS, FONTS} from '../../../../conts';
import {BottomSheetTextInput, TouchableOpacity} from '@gorhom/bottom-sheet';

export const Input = React.forwardRef(
  (
    {
      error = null,
      type = 'grey',
      fontFamily,
      fontSize = 16,
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
      password = false,
      light,
      big,
      value,
      rightIcon,
      leftIcon,
      border = true,
      loading,
      showTextError = true,
      handleScroll,
      ...props
    },
    ref,
  ) => {
    const [focused, setFocused] = React.useState(false);
    const [showPassword, setShowPassword] = React.useState(password);
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

    const getBackgroundColor = () => {
      if (backgroundColor) {
        if (typeof backgroundColor == 'object') {
          return error
            ? backgroundColor.blur
            : focused
            ? backgroundColor.active
            : backgroundColor.blur;
        } else {
          return backgroundColor;
        }
      } else {
        return error
          ? inputStyleConfig[type].backgroundColor.blur
          : focused
          ? inputStyleConfig[type].backgroundColor.active
          : inputStyleConfig[type].backgroundColor.blur;
      }
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
          return error ? COLORS.error : textColor;
        }
      } else {
        return error && !focused
          ? COLORS.primary
          : focused
          ? inputStyleConfig[type].textColor.active
          : inputStyleConfig[type].textColor.blur;
      }
    };

    const showErrorMessage = !focused && error && showTextError;

    return (
      <View
        style={{
          width: '100%',
          marginBottom: 10,
          flexDirection: 'row',
          ...conStyle,
        }}>
        <View
          style={[
            styles.inputContainer,
            {
              height: big ? 60 : 54,
              alignItems: 'center',
              backgroundColor: getBackgroundColor(),
              borderWidth: 1,
              borderColor: !border
                ? COLORS.white
                : focused && !error
                ? COLORS.blue
                : error
                ? COLORS.error
                : 'rgba(208, 208, 208, 0)',
              ...style,
            },
          ]}>
          {loading ? (
            <View
              style={{
                height: '100%',
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <ActivityIndicator color={COLORS.yellow} />
            </View>
          ) : (
            <>
              {leftIcon && <View style={{left: 0}}>{leftIcon}</View>}

              <TextInput
                secureTextEntry={!focused && error ? false : showPassword}
                onFocus={() => {
                  onFocus();
                  setFocused(true);
                }}
                onBlur={() => {
                  onBlur();
                  setFocused(false);
                }}
                placeholderTextColor={getTextColor()}
                style={{
                  fontSize,
                  ...styles.input,
                  color: getTextColor(),
                  textAlign: centerText ? 'center' : 'left',
                  fontFamily: FONTS.AIRBNBCEREAL_FONTS.Md,
                  ...inputStyle,
                }}
                ref={ref}
                editable={editable}
                value={showErrorMessage ? error : value?.trimStart?.() ?? ''}
                {...props}
              />

              {rightIcon ? (
                <View style={{right: 0}}>{rightIcon}</View>
              ) : (
                password && (
                  <View>
                    {password ? (
                      <TouchableOpacity
                        onPress={() => {
                          setShowPassword(!showPassword);
                        }}>
                        <Image
                          style={{height: 20, width: 20}}
                          source={require('../../../../assets/images/others/eyeClose.png')}
                        />
                      </TouchableOpacity>
                    ) : (
                      <View style={{right: -20}}>{rightIcon}</View>
                    )}
                  </View>
                )
              )}
            </>
          )}
        </View>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 20,
    width: '100%',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  input: {
    color: COLORS.grey,
    flex: 1,
  },
});
