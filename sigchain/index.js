const fs = require('fs');
//const msgpack = require('@msgpack/msgpack');
//const { dearmorAndVerifyDetached } = require('@samuelthomas2774/saltpack');

require('./sigchain/lib/proto.js');
const { makeKeysPubKey } = require('./sigchain/lib/keyspub.js');
const { makeSshKey } = require('./sigchain/lib/sshkey.js');

// TODO: Verify Saltpack Sig for 'keys.msgpack' in JS
/*
const encoded = fs.readFileSync('./data/keys.msgpack');
const keychain = msgpack.decode(Uint8Array.fromBuffer(encoded));
const signature = fs.readFileSync('./data/keys.msgpack.sig');
const result = await dearmorAndVerifyDetached(signature, encoded);
if (!Buffer.from(result.public_key).equals(sender_key)) {
    console.error('Invalid Signature, trust nothing');
}
*/

const keychain = JSON.parse(fs.readFileSync('./data/keys.json'));

let result = [];

for (const [name, key] of Object.entries(keychain)) {
    let tmp = '';

    switch (key.type) {
        case 'ssh':
            tmp = makeSshKey(key);
            break;
        case 'keys.pub':
            tmp = makeKeysPubKey(key);
            break;
        default:
            continue;
    }

    console.debug(name, tmp);

    result.push(Object.assign({ output: tmp }, key));
}

console.log(result);
