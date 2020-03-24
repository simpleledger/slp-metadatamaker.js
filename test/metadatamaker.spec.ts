import * as chai from 'chai';
import { expect } from 'chai';
import chaiBytes from 'chai-bytes';
chai.use(chaiBytes);

import 'mocha';
import BN from 'bignumber.js';
import TokenType1 from './../lib/tokentype1';
import NFT1 from './../lib/nft1';
import {
    pushdata,
    BNToInt64BE,
    createOpReturnGenesis,
    createOpReturnMint,
    createOpReturnSend
} from './../lib/util';


describe('GENESIS', () => {
  it('OK: minimal GENESIS', () => {
    const result = TokenType1.genesis('', '', '', '', 0, null, new BN(0x64)).toString('hex');
    expect(result).to.equal('6a04534c500001010747454e455349534c004c004c004c0001004c00080000000000000064');
  });

  it('OK: minimal NFT1 Group GENESIS', () => {
    const result = NFT1.Group.genesis('', '', '', '', 0, null, new BN(0x64)).toString('hex');
    expect(result).to.equal('6a04534c500001810747454e455349534c004c004c004c0001004c00080000000000000064');
  });

  it('OK: minimal NFT1 Child GENESIS', () => {
    const result = NFT1.Child.genesis('', '', '', '').toString('hex');
    expect(result).to.equal('6a04534c500001410747454e455349534c004c004c004c0001004c00080000000000000001');
  });

  it('(must be invalid: wrong size): Genesis with 2-byte decimals', () => {
    expect(() => TokenType1.genesis('', '', '', '', 0xFFEE, null, new BN(0x64))).to.throw();
  });

  it('OK: Genesis with 32-byte dochash', () => {
    const result = TokenType1.genesis('', '', '', 'f'.repeat(64), 0, null, new BN(0x64)).toString('hex');
    expect(result).to.equal('6a04534c500001010747454e455349534c004c004c0020ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff01004c00080000000000000064');
  });

  it('(must be invalid: wrong size): Genesis with 31-byte dochash', () => {
    expect(() => TokenType1.genesis('', '', '', 'f'.repeat(62), 0, null, new BN(0x64))).to.throw();
  });

  it('(must be invalid: wrong size): Genesis with 33-byte dochash', () => {
    expect(() => TokenType1.genesis('', '', '', 'f'.repeat(66), 0, null, new BN(0x64))).to.throw();
  });

  it('(must be invalid: wrong size): Genesis with 64-byte dochash', () => {
    expect(() => TokenType1.genesis('', '', '', 'f'.repeat(128), 0, null, new BN(0x64))).to.throw();
  });

  it('(must be invalid: wrong size): Genesis with 20-byte dochash', () => {
    expect(() => TokenType1.genesis('', '', '', 'f'.repeat(40), 0, null, new BN(0x64))).to.throw();
  });

  it('(must be invalid: wrong format): Genesis with non-hex dochash', () => {
    expect(() => TokenType1.genesis('', '', '', 'g'.repeat(64), 0, null, new BN(0x64))).to.throw();
  });

  it('OK: Genesis with decimals=9', () => {
    const result = TokenType1.genesis('', '', '', '', 9, null, new BN(0x64)).toString('hex');
    expect(result).to.equal('6a04534c500001010747454e455349534c004c004c004c0001094c00080000000000000064');
  });

  it('(must be invalid: bad value): Genesis with decimals=10', () => {
    expect(() => TokenType1.genesis('', '', '', '', 10, null, new BN(0x64))).to.throw();
  });

  it('OK: Genesis with mint_baton_vout=255', () => {
    const result = TokenType1.genesis('', '', '', '', 0, 255, new BN(0x64)).toString('hex');
    expect(result).to.equal('6a04534c500001010747454e455349534c004c004c004c00010001ff080000000000000064');
  });

  it('OK: Genesis with mint_baton_vout=95', () => {
    const result = TokenType1.genesis('', '', '', '', 0, 95, new BN(0x64)).toString('hex');
    expect(result).to.equal('6a04534c500001010747454e455349534c004c004c004c000100015f080000000000000064');
  });

  it('OK: Genesis with mint_baton_vout=2', () => {
    const result = TokenType1.genesis('', '', '', '', 0, 2, new BN(0x64)).toString('hex');
    expect(result).to.equal('6a04534c500001010747454e455349534c004c004c004c0001000102080000000000000064');
  });

  it('(must be invalid: bad value): Genesis with mint_baton_vout=1', () => {
    expect(() => TokenType1.genesis('', '', '', '', 0, 1, new BN(0x64))).to.throw();
  });

  it('(must be invalid: bad value): Genesis with mint_baton_vout=0', () => {
    expect(() => TokenType1.genesis('', '', '', '', 0, 0, new BN(0x64))).to.throw();
  });

  it('OK: genesis with 300-byte name \'UUUUU...\' (op_return over 223 bytes, validators must not refuse this)', () => {
    const result = TokenType1.genesis('', 'U'.repeat(300), '', '', 0, null, new BN(0x64)).toString('hex');
    expect(result).to.equal('6a04534c500001010747454e455349534c004d2c015555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555554c004c0001004c00080000000000000064');
  });

  it('OK: genesis with 300-byte document url \'UUUUU...\' (op_return over 223 bytes, validators must not refuse this)', () => {
    const result = TokenType1.genesis('', '', 'U'.repeat(300), '', 0, null, new BN(0x64)).toString('hex');
    expect(result).to.equal('6a04534c500001010747454e455349534c004c004d2c015555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555554c0001004c00080000000000000064');
  });
});

