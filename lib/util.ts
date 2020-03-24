import BN from 'bignumber.js';

export const pushdata = (buf: Buffer|Uint8Array): Buffer => {
  if (buf.length === 0) {
    return Buffer.from(Uint8Array.from([0x4C, 0x00]));
  } else if (buf.length < 0x4E) {
    return Buffer.concat([Uint8Array.from([buf.length]), buf]);
  } else if (buf.length < 0xFF) {
    return Buffer.concat([Uint8Array.from([0x4c, buf.length]), buf]);
  } else if (buf.length < 0xFFFF) {
    const tmp = Buffer.allocUnsafe(2);
    tmp.writeUInt16LE(buf.length, 0);
    return Buffer.concat([Uint8Array.from([0x4d]), tmp, buf]);
  } else if (buf.length < 0xFFFFFFFF) {
    const tmp = Buffer.allocUnsafe(4);
    tmp.writeUInt32LE(buf.length, 0);
    return Buffer.concat([Uint8Array.from([0x4e]), tmp, buf]);
  } else {
    throw new Error('does not support bigger pushes yet');
  }
};

export const BNToInt64BE = (bn: BN): Buffer => {
  if (! bn.isInteger()) {
    throw new Error('bn not an integer');
  }

  if (! bn.isPositive()) {
    throw new Error('bn not positive integer');
  }

  const h = bn.toString(16)
  if (h.length > 16) {
    throw new Error('bn outside of range');
  }

  return Buffer.from(h.padStart(16, '0'), 'hex');
}

export const createOpReturnGenesis = (
  versionType:   number,
  ticker:        string|Buffer,
  name:          string|Buffer,
  documentUrl:   string|Buffer,
  documentHash:  string,
  decimals:      number,
  mintBatonVout: number|null,
  quantity:      BN
): Buffer => {
  if (! [0x01, 0x41, 0x81].includes(versionType)) {
    throw new Error('unknown versionType');
  }

  if (documentHash.length !== 0 && documentHash.length !== 64) {
    throw new Error('documentHash must be either 0 or 32 hex bytes');
  }
  if (documentHash.length === 64 && ! documentHash.match(/^[0-9a-fA-F]{64}$/)) {
    throw new Error('documentHash must be hex');
  }
  if (decimals < 0 || decimals > 9) {
    throw new Error('decimals out of range');
  }
  if (mintBatonVout !== null) {
    if (mintBatonVout < 2 || mintBatonVout > 0xFF) {
      throw new Error('mintBatonVout out of range (0x02 < > 0xFF)');
    }
  }

  if (versionType === 0x41) {
    if (! quantity.isEqualTo(1)) {
      throw new Error('quantity must be 1 for NFT1 child genesis');
    }

    if (decimals !== 0) {
      throw new Error('decimals must be 0 for NFT1 child genesis');
    }

    if (mintBatonVout !== null) {
      throw new Error('mintBatonVout must be null for NFT1 child genesis');
    }
  }

  const buf = Buffer.concat([
    Uint8Array.from([0x6A]), // OP_RETURN
    pushdata(Buffer.from("SLP\0")),
    pushdata(Uint8Array.from([versionType])), // versionType
    pushdata(Buffer.from("GENESIS")),
    pushdata(Buffer.from(ticker)),
    pushdata(Buffer.from(name)),
    pushdata(Buffer.from(documentUrl)),
    pushdata(Buffer.from(documentHash, 'hex')),
    pushdata(Uint8Array.from([decimals])),
    pushdata(Uint8Array.from(mintBatonVout === null ? [] : [mintBatonVout])),
    pushdata(BNToInt64BE(quantity)),
  ]);

  return buf;
};

export const createOpReturnMint = (
  versionType:   number,
  tokenIdHex:    string,
  mintBatonVout: number,
  quantity:      BN
): Buffer => {
  if (! [0x01, 0x41, 0x81].includes(versionType)) {
    throw new Error('unknown versionType');
  }

  if (! tokenIdHex.match(/^[0-9a-fA-F]{64}$/)) {
    throw new Error('tokenIdHex no matchy');
  }
  if (mintBatonVout !== null) {
    if (mintBatonVout < 2 || mintBatonVout > 0xFF) {
      throw new Error('mintBatonVout out of range (0x02 < > 0xFF)');
    }
  }

  const buf = Buffer.concat([
    Uint8Array.from([0x6A]), // OP_RETURN
    pushdata(Buffer.from("SLP\0")),
    pushdata(Uint8Array.from([versionType])), // versionType
    pushdata(Buffer.from("MINT")),
    pushdata(Buffer.from(tokenIdHex, 'hex')),
    pushdata(Uint8Array.from(mintBatonVout === null ? [] : [mintBatonVout])),
    pushdata(BNToInt64BE(quantity)),
  ]);

  return buf;
};

export const createOpReturnSend = (
  versionType: number,
  tokenIdHex:  string,
  slpAmounts:  BN[]
): Buffer => {
  if (! [0x01, 0x41, 0x81].includes(versionType)) {
    throw new Error('unknown versionType');
  }

  if (! tokenIdHex.match(/^[0-9a-fA-F]{64}$/)) {
    throw new Error('tokenIdHex no matchy');
  }

  if (slpAmounts.length < 1) {
    throw new Error('send requires at least one amount');
  }
  if (slpAmounts.length > 19) {
    throw new Error('too many slp amounts');
  }

  const buf = Buffer.concat([
    Uint8Array.from([0x6A]), // OP_RETURN
    pushdata(Buffer.from("SLP\0")),
    pushdata(Uint8Array.from([versionType])), // versionType
    pushdata(Buffer.from("SEND")),
    pushdata(Buffer.from(tokenIdHex, 'hex')),
    ...slpAmounts.map(v => pushdata(BNToInt64BE(v))),
  ]);

  return buf;
};
