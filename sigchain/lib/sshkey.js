function makeSshRSAPayload(key) {
    // Checking the length so we know how big to make
    // the array buffer
    const arr_e = Uint8Array.from64BitString(key.data.e);
    const arr_n = Uint8Array.from64BitString(key.data.n);
  
    const buf = new ArrayBuffer(19 + arr_e.length + arr_n.length);
    const view = new DataView(buf);

    let offset = 0;

    offset = view.setCString(offset, "ssh-rsa");

    // Setting the first component (e)
    offset = view.setMpint(offset, arr_e);

    // Setting the second component (n)
    offset = view.setMpint(offset, arr_n);

    return buf.to64BitString();
}
  
function makeSshEd25519Payload(key) {
    const arr_a = Uint8Array.from64BitString(key.data.a);
  
    const buf = new ArrayBuffer(51);
    const view = new DataView(buf);
  
    let offset = 0;
  
    offset = view.setCString(offset, "ssh-ed25519");
  
    // Setting raw public key
    offset = view.setBignum(offset, arr_a);
  
    return buf.to64BitString();
}
  
function makeSshKey(key) {
    let ret = `ssh-${key.crypt} `;
  
    switch (key.crypt) {
        case 'ed25519':
            ret += makeSshEd25519Payload(key);
            break;
        case 'rsa':
            ret += makeSshRSAPayload(key);
            break;
        default:
            return '';
    }
  
    if (key.comment !== '') {
        ret += ' ';
        ret += key.comment;
    }
  
    return ret;
}

exports.makeSshKey = makeSshKey;
