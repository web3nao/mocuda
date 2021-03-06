/* eslint-disable id-length */
import fs from 'fs'
import prices from '../../data/prices.json'
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
