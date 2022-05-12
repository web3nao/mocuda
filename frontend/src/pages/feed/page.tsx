import {
	Box,
	Center,
	Grid,
	GridItem,
	Heading,
	Skeleton,
	Stack,
	Text,
} from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { useTranslation } from 'react-i18next'
import LineChart from '../../components/charts/LineChart'
import { BASE_COLOR } from '../../constants/style.const'
import { prettyDuration } from '../../helpers/ui'
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
