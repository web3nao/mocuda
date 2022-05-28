import { flow, Instance, types } from 'mobx-state-tree'
import {
	AddressToConsumer,
	ADDRESS_TO_CONSUMER,
	getAnonymousConsumer,
} from '../../constants/consumers.const'
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

				api.stateAndCache.updateToDone(stateAndCacheKey)
			} catch (error) {
				console.error(error)
				api.stateAndCache.updateToFailure(stateAndCacheKey)
			}
		}),
	}))
	.views((self) => ({
		getByAddress(
			address: string,
		): Instance<typeof MedianizerPrice> | undefined {
			const foundOracle = self.medianizerprices.find(
				(oracle) => oracle.id.toLowerCase() === address.toLowerCase(),
			)
			return foundOracle
		},

		medianizerConsumers(address: string): AddressToConsumer[] {
			const oracleData = this.getByAddress(address)
			if (!oracleData) {
				return []
			}

			return oracleData.consumers
				.map((currentConsumer) => {
					const consumer = ADDRESS_TO_CONSUMER.get(currentConsumer.address)
					if (!consumer) {
						return getAnonymousConsumer(currentConsumer.address)
					}
					return consumer
				})
				.sort((a, b) => (b.anonymous ? 0 : 1) - (a.anonymous ? 0 : 1))
		},

		osmConsumers(address: string): AddressToConsumer[] {
			const oracleData = this.getByAddress(address)
			if (!oracleData || !oracleData.osm || oracleData.osm.length === 0) {
				return []
			}

			const consumers: AddressToConsumer[] = []

			for (const osm of oracleData.osm) {
				osm.consumers.forEach((currentConsumer) => {
					let consumer = ADDRESS_TO_CONSUMER.get(currentConsumer.address)
					if (!consumer) {
						consumer = getAnonymousConsumer(currentConsumer.address)
					}
					consumers.push(consumer)
				})
			}

			return consumers.sort(
				(a, b) => (b.anonymous ? 0 : 1) - (a.anonymous ? 0 : 1),
			)
		},

		osm(address: string): Instance<typeof MakerOSM>[] {
			const oracleData = this.getByAddress(address)
			if (!oracleData || !oracleData.osm || oracleData.osm.length === 0) {
				return []
			}
			return oracleData.osm
		},

		consumers(): AddressToConsumer[] {
			const consumers: AddressToConsumer[] = []
			const consumerNames = new Set<string>()
			for (const medianizerprice of self.medianizerprices) {
				for (const mConsumer of medianizerprice.consumers) {
					const consumer = ADDRESS_TO_CONSUMER.get(mConsumer.address)
					if (consumer && !consumerNames.has(consumer.id)) {
						consumerNames.add(consumer.id)
						consumers.push(consumer)
					}
				}
				for (const osm of medianizerprice.osm) {
					for (const osmConsumer of osm.consumers) {
						const consumer = ADDRESS_TO_CONSUMER.get(osmConsumer.address)
						if (consumer && !consumerNames.has(consumer.id)) {
							consumerNames.add(consumer.id)
							consumers.push(consumer)
						}
					}
				}
			}
			return consumers
		},
	}))
