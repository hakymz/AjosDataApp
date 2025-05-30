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

import BackArrowGrey from '../../../../assets/svgs/icons/backArrowGrey.svg';
import EyeLash from '../../../../assets/svgs/icons/eyeLash.svg';
import NoteRedDot from '../../../../assets/svgs/icons/noteRedDot.svg';
import StickMan from '../../../../assets/svgs/icons/stickMan.svg';
import Plus from '../../../../assets/svgs/icons/plus.svg';
import Clipboard from '../../../../assets/svgs/icons/clipboard.svg';
import ChatRound from '../../../../assets/svgs/icons/chatRound.svg';
import BombEmoji from '../../../../assets/svgs/icons/bombEmoji.svg';
import Data from '../../../../assets/svgs/icons/data.svg';
import Airtime from '../../../../assets/svgs/icons/airtime.svg';
import Bill from '../../../../assets/svgs/icons/bill.svg';
import Sms from '../../../../assets/svgs/icons/sms.svg';
import DollarCard from '../../../../assets/svgs/icons/dollarCard.svg';
import Giftcard from '../../../../assets/svgs/icons/giftcard.svg';
import ChevronDown from '../../../../assets/svgs/icons/chevronDown.svg';
import Plug from '../../../../assets/svgs/icons/plug.svg';
import PlugActive from '../../../../assets/svgs/icons/plugActive.svg';
import Tv from '../../../../assets/svgs/icons/tv.svg';
import Book1 from '../../../../assets/svgs/icons/book1.svg';
import Book2 from '../../../../assets/svgs/icons/book2.svg';
import Book3 from '../../../../assets/svgs/icons/book3.svg';
import Paste from '../../../../assets/svgs/icons/paste.svg';
import ChevronRight from '../../../../assets/svgs/icons/chevronRight.svg';
import UserTag from '../../../../assets/svgs/icons/userTag.svg';
import Scan from '../../../../assets/svgs/icons/scan.svg';
import AddCategory from '../../../../assets/svgs/icons/addCategory.svg';
import Unlock from '../../../../assets/svgs/icons/unlock.svg';
import Like from '../../../../assets/svgs/icons/like.svg';
import SMS2 from '../../../../assets/svgs/icons/SMS2.svg';
import Delete from '../../../../assets/svgs/icons/delete.svg';
import Logout from '../../../../assets/svgs/icons/logout.svg';
import PenCircle from '../../../../assets/svgs/icons/penCircle.svg';
import Lock from '../../../../assets/svgs/icons/lock.svg';
import Key from '../../../../assets/svgs/icons/key.svg';
import Scan2 from '../../../../assets/svgs/icons/scan2.svg';
import Call from '../../../../assets/svgs/icons/call.svg';
import Message2 from '../../../../assets/svgs/icons/message2.svg';
import Message3 from '../../../../assets/svgs/icons/message3.svg';
import Message4 from '../../../../assets/svgs/icons/message4.svg';
import Message5 from '../../../../assets/svgs/icons/message5.svg';
import EditPenCircle from '../../../../assets/svgs/icons/editPenCircle.svg';
import DeletePen from '../../../../assets/svgs/icons/deletePen.svg';
import Close from '../../../../assets/svgs/icons/close.svg';
import Notes from '../../../../assets/svgs/icons/notes.svg';
import AddNumber from '../../../../assets/svgs/icons/addNumber.svg';

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
  AddNumber: ({...props}) => {
    return <Svg {...customStyle(props)} file={AddNumber} />;
  },
  Notes: ({...props}) => {
    return <Svg {...customStyle(props)} file={Notes} />;
  },
  Close: ({...props}) => {
    return <Svg {...customStyle(props)} file={Close} />;
  },
  EditPenCircle: ({...props}) => {
    return <Svg {...customStyle(props)} file={EditPenCircle} />;
  },
  DeletePen: ({...props}) => {
    return <Svg {...customStyle(props)} file={DeletePen} />;
  },
  Message2: ({...props}) => {
    return <Svg {...customStyle(props)} file={Message2} />;
  },
  Message3: ({...props}) => {
    return <Svg {...customStyle(props)} file={Message3} />;
  },
  Message4: ({...props}) => {
    return <Svg {...customStyle(props)} file={Message4} />;
  },
  Message5: ({...props}) => {
    return <Svg {...customStyle(props)} file={Message5} />;
  },
  Call: ({...props}) => {
    return <Svg {...customStyle(props)} file={Call} />;
  },
  Scan2: ({...props}) => {
    return <Svg {...customStyle(props)} file={Scan2} />;
  },
  Key: ({...props}) => {
    return <Svg {...customStyle(props)} file={Key} />;
  },
  PenCircle: ({...props}) => {
    return <Svg {...customStyle(props)} file={PenCircle} />;
  },
  Logout: ({...props}) => {
    return <Svg {...customStyle(props)} file={Logout} />;
  },
  Delete: ({...props}) => {
    return <Svg {...customStyle(props)} file={Delete} />;
  },
  SMS2: ({...props}) => {
    return <Svg {...customStyle(props)} file={SMS2} />;
  },
  Like: ({...props}) => {
    return <Svg {...customStyle(props)} file={Like} />;
  },
  Unlock: ({...props}) => {
    return <Svg {...customStyle(props)} file={Unlock} />;
  },
  AddCategory: ({...props}) => {
    return <Svg {...customStyle(props)} file={AddCategory} />;
  },
  Scan: ({...props}) => {
    return <Svg {...customStyle(props)} file={Scan} />;
  },
  UserTag: ({...props}) => {
    return <Svg {...customStyle(props)} file={UserTag} />;
  },
  ChevronRight: ({...props}) => {
    return <Svg {...customStyle(props)} file={ChevronRight} />;
  },
  Paste: ({...props}) => {
    return <Svg {...customStyle(props)} file={Paste} />;
  },
  Plug: ({...props}) => {
    return <Svg {...customStyle(props)} file={Plug} />;
  },
  PlugActive: ({...props}) => {
    return <Svg {...customStyle(props)} file={PlugActive} />;
  },
  Book1: ({...props}) => {
    return <Svg {...customStyle(props)} file={Book1} />;
  },
  Book2: ({...props}) => {
    return <Svg {...customStyle(props)} file={Book2} />;
  },
  Book3: ({...props}) => {
    return <Svg {...customStyle(props)} file={Book3} />;
  },
  Data: ({...props}) => {
    return <Svg {...customStyle(props)} file={Data} />;
  },
  ChevronDown: ({...props}) => {
    return <Svg {...customStyle(props)} file={ChevronDown} />;
  },
  Airtime: ({...props}) => {
    return <Svg {...customStyle(props)} file={Airtime} />;
  },
  DollarCard: ({...props}) => {
    return <Svg {...customStyle(props)} file={DollarCard} />;
  },
  Giftcard: ({...props}) => {
    return <Svg {...customStyle(props)} file={Giftcard} />;
  },
  Bill: ({...props}) => {
    return <Svg {...customStyle(props)} file={Bill} />;
  },
  Sms: ({...props}) => {
    return <Svg {...customStyle(props)} file={Sms} />;
  },
  ChatRound: ({...props}) => {
    return <Svg {...customStyle(props)} file={ChatRound} />;
  },
  BombEmoji: ({...props}) => {
    return <Svg {...customStyle(props)} file={BombEmoji} />;
  },
  Clipboard: ({...props}) => {
    return <Svg {...customStyle(props)} file={Clipboard} />;
  },
  Plus: ({...props}) => {
    return <Svg {...customStyle(props)} file={Plus} />;
  },
  StickMan: ({...props}) => {
    return <Svg {...customStyle(props)} file={StickMan} />;
  },
  NoteRedDot: ({...props}) => {
    return <Svg {...customStyle(props)} file={NoteRedDot} />;
  },
  EyeLash: ({...props}) => {
    return <Svg {...customStyle(props)} file={EyeLash} />;
  },
  BackArrowGrey: ({...props}) => {
    return <Svg {...customStyle(props)} file={BackArrowGrey} />;
  },

  Lock: ({...props}) => {
    return <Svg {...customStyle(props)} file={Lock} />;
  },
  PlusCircle: ({...props}) => {
    return <Svg {...customStyle(props)} file={PlusCircle} />;
  },

  // old Icons
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
