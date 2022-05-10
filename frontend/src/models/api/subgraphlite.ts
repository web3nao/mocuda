import { nao, TheGraph } from '@web3nao/http-configs'
import { flow, types } from 'mobx-state-tree'
import {
	SUBGRAPH_LITE_ACCOUNT,
	SUBGRAPH_LITE_NAME,
} from '../../constants/env.const'
import { request } from '../../helpers/api'
import { getRootStore } from '../helpers'
import { StateAndCacheKey } from './stateAndCache'

export const SubgraphLite = types
	.model('SubgraphLite', {
		eventCounters: types.array(
			types.model({
				id: types.string,
				count: types.number,
				first: types.Date,
				latest: types.Date,
			}),
		),
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
						count
						first
						latest
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
					self.eventCounters.push({
						id: eventCounter.id,
						count: eventCounter.count,
						first: Number(`${eventCounter.first}000`),
						latest: Number(`${eventCounter.latest}000`),
					})
				}
				api.stateAndCache.updateToDone(stateAndCacheKey)
			} catch (error) {
				console.error(error)
				api.stateAndCache.updateToFailure(stateAndCacheKey)
			}
		}),
	}))
