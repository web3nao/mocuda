import { RepeatClockIcon, StarIcon, TimeIcon } from '@chakra-ui/icons'
import {
	Box,
	Button,
	Center,
	Grid,
	GridItem,
	Heading,
	List,
	ListIcon,
	ListItem,
	Skeleton,
	Stack,
	Text,
} from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { Instance } from 'mobx-state-tree'
import { useTranslation } from 'react-i18next'
import { BASE_COLOR } from '../../constants/style.const'
import { formatDateTime } from '../../helpers/ui'
import { EventCounter } from '../../models/api/subgraphlite'
import { useMst } from '../../models/root'
import routes from '../../routes'

export default observer(() => {
	const { t } = useTranslation('app')
	const {
		root: {
			pages: { home: page },
		},
		router,
	} = useMst()

	const feedItem = (feed: Instance<typeof EventCounter>) => (
		<Center py={6}>
			<Box
				maxW={'330px'}
				w={'full'}
				boxShadow={'2xl'}
				rounded={'md'}
				overflow={'hidden'}
			>
				<Stack textAlign={'center'} p={6} align={'center'}>
					<Stack direction={'column'} align={'center'} justify={'center'}>
						<Text fontSize={'3xl'} fontWeight={800}>
							{feed.name}
						</Text>
						<Text fontSize={'2xl'} fontWeight={800}>
							{feed.latestValue}
						</Text>
					</Stack>
				</Stack>

				<Box px={6} py={6}>
					<List spacing={3}>
						<ListItem>
							<ListIcon as={TimeIcon} color={BASE_COLOR(400)} />
							{formatDateTime(feed.latest)}
						</ListItem>
						<ListItem>
							<ListIcon as={RepeatClockIcon} color={BASE_COLOR(400)} />
							{feed.count}
						</ListItem>
						<ListItem>
							<ListIcon as={StarIcon} color={BASE_COLOR(400)} />
							{formatDateTime(feed.first)}
						</ListItem>
					</List>

					<Button
						mt={10}
						w={'full'}
						bg={BASE_COLOR(400)}
						color={'white'}
						rounded={'xl'}
						boxShadow={'0 5px 20px 0px rgb(72 187 120 / 43%)'}
						_hover={{
							bg: BASE_COLOR(500),
						}}
						_focus={{
							bg: BASE_COLOR(500),
						}}
						onClick={() => router.goTo(routes.feed, { address: feed.id })}
					>
						{t('pages.home.actions.feedDetails')}
					</Button>
				</Box>
			</Box>
		</Center>
	)

	let content = (
		<Stack gap={1}>
			<Skeleton h={'20px'} />
			<Skeleton h={'20px'} />
			<Skeleton h={'20px'} />
		</Stack>
	)

	if (!page.loading()) {
		const feedGroups = [
			{
				id: 'activeFeeds',
				heading: t('pages.home.headings.active'),
				feeds: page.feeds().activeFeeds,
			},
			{
				id: 'deadFeeds',
				heading: t('pages.home.headings.dead'),
				feeds: page.feeds().deadFeeds,
			},
		]
		content = (
			<>
				{feedGroups.map((feedGroup) => (
					<Stack key={feedGroup.id}>
						<Heading>{feedGroup.heading}</Heading>
						<Grid
							templateColumns={{
								base: 'repeat(2, 1fr)',
								md: 'repeat(3, 1fr)',
								xl: 'repeat(5, 1fr)',
							}}
							gap={6}
						>
							{feedGroup.feeds.map((feed) => (
								<GridItem key={feed.id} w="100%">
									{feedItem(feed)}
								</GridItem>
							))}
						</Grid>
					</Stack>
				))}
			</>
		)
	}

	return content
})
