const bech32 = require('bech32');

function makeKeysPubKey(key) {
    let hrp = '';
  
    switch (key.crypt) {
        case 'edx25519':
            hrp = 'kex';
            break;
        case 'x25519':
            hrp = 'kbx';
            break;
        default:
            return '';
    }

    const a_arr = Uint8Array.from64BitString(key.data.a);

    const words = bech32.toWords(a_arr);
    const ret = bech32.encode(hrp, words);

    return ret;
}

exports.makeKeysPubKey = makeKeysPubKey;
