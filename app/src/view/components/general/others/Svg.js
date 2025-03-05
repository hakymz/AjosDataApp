import React from 'react';
import {TouchableOpacity} from 'react-native';

export const Svg = ({
  file,
  color,
  onPress,
  size,
  style,
  strokeColor,
  ...props
}) => {
  const File = file;
  const height = style.height || size;
  const width = style.width || size;

  return (
    <TouchableOpacity
      activeOpacity={0}
      disabled={!onPress}
      onPress={onPress}
      style={{...style}}
      {...props}>
      <File
        {...{
          height: height || '100%',
          width: width || '100%',
          fill: color,
        }}
      />
    </TouchableOpacity>
  );
};