describe('MINT', () => {
  it('OK: typical MINT without baton', () => {
    const result = TokenType1.mint('f'.repeat(64), null, new BN(0x64)).toString('hex');
    expect(result).to.equal('6a04534c50000101044d494e5420ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff4c00080000000000000064');
  });

  it('OK: typical NFT1 Group MINT without baton', () => {
    const result = NFT1.Group.mint('f'.repeat(64), null, new BN(0x64)).toString('hex');
    expect(result).to.equal('6a04534c50000181044d494e5420ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff4c00080000000000000064');
  });

  it('(must be invalid: wrong size): MINT with 0-byte token_id', () => {
    expect(() => TokenType1.mint('', null, new BN(0x64))).to.throw();
  });
  it('(must be invalid: wrong size): MINT with 31-byte token_id', () => {
    expect(() => TokenType1.mint('f'.repeat(62), null, new BN(0x64))).to.throw();
  });
  it('(must be invalid: wrong size): MINT with 33-byte token_id', () => {
    expect(() => TokenType1.mint('f'.repeat(66), null, new BN(0x64))).to.throw();
  });
  it('OK: MINT with mint_baton_vout=255', () => {
    const result = TokenType1.mint('f'.repeat(64), 255, new BN(0x64)).toString('hex');
    expect(result).to.equal('6a04534c50000101044d494e5420ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff01ff080000000000000064');
  });

  it('OK: MINT with mint_baton_vout=95', () => {
    const result = TokenType1.mint('f'.repeat(64), 95, new BN(0x64)).toString('hex');
    expect(result).to.equal('6a04534c50000101044d494e5420ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff015f080000000000000064');
  });

  it('OK: MINT with mint_baton_vout=2', () => {
    const result = TokenType1.mint('f'.repeat(64), 2, new BN(0x64)).toString('hex');
    expect(result).to.equal('6a04534c50000101044d494e5420ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0102080000000000000064');
  });

  it('(must be invalid: bad value): MINT with mint_baton_vout=1', () => {
    expect(() => TokenType1.mint('f'.repeat(64), 1, new BN(0x64))).to.throw();
  });

  it('(must be invalid: bad value): MINT with mint_baton_vout=0', () => {
    expect(() => TokenType1.mint('f'.repeat(64), 0, new BN(0x64))).to.throw();
  });
});

