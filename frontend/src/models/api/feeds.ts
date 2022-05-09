import { flow, types } from 'mobx-state-tree'
import { request } from '../../helpers/api'

const FEEDS_JSON_URL = import.meta.env.VITE_DATA_FEED_JSON_URL

export const Feeds = types
	.model('Feeds', {
		feeds: types.array(types.string),
		pairs: types.array(types.string),
	})
	.actions((self) => ({
		get: flow(function* () {
			const json = yield request({
				url: FEEDS_JSON_URL,
				method: 'get',
			})
			self.feeds = json.feeds
			self.pairs = json.pairs
		}),
	}))
