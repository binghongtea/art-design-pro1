/* eslint-disable */
import CryptoJS from 'crypto-js';
/**
 * Check if an element has a class
 * @param {HTMLElement} elm
 * @param {string} cls
 * @returns {boolean}
 */

/**
 * 登录账户和密码加密
 * @param {*} param
 * @param {*} keyStr
 * @returns
 */
export function encryptByEcb(param, keyStr = 'kEKWCHrDooWtfeSx') {
  const keyHex = CryptoJS.enc.Utf8.parse(keyStr); // 秘钥
  const data = CryptoJS.enc.Utf8.parse(param);
  const dataEncrypted = CryptoJS.AES.encrypt(data, keyHex, {
    mode: CryptoJS.mode.ECB, // 加密模式
    padding: CryptoJS.pad.Pkcs7,
  });
  return dataEncrypted.toString();
}


export function clearUserInfo() {
  localStorage.removeItem('Authorization');
  localStorage.removeItem('username');
  localStorage.removeItem('userId');
  localStorage.removeItem('userUuid');
  localStorage.removeItem('headImage');
  localStorage.removeItem('depId');
  localStorage.removeItem('fullName');
  localStorage.removeItem('projectCode');
  // localStorage.removeItem('locale');
  // localStorage.clear();
}
