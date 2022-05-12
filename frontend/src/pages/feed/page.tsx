import { Heading, Skeleton, Stack } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { useTranslation } from 'react-i18next'
import { formatDateTime } from '../../helpers/ui'
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
		content = (
			<>
				{page.medianPrices().map((price) => (
					<p>
						{formatDateTime(price.age)} | {price.latestValue}
					</p>
				))}
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
