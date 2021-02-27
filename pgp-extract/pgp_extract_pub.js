const assert = require('assert').strict;
const fs = require('fs');

const openpgp = require('openpgp');

(async () => {
    const armoredKey = fs.readFileSync('./pgp_keys/public.asc'); 
    const { keys: [pgpKey] } = await openpgp.key.readArmored(armoredKey);

    const signKey = await pgpKey.getSigningKey();

    assert.strictEqual(signKey.keyPacket.algorithm, 'eddsa');

    const { Q } = openpgp.crypto.publicKey.elliptic.eddsa.parseParams(signKey.keyPacket.params);

    // According to an old Draft OpenPGP RFC:
    // Q is just the pubkey with the const 0x40 (64) as the first element.
    // The definition of MPI is different than the one used in RFC 4251.
    // The most current Draft RFC doesn't explain this properly
    // See the RFC for more details:
    // https://tools.ietf.org/html/draft-ietf-openpgp-rfc4880bis-10#section-13.3
    const pubkey = Q.slice(1);

    console.log(Buffer.from(pubkey).toString('base64'));
})();
