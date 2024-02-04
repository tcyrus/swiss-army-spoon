const assert = require('assert').strict;
const fs = require('fs');

const openpgp = require('openpgp');
const sshpk = require('sshpk');

const prompt = require('prompt');
const getPrompt = require('util').promisify(prompt.get).bind(prompt);

(async () => {
    const armoredKey = fs.readFileSync('./pgp_keys/private.asc'); 
    const { keys: [pgpKey] } = await openpgp.key.readArmored(armoredKey);

    if (pgpKey.isDecrypted() === false) {
      const { passphrase } = await getPrompt([{ name: 'passphrase', hidden: true }]);
      await pgpKey.decrypt(passphrase);
    }

    // Note: There's no easy way to identify auth subkeys in OpenPGP.js
    // You might need to mess around with this part of the code in order
    // to select the right subkey.
    const subKey = await pgpKey.getSigningKey();

    assert.strictEqual(subKey.keyPacket.algorithm, 'eddsa');

    const { Q, seed } = openpgp.crypto.publicKey.elliptic.eddsa.parseParams(subKey.keyPacket.params);

    // Q is just the pubkey with the const 0x40 (64) as the first element
    // See RFC for more details:
    // https://tools.ietf.org/html/draft-ietf-openpgp-rfc4880bis-07#section-13.3
    const pubkey = Q.slice(1);

    const sshPriv = new sshpk.PrivateKey({
        type: 'ed25519',
        parts: [
            { name: 'A', data: Buffer.from(pubkey) },
            { name: 'k', data: Buffer.from(seed) }
        ]
    });

    console.log(sshPriv.toString('ssh'));
})();
