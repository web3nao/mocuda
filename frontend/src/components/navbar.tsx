import { MoonIcon, SearchIcon, SunIcon, HamburgerIcon } from '@chakra-ui/icons'
import {
	Avatar,
	Box,
	Button,
	Container,
	Flex,
	HStack,
	Img,
	Kbd,
	Link,
	Menu,
	MenuButton,
	MenuDivider,
	MenuItem,
	MenuList,
	Stack,
	Text,
	useColorMode,
	useColorModeValue,
} from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
// import { Link } from 'mobx-router'
import { useTranslation } from 'react-i18next'
import { BASE_COLOR } from '../constants/style.const'
import { useMst } from '../models/root'
import routes from '../routes'

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
						<HStack>
							<HStack>
								<Link onClick={() => router.goTo(routes.home)}>
									<Img src={'/logo100.webp'} h={10} alt="logo" />
								</Link>
								<Button
									colorScheme="blue"
									variant="ghost"
									onClick={() => router.goTo(routes.home)}
								>
									{t('title')}
								</Button>
							</HStack>

							<Box display={{ base: 'none', md: 'inline-flex' }}>
								<Button
									colorScheme="blue"
									variant="ghost"
									onClick={() => router.goTo(routes.consumers)}
								>
									{t('pages.consumers.headings.title')}
								</Button>
							</Box>
						</HStack>

						<Flex alignItems={'center'}>
							<Stack direction={'row'} spacing={5}>
								<Button onClick={quickSearch.open}>
									<SearchIcon />
									<HStack ml={2} display={{ base: 'none', md: 'inline-flex' }}>
										<Kbd>ctrl</Kbd> <Text>+</Text> <Kbd>k</Kbd>
									</HStack>
								</Button>

								<Button onClick={toggleColorMode}>
									{colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
								</Button>

								<Button
									colorScheme="blue"
									variant="outline"
									display={{ base: 'none', md: 'inline-flex' }}
								>
									{t('navbar.actions.request')}
								</Button>

								<Flex
									alignItems={'center'}
									display={{ base: 'inline-flex', md: 'none' }}
								>
									<Menu>
										<MenuButton
											as={Button}
											rounded={'full'}
											variant={'link'}
											cursor={'pointer'}
											minW={0}
										>
											<HamburgerIcon />
										</MenuButton>
										<MenuList>
											<MenuItem>{t('navbar.actions.request')}</MenuItem>
											<MenuDivider />
											<MenuItem onClick={() => router.goTo(routes.consumers)}>
												{t('pages.consumers.headings.title')}
											</MenuItem>
										</MenuList>
									</Menu>
								</Flex>
							</Stack>
						</Flex>
					</Flex>
				</Container>
			</Box>
		</div>
	)
})
