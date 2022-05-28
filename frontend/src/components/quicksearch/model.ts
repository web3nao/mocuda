import { types } from 'mobx-state-tree'
import { getRouter } from '../../models/helpers'
import routes from '../../routes'

export const SEARCH_ID = '_search_'

interface QuickSearchAction {
	id: string
	title: string
	subtitle?: string
	icon?: string
	action: () => {}
}

const ACTIONS: QuickSearchAction[] = []

export const QuickSearchActionModel = types.model({
	title: types.string,
	subtitle: types.maybe(types.string),
	icon: types.maybe(types.string),
	action: types.frozen<any>(),
})

export const QuickSearchComponent = types
	.model('QuickSearchComponent', {
		initStatus: types.optional(
			types.enumeration(['loading', 'init', 'success']),
			'init',
		),
		isOpen: types.optional(types.boolean, false),
		searchTerm: types.optional(types.string, ''),
		searchResults: types.array(types.string),
		selectedId: types.optional(types.string, SEARCH_ID),
	})
	.actions((self) => ({
		// INITIALIZATION
		initialise() {
			self.isOpen = false
			self.searchTerm = ''
			self.selectedId = SEARCH_ID
			if (!self.initStatus || self.initStatus === 'init') {
				self.initStatus = 'loading'
				window.addEventListener('keydown', (event: KeyboardEvent) => {
					this.act(event)
				})
				this.addAction({
					id: 'navigateHome',
					title: 'Home',
					subtitle: 'Go back to Home Screen',
					action: () => getRouter().goTo(routes.home),
				})

				self.initStatus = 'success'
			}
		},

		act(event: KeyboardEvent) {
			if (event.key === 'k' && event.ctrlKey) {
				event.preventDefault()
				this.open()
				return
			}
			if (event.key === 'ArrowDown') {
				if (self.selectedId === SEARCH_ID && self.searchResults.length > 0) {
					self.selectedId = self.searchResults[0]
				} else {
					const currentIndex = self.searchResults.indexOf(self.selectedId)
					if (currentIndex < self.searchResults.length - 1) {
						self.selectedId = self.searchResults[currentIndex + 1]
					}
				}
			}
			if (event.key === 'ArrowUp') {
				if (self.selectedId !== SEARCH_ID) {
					const currentIndex = self.searchResults.indexOf(self.selectedId)
					if (currentIndex > 0) {
						self.selectedId = self.searchResults[currentIndex - 1]
					} else {
						self.selectedId = SEARCH_ID
					}
				}
			}
			if (event.key === 'Enter') {
				const action = ACTIONS.find(
					(currentAction) => currentAction.id === self.selectedId,
				)
				if (action) {
					action.action()
				}
				this.close()
			}
		},

		addAction(action: QuickSearchAction) {
			ACTIONS.push(action)
		},

		updateSearchTerm(searchTerm: string) {
			self.searchTerm = searchTerm
			self.searchResults.clear()

			if (searchTerm.length === 0) {
				return
			}

			ACTIONS.forEach((action) => {
				if (
					action.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
					(action.subtitle &&
						action.subtitle.toLowerCase().includes(searchTerm.toLowerCase()))
				) {
					self.searchResults.push(action.id)
				}
			})
		},

		open() {
			self.selectedId = SEARCH_ID
			self.searchTerm = ''
			self.searchResults.clear()
			self.isOpen = true
		},

		close() {
			self.isOpen = false
		},
	}))
	.views((self) => ({
		getSearchResults() {
			const actions: QuickSearchAction[] = []
			for (const searchResult of self.searchResults) {
				const action = ACTIONS.find((action) => action.id === searchResult)
				if (action) {
					actions.push(action)
				}
			}
			return actions
		},
	}))
