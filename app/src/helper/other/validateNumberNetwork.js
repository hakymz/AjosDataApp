import {NETWORKS} from '../../conts';

const MTN = [
  '0803',
  '0806',
  '07025',
  '07026',
  '0703',
  '0704',
  '0706',
  '0813',
  '0816',
  '0810',
  '0814',
  '0903',
  '0906',
  '0913',
  '0916',
  '0707',
];
const GLO = ['0805', '0807', '0705', '0905', '0815', '0811', '0905', '0915'];
const NINE = ['0809', '0909', '0908', '0817', '0818'];
const AIRTEL = [
  '0802',
  '0808',
  '0701',
  '0708',
  '0812',
  '0901',
  '0902',
  '0904',
  '0907',
  '0912',
  '0911',
];

export const validateNumberNetwork = (phoneNo, network) => {
  let networkU = network?.toUpperCase?.();
  let isNetwork = false;
  let prefixNetwork = [];

  if (networkU == 'MTN') {
    prefixNetwork = MTN;
  } else if (networkU == 'GLO') {
    prefixNetwork = GLO;
  } else if (networkU == 'AIRTEL') {
    prefixNetwork = AIRTEL;
  } else if (networkU == '9MOBILE') {
    prefixNetwork = NINE;
  }

  for (let i = 0; i < prefixNetwork?.length; i++) {
    if (phoneNo?.toString?.().includes(prefixNetwork[i])) {
      isNetwork = true;
      break;
    }
  }

  return isNetwork;
};

export const getNumberNetwork = phoneNo => {
  if (validateNumberNetwork(phoneNo, 'MTN')) {
    return NETWORKS[0];
  } else if (validateNumberNetwork(phoneNo, 'AIRTEL')) {
    return NETWORKS[1];
  } else if (validateNumberNetwork(phoneNo, 'GLO')) {
    return NETWORKS[3];
  } else if (validateNumberNetwork(phoneNo, '9MOBILE')) {
    return NETWORKS[2];
  }
};
