import { Instance, types } from 'mobx-state-tree'
import { LineChartOptions } from '../../components/charts/LineChart'
import { AddressToConsumer } from '../../constants/consumers.const'
import { formatDateTime } from '../../helpers/ui'
import { MakerOSM } from '../../models/api/makerOracles'
import { getRootStore } from '../../models/helpers'

export const FeedPage = types
	.model('FeedPage', {
		meta: types.maybe(
			types.model({
				title: types.string,
			}),
		),
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
			api.makerOracles.getOracles()
			api.subgraphLite.getMedianPrices({ address })
		},

		updateFeedName(feed: string) {
			self.feed = feed
			const { api } = getRootStore(self)
			api.helmet.updateTitle({ title: feed, concatenateAppname: true })
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
				{
					api: `makeroracles`,
					operation: `getOracles`,
				},
			])
		},

		medianPrices() {
			const { api } = getRootStore(self)
			return api.subgraphLite.medianPricesByAddress(self.address)
		},

		latestMedianizerPrice() {
			const prices = this.medianPrices()
			if (prices?.length === 0) {
				return { curValue: '?', age: new Date(0) }
			}
			const latestPrice = prices[prices.length - 1]
			return { curValue: latestPrice.latestValue, age: latestPrice.age }
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

		makerOracleData() {
			const { api } = getRootStore(self)
			return api.makerOracles.getByAddress(self.address)
		},

		medianizerConsumers(): AddressToConsumer[] {
			const { api } = getRootStore(self)
			return api.makerOracles.medianizerConsumers(self.address)
		},

		osmConsumers(): AddressToConsumer[] {
			const { api } = getRootStore(self)
			return api.makerOracles.osmConsumers(self.address)
		},

		osm(): Instance<typeof MakerOSM>[] {
			const { api } = getRootStore(self)
			return api.makerOracles.osm(self.address)
		},
	}))