describe('SEND', () => {
  it('OK: typical 1-output SEND', () => {
    const result = TokenType1.send('8'.repeat(64), [new BN(0x42)]).toString('hex');
    expect(result).to.equal('6a04534c500001010453454e44208888888888888888888888888888888888888888888888888888888888888888080000000000000042');
  });

  it('OK: typical 1-output NFT1 Group SEND', () => {
    const result = NFT1.Group.send('8'.repeat(64), [new BN(0x42)]).toString('hex');
    expect(result).to.equal('6a04534c500001810453454e44208888888888888888888888888888888888888888888888888888888888888888080000000000000042');
  });

  it('OK: typical 1-output NFT1 Child SEND', () => {
    const result = NFT1.Child.send('8'.repeat(64), [new BN(0x42)]).toString('hex');
    expect(result).to.equal('6a04534c500001410453454e44208888888888888888888888888888888888888888888888888888888888888888080000000000000042');
  });

  it('OK: typical 2-output SEND', () => {
    const result = TokenType1.send('8'.repeat(64), [new BN(0x42), new BN(0x63)]).toString('hex');
    expect(result).to.equal('6a04534c500001010453454e44208888888888888888888888888888888888888888888888888888888888888888080000000000000042080000000000000063');
  });

  it('OK: typical SEND for token_type=41', () => {
    const result = NFT1.Child.send('8'.repeat(64), [new BN(0x01)]).toString('hex');
    expect(result).to.equal('6a04534c500001410453454e44208888888888888888888888888888888888888888888888888888888888888888080000000000000001');
  });

  it('(must be invalid: wrong size): SEND with 0-byte token_id', () => {
    expect(() => TokenType1.send('', [new BN(0x64)])).to.throw();
  });

  it('(must be invalid: wrong size): SEND with 31-byte token_id', () => {
    expect(() => TokenType1.send('f'.repeat(62), [new BN(0x64)])).to.throw();
  });

  it('(must be invalid: wrong size): SEND with 33-byte token_id', () => {
    expect(() => TokenType1.send('f'.repeat(66), [new BN(0x64)])).to.throw();
  });

  it('OK: SEND with 19 token output amounts', () => {
    const result = TokenType1.send('8'.repeat(64), Array(19).fill(new BN(0x01))).toString('hex');
    expect(result).to.equal('6a04534c500001010453454e44208888888888888888888888888888888888888888888888888888888888888888080000000000000001080000000000000001080000000000000001080000000000000001080000000000000001080000000000000001080000000000000001080000000000000001080000000000000001080000000000000001080000000000000001080000000000000001080000000000000001080000000000000001080000000000000001080000000000000001080000000000000001080000000000000001080000000000000001');
  });

  it('(must be invalid: not enough parameters): SEND with 0 token output amounts', () => {
    expect(() => TokenType1.send('8'.repeat(64), [])).to.throw();
  });

  it('(must be invalid: too many parameters): SEND with 20 token output amounts', () => {
    expect(() => TokenType1.send('8'.repeat(64), Array(20).fill(new BN(0x01)))).to.throw();
  });

  it('OK: all output amounts 0', () => {
    const result = TokenType1.send('8'.repeat(64), Array(2).fill(new BN(0x00))).toString('hex');
    expect(result).to.equal('6a04534c500001010453454e44208888888888888888888888888888888888888888888888888888888888888888080000000000000000080000000000000000');
  });
});

