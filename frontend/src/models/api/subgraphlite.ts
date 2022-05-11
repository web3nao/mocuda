import { nao, TheGraph } from '@web3nao/http-configs'
import { flow, types } from 'mobx-state-tree'
import {
	SUBGRAPH_LITE_ACCOUNT,
	SUBGRAPH_LITE_NAME,
} from '../../constants/env.const'
import { request } from '../../helpers/api'
import { convertStringToDecimal } from '../../helpers/ui'
import { getRootStore } from '../helpers'
import { StateAndCacheKey } from './stateAndCache'

export const EventCounter = types.model({
	id: types.string,
	name: types.string,
	count: types.number,
	first: types.Date,
	latest: types.Date,
	latestValue: types.optional(types.string, ''),
})

export const SubgraphLite = types
	.model('SubgraphLite', {
		eventCounters: types.array(EventCounter),
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
					}
					logMedianPrices(orderBy:age, orderDirection:desc, first:25) {
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

				self.eventCounters.clear()
				for (const eventCounter of response?.data?.eventCounters) {
					const foundValue = response?.data?.logMedianPrices?.find(
						(price: any) => price.type === eventCounter.id,
					)?.val
					self.eventCounters.push({
						id: eventCounter.id,
						name: eventCounter.name,
						count: eventCounter.count,
						first: Number(`${eventCounter.first}000`),
						latest: Number(`${eventCounter.latest}000`),
						latestValue: foundValue
							? String(convertStringToDecimal(foundValue, 18))
							: '',
					})
				}
				api.stateAndCache.updateToDone(stateAndCacheKey)
			} catch (error) {
				console.error(error)
				api.stateAndCache.updateToFailure(stateAndCacheKey)
			}
		}),
	}))
