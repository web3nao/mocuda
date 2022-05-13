/* eslint-disable id-length */
import fs from 'fs'
import prices from '../../data/prices.json'
import prices2 from '../../data/prices2.json'
import prices3 from '../../data/prices3.json'
import prices4 from '../../data/prices4.json'
import prices5 from '../../data/prices5.json'
import prices6 from '../../data/prices6.json'
import prices7 from '../../data/prices7.json'
import prices8 from '../../data/prices8.json'
import prices9 from '../../data/prices9.json'
import prices10 from '../../data/prices10.json'
import prices11 from '../../data/prices11.json'
import transformed from '../../data/transformed.json'
import { RecoverAddress } from './RecoverAddress'

export interface FeedData {
  age: number
  date: string
  price: number
  priceStr: string
  traces: { [key: string]: string }
}

export interface FeedProducer {
  address: string
  data: FeedData[]
}

export interface Feed {
  feed: string
  producers: FeedProducer[]
}

const MAX_DATA_LENGTH = 10

export class TransformPrices {
  public static transform(): Feed[] {
    const feeds: Feed[] = transformed

    const allPrices = [
      ...prices,
      ...prices2,
      ...prices3,
      ...prices4,
      ...prices5,
      ...prices6,
      ...prices7,
      ...prices8,
      ...prices9,
      ...prices10,
      ...prices11,
    ]

    for (const price of prices) {
      const wat = price.price.wat
      const val = price.price.val

      let feed = feeds.find((currentFeed) => currentFeed.feed === wat)
      if (!feed) {
        feed = {
          feed: wat,
          producers: [],
        }
        feeds.push(feed)
      }

      const feedAddress = RecoverAddress.addressByDataFromFeed({
        feed: wat,
        price: val,
        timestamp: price.price.age,
        v: price.price.v,
        r: price.price.r,
        s: price.price.s,
      })

      let producer = feed.producers.find(
        (currentProducer) => currentProducer.address === feedAddress
      )
      if (!producer) {
        producer = {
          address: feedAddress,
          data: [],
        }
        feed.producers.push(producer)
      }

      const ageNumber = Number(`${price.price.age}000`)
      let foundDataWithSameTimestamp = producer.data.find(
        (currentData) => currentData.age === ageNumber
      )
      if (!foundDataWithSameTimestamp) {
        producer.data.push({
          age: ageNumber,
          date: new Date(ageNumber).toISOString(),
          price: RecoverAddress.convertStringToDecimal(val, 18),
          priceStr: val,
          traces: price.trace,
        })
      }

      producer.data.sort((a, b) => b.age - a.age)
      if (producer.data.length > MAX_DATA_LENGTH) {
        producer.data = producer.data.slice(0, MAX_DATA_LENGTH)
      }
    }

    TransformPrices.storeFeedData(feeds)
    feeds.forEach((feed) => TransformPrices.storeOneFeedData(feed))
    TransformPrices.storeFeedPairs(feeds.map((feed) => feed.feed))

    return feeds
  }

  public static storeFeedData(feeds: Feed[]) {
    fs.writeFileSync(
      `${__dirname}/../../data/transformed.json`,
      JSON.stringify(feeds),
      { encoding: 'utf-8' }
    )
  }

  public static storeOneFeedData(feed: Feed) {
    fs.writeFileSync(
      `${__dirname}/../../data/feeds/${feed.feed}.json`,
      JSON.stringify(feed),
      { encoding: 'utf-8' }
    )
  }

  public static storeFeedPairs(pairs: string[]) {
    fs.writeFileSync(
      `${__dirname}/../../data/feeds/pairs.json`,
      JSON.stringify(pairs),
      { encoding: 'utf-8' }
    )
  }
}
