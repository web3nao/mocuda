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
import { observer } from 'mobx-react-lite'
import { MobxRouter, startRouter } from 'mobx-router'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Helmet } from 'react-helmet'
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
	} = useMst()

	startRouter(routes, rootStore, {
		notfound: () => rootStore.router.goTo(routes.notFound),
	})

	return (
		<>
			<Helmet>
				{api.helmet.title ? <title>{api.helmet.title}</title> : null}
			</Helmet>
			<ChakraProvider>
				<Navbar />
				<Box p={4} minHeight={{ md: 'calc(100vh - 415px)' }}>
					<MobxRouter store={rootStore} />
				</Box>
			</ChakraProvider>
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
