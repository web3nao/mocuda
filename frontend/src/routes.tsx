import { Route } from 'mobx-router'
import { RootStore } from './models/root'
import NotFoundPage from './pages/404/page'
import FeedsPage from './pages/feeds/page'

export default {
	home: new Route<RootStore>({
		path: '/',
		component: <FeedsPage />,
		onEnter(_route, _parameters, { root: { pages } }) {
			pages.feeds.initialisePage()
		},
	}),

	notFound: new Route<RootStore>({
		path: '/404',
		component: <NotFoundPage />,
		onEnter(_route, _parameters, { root: { pages } }) {
			pages.notFound.initialisePage()
		},
	}),
}
