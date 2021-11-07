import pbkdf2 from 'crypto-js/pbkdf2';
const cryptoJS = require('./CryptoJS');

const salt = 'ada7a163-5854-49db-a321-44f730319fe1';

export const cipher = (planText, key) => {
  return cryptoJS.AES.encrypt(planText, key).toString();
};

export const decipher = (cipherText, key) => {
  return cryptoJS.AES.decrypt(cipherText, key).toString(cryptoJS.enc.Utf8);
};

export const asterisk = cipherText => {
  return cipherText.split('').reverse().join('').slice(1, 6) + '*****';
};

export const hash = secret => {
  return pbkdf2(secret, salt, {
    keySize: 512 / 32,
    iterations: 1000,
  }).toString();
};
