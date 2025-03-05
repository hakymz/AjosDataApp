import React from 'react';
export const extractError = error => {
  const {
    data: {message},
  } = error?.response || {};

  return message;
};
