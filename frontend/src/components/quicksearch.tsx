import { Box, Text, useColorMode } from '@chakra-ui/react'
import {
	KBarAnimator,
	KBarPortal,
	KBarPositioner,
	KBarProvider,
	KBarResults,
	KBarSearch,
	useMatches,
} from 'kbar'
import { observer } from 'mobx-react-lite'
import { useTranslation } from 'react-i18next'
import { useMst } from '../models/root'
import routes from '../routes'

export default observer(() => {
	const { t } = useTranslation('app')
	const {
		router,
		root: { api },
	} = useMst()

	let content = null

	if (api.subgraphLite.eventCounters.length > 0) {
		const actions = api.subgraphLite.eventCounters.map((eventCounter) => {
			return {
				id: eventCounter.id,
				name: eventCounter.name,
				keywords: eventCounter.name,
				perform: () => router.goTo(routes.feed, { address: eventCounter.id }),
			}
		})
		content = (
			<KBarProvider actions={actions}>
				<KBarPortal>
					<KBarPositioner>
						<KBarAnimator>
							<KBarSearch className="m-2" />
							<RenderResults />
						</KBarAnimator>
					</KBarPositioner>
				</KBarPortal>
			</KBarProvider>
		)
	}

	return content
})

function RenderResults() {
	const { results } = useMatches()
	const { colorMode } = useColorMode()

	const backgroundColor = colorMode === 'light' ? 'white' : '#1A202B'
	const color = colorMode === 'light' ? 'black' : 'white'

	return (
		<KBarResults
			items={results}
			onRender={({ item, active }) => {
				const label = typeof item === 'string' ? item : item.name
				return (
					<Box bg={active ? '#eee' : backgroundColor} p={1}>
						<Text>{label}</Text>
					</Box>
				)
			}}
		/>
	)
}
