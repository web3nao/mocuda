import { Instance, types } from 'mobx-state-tree'
import { Feeds } from './feeds'

export default types.model('API', {
	feeds: types.optional(Feeds, () => Feeds.create()),
})

export type APIType = Instance<{
	feeds: Instance<typeof Feeds>
}>
