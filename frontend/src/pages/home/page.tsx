import {
	Box,
	Heading,
	HStack,
	Image,
	SimpleGrid,
	Skeleton,
	Stack,
	Text,
	useColorMode,
	VStack,
} from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { Instance } from 'mobx-state-tree'
import { useTranslation } from 'react-i18next'
import { feedIcon, prettyDuration } from '../../helpers/ui'
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
	const { colorMode } = useColorMode()

	const feedItem = (feed: Instance<typeof EventCounter>) => {
		const FeedIconName = () => (
			<>
				<HStack display={{ base: 'inline-flex', sm: 'none' }}>
					<Image src={feedIcon(feed.name)} alt={feed.name} w={5} />
					<VStack alignItems={'start'}>
						<Text>{feed.name}</Text>
						<Text fontSize={'xs'}>
							{prettyDuration(new Date(), feed.latest)}
						</Text>
					</VStack>
				</HStack>
				<HStack display={{ base: 'none', sm: 'inline-flex' }}>
					<Image src={feedIcon(feed.name)} alt={feed.name} w={5} />
					<Text>{feed.name}</Text>
				</HStack>
			</>
		)
		const value = feed.latestValue.substring(0, 10)
		return (
			<Box
				boxShadow={'lg'}
				m={5}
				p={3}
				rounded={'md'}
				onClick={() => router.goTo(routes.feed, { address: feed.name })}
				cursor={'pointer'}
				key={feed.id}
				borderColor={colorMode === 'light' ? 'gray.200' : 'gray.600'}
				borderWidth={1}
			>
				<SimpleGrid columns={{ base: 2, sm: 3 }}>
					<FeedIconName />
					<Text>{value}</Text>
					<Text display={{ base: 'none', sm: 'inline-flex' }}>
						{prettyDuration(new Date(), feed.latest)}
					</Text>
				</SimpleGrid>
			</Box>
		)
	}

	let content = (
		<Stack gap={1}>
			<Skeleton h={'20px'} />
			<Skeleton h={'20px'} />
			<Skeleton h={'20px'} />
		</Stack>
	)

	if (!page.loading()) {
		const inactiveFeedCountPerColumn =
			page.feeds().deadFeeds.length % 2 === 1
				? Math.floor(page.feeds().deadFeeds.length / 2) + 1
				: page.feeds().deadFeeds.length / 2
		content = (
			<>
				<SimpleGrid columns={{ base: 1, lg: 2 }}>
					<Box>
						<Heading size={'md'}>{t('pages.home.headings.popular')}</Heading>
						{page
							.feeds()
							.popularFeeds.slice(0, 5)
							.map((feed) => feedItem(feed))}
					</Box>
					<Box>
						<Heading size={'md'}>{t('pages.home.headings.recent')}</Heading>
						{page
							.feeds()
							.recentFeeds.slice(0, 5)
							.map((feed) => feedItem(feed))}
					</Box>
				</SimpleGrid>
				<Heading size={'md'}>{t('pages.home.headings.inactive')}</Heading>
				<SimpleGrid columns={{ base: 1, lg: 2 }}>
					<Box>
						{page
							.feeds()
							.deadFeeds.slice(0, inactiveFeedCountPerColumn)
							.map((feed) => feedItem(feed))}
					</Box>
					<Box>
						{page
							.feeds()
							.deadFeeds.slice(inactiveFeedCountPerColumn)
							.map((feed) => feedItem(feed))}
					</Box>
				</SimpleGrid>
			</>
		)
	}

	return (
		<Stack gap={2}>
			<Heading mb={2}>{t('pages.home.headings.title')}</Heading>
			{content}
		</Stack>
	)
})