describe('util', () => {
  describe('pushdata', () => {
    it('OK: empty', () => {
      expect(pushdata(Uint8Array.from([])))
      .to.equalBytes(Buffer.from(Uint8Array.from([0x4c, 0x00])));
    });
  
    it('OK: tiny 0x00', () => {
      expect(pushdata(Uint8Array.from([0x00])))
      .to.equalBytes(Buffer.from(Uint8Array.from([0x01, 0x00])));
    });
  
    it('OK: tiny 0x01', () => {
      expect(pushdata(Uint8Array.from([0x01])))
      .to.equalBytes(Buffer.from(Uint8Array.from([0x01, 0x01])));
    });
  
    it('OK: tiny 0xff', () => {
      expect(pushdata(Uint8Array.from([0xff])))
      .to.equalBytes(Buffer.from(Uint8Array.from([0x01, 0xff])));
    });
  
    it('OK: 0x4e length', () => {
      expect(pushdata(Uint8Array.from(new Array(0x4e).fill(0xff))))
      .to.equalBytes(Buffer.from(Uint8Array.from([0x4c, 0x4e, ...new Array(0x4e).fill(0xff)])));
    });
  
    it('OK: 0x4c', () => {
      expect(pushdata(Uint8Array.from(new Array(0x4f).fill(0xff))))
      .to.equalBytes(Buffer.from(Uint8Array.from([0x4c, 0x4f, ...new Array(0x4f).fill(0xff)])));
    });
  
    it('OK: 0x4d', () => {
      expect(pushdata(Uint8Array.from(new Array(0x100).fill(0xff))))
      .to.equalBytes(Buffer.from(Uint8Array.from([0x4d, 0x00, 0x01, ...new Array(0x100).fill(0xff)])));
    });
  
    it('OK: 0x4e', () => {
      expect(pushdata(Uint8Array.from(new Array(0x10000).fill(0xff))))
      .to.equalBytes(Buffer.from(Uint8Array.from([0x4e, 0x00, 0x00, 0x01, 0x00, ...new Array(0x10000).fill(0xff)])));
    });
  });

  describe('BNToInt64BE', () => {
    it('non-integer', () => {
       expect(() => BNToInt64BE(new BN(0.1))).to.throw();
    });
    it('negative', () => {
       expect(() => BNToInt64BE(new BN(-1))).to.throw();
    });
    it('out-of-range', () => {
       expect(() => BNToInt64BE(new BN(0xffffffffffffffff01))).to.throw();
    });
    it('OK: parsed tiny', () => {
      expect(BNToInt64BE(new BN("0x11")))
      .to.equalBytes(Uint8Array.from([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x11]));
    });
    it('OK: parsed full', () => {
      expect(BNToInt64BE(new BN("0x1122334455667788")))
      .to.equalBytes(Uint8Array.from([0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77, 0x88]));
    });
  });

  it('OK: createOpReturnGenesis', () => {
    const result = createOpReturnGenesis(0x01, '', '', '', '', 0, null, new BN(0x64)).toString('hex');
    expect(result).to.equal('6a04534c500001010747454e455349534c004c004c004c0001004c00080000000000000064');
  });

  it('OK: createOpReturnMint', () => {
    const result = createOpReturnMint(0x01, 'f'.repeat(64), null, new BN(0x64)).toString('hex');
    expect(result).to.equal('6a04534c50000101044d494e5420ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff4c00080000000000000064');
  });
  it('OK: createOpReturnSend', () => {
    const result = createOpReturnSend(0x01, '8'.repeat(64), [new BN(0x42)]).toString('hex');
    expect(result).to.equal('6a04534c500001010453454e44208888888888888888888888888888888888888888888888888888888888888888080000000000000042');
  });
  it('(must be invalid: bad value): NFT1 Child Genesis with mint_baton_vout!==null', () => {
    expect(() => createOpReturnGenesis(0x41, '', '', '', '', 0, 2, new BN(0x01))).to.throw();
  });

  it('(must be invalid: bad value): NFT1 Child Genesis with divisibility!==0', () => {
    expect(() => createOpReturnGenesis(0x41, '', '', '', '', 1, null, new BN(0x01))).to.throw();
  });

  it('(must be invalid: bad value): NFT1 Child Genesis with quanitity!==1', () => {
    expect(() => createOpReturnGenesis(0x41, '', '', '', '', 0, null, new BN(0x64))).to.throw();
  });

  it('(must be invalid: bad version type): GENESIS with token_type=69', () => {
    expect(() => createOpReturnGenesis(0x69, '', '', '', '', 0, null, new BN(0x64))).to.throw();
  });
  it('(must be invalid: bad version type): MINT with token_type=69', () => {
    expect(() => createOpReturnMint(0x69, 'f'.repeat(64), null, new BN(0x64))).to.throw();
  });
  it('(must be invalid: bad version type): SEND with token_type=69', () => {
    expect(() => createOpReturnSend(0x69, '8'.repeat(64), [new BN(0x64)])).to.throw();
  });
});
