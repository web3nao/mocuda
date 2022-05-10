import { Instance, types } from 'mobx-state-tree'
import { Feeds } from './feeds'
import { StateAndCache } from './stateAndCache'
import { SubgraphLite } from './subgraphlite'

export default types.model('API', {
	stateAndCache: types.optional(StateAndCache, () => StateAndCache.create()),
	feeds: types.optional(Feeds, () => Feeds.create()),
	subgraphLite: types.optional(SubgraphLite, () => SubgraphLite.create()),
})

export type APIType = Instance<{
	stateAndCache: Instance<typeof StateAndCache>
	feeds: Instance<typeof Feeds>
	subgraphLite: Instance<typeof SubgraphLite>
}>
