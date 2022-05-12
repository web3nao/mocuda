import { Route } from 'mobx-router'
import { RootStore } from './models/root'
import NotFoundPage from './pages/404/page'
import FeedPage from './pages/feed/page'
import HomePage from './pages/home/page'

export default {
	home: new Route<RootStore>({
		path: '/',
		component: <HomePage />,
		onEnter(_route, _parameters, { root: { pages } }) {
			pages.home.initialisePage()
		},
	}),

	feed: new Route<RootStore>({
		path: '/feed/:address',
		component: <FeedPage />,
		onEnter(_route, parameters, { root: { pages } }) {
			const address = (parameters as any).address
			pages.feed.initialisePage(address)
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
