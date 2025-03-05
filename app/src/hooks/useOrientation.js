import React from 'react';
import {useWindowDimensions} from 'react-native';
export const useOrientation = () => {
  const {width, height} = useWindowDimensions();
  const [screenOrientation, setScreenOrientation] = React.useState('portrait');
  React.useEffect(() => {
    const orientation = width > height ? 'landscape' : 'portrait';
    setScreenOrientation(orientation);
  }, [width, height]);
  return {screenOrientation};
};
