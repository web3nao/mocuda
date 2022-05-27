import { Box, ChakraProvider } from '@chakra-ui/react'
import {
	CategoryScale,
	Chart as ChartJS,
	Filler,
	Legend,
	LinearScale,
	LineElement,
	PointElement,
	Title,
	Tooltip,
} from 'chart.js'
import {
	KBarAnimator,
	KBarPortal,
	KBarPositioner,
	KBarProvider,
	KBarSearch,
	KBarResults,
	useMatches,
	NO_GROUP,
} from 'kbar'
import { observer } from 'mobx-react-lite'
import { MobxRouter, startRouter } from 'mobx-router'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import Navbar from './components/navbar'
import events, { LogLevel } from './events/events'
import './i18n/config'
import './index.scss'
import { Provider, rootStore, useMst } from './models/root'
import routes from './routes'

export const LOGLEVEL = import.meta.env.VITE_LOGLEVEL
	? (String(import.meta.env.VITE_LOGLEVEL) as LogLevel)
	: 'off'
events.init(LOGLEVEL)

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Filler,
	Title,
	Tooltip,
	Legend,
)

const App = observer(() => {
	const {
		root: { api },
		router,
	} = useMst()

	startRouter(routes, rootStore, {
		notfound: () => rootStore.router.goTo(routes.notFound),
	})

	let app = (
		<ChakraProvider>
			<Navbar />
			<Box p={4} minHeight={{ md: 'calc(100vh - 415px)' }}>
				<MobxRouter store={rootStore} />
			</Box>
		</ChakraProvider>
	)

	if (api.subgraphLite.eventCounters.length > 0) {
		const actions = api.subgraphLite.eventCounters.map((eventCounter) => {
			return {
				id: eventCounter.id,
				name: eventCounter.name,
				keywords: eventCounter.name,
				perform: () => router.goTo(routes.feed, { address: eventCounter.id }),
			}
		})
		app = (
			<KBarProvider actions={actions}>
				<KBarPortal>
					<KBarPositioner>
						<KBarAnimator>
							<KBarSearch className="m-2" />
							<RenderResults />
						</KBarAnimator>
					</KBarPositioner>
				</KBarPortal>
				<ChakraProvider>
					<Navbar />
					<Box p={4} minHeight={{ md: 'calc(100vh - 415px)' }}>
						<MobxRouter store={rootStore} />
					</Box>
				</ChakraProvider>
			</KBarProvider>
		)
	}

	return (
		<>
			<HelmetProvider>
				<Helmet>
					{api.helmet.title ? <title>{api.helmet.title}</title> : null}
				</Helmet>
			</HelmetProvider>
			{app}
		</>
	)
})

const container = document.getElementById('root')
if (container) {
	const root = createRoot(container)
	root.render(
		<StrictMode>
			<Provider value={rootStore}>
				<App />
			</Provider>
		</StrictMode>,
	)
}

function RenderResults() {
	const { results } = useMatches()

	return (
		<KBarResults
			items={results}
			onRender={({ item, active }) =>
				typeof item === 'string' ? (
					<div>{item}</div>
				) : (
					<Box bg={active ? '#eee' : 'white'} p={1}>
						{item.name}
					</Box>
				)
			}
		/>
	)
}
