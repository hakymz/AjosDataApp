import React from 'react';
import {COLORS} from '../../../../conts';
import {PageList} from '../../lists';
import {Input} from './Input';
export const PageInput = ({
  onFocus = () => {},
  onBlur = () => {},
  error,
  keyboardType,
  style,
  showTextError = false,
  ...props
}) => {
  const [focused, setIsFocused] = React.useState(false);
  return (
    <PageList style={{paddingHorizontal: 0}}>
      <Input
        textColor={COLORS.blue}
        keyboardType={keyboardType}
        error={error}
        onFocus={() => {
          onFocus();
          // setIsFocused(true);
        }}
        onBlur={() => {
          onBlur();
          // setIsFocused(false);
        }}
        showTextError={showTextError}
        border={error ? true : false}
        backgroundColor={COLORS.white}
        conStyle={{marginBottom: 0, borderRadius: 16, height: '100%'}}
        style={{
          borderRadius: 8,
          backgroundColor: 'white',
          borderRadius: 16,
          height: '100%',
          ...style,
        }}
        {...props}
      />
    </PageList>
  );
};
