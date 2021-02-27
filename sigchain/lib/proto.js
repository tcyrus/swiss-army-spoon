/*
DataView.prototype.setBase64String = function (offset, str) {
    const buf = Buffer.from(str, 'base64');
    const arr = new Uint8Array(buf);
    const len = arr.length;

    const tmp = new Uint8Array(this.buffer, offset, len);
    tmp.set(arr, 0);

    offset += len;
    return offset;
};
*/

/*
DataView.prototype.setAsciiString = function (offset, str) {
    for (let i = 0; i < str.length; i++) {
        this.setUint8(offset + i, str.charCodeAt(i) & 0xFF);
    }
};
*/

DataView.prototype.setCString = function (offset, str) {
    /*
    const len = str.length;
    this.setUint32(offset, len);
    offset += 4;
    this.setAsciiString(offset, str);
    offset += len;
    return offset;
    */

    var tmp = new Uint8Array(str.length);
    for (let i = 0; i < str.length; i++) {
        tmp[i] = str.charCodeAt(i) & 0xFF;
    }

    return this.setBignum(offset, tmp);
};

DataView.prototype.setBignum = function (offset, arr) {
    const len = arr.length;
    this.setUint32(offset, len);
    offset += 4;

    const tmp = new Uint8Array(this.buffer, offset, len);
    tmp.set(arr, 0);

    offset += len;
    return offset;
};

// Taken and modified from coreos/openssh-keys
// According to RFC 4251, the mpint datatype representation is a big-endian
// arbitrary-precision integer encoded in two's complement and stored as a
// string with the minimum possible number of characters.
// see mpint definition in https://tools.ietf.org/html/rfc4251#section-5
DataView.prototype.setMpint = function (offset, arr) {
    let mp_arr = arr;

    // If the number is positive then we are required to guarentee that the
    // most significant bit is set to zero if the first bit in the first
    // byte is going to be one.
    if ((arr[0] & 0x80) !== 0) {
        mp_arr = new Uint8Array(arr.length + 1);
        mp_arr[0] = 0;
        mp_arr.set(arr, 1);
    }

    // other than that it's just normal ssh encoding
    return this.setBignum(offset, mp_arr);
}


DataView.prototype.setBignumBuffer = function (offset, buf) {
    return this.setBignum(offset, new Uint8Array(buf));
};

/*
ArrayBuffer.prototype.toHexString = function() {
  return Array.prototype.map.call(new Uint8Array(this), x => ('00' + x.toString(16)).slice(-2)).join('');
};
*/

ArrayBuffer.prototype.to64BitString = function () {
    return Buffer.from(this).toString('base64');
}

Uint8Array.fromBuffer = function (buf) {
    return (new Uint8Array(buf.length)).map((_, i) => buf[i]);
}

Uint8Array.from64BitString = function (str) {
    return Uint8Array.fromBuffer(Buffer.from(str, 'base64'));
}
