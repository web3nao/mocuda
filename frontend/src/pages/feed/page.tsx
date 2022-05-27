import {
	Avatar,
	Box,
	Center,
	Grid,
	GridItem,
	Heading,
	HStack,
	Skeleton,
	Stack,
	Text,
	Tooltip,
} from '@chakra-ui/react'
import makeBlockie from 'ethereum-blockies-base64'
import { observer } from 'mobx-react-lite'
import { useTranslation } from 'react-i18next'
import LineChart from '../../components/charts/LineChart'
import { AddressToConsumer } from '../../constants/consumers.const'
import { BASE_COLOR } from '../../constants/style.const'
import { formatDateTime, prettyDuration } from '../../helpers/ui'
import { useMst } from '../../models/root'

export default observer(() => {
	const { t } = useTranslation('app')
	const {
		root: {
			pages: { feed: page },
		},
	} = useMst()

	let heading = page.address
	let content = (
		<>
			<Skeleton h={'20px'} />
			<Skeleton h={'20px'} />
			<Skeleton h={'20px'} />
		</>
	)

	if (!page.loading()) {
		heading = page.feedName()
		const options = page.lineChartOptions()
		content = (
			<>
				{Consumers({
					heading: `Medianizer`,
					consumers: page.medianizerConsumers(),
				})}
				{Medianizer({
					curValue: String(page.latestMedianizerPrice().curValue),
					age: page.latestMedianizerPrice().age,
				})}
				{Consumers({ heading: `OSM`, consumers: page.osmConsumers() })}
				{page.osm().map((osm) => {
					return OSM({
						curValue: osm.curValue,
						nextValue: osm.nextValue,
						nextTimestamp: osm.nextTimestamp,
					})
				})}
				<LineChart
					title={options.title}
					data={options.data}
					legend={options.legend}
				/>
				<Grid
					templateColumns={{
						base: 'repeat(3, 1fr)',
						md: 'repeat(5, 1fr)',
						xl: 'repeat(5, 1fr)',
					}}
					gap={6}
				>
					{page.oracles().map((oracle) => (
						<GridItem key={oracle.address} w="100%">
							<Center>
								<Box
									rounded={'md'}
									borderColor={BASE_COLOR(500)}
									borderWidth={1}
									w={100}
									h={100}
								>
									<Center>
										<Stack>
											<Text textAlign={'center'}>
												{oracle.data[0].price.toFixed(2)}
											</Text>
											<Text textAlign={'center'}>
												{oracle.address.substring(0, 6)}...
											</Text>
											<Text fontSize={'xs'} textAlign={'center'}>
												{prettyDuration(
													new Date(),
													new Date(oracle.data[0].date),
												)}
											</Text>
										</Stack>
									</Center>
								</Box>
							</Center>
						</GridItem>
					))}
				</Grid>
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
}) {
	return (
		<>
			<Heading size={'sm'}>{options.heading}</Heading>
			<HStack>
				{options.consumers.length > 0 ? (
					options.consumers.map((consumer) => {
						const src = consumer.anonymous
							? makeBlockie(consumer.address)
							: `/consumers/logos/${consumer.id}.png`
						return (
							<Tooltip
								key={consumer.address}
								label={`${consumer.address} (${consumer.name})`}
							>
								<Avatar size={'sm'} src={src} />
							</Tooltip>
						)
					})
				) : (
					<Text>No Consumers</Text>
				)}
			</HStack>
		</>
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
