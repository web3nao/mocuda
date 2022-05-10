import { flow, types } from 'mobx-state-tree'
import { FEEDS_JSON_URL } from '../../constants/env.const'
import { request } from '../../helpers/api'
import { getRootStore } from '../helpers'
import { StateAndCacheKey } from './stateAndCache'

export const Feeds = types
	.model('Feeds', {
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
	}))
