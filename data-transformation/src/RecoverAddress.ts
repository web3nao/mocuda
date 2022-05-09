/* eslint-disable id-length */
import Units from 'ethereumjs-units'

import {
  ecrecover,
  keccakFromHexString,
  BN,
  bufferToHex,
  pubToAddress,
  keccak256,
} from 'ethereumjs-util'

export interface RecoverAddressParameters {
  feed: string
  price: number
  timestamp: number
  v: number
  r: string
  s: string
}

export interface RecoverAddressParametersFromFeed {
  feed: string
  price: string
  timestamp: number
  v: string
  r: string
  s: string
}

const MESSAGE_PREFIX = '\x19Ethereum Signed Message:\n32'

export class RecoverAddress {
  public static addressByDataFromFeed(
    parameters: RecoverAddressParametersFromFeed
  ): string {
    const transformedParameters: RecoverAddressParameters = {
      feed: parameters.feed,
      price: RecoverAddress.convertStringToDecimal(parameters.price, 18),
      timestamp: parameters.timestamp,
      v: Number(`0x${parameters.v}`),
      r: `0x${parameters.r}`,
      s: `0x${parameters.s}`,
    }
    return RecoverAddress.address(transformedParameters)
  }

  public static address(parameters: RecoverAddressParameters): string {
    const part1 = RecoverAddress.pad32(
      RecoverAddress.hex(new BN(Units.convert(parameters.price, 'eth', 'wei')))
    )
    const part2 = RecoverAddress.pad32(
      RecoverAddress.hex(new BN(parameters.timestamp))
    )
    const part3 = RecoverAddress.stringToBytes(parameters.feed)

    const message = `0x${part1}${part2}${part3}`

    let hash = keccakFromHexString(message, 256)
    const prefix = Buffer.from(MESSAGE_PREFIX)
    const prefixedMsg = keccak256(Buffer.concat([prefix, hash]))

    let pubKey = ecrecover(
      prefixedMsg,
      parameters.v,
      Buffer.from(parameters.r.slice(2), 'hex'),
      Buffer.from(parameters.s.slice(2), 'hex')
    )
    const addrBuf = pubToAddress(pubKey)
    return bufferToHex(addrBuf)
  }

  private static pad32(hex: string) {
    return hex.padStart(64, '0')
  }

  private static hex(bnNumber: any) {
    return bnNumber.toString(16)
  }

  private static stringToBytes(value: string) {
    let hexstr = ''
    const bufferArray = [...Buffer.from(value)]
    bufferArray.forEach((currentValue) => {
      hexstr += RecoverAddress.hex(currentValue)
    })

    return hexstr.padEnd(64, '0')
  }

  public static convertStringToDecimal(
    value: string,
    precision: number
  ): number {
    const splitted = value.split('').reverse()
    if (splitted.length < precision) {
      for (let i = 0; i < precision - splitted.length; i++) {
        splitted.push('0')
      }
    }
    const updatedValue = []

    for (let index = 0; index < splitted.length; index++) {
      updatedValue.push(splitted[index])
      if (index === precision - 1) {
        updatedValue.push('.')
      }
    }
    const updatedValueString = updatedValue.reverse().join('')
    const asNumber = Number(updatedValueString)
    return asNumber
  }
}
