# SLP Metadata Maker

slp-mdm is a JavaScript Library for building [Simple Ledger Protocol (SLP)](https://github.com/simpleledger/slp-specifications) metadata for use in Bitcoin transactions. GENESIS, MINT, and SEND token functions are supported for TokenType1 and NFT1 tokens. This repo is designed to be easy to port to other languages, and should be combined with a transaction building library such as [bitcore-lib-cash](https://github.com/bitpay/bitcore/tree/master/packages/bitcore-lib-cash), and a validation library such as [slp-validate](https://github.com/simpleledger/slp-validate).

[![NPM](https://nodei.co/npm/slp-mdm.png)](https://nodei.co/npm/slp-mdm/)


# Installation

#### For node.js
```bash
npm install slp-mdm
```

#### For browser
```html
<script src='https://unpkg.com/slp-mdm'></script>
```


# Examples

Software utilizing this library will want to validate the transactions they create do not burn any tokens. This library does not perform any validation of the inputs or output amounts, dealing solely with creating the OP_RETURN messages SLP needs to function. If this is not clear, please read the [slp-specifications](https://github.com/simpleledger/slp-specifications) as it is possible to burn tokens by using this library incorrectly.

NOTES: 

* The [BigNumber.js library](https://github.com/MikeMcl/bignumber.js) is used to avoid precision issues with numbers having more than 15 significant digits. This can be accessed with `slpMdm.BN`.
* All slp-mdm methods require token quantities to be expressed in the smallest possible unit of account for the token (i.e., token satoshis).  This requires the token's precision to be used to calculate the quantity. For example, token having a decimal precision of 9 sending an amount of 1.01 tokens would need to first calculate the sending amount using `1.01 x 10^9 => 1010000000`.

## GENESIS 

Create a new normal token. You can also use `NFT1.Group.genesis` for this. `NFT1.Child.genesis` has slightly different signature and is described below.


```js
const slpMdm = require('slp-mdm');
const buf = slpMdm.TokenType1.genesis(
  'TOK',                                                              // symbol
  'token_name',                                                       // name
  'https://fountainhead.cash/document.pdf',                           // document_uri
  'f8bf41177a5f5e808a7ccb648b51080b031f15ca8018d91a576263d6cc626eb6', // document_hash
  5,                                                                  // decimals
  null,                                                               // mint_baton_vout
  new slpMdm.BN("1000")                                               // quantity (needs to be BigNumber)
);
```

### NFT1 Child Genesis

NFT1-child tokens have quantity set to 1, no baton vout (i.e. future minting impossible), and have 0 decimal places. Because of these differences, the signature for this method excludes these parameters.

```js
const slpMdm = require('slp-mdm');
const buf = slpMdm.NFT1.Child.genesis(
  'IVAN',                                                             // symbol
  'gorilla'                                                           // name
  'https://fountainhead.cash/document.pdf',                           // document_uri
  'f8bf41177a5f5e808a7ccb648b51080b031f15ca8018d91a576263d6cc626eb6'  // document_hash
);
```

## MINT 

Mints additional tokens. You can also use `NFT1.Group.mint`, NFT1.Child does not support minting additional tokens.

```js
const slpMdm = require('slp-mdm');
const buf = slpMdm.TokenType1.mint(
  'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff', // token_id
  null,                                                               // mint_baton_vout 
  new slpMdm.BN("500")                                                // quantity (needs to be BigNumber)
);
```

## SEND 

Transfer tokens to new UTXOs. You can also use `NFT1.Group.send`, or `NFT1.Child.send` for this.

```js
const slpMdm = require('slp-mdm');
const buf = slpMdm.TokenType1.send(
  'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff', // token_id
  [                                                                   // slp_amounts to send
    new slpMdm.BN("100"), 
    new slpMdm.BN("200"), 
    new slpMdm.BN("300"), 
  ]
);
```

# Building & Testing

Building this project creates browserified versions in the `dist` folder.

## Requirements
Running the unit tests require node.js v8.15+. 

## Build
`npm run build`

## Test
`npm run test`


# Porting

slp-mdm was designed to be very easy to port to other languages. If you are working on a port to another language please open an issue on this repo so we can link to your port or help with any questions. Make sure to utilize the unit-tests :)


# Change Log

### 0.0.6
- Allows for Buffer for documentHash and tokenIdHex

### 0.0.5
- Perform strictNullChecks

### 0.0.4
- Make mint_baton_vout nullable

### 0.0.3
- Improved some error messages 

### 0.0.2
- Fixed README

### 0.0.1
- Initial release
