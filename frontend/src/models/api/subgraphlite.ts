import { nao, TheGraph } from '@web3nao/http-configs'
import { flow, types } from 'mobx-state-tree'
import { DAY } from '../../constants/duration.const'
import {
	SUBGRAPH_LITE_ACCOUNT,
	SUBGRAPH_LITE_NAME,
} from '../../constants/env.const'
import { request } from '../../helpers/api'
import { convertStringToDecimal } from '../../helpers/ui'
import routes from '../../routes'
import { getRootStore, getRouter } from '../helpers'
import { StateAndCacheKey } from './stateAndCache'

export const EventCounter = types.model({
	id: types.string,
	name: types.string,
	count: types.number,
	first: types.Date,
	latest: types.Date,
	latestValue: types.string,
})

export const MedianPrice = types.model({
	age: types.Date,
	latestValue: types.number,
})

export const SubgraphLite = types
	.model('SubgraphLite', {
		eventCounters: types.array(EventCounter),
		medianPrices: types.map(types.array(MedianPrice)),
	})
	.actions((self) => ({
		getEventCounters: flow(function* () {
			const { api } = getRootStore(self)

			const stateAndCacheKey: StateAndCacheKey = {
				api: `subgraphlite`,
				operation: `getEventCounters`,
			}
			if (!api.stateAndCache.shouldFetch(stateAndCacheKey, true)) {
				return
			}
			api.stateAndCache.updateToPending(stateAndCacheKey)

			const naoRequest = nao<TheGraph.QueryByName>({
				kind: 'thegraph.hostedservice.queryByName',
				'param:account': String(SUBGRAPH_LITE_ACCOUNT),
				'param:name': String(SUBGRAPH_LITE_NAME),
				'body:query': `
				{ 
					eventCounters {
						id
						name
						count
						first
						latest
						val
					}
				}
				`,
			})

			try {
				const response = yield request({
					url: naoRequest.url,
					method: naoRequest.method,
					body: naoRequest.body,
					headers: naoRequest.headers,
				})

				const { components } = getRootStore(self)

				if (response?.data?.eventCounters) {
					response?.data?.eventCounters.sort(
						(a: any, b: any) => Number(b.latest) - Number(a.latest),
					)
				}
				self.eventCounters.clear()
				for (const eventCounter of response?.data?.eventCounters) {
					if (
						!self.eventCounters.find(
							(currentEventCounter) =>
								currentEventCounter.name.toLowerCase() ===
								eventCounter.name.toLowerCase(),
						)
					) {
						self.eventCounters.push({
							id: eventCounter.id,
							name: eventCounter.name,
							count: eventCounter.count,
							first: Number(`${eventCounter.first}000`),
							latest: Number(`${eventCounter.latest}000`),
							latestValue: String(convertStringToDecimal(eventCounter.val, 18)),
						})
						components.quickSearch.addAction({
							id: eventCounter.id,
							title: eventCounter.name,
							tag:
								Number(`${eventCounter.latest}000`) < Date.now() - DAY
									? 'inactive'
									: undefined,
							subtitle: eventCounter.id,
							action: () =>
								getRouter().goTo(routes.feed, { address: eventCounter.name }),
						})
					}
				}
				api.stateAndCache.updateToDone(stateAndCacheKey)
			} catch (error) {
				console.error(error)
				api.stateAndCache.updateToFailure(stateAndCacheKey)
			}
		}),

		getMedianPrices: flow(function* (options: {
			address: string
			useCache?: boolean
		}) {
			const { api } = getRootStore(self)

			const address = options.address.toLowerCase()
			const useCache = options.useCache ?? true
			const stateAndCacheKey: StateAndCacheKey = {
				api: `subgraphlite`,
				operation: `getMedianPrices`,
				id: address,
			}
			if (!api.stateAndCache.shouldFetch(stateAndCacheKey, useCache)) {
				return
			}
			api.stateAndCache.updateToPending(stateAndCacheKey)

			const naoRequest = nao<TheGraph.QueryByName>({
				kind: 'thegraph.hostedservice.queryByName',
				'param:account': String(SUBGRAPH_LITE_ACCOUNT),
				'param:name': String(SUBGRAPH_LITE_NAME),
				'body:query': `
				{
					logMedianPrices(where:{type:"${address}"}, first:50, orderBy:age orderDirection:desc) {
						id
						val
						age
						type
					}  
				}				
				`,
			})

			try {
				const response = yield request({
					url: naoRequest.url,
					method: naoRequest.method,
					body: naoRequest.body,
					headers: naoRequest.headers,
				})

				const medianPrices: any[] = []
				for (const medianPrice of response?.data?.logMedianPrices) {
					medianPrices.push({
						age: Number(`${medianPrice.age}000`),
						latestValue: convertStringToDecimal(medianPrice.val, 18),
					})
				}
				medianPrices.sort((a, b) => a.age - b.age)
				self.medianPrices.set(address, medianPrices)
				api.stateAndCache.updateToDone(stateAndCacheKey)
			} catch (error) {
				console.error(error)
				api.stateAndCache.updateToFailure(stateAndCacheKey)
			}
		}),
	}))
	.views((self) => ({
		nameByAddress(address: string) {
			const foundCounter = self.eventCounters.find(
				(counter) => counter.id.toLowerCase() === address.toLowerCase(),
			)
			return foundCounter?.name ?? 'Address Not Found'
		},

		addressbyName(name: string) {
			const foundCounter = self.eventCounters.find(
				(counter) => counter.name.toLowerCase() === name.toLowerCase(),
			)
			return foundCounter?.id ?? 'Name Not Found'
		},

		medianPricesByAddress(address: string) {
			return self.medianPrices.get(address) ?? []
		},
	}))
