const assert = require('assert').strict;
const fs = require('fs');

const openpgp = require('openpgp');
const sshpk = require('sshpk');

const prompt = require('prompt');
const getPrompt = require('util').promisify(prompt.get).bind(prompt);

(async () => {
    const armoredKey = fs.readFileSync('./pgp_keys/sign_private.asc'); 
    const { keys: [pgpKey] } = await openpgp.key.readArmored(armoredKey);

    const { passphrase } = await getPrompt([{ name: 'passphrase', hidden: true }]);
    await pgpKey.decrypt(passphrase);

    const signKey = await pgpKey.getSigningKey();

    assert.strictEqual(signKey.keyPacket.algorithm, 'eddsa');

    const { Q, seed } = openpgp.crypto.publicKey.elliptic.eddsa.parseParams(signKey.keyPacket.params);

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
