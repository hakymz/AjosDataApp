import React from 'react';
import {Svg} from '.';
import Home from '../../../../assets/svgs/icons/homeBottomTabIcons/home.svg';
import HomeActive from '../../../../assets/svgs/icons/homeBottomTabIcons/homeActive.svg';
import History from '../../../../assets/svgs/icons/homeBottomTabIcons/history.svg';
import HistoryActive from '../../../../assets/svgs/icons/homeBottomTabIcons/historyActive.svg';
import Profile from '../../../../assets/svgs/icons/homeBottomTabIcons/profile.svg';
import ProfileActive from '../../../../assets/svgs/icons/homeBottomTabIcons/profileActive.svg';
import Wallet from '../../../../assets/svgs/icons/homeBottomTabIcons/wallet.svg';
import WalletActive from '../../../../assets/svgs/icons/homeBottomTabIcons/walletActive.svg';
import Flayer from '../../../../assets/svgs/icons/homeBottomTabIcons/flayer.svg';
import FlayerActive from '../../../../assets/svgs/icons/homeBottomTabIcons/flayerActive.svg';

const width = 30;
const height = 30;

const customStyle = props => {
  return {
    style: {
      height: props.height || props.size || height,
      width: props.width || props.size || width,
    },
    ...props,
  };
};
export const TabsIcons = {
  Home: ({...props}) => {
    return <Svg {...customStyle(props)} file={Home} />;
  },
  HomeActive: ({...props}) => {
    return <Svg {...customStyle(props)} file={HomeActive} />;
  },

  History: ({...props}) => {
    return <Svg {...customStyle(props)} file={History} />;
  },
  HistoryActive: ({...props}) => {
    return <Svg {...customStyle(props)} file={HistoryActive} />;
  },
  Profile: ({...props}) => {
    return <Svg {...customStyle(props)} file={Profile} />;
  },
  ProfileActive: ({...props}) => {
    return <Svg {...customStyle(props)} file={ProfileActive} />;
  },
  Wallet: ({...props}) => {
    return <Svg {...customStyle(props)} file={Wallet} />;
  },
  WalletActive: ({...props}) => {
    return <Svg {...customStyle(props)} file={WalletActive} />;
  },
  FlayerActive: ({...props}) => {
    return <Svg {...customStyle(props)} file={FlayerActive} />;
  },
  Flayer: ({...props}) => {
    return <Svg {...customStyle(props)} file={Flayer} />;
  },
};
