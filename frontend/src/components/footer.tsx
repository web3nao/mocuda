import {
	Box,
	Container,
	Flex,
	Image,
	Link,
	SimpleGrid,
	Stack,
	Text,
	useColorModeValue,
} from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useMst } from '../models/root'

const ListHeader = ({ children }: { children: ReactNode }) => {
	return (
		<Text fontWeight={'500'} fontSize={'lg'} mb={2}>
			{children}
		</Text>
	)
}

export default observer(() => {
	const { t } = useTranslation('app')
	const { router } = useMst()

	const navKey = (section: string, label: string) => {
		return `${section}-${label.replaceAll(' ', '-').toLowerCase()}`
	}

	const navigation = [
		{
			label: t('footer.developers.title'),
			links: [
				{
					label: t('footer.developers.docs'),
					href: '#',
				},
				{
					label: t('footer.developers.resources'),
					href: '#',
				},
				{
					label: t('footer.developers.feeds'),
					href: '#',
				},
				{
					label: t('footer.developers.contractReference'),
					href: '#',
				},
			],
		},
		{
			label: t('footer.solutions.title'),
			links: [
				{
					label: t('footer.solutions.overview'),
					href: '#',
				},
				{
					label: t('footer.solutions.defi'),
					href: '#',
				},
			],
		},
		{
			label: t('footer.community.title'),
			links: [
				{
					label: t('footer.community.overview'),
					href: '#',
				},
				{
					label: t('footer.community.grantProgram'),
					href: '#',
				},
				{
					label: t('footer.community.events'),
					href: '#',
				},
			],
		},
		{
			label: t('footer.ocu.title'),
			links: [
				{
					label: t('footer.ocu.ecosystem'),
					href: '#',
				},
				{
					label: t('footer.ocu.blog'),
					href: '#',
				},
				{
					label: t('footer.ocu.team'),
					href: '#',
				},
				{
					label: t('footer.ocu.faqs'),
					href: '#',
				},
			],
		},
		{
			label: t('footer.contact.title'),
			links: [
				{
					label: t('footer.contact.security'),
					href: '#',
				},
				{
					label: t('footer.contact.support'),
					href: '#',
				},
				{
					label: t('footer.contact.talkExpert'),
					href: '#',
				},
			],
		},
		{
			label: t('footer.social.title'),
			links: [
				{
					label: t('footer.social.twitter'),
					href: '#',
				},
				{
					label: t('footer.social.discord'),
					href: '#',
				},
			],
		},
	]

	return (
		<Box
			bg={useColorModeValue('gray.50', 'gray.900')}
			color={useColorModeValue('gray.700', 'gray.200')}
		>
			<Container as={Stack} maxW={'6xl'} py={10}>
				<SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={8}>
					{navigation.map((section, index) => (
						<Stack
							align={'flex-start'}
							key={navKey(`section-${index}`, section.label)}
						>
							<ListHeader>{section.label}</ListHeader>
							{section.links.map((link) => (
								<Link
									href={link.href}
									key={navKey(`section-${index}`, link.label)}
								>
									{link.label}
								</Link>
							))}
						</Stack>
					))}
				</SimpleGrid>
			</Container>
			<Box py={10}>
				<Flex
					align={'center'}
					_before={{
						content: '""',
						borderBottom: '1px solid',
						borderColor: useColorModeValue('gray.200', 'gray.700'),
						flexGrow: 1,
						mr: 8,
					}}
					_after={{
						content: '""',
						borderBottom: '1px solid',
						borderColor: useColorModeValue('gray.200', 'gray.700'),
						flexGrow: 1,
						ml: 8,
					}}
				>
					<Image src={'/logo.png'} alt={'mocuda'} w={10} h={10} />
				</Flex>
				<Text pt={6} fontSize={'sm'} textAlign={'center'}>
					© {new Date().getFullYear()} {t('footer.copyright')}
				</Text>
			</Box>
		</Box>
	)
})
