import React from 'react';
import {Svg} from '.';
import ArrowRed from '../../../../assets/svgs/icons/arrowRed.svg';
import ArrowLeft from '../../../../assets/svgs/icons/arrowLeft.svg';
import EyeClose from '../../../../assets/svgs/icons/eyeClose.svg';
import FingerPrint from '../../../../assets/svgs/icons/fingerPrint.svg';
import FaceId from '../../../../assets/svgs/icons/faceId.svg';
import Bell from '../../../../assets/svgs/icons/bell.svg';
import DoublePerson from '../../../../assets/svgs/icons/doublePerson.svg';
import LiveChat from '../../../../assets/svgs/icons/liveChat.svg';
import PlusCircle from '../../../../assets/svgs/icons/plusCircle.svg';
import Share from '../../../../assets/svgs/icons/share.svg';
import Info from '../../../../assets/svgs/icons/info.svg';
import CloseCircle from '../../../../assets/svgs/icons/closeCircle.svg';
import Copy from '../../../../assets/svgs/icons/copy.svg';
import AddCircle from '../../../../assets/svgs/icons/addCircle.svg';
import DeleteIcon from '../../../../assets/svgs/icons/deleteIcon.svg';
import Chevron from '../../../../assets/svgs/icons/chevron.svg';
import Phone from '../../../../assets/svgs/icons/phone.svg';
import Upload from '../../../../assets/svgs/icons/upload.svg';
import Light from '../../../../assets/svgs/icons/light.svg';
import Lock from '../../../../assets/svgs/icons/lock.svg';
import Tv from '../../../../assets/svgs/icons/tv.svg';
import Person from '../../../../assets/svgs/icons/person.svg';
import Settings from '../../../../assets/svgs/icons/settings.svg';
import Biometrics from '../../../../assets/svgs/icons/biometrics.svg';
import Emojis from '../../../../assets/svgs/icons/emojis.svg';
import Chat from '../../../../assets/svgs/icons/chat.svg';
import DeleteGrey from '../../../../assets/svgs/icons/deleteGrey.svg';
import Pin from '../../../../assets/svgs/icons/pin.svg';
import Padlock from '../../../../assets/svgs/icons/padlock.svg';
import Email from '../../../../assets/svgs/icons/email.svg';
import Message from '../../../../assets/svgs/icons/message.svg';
import RedArrow from '../../../../assets/svgs/icons/redArrow.svg';
import Galary from '../../../../assets/svgs/icons/galary.svg';
import Calender from '../../../../assets/svgs/icons/calender.svg';
import SmallPadlock from '../../../../assets/svgs/icons/smallPadlock.svg';
import Bank from '../../../../assets/svgs/icons/bank.svg';
import Vault from '../../../../assets/svgs/icons/vault.svg';
import UserRight from '../../../../assets/svgs/icons/userRight.svg';
import Cash from '../../../../assets/svgs/icons/cash.svg';
import ChatGreen from '../../../../assets/svgs/icons/chatGreen.svg';
import History from '../../../../assets/svgs/icons/history.svg';
import Coins from '../../../../assets/svgs/icons/coins.svg';
import Convert from '../../../../assets/svgs/icons/convert.svg';
import Folder from '../../../../assets/svgs/icons/folder.svg';
import Edit from '../../../../assets/svgs/icons/edit.svg';
import Wifi from '../../../../assets/svgs/icons/wifi.svg';
import Gift from '../../../../assets/svgs/icons/gift.svg';
import Whatsapp from '../../../../assets/svgs/icons/whatsapp.svg';
import MailRed from '../../../../assets/svgs/icons/mailRed.svg';
import ChatRed from '../../../../assets/svgs/icons/chatRed.svg';
import BellOff from '../../../../assets/svgs/icons/bellOff.svg';
import CloseRed from '../../../../assets/svgs/icons/closeRed.svg';
import EditPen from '../../../../assets/svgs/icons/editPen.svg';
import DollarCoin from '../../../../assets/svgs/icons/dollarCoin.svg';
import ArrowCircleRight from '../../../../assets/svgs/icons/arrowCircleRight.svg';

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
export const Icons = {
  EditPen: ({...props}) => {
    return <Svg {...customStyle(props)} file={EditPen} />;
  },
  ArrowCircleRight: ({...props}) => {
    return <Svg {...customStyle(props)} file={ArrowCircleRight} />;
  },
  DollarCoin: ({...props}) => {
    return <Svg {...customStyle(props)} file={DollarCoin} />;
  },
  CloseRed: ({...props}) => {
    return <Svg {...customStyle(props)} file={CloseRed} />;
  },
  BellOff: ({...props}) => {
    return <Svg {...customStyle(props)} file={BellOff} />;
  },
  ChatRed: ({...props}) => {
    return <Svg {...customStyle(props)} file={ChatRed} />;
  },
  MailRed: ({...props}) => {
    return <Svg {...customStyle(props)} file={MailRed} />;
  },
  Whatsapp: ({...props}) => {
    return <Svg {...customStyle(props)} file={Whatsapp} />;
  },
  Gift: ({...props}) => {
    return <Svg {...customStyle(props)} file={Gift} />;
  },
  Wifi: ({...props}) => {
    return <Svg {...customStyle(props)} file={Wifi} />;
  },
  Coins: ({...props}) => {
    return <Svg {...customStyle(props)} file={Coins} />;
  },
  Edit: ({...props}) => {
    return <Svg {...customStyle(props)} file={Edit} />;
  },
  Folder: ({...props}) => {
    return <Svg {...customStyle(props)} file={Folder} />;
  },
  Convert: ({...props}) => {
    return <Svg {...customStyle(props)} file={Convert} />;
  },
  Cash: ({...props}) => {
    return <Svg {...customStyle(props)} file={Cash} />;
  },
  ChatGreen: ({...props}) => {
    return <Svg {...customStyle(props)} file={ChatGreen} />;
  },
  History: ({...props}) => {
    return <Svg {...customStyle(props)} file={History} />;
  },
  UserRight: ({...props}) => {
    return <Svg {...customStyle(props)} file={UserRight} />;
  },
  Vault: ({...props}) => {
    return <Svg {...customStyle(props)} file={Vault} />;
  },
  Bank: ({...props}) => {
    return <Svg {...customStyle(props)} file={Bank} />;
  },
  SmallPadlock: ({...props}) => {
    return <Svg {...customStyle(props)} file={SmallPadlock} />;
  },
  Galary: ({...props}) => {
    return <Svg {...customStyle(props)} file={Galary} />;
  },
  Calender: ({...props}) => {
    return <Svg {...customStyle(props)} file={Calender} />;
  },
  RedArrow: ({...props}) => {
    return <Svg {...customStyle(props)} file={RedArrow} />;
  },
  Chat: ({...props}) => {
    return <Svg {...customStyle(props)} file={Chat} />;
  },
  Biometrics: ({...props}) => {
    return <Svg {...customStyle(props)} file={Biometrics} />;
  },
  Emojis: ({...props}) => {
    return <Svg {...customStyle(props)} file={Emojis} />;
  },
  Settings: ({...props}) => {
    return <Svg {...customStyle(props)} file={Settings} />;
  },
  PlusCircle: ({...props}) => {
    return <Svg {...customStyle(props)} file={PlusCircle} />;
  },
  Person: ({...props}) => {
    return <Svg {...customStyle(props)} file={Person} />;
  },
  Share: ({...props}) => {
    return <Svg {...customStyle(props)} file={Share} />;
  },
  LiveChat: ({...props}) => {
    return <Svg {...customStyle(props)} file={LiveChat} />;
  },
  DoublePerson: ({...props}) => {
    return <Svg {...customStyle(props)} file={DoublePerson} />;
  },
  ArrowRed: ({...props}) => {
    return <Svg {...customStyle(props)} file={ArrowRed} />;
  },
  ArrowLeft: ({...props}) => {
    return <Svg {...customStyle(props)} file={ArrowLeft} />;
  },
  EyeClose: ({...props}) => {
    return <Svg {...customStyle(props)} file={EyeClose} />;
  },
  FingerPrint: ({...props}) => {
    return <Svg {...customStyle(props)} file={FingerPrint} />;
  },
  FaceId: ({...props}) => {
    return <Svg {...customStyle(props)} file={FaceId} />;
  },
  Bell: ({...props}) => {
    return <Svg {...customStyle(props)} file={Bell} />;
  },
  Info: ({...props}) => {
    return <Svg {...customStyle(props)} file={Info} />;
  },
  CloseCircle: ({...props}) => {
    return <Svg {...customStyle(props)} file={CloseCircle} />;
  },
  Copy: ({...props}) => {
    return <Svg {...customStyle(props)} file={Copy} />;
  },
  AddCircle: ({...props}) => {
    return <Svg {...customStyle(props)} file={AddCircle} />;
  },
  DeleteIcon: ({...props}) => {
    return <Svg {...customStyle(props)} file={DeleteIcon} />;
  },
  Chevron: ({...props}) => {
    return <Svg {...customStyle(props)} file={Chevron} />;
  },
  Phone: ({...props}) => {
    return <Svg {...customStyle(props)} file={Phone} />;
  },
  Upload: ({...props}) => {
    return <Svg {...customStyle(props)} file={Upload} />;
  },
  Tv: ({...props}) => {
    return <Svg {...customStyle(props)} file={Tv} />;
  },
  Light: ({...props}) => {
    return <Svg {...customStyle(props)} file={Light} />;
  },
  Lock: ({...props}) => {
    return <Svg {...customStyle(props)} file={Lock} />;
  },
  DeleteGrey: ({...props}) => {
    return <Svg {...customStyle(props)} file={DeleteGrey} />;
  },
  Pin: ({...props}) => {
    return <Svg {...customStyle(props)} file={Pin} />;
  },
  Padlock: ({...props}) => {
    return <Svg {...customStyle(props)} file={Padlock} />;
  },
  Message: ({...props}) => {
    return <Svg {...customStyle(props)} file={Message} />;
  },
  Email: ({...props}) => {
    return <Svg {...customStyle(props)} file={Email} />;
  },
};
