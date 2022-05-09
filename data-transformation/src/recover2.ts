/* eslint-disable id-length */
// import pkg from 'ethereumjs-util'
// const {
//   ecrecover,
//   keccakFromHexString,
//   BN,
//   bufferToHex,
//   pubToAddress,
//   keccak256,
// } = pkg
import Units from 'ethereumjs-units'

import {
  ecrecover,
  keccakFromHexString,
  BN,
  bufferToHex,
  pubToAddress,
  keccak256,
} from 'ethereumjs-util'
import { doit } from './myfloat'

function pad32(hex) {
  return hex.padStart(64, '0')
}

function hex(bnnumber) {
  return bnnumber.toString(16)
}

function stringToBytes(string) {
  let hexstr = ''
  ;[...Buffer.from(string)].forEach((value) => {
    hexstr += hex(value)
  })
  return hexstr.padEnd(64, '0')
}

export function address(feed, price, timestamp, v, r, s) {
  let message =
    '0x' +
    pad32(hex(new BN(Units.convert(price, 'eth', 'wei')))) +
    pad32(hex(new BN(timestamp))) +
    stringToBytes(feed)
  let hash = keccakFromHexString(message, 256)
  const prefix = Buffer.from('\x19Ethereum Signed Message:\n32')
  const prefixedMsg = keccak256(Buffer.concat([prefix, hash]))
  let pubKey = ecrecover(
    prefixedMsg,
    v,
    Buffer.from(r.slice(2), 'hex'),
    Buffer.from(s.slice(2), 'hex')
  )
  const addrBuf = pubToAddress(pubKey)
  return bufferToHex(addrBuf)
}

export function test() {
  let addr = address(
    'ETHUSD',
    1182.71,
    1609950220,
    27,
    '0xca9d9f50953fa3b6561d40781d0fc83820022921eafcbbe5ddeadeb04b1c582e',
    '0x621cface084f75ec0e2bde81d013d0fec773260ab457863e70b7a5f7673cd98d'
  )

  let addr2 = address(
    'MATICUSD',
    // 1.1115690292309606,
    doit('1111569029230960600', 18),
    1651687608,
    Number('0x1c'),
    '0x765655215744bd6f66a2368de0392e347a4b4e2660b43d179c281d6efcef02a6',
    '0x4960327a60bafeaa70b7167333ab945c70c5817e67d39060d407fb73423fc430'
  )

  let addr3 = address(
    'ETHUSD',
    2928.34,
    // '2928340000000000000000',
    1651753590,
    Number('0x1b'),
    '0x0ec03feddb584b3ce854e80f8eddcb1940cacb79394ad992f727dd6127b73cd0',
    '0x07be3a0069e5d8aa3dbb5856d7d7e118b37a946b53195f3909ea44966d16aa14'
  )

  console.log('Expecting: 0xd94bbe83b4a68940839cd151478852d16b3ef891')
  console.log('Got:       ' + addr2.toString())
}
test()
