import {
	Box,
	Heading,
	Image,
	SimpleGrid,
	Skeleton,
	Stack,
	Text,
} from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { useTranslation } from 'react-i18next'
import { ConsumerLogo } from '../../constants/consumers.const'
import { useMst } from '../../models/root'

export default observer(() => {
	const { t } = useTranslation('app')
	const {
		root: {
			pages: { consumers: page },
		},
	} = useMst()

	let heading = <Text>{t('pages.consumers.headings.title')}</Text>
	let content = (
		<>
			<Skeleton h={'20px'} />
			<Skeleton h={'20px'} />
			<Skeleton h={'20px'} />
		</>
	)

	if (!page.loading()) {
		content = (
			<>
				<SimpleGrid columns={{ base: 2, md: 4 }} gap={5}>
					{page.consumers().map((consumer) => (
						<Box boxShadow={'lg'} rounded={'lg'} p={5} key={consumer.id}>
							<Stack>
								<Image
									src={ConsumerLogo(consumer)}
									alt={consumer.name}
									h={10}
									w={10}
								/>
								<Text>{consumer.name}</Text>
							</Stack>
						</Box>
					))}
				</SimpleGrid>
			</>
		)
	}

	return (
		<Stack gap={2}>
			<Heading>{heading}</Heading>
			{content}
		</Stack>
	)
})
