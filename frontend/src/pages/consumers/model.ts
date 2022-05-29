import { t } from 'i18next'
import { types } from 'mobx-state-tree'
import { getRootStore } from '../../models/helpers'

export const ConsumersPage = types
	.model('ConsumersPage', {})
	.actions((self) => ({
		// INITIALIZATION
		initialisePage() {
			const { api } = getRootStore(self)
			api.helmet.updateTitle({
				title: t('pages.consumers.headings.title'),
				concatenateAppname: true,
			})
			api.makerOracles.getOracles()
		},
	}))
	.views((self) => ({
		loading() {
			const { api } = getRootStore(self)
			return api.stateAndCache.somePending([
				{
					api: `makeroracles`,
					operation: `getOracles`,
				},
			])
		},

		consumers() {
			const { api } = getRootStore(self)
			return api.makerOracles.consumers()
		},
	}))
