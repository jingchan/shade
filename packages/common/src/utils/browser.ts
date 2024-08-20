'use client';
/* eslint-disable */
export function isIE() {
  var userAgent = window.navigator.userAgent;
  return userAgent.indexOf('MSIE ') > -1 || userAgent.indexOf('Trident/') > -1;
}
