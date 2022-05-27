import {
	Avatar,
	Box,
	Center,
	Divider,
	Grid,
	GridItem,
	Heading,
	HStack,
	Image,
	SimpleGrid,
	Skeleton,
	Stack,
	Stat,
	StatLabel,
	StatNumber,
	Text,
	Tooltip,
	useColorMode,
	VStack,
} from '@chakra-ui/react'
import makeBlockie from 'ethereum-blockies-base64'
import { observer } from 'mobx-react-lite'
import { useTranslation } from 'react-i18next'
import LineChart from '../../components/charts/LineChart'
import { AddressToConsumer } from '../../constants/consumers.const'
import { feedIcon, formatDateTime, prettyDuration } from '../../helpers/ui'
import { useMst } from '../../models/root'

export default observer(() => {
	const { t } = useTranslation('app')
	const {
		root: {
			pages: { feed: page },
		},
	} = useMst()
	const { colorMode } = useColorMode()

	let heading = <Text>{page.feedName()}</Text>
	let content = (
		<>
			<Skeleton h={'20px'} />
			<Skeleton h={'20px'} />
			<Skeleton h={'20px'} />
		</>
	)

	if (!page.loading()) {
		heading = (
			<HStack>
				<Image src={feedIcon(page.feedName())} alt={page.feedName()} w={10} />
				<Text>{page.feedName()}</Text>
			</HStack>
		)
		const options = page.lineChartOptions()
		content = (
			<>
				<SimpleGrid columns={{ base: 1, xl: 2 }} gap={5}>
					<Box
						rounded={'md'}
						boxShadow={{ base: 'lg' }}
						p={5}
						borderColor={colorMode === 'light' ? 'gray.200' : 'gray.600'}
						borderWidth={1}
					>
						<VStack alignItems={'start'}>
							<HStack gap={10}>
								<VStack alignItems={'start'}>
									<Stat>
										<StatLabel>Medianizer</StatLabel>
										<StatNumber>
											{page.latestMedianizerPrice().curValue}
										</StatNumber>
									</Stat>
									<Divider />
									<Stat>
										<StatLabel>Age</StatLabel>
										<StatNumber>
											{prettyDuration(
												new Date(),
												page.latestMedianizerPrice().age,
											)}
										</StatNumber>
									</Stat>
								</VStack>
								<VStack alignItems={'start'}>
									<Stat>
										<StatLabel>OSM</StatLabel>
										<StatNumber>
											{page.osm()?.length > 0 ? page.osm()[0].curValue : 'n/a'}
										</StatNumber>
									</Stat>
									<Divider />
									<Stat>
										<StatLabel>OSM next value</StatLabel>
										<StatNumber>
											{page.osm()?.length > 0 ? page.osm()[0].nextValue : 'n/a'}
										</StatNumber>
									</Stat>
								</VStack>
							</HStack>
							<Divider />
							<Box>
								<Text fontSize={'xs'}>Contract Address</Text>
								<Text fontSize={{ base: 'sm', md: 'xl' }}>{page.address}</Text>
							</Box>
						</VStack>
					</Box>
					<Box
						rounded={'md'}
						boxShadow={{ base: 'lg' }}
						p={5}
						borderColor={colorMode === 'light' ? 'gray.200' : 'gray.600'}
						borderWidth={1}
					>
						<Heading size={'sm'} p={5}>
							Oracles
						</Heading>
						<Grid
							templateColumns={{
								base: 'repeat(3, 1fr)',
								sm: 'repeat(3, 1fr)',
								md: 'repeat(5, 1fr)',
								xl: 'repeat(4, 1fr)',
							}}
							gap={2}
						>
							{page.oracles().map((oracle) => (
								<GridItem key={oracle.address} w="100%">
									<Center>
										<Box rounded={'md'} w={100} h={100}>
											<Center>
												<VStack>
													<Avatar src={makeBlockie(oracle.address)} />
													<Text textAlign={'center'} fontSize={'xs'}>
														{oracle.data[0].price.toFixed(2)}
													</Text>
													{/* <Text fontSize={'xs'} textAlign={'center'}>
														{prettyDuration(
															new Date(),
															new Date(oracle.data[0].date),
														)}
													</Text> */}
												</VStack>
											</Center>
										</Box>
									</Center>
								</GridItem>
							))}
						</Grid>
					</Box>
				</SimpleGrid>
				<Box
					rounded={'md'}
					boxShadow={{ base: 'lg' }}
					p={5}
					borderColor={colorMode === 'light' ? 'gray.200' : 'gray.600'}
					borderWidth={1}
				>
					<Heading size={'sm'} p={5}>
						History
					</Heading>
					<LineChart
						title={options.title}
						data={options.data}
						legend={options.legend}
					/>
				</Box>
				{page.medianizerConsumers().length > 0 &&
					Consumers({
						heading: `Medianizer Consumers`,
						consumers: page.medianizerConsumers(),
						colorMode,
					})}
				{page.osmConsumers().length > 0 &&
					Consumers({
						heading: `OSM Consumers`,
						consumers: page.osmConsumers(),
						colorMode,
					})}
			</>
		)
	}

	return (
		<Stack gap={1}>
			<Heading>{heading}</Heading>
			{content}
		</Stack>
	)
})

export function Consumers(options: {
	heading: string
	consumers: AddressToConsumer[]
	colorMode: string
}) {
	return (
		<Box
			rounded={'md'}
			boxShadow={{ base: 'lg' }}
			p={5}
			borderColor={options.colorMode === 'light' ? 'gray.200' : 'gray.600'}
			borderWidth={1}
		>
			<Heading size={'sm'} p={5}>
				{options.heading}
			</Heading>
			<SimpleGrid columns={{ base: 3, sm: 4, md: 5, lg: 6, xl: 9 }} gap={5}>
				{options.consumers.length > 0 ? (
					options.consumers.map((consumer) => {
						const src = consumer.anonymous
							? makeBlockie(consumer.address)
							: `/consumers/logos/${consumer.id}.png`
						return (
							<Center key={consumer.address}>
								<Tooltip label={`${consumer.address} (${consumer.name})`}>
									<Avatar size={'lg'} src={src} />
								</Tooltip>
							</Center>
						)
					})
				) : (
					<Text>No Consumers</Text>
				)}
			</SimpleGrid>
		</Box>
	)
}

export function OSM(options: {
	curValue: string
	nextValue: string
	nextTimestamp: string
}) {
	const timestamp = new Date(Number(`${options.nextTimestamp}000`))
	return (
		<HStack key={options.nextTimestamp}>
			<Text>Current Value: {options.curValue}</Text>
			<Text>Next Value: {options.nextValue}</Text>
			<Text>Next Timestamp: {formatDateTime(timestamp)}</Text>
		</HStack>
	)
}

export function Medianizer(options: { curValue: string; age: Date }) {
	return (
		<HStack>
			<Text>Current Value: {options.curValue}</Text>
			<Text>Age: {prettyDuration(new Date(), options.age)}</Text>
		</HStack>
	)
}
