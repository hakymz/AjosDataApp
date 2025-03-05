import React from 'react';
import {ActivityIndicator, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {COLORS} from '../../../../conts';

export const Image = ({resizeMode = FastImage.resizeMode.contain, ...pros}) => {
  const [loading, setLoading] = React.useState(true);
  return (
    <View>
      {loading && (
        <View
          style={{
            zIndex: loading ? 1 : -1,
            width: '100%',
            position: 'absolute',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ActivityIndicator
            color={COLORS.primary}
            size={'large'}
            style={{position: 'absolute'}}
          />
        </View>
      )}

      <FastImage
        onLoadEnd={() => {
          setLoading(false);
        }}
        resizeMode={resizeMode}
        {...pros}
      />
    </View>
  );
};
