import { types } from 'mobx-state-tree'
import { LineChartOptions } from '../../components/charts/LineChart'
import { formatDateTime } from '../../helpers/ui'
import { getRootStore } from '../../models/helpers'

export const FeedPage = types
	.model('FeedPage', {
		address: types.optional(types.string, ''),
		feed: types.optional(types.string, ''),
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
			api.subgraphLite.getEventCounters().then(() => {
				const feed = api.subgraphLite.nameByAddress(self.address)
				this.updateFeedName(feed)
				api.feeds.getFeedData({ feed })
			})
			api.subgraphLite.getMedianPrices({ address })
		},

		updateFeedName(feed: string) {
			self.feed = feed
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
				{
					api: `feeds`,
					operation: `getFeedData`,
					id: self.feed,
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

		lineChartOptions(): LineChartOptions {
			const options: LineChartOptions = {
				legend: false,
				data: {
					datasets: [
						{
							label: this.feedName(),
							values: this.medianPrices().map((price) => {
								return {
									label: formatDateTime(price.age),
									value: price.latestValue,
								}
							}),
						},
					],
				},
			}
			return options
		},

		oracles() {
			const { api } = getRootStore(self)
			return api.feeds.feedData.get(self.feed)?.producers ?? []
		},
	}))
