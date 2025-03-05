import React from 'react';
import {COLORS} from '../../../../conts';
import {PageList} from '../../lists';
import {Input} from './Input';
import {CustomPicker} from './Picker';
import {ActivityIndicator, View} from 'react-native';
export const PagePicker = ({
  onFocus = () => {},
  onBlur = () => {},
  error,
  keyboardType,
  loading,
  ...props
}) => {
  const [focused, setFocused] = React.useState(false);

  return (
    <PageList style={{paddingHorizontal: 0}}>
      {loading ? (
        <View style={{flex: 1}}>
          <ActivityIndicator size={'small'} color={COLORS.primary} />
        </View>
      ) : (
        <CustomPicker
          style={{height: 68}}
          textColor={COLORS.blue}
          keyboardType={keyboardType}
          error={error}
          onFocus={() => {
            onFocus();
            setFocused(true);
          }}
          onBlur={() => {
            onBlur();
            setFocused(false);
          }}
          border={false}
          backgroundColor={COLORS.white}
          conStyle={{marginBottom: 0, paddingVertical: 0}}
          {...props}
        />
      )}
    </PageList>
  );
};
