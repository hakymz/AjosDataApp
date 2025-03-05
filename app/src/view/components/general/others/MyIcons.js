import React from 'react';
import {Svg} from '.';
import ArrowGreen from '../../../../assets/svgs/icons/myIcons/arrowGreen.svg';
import TickWhite from '../../../../assets/svgs/icons/myIcons/tickWhite.svg';
import FaceId from '../../../../assets/svgs/icons/myIcons/faceId.svg';
import FingerPrint from '../../../../assets/svgs/icons/myIcons/fingerPrint.svg';
import Bell from '../../../../assets/svgs/icons/myIcons/bell.svg';
import ArrowGrey from '../../../../assets/svgs/icons/myIcons/arrowGrey.svg';
import TopupBlack from '../../../../assets/svgs/icons/myIcons/topUpBlack.svg';
import TopUpGreen from '../../../../assets/svgs/icons/myIcons/topUpGreen.svg';
import Swap from '../../../../assets/svgs/icons/myIcons/swap.svg';
import Withdraw from '../../../../assets/svgs/icons/myIcons/withdraw.svg';
import CardGreen from '../../../../assets/svgs/icons/myIcons/cardGreen.svg';
import SellGiftCard from '../../../../assets/svgs/icons/myIcons/sellGifrcard.svg';
import DollarCardGreen from '../../../../assets/svgs/icons/myIcons/dollarCardGreen.svg';
import PayBills from '../../../../assets/svgs/icons/myIcons/payBills.svg';
import BellWhite from '../../../../assets/svgs/icons/myIcons/bellWhite.svg';
import BellGreen from '../../../../assets/svgs/icons/myIcons/bellGreen.svg';
import ArrowLightGreen from '../../../../assets/svgs/icons/myIcons/arrowLightGreen.svg';
import ArrowLightRed from '../../../../assets/svgs/icons/myIcons/arrowLightRed.svg';
import BankGreen from '../../../../assets/svgs/icons/myIcons/bankGreen.svg';
import Copy from '../../../../assets/svgs/icons/myIcons/copy.svg';
import Minus from '../../../../assets/svgs/icons/myIcons/minus.svg';
import SwapGreen from '../../../../assets/svgs/icons/myIcons/swapGreen.svg';
import UserGreen from '../../../../assets/svgs/icons/myIcons/userGreen.svg';
import LockCard from '../../../../assets/svgs/icons/myIcons/lockCard.svg';
import SendGreen from '../../../../assets/svgs/icons/myIcons/sendGreen.svg';
import Contact from '../../../../assets/svgs/icons/myIcons/contact.svg';
import Search from '../../../../assets/svgs/icons/myIcons/search.svg';
import DoubleArrow from '../../../../assets/svgs/icons/myIcons/doubleArrow.svg';
import Lock from '../../../../assets/svgs/icons/myIcons/lock.svg';
import Logout from '../../../../assets/svgs/icons/myIcons/logout.svg';
import Book from '../../../../assets/svgs/icons/myIcons/book.svg';
import Verify from '../../../../assets/svgs/icons/myIcons/verify.svg';
import Privacy from '../../../../assets/svgs/icons/myIcons/privacy.svg';
import Message from '../../../../assets/svgs/icons/myIcons/message.svg';
import ErrorGrey from '../../../../assets/svgs/icons/myIcons/errorGrey.svg';
import ErrorRed from '../../../../assets/svgs/icons/myIcons/errorRed.svg';
import LockCardGreen from '../../../../assets/svgs/icons/myIcons/lockCardGreen.svg';
import Pin from '../../../../assets/svgs/icons/myIcons/pin.svg';
import Verified from '../../../../assets/svgs/icons/myIcons/verified.svg';
import Emoji from '../../../../assets/svgs/icons/myIcons/emoji.svg';
import TickBox from '../../../../assets/svgs/icons/myIcons/tickBox.svg';
import TickRound from '../../../../assets/svgs/icons/myIcons/tickCircle.svg';
import LockOpen from '../../../../assets/svgs/icons/myIcons/lockOpen.svg';
import GalleryGreen from '../../../../assets/svgs/icons/myIcons/galleryGreen.svg';
import Gallery from '../../../../assets/svgs/icons/myIcons/gallery.svg';
import CashSend from '../../../../assets/svgs/icons/myIcons/cashSend.svg';
import Cloud from '../../../../assets/svgs/icons/myIcons/cloud.svg';
import CancelRed from '../../../../assets/svgs/icons/myIcons/cancelRed.svg';
import CancelWhite from '../../../../assets/svgs/icons/myIcons/cancelWhite.svg';
import check from '../../../../assets/svgs/icons/myIcons/check.svg';
import Date from '../../../../assets/svgs/icons/myIcons/date.svg';
import VerifyGreen from '../../../../assets/svgs/icons/myIcons/verifyGreen.svg';
import Time from '../../../../assets/svgs/icons/myIcons/time.svg';
import Share from '../../../../assets/svgs/icons/myIcons/share.svg';
import Download from '../../../../assets/svgs/icons/myIcons/download.svg';

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
export const MyIcons = {
  CashSend: ({...props}) => {
    return <Svg {...customStyle(props)} file={CashSend} />;
  },
  Share: ({...props}) => {
    return <Svg {...customStyle(props)} file={Share} />;
  },
  Date: ({...props}) => {
    return <Svg {...customStyle(props)} file={Date} />;
  },
  Cloud: ({...props}) => {
    return <Svg {...customStyle(props)} file={Cloud} />;
  },
  GalleryGreen: ({...props}) => {
    return <Svg {...customStyle(props)} file={GalleryGreen} />;
  },
  Gallery: ({...props}) => {
    return <Svg {...customStyle(props)} file={Gallery} />;
  },
  LockOpen: ({...props}) => {
    return <Svg {...customStyle(props)} file={LockOpen} />;
  },
  TickBox: ({...props}) => {
    return <Svg {...customStyle(props)} file={TickBox} />;
  },
  TickRound: ({...props}) => {
    return <Svg {...customStyle(props)} file={TickRound} />;
  },
  Emoji: ({...props}) => {
    return <Svg {...customStyle(props)} file={Emoji} />;
  },
  ArrowGreen: ({...props}) => {
    return <Svg {...customStyle(props)} file={ArrowGreen} />;
  },
  TickWhite: ({...props}) => {
    return <Svg {...customStyle(props)} file={TickWhite} />;
  },
  FaceId: ({...props}) => {
    return <Svg {...customStyle(props)} file={FaceId} />;
  },
  FingerPrint: ({...props}) => {
    return <Svg {...customStyle(props)} file={FingerPrint} />;
  },
  Bell: ({...props}) => {
    return <Svg {...customStyle(props)} file={Bell} />;
  },
  ArrowGrey: ({...props}) => {
    return <Svg {...customStyle(props)} file={ArrowGrey} />;
  },
  TopupBlack: ({...props}) => {
    return <Svg {...customStyle(props)} file={TopupBlack} />;
  },
  Withdraw: ({...props}) => {
    return <Svg {...customStyle(props)} file={Withdraw} />;
  },
  Swap: ({...props}) => {
    return <Svg {...customStyle(props)} file={Swap} />;
  },
  PayBills: ({...props}) => {
    return <Svg {...customStyle(props)} file={PayBills} />;
  },
  CardGreen: ({...props}) => {
    return <Svg {...customStyle(props)} file={CardGreen} />;
  },
  SellGiftCard: ({...props}) => {
    return <Svg {...customStyle(props)} file={SellGiftCard} />;
  },
  DollarCardGreen: ({...props}) => {
    return <Svg {...customStyle(props)} file={DollarCardGreen} />;
  },
  ArrowLightGreen: ({...props}) => {
    return <Svg {...customStyle(props)} file={ArrowLightGreen} />;
  },
  ArrowLightRed: ({...props}) => {
    return <Svg {...customStyle(props)} file={ArrowLightRed} />;
  },
  BellWhite: ({...props}) => {
    return <Svg {...customStyle(props)} file={BellWhite} />;
  },
  BellGreen: ({...props}) => {
    return <Svg {...customStyle(props)} file={BellGreen} />;
  },
  BankGreen: ({...props}) => {
    return <Svg {...customStyle(props)} file={BankGreen} />;
  },
  Copy: ({...props}) => {
    return <Svg {...customStyle(props)} file={Copy} />;
  },
  TopUpGreen: ({...props}) => {
    return <Svg {...customStyle(props)} file={TopUpGreen} />;
  },
  Minus: ({...props}) => {
    return <Svg {...customStyle(props)} file={Minus} />;
  },
  SwapGreen: ({...props}) => {
    return <Svg {...customStyle(props)} file={SwapGreen} />;
  },
  UserGreen: ({...props}) => {
    return <Svg {...customStyle(props)} file={UserGreen} />;
  },
  LockCard: ({...props}) => {
    return <Svg {...customStyle(props)} file={LockCard} />;
  },
  SendGreen: ({...props}) => {
    return <Svg {...customStyle(props)} file={SendGreen} />;
  },
  Contact: ({...props}) => {
    return <Svg {...customStyle(props)} file={Contact} />;
  },
  Search: ({...props}) => {
    return <Svg {...customStyle(props)} file={Search} />;
  },
  DoubleArrow: ({...props}) => {
    return <Svg {...customStyle(props)} file={DoubleArrow} />;
  },
  Lock: ({...props}) => {
    return <Svg {...customStyle(props)} file={Lock} />;
  },
  Book: ({...props}) => {
    return <Svg {...customStyle(props)} file={Book} />;
  },
  ErrorGrey: ({...props}) => {
    return <Svg {...customStyle(props)} file={ErrorGrey} />;
  },
  Message: ({...props}) => {
    return <Svg {...customStyle(props)} file={Message} />;
  },
  Privacy: ({...props}) => {
    return <Svg {...customStyle(props)} file={Privacy} />;
  },
  Logout: ({...props}) => {
    return <Svg {...customStyle(props)} file={Logout} />;
  },
  Verify: ({...props}) => {
    return <Svg {...customStyle(props)} file={Verify} />;
  },
  LockCardGreen: ({...props}) => {
    return <Svg {...customStyle(props)} file={LockCardGreen} />;
  },
  Pin: ({...props}) => {
    return <Svg {...customStyle(props)} file={Pin} />;
  },
  ErrorRed: ({...props}) => {
    return <Svg {...customStyle(props)} file={ErrorRed} />;
  },
  Verified: ({...props}) => {
    return <Svg {...customStyle(props)} file={Verified} />;
  },
  CancelRed: ({...props}) => {
    return <Svg {...customStyle(props)} file={CancelRed} />;
  },
  CancelWhite: ({...props}) => {
    return <Svg {...customStyle(props)} file={CancelWhite} />;
  },
  Check: ({...props}) => {
    return <Svg {...customStyle(props)} file={check} />;
  },
  VerifyGreen: ({...props}) => {
    return <Svg {...customStyle(props)} file={VerifyGreen} />;
  },
  Time: ({...props}) => {
    return <Svg {...customStyle(props)} file={Time} />;
  },
  Download: ({...props}) => {
    return <Svg {...customStyle(props)} file={Download} />;
  },
};
