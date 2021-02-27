const fs = require('fs');
const msgpack = require('@msgpack/msgpack');

const keys = JSON.parse(fs.readFileSync('./data/keys.json'));

const encoded = Buffer.from(msgpack.encode(keys));
fs.writeFileSync("./data/keys.msgpack", encoded, 'binary');
