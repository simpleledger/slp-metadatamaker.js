import BN from 'bignumber.js';
import {
  createOpReturnGenesis,
  createOpReturnMint,
  createOpReturnSend
} from './util';

export default {
  genesis: (
    ticker:        string|Buffer,
    name:          string|Buffer,
    documentUrl:   string|Buffer,
    documentHash:  string|Buffer,
    decimals:      number,
    mintBatonVout: number|null,
    quantity:      BN
  ): Buffer => createOpReturnGenesis(
    0x01,
    ticker,
    name,
    documentUrl,
    documentHash,
    decimals,
    mintBatonVout,
    quantity
  ),

  mint: (
    tokenIdHex:    string|Buffer,
    mintBatonVout: number|null,
    quantity:      BN
  ): Buffer => createOpReturnMint(
    0x01,
    tokenIdHex,
    mintBatonVout,
    quantity
  ),

  send: (
    tokenIdHex: string|Buffer,
    slpAmounts: BN[]
  ): Buffer => createOpReturnSend(
    0x01,
    tokenIdHex,
    slpAmounts,
  ),
};
