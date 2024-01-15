import CryptoJS from 'crypto-js';

function encrypt(message, key, iv){
    var encrypted = CryptoJS.AES.encrypt(message, key, {iv: iv});
    var decrypted = CryptoJS.AES.decrypt(encrypted, key ,{ iv: iv});
    console.log("Decrypted Sending: "+decrypted.toString(CryptoJS.enc.Utf8));
}

export {encrypt};