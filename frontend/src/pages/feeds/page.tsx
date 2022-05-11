import { Heading, ListItem, UnorderedList } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { useTranslation } from 'react-i18next'
import { formatDateTime } from '../../helpers/ui'
import { useMst } from '../../models/root'

export default observer(() => {
	const { t } = useTranslation('app')
	const {
		root: {
			pages: { feeds: page },
		},
	} = useMst()

	let content = <>Loading</>

	if (!page.loading()) {
		content = (
			<>
				<Heading>{t('pages.feeds.titles.feeds')}</Heading>
				<UnorderedList>
					{page.feeds().map((feed) => (
						<ListItem key={feed}>{feed}</ListItem>
					))}
				</UnorderedList>

				<Heading>{t('pages.feeds.titles.pairs')}</Heading>
				<UnorderedList>
					{page.pairs().map((pair) => (
						<ListItem key={pair}>{pair}</ListItem>
					))}
				</UnorderedList>

				<Heading>{t('pages.feeds.titles.eventCounters')}</Heading>
				<UnorderedList>
					{page.eventCounters().map((eventCounter) => (
						<ListItem key={eventCounter.id}>
							{eventCounter.name} | {eventCounter.id}, count:{' '}
							{eventCounter.count}, first Event:{' '}
							{formatDateTime(eventCounter.first)}, latest Event:{' '}
							{formatDateTime(eventCounter.latest)}
						</ListItem>
					))}
				</UnorderedList>
			</>
		)
	}

	return content
})
