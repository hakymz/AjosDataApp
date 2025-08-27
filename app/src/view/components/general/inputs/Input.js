import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Image,
} from 'react-native';
import {COLORS, FONTS} from '../../../../conts';
import {TouchableOpacity} from '@gorhom/bottom-sheet';
import {Icons} from '../others';
import Clipboard from '@react-native-clipboard/clipboard';
import {Text} from '../text';

const fetchCopiedText = async () => {
  const text = await Clipboard.getString();
  return text;
};

export const Input = React.forwardRef(
  (
    {
      error = null,
      type = 'white',
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
      paste = true,
      onPaste,
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
          blur: COLORS.white,
        },
        textColor: {active: COLORS.darkBlue, blur: '#848A94'},
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
          ? inputStyleConfig[type].textColor.blur
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
          ...conStyle,
        }}>
        <View
          style={[
            styles.inputContainer,
            {
              height: 60,
              alignItems: 'center',
              backgroundColor: getBackgroundColor(),
              borderWidth: 1,
              borderColor: !border
                ? COLORS.white
                : focused && !error
                ? COLORS.primary
                : error
                ? COLORS.error
                : '#E9F1FF',
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
              <ActivityIndicator color={COLORS.primary} />
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
                  fontFamily:
                    fontFamily || FONTS.PLUS_JAKARTA_SANS_FONTS.regular,
                  ...inputStyle,
                }}
                ref={ref}
                editable={editable}
                value={value?.trimStart?.() ?? ''}
                {...props}
              />

              {rightIcon ? (
                <View style={{right: -10}}>{rightIcon}</View>
              ) : onPaste ? (
                <TouchableOpacity
                  onPress={async () => {
                    const text = await fetchCopiedText();
                    onPaste(text);
                  }}>
                  <Icons.Paste size={22} />
                </TouchableOpacity>
              ) : (
                password && (
                  <TouchableOpacity
                    onPress={() => {
                      setShowPassword(!showPassword);
                    }}>
                    <Icons.EyeLash size={22} />
                  </TouchableOpacity>
                )
              )}
            </>
          )}
        </View>
        {error && (
          <Text size={12} medium style={{marginTop: 5}} color={COLORS.error}>
            {error}
          </Text>
        )}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
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
