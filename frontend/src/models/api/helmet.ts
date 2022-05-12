import { types } from 'mobx-state-tree'
import i18next from '../../i18n/config'

export const HelmetModel = types
	.model('HelmetModel', {
		title: types.maybe(types.string),
	})
	.actions((self) => ({
		updateTitle(options: { title: string; concatenateAppname?: boolean }) {
			const titleParts: string[] = [options.title]
			if (options.concatenateAppname) {
				titleParts.push(i18next.t('app:title'))
			}
			self.title = titleParts.join(' | ')
		},

		defaultTitle() {
			self.title = i18next.t('app:title')
		},
	}))
