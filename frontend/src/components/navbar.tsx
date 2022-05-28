import { Container, HStack, Img, Kbd } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { Link } from 'mobx-router'
import { useTranslation } from 'react-i18next'
import { useMst } from '../models/root'
import routes from '../routes'
import {
	Text,
	Box,
	Flex,
	Avatar,
	Button,
	Menu,
	MenuButton,
	MenuList,
	MenuItem,
	MenuDivider,
	useDisclosure,
	useColorModeValue,
	Stack,
	useColorMode,
	Center,
} from '@chakra-ui/react'
import { MoonIcon, SearchIcon, SunIcon } from '@chakra-ui/icons'
import { BASE_COLOR } from '../constants/style.const'

export default observer(() => {
	const { t } = useTranslation('app')
	const {
		router,
		root: {
			components: { quickSearch },
		},
	} = useMst()

	const { colorMode, toggleColorMode } = useColorMode()

	return (
		<div>
			<Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
				<Container maxW="6xl">
					<Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
						<Box>
							<Link route={routes.home as any} router={router as any}>
								<HStack>
									<Img src={'/logo.webp'} h={10} />
									<Text>{t('title')}</Text>
								</HStack>
							</Link>
						</Box>

						<Flex alignItems={'center'}>
							<Stack direction={'row'} spacing={7}>
								<Button onClick={quickSearch.open}>
									<SearchIcon />
								</Button>
								<HStack display={{ base: 'none', md: 'inline-flex' }}>
									<Kbd>ctrl</Kbd> <Text>+</Text> <Kbd>k</Kbd>
								</HStack>

								<Button onClick={toggleColorMode}>
									{colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
								</Button>

								<Button
									display={{ base: 'none', md: 'inline-flex' }}
									fontSize={'sm'}
									fontWeight={600}
									color={'black'}
									bg={BASE_COLOR(400)}
									_hover={{
										bg: BASE_COLOR(300),
									}}
								>
									{t('navbar.actions.request')}
								</Button>
							</Stack>
						</Flex>
					</Flex>
				</Container>
			</Box>
		</div>
	)
})
