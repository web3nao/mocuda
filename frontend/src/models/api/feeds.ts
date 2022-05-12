import { flow, types } from 'mobx-state-tree'
import { FEEDS_JSON_BASE_URL, FEEDS_JSON_URL } from '../../constants/env.const'
import { request } from '../../helpers/api'
import { getRootStore } from '../helpers'
import { StateAndCacheKey } from './stateAndCache'

export const FeedData = types.model({
	age: types.number,
	date: types.string,
	price: types.number,
	priceStr: types.string,
	traces: types.map(types.string),
})

export const FeedProducer = types.model({
	address: types.string,
	data: types.array(FeedData),
})

export const Feed = types.model({
	feed: types.string,
	producers: types.array(FeedProducer),
})

export const Feeds = types
	.model('Feeds', {
		feedData: types.map(Feed),
		feeds: types.array(types.string),
		pairs: types.array(types.string),
	})
	.actions((self) => ({
		get: flow(function* () {
			const { api } = getRootStore(self)

			const stateAndCacheKey: StateAndCacheKey = {
				api: `feeds`,
				operation: `get`,
			}
			if (!api.stateAndCache.shouldFetch(stateAndCacheKey, true)) {
				return
			}
			api.stateAndCache.updateToPending(stateAndCacheKey)

			try {
				const json = yield request({
					url: FEEDS_JSON_URL,
					method: 'get',
				})
				self.feeds = json.feeds
				self.pairs = json.pairs

				api.stateAndCache.updateToDone(stateAndCacheKey)
			} catch (error) {
				console.error(error)
				api.stateAndCache.updateToFailure(stateAndCacheKey)
			}
		}),

		getFeedData: flow(function* (options: {
			feed: string
			useCache?: boolean
		}) {
			const { api } = getRootStore(self)

			const useCache = options.useCache ?? true
			const feed = options.feed.toUpperCase()

			const stateAndCacheKey: StateAndCacheKey = {
				api: `feeds`,
				operation: `getFeedData`,
				id: feed,
			}
			if (!api.stateAndCache.shouldFetch(stateAndCacheKey, useCache)) {
				return
			}
			api.stateAndCache.updateToPending(stateAndCacheKey)

			try {
				const json = yield request({
					url: `${FEEDS_JSON_BASE_URL}/${feed}.json`,
					method: 'get',
				})
				self.feedData.set(feed, json)

				api.stateAndCache.updateToDone(stateAndCacheKey)
			} catch (error) {
				console.error(error)
				api.stateAndCache.updateToFailure(stateAndCacheKey)
			}
		}),
	}))
