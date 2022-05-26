import { flow, types } from 'mobx-state-tree'
import { MAKER_OCU_GRAPH_BASE_URL } from '../../constants/env.const'
import { request } from '../../helpers/api'
import { getRootStore } from '../helpers'
import { StateAndCacheKey } from './stateAndCache'

export const MakerOracleConsumer = types.model({
	address: types.string,
})

export const MakerFeed = types.model({
	// active: types.maybe(),
	curValue: types.string,
	id: types.string,
	r: types.string,
	s: types.string,
	updatedTimeStamp: types.string,
	v: types.number,
})

export const MakerOSM = types.model({
	consumers: types.array(MakerOracleConsumer),
	curValue: types.string,
	id: types.string,
	nextTimestamp: types.string,
	nextValue: types.string,
	transactionHash: types.string,
	updatedBlockNumber: types.string,
	updatedTimeStamp: types.string,
})

export const MedianizerPrice = types.model({
	consumers: types.array(MakerOracleConsumer),
	curValue: types.string,
	name: types.string,
	id: types.string,
	transactionHash: types.string,
	updatedBlockNumber: types.string,
	updatedTimeStamp: types.string,
	osm: types.array(MakerOSM),
	feeds: types.array(MakerFeed),
})

export const MakerOracles = types
	.model('MakerOracles', {
		medianizerprices: types.array(MedianizerPrice),
	})
	.actions((self) => ({
		getOracles: flow(function* (options: { useCache?: boolean } = {}) {
			const { api } = getRootStore(self)

			const useCase = options.useCache ?? true

			const stateAndCacheKey: StateAndCacheKey = {
				api: `makeroracles`,
				operation: `getOracles`,
			}
			if (!api.stateAndCache.shouldFetch(stateAndCacheKey, useCase)) {
				return
			}
			api.stateAndCache.updateToPending(stateAndCacheKey)

			const query = `query {
				medianizerPrices {
					consumers {
						address
					}
					feeds {
						s
						r
						v
						active
						curValue
						updatedTimeStamp
						id
					}
					osm {
						consumers {
							address
						}
						transactionHash
						nextTimestamp
						updatedBlockNumber
						updatedTimeStamp
						nextValue
						curValue
						id
					}
					transactionHash
					updatedBlockNumber
					updatedTimeStamp
					curValue
					name
					id
				}
			}`

			try {
				const response = yield request({
					url: `${MAKER_OCU_GRAPH_BASE_URL}/subgraphs/name/maker-oracles`,
					method: `POST`,
					body: { query },
				})

				self.medianizerprices = response.data.medianizerPrices

				console.log(response)

				api.stateAndCache.updateToDone(stateAndCacheKey)
			} catch (error) {
				console.error(error)
				api.stateAndCache.updateToFailure(stateAndCacheKey)
			}
		}),
	}))
	.views((self) => ({}))
