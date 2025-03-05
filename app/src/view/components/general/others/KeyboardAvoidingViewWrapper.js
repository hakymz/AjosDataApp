import React from 'react';

import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {GENERAL} from '../../../../conts';
import {useLayouts} from '../../../../hooks';
export const KeyboardAvoidingViewWrapper = React.forwardRef(
  (
    {
      style,
      contentContainerStyle,
      children,
      innerRef = () => {},
      addMinHeight,
      ...props
    },

    ref,
  ) => {
    const {minHeight} = useLayouts();
    return (
      <KeyboardAwareScrollView
        innerRef={ref => innerRef(ref)}
        style={{...style}}
        // bounces={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          addMinHeight && {
            minHeight: minHeight - 90,
            paddingBottom: GENERAL.platform == 'ios' ? 40 : 20,
          },
          contentContainerStyle,
        ]}
        {...props}>
        {children}
      </KeyboardAwareScrollView>
    );
  },
);
