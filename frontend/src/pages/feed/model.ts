import { types } from 'mobx-state-tree'
import { getRootStore } from '../../models/helpers'

export const FeedPage = types
	.model('FeedPage', {
		address: types.optional(types.string, ''),
		data: types.optional(
			types.model({
				test: types.optional(types.string, ''),
			}),
			{},
		),
	})
	.actions((self) => ({
		// INITIALIZATION
		initialisePage(address: string) {
			self.address = address
			const { api } = getRootStore(self)
			api.subgraphLite.getMedianPrices({ address })
			api.subgraphLite.getEventCounters()
		},
	}))
	.views((self) => ({
		loading() {
			const { api } = getRootStore(self)
			return api.stateAndCache.somePending([
				{
					api: `subgraphlite`,
					operation: `getMedianPrices`,
					id: self.address,
				},
				{
					api: `subgraphlite`,
					operation: `getEventCounters`,
				},
			])
		},

		medianPrices() {
			const { api } = getRootStore(self)
			return api.subgraphLite.medianPricesByAddress(self.address)
		},

		feedName() {
			const { api } = getRootStore(self)
			return api.subgraphLite.nameByAddress(self.address)
		},
	}))
