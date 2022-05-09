import { Heading, ListItem, UnorderedList } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { useTranslation } from 'react-i18next'
import { useMst } from '../../models/root'

export default observer(() => {
	const { t } = useTranslation('app')
	const {
		root: {
			pages: { feeds: page },
		},
	} = useMst()

	return (
		<>
			<Heading>{t('pages.feeds.titles.feeds')}</Heading>
			<UnorderedList>
				{page.feeds().map((feed) => (
					<ListItem>{feed}</ListItem>
				))}
			</UnorderedList>

			<Heading>{t('pages.feeds.titles.pairs')}</Heading>
			<UnorderedList>
				{page.pairs().map((pair) => (
					<ListItem>{pair}</ListItem>
				))}
			</UnorderedList>
		</>
	)
})
