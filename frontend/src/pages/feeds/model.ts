import { types } from 'mobx-state-tree'
import { getRootStore } from '../../models/helpers'

export const FeedsPage = types
	.model('FeedsPage', {
		data: types.optional(
			types.model({
				test: types.optional(types.string, ''),
			}),
			{},
		),
	})
	.actions((self) => ({
		// INITIALIZATION
		initialisePage() {
			const { api } = getRootStore(self)
			api.feeds.get()
			api.subgraphLite.getEventCounters()
		},
	}))
	.views((self) => ({
		loading() {
			const { api } = getRootStore(self)
			return api.stateAndCache.somePending([
				{
					api: `feeds`,
					operation: `get`,
				},
				{
					api: `subgraphlite`,
					operation: `getEventCounters`,
				},
			])
		},

		feeds() {
			const { api } = getRootStore(self)
			return api.feeds.feeds
		},

		pairs() {
			const { api } = getRootStore(self)
			return api.feeds.pairs
		},

		eventCounters() {
			const { api } = getRootStore(self)
			return api.subgraphLite.eventCounters
		},
	}))
