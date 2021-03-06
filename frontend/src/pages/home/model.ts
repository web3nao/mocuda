import { Instance, types } from 'mobx-state-tree'
import { DAY } from '../../constants/duration.const'
import { EventCounter } from '../../models/api/subgraphlite'
import { getRootStore } from '../../models/helpers'

export const HomePage = types
	.model('HomePage', {
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
			api.helmet.defaultTitle()
			api.feeds.get()
			api.subgraphLite.getEventCounters()
			api.makerOracles.getOracles()
		},
	}))
	.views((self) => ({
		loading() {
			const { api } = getRootStore(self)
			return api.stateAndCache.somePending([
				{
					api: `subgraphlite`,
					operation: `getEventCounters`,
				},
			])
		},

		eventCounters() {
			const { api } = getRootStore(self)
			return api.subgraphLite.eventCounters
		},

		feeds(): {
			activeFeeds: Instance<typeof EventCounter>[]
			deadFeeds: Instance<typeof EventCounter>[]
			popularFeeds: Instance<typeof EventCounter>[]
			recentFeeds: Instance<typeof EventCounter>[]
		} {
			const active = Date.now() - DAY
			const { api } = getRootStore(self)

			const activeFeeds = api.subgraphLite.eventCounters.filter(
				(counter) => counter.latest >= new Date(active),
			)

			const deadFeeds = api.subgraphLite.eventCounters.filter(
				(counter) => counter.latest < new Date(active),
			)

			const popularFeeds = activeFeeds.slice()
			popularFeeds.sort((a, b) => b.count - a.count)

			const recentFeeds = activeFeeds.slice()
			recentFeeds.sort((a, b) => b.first.getTime() - a.first.getTime())

			return {
				activeFeeds,
				deadFeeds,
				popularFeeds,
				recentFeeds,
			}
		},
	}))
