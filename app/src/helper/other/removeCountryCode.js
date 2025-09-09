export const removeCountryCode = phone => {
  if (!phone) return '';

  phone = String(phone);

  // Remove leading + if present
  if (phone.startsWith('+')) {
    phone = phone.slice(1);
  }

  if (phone.startsWith('234')) {
    const rest = phone.slice(3);
    // If the next digit is already "0", keep it
    return rest.startsWith('0') ? rest : '0' + rest;
  }

  return phone;
};
