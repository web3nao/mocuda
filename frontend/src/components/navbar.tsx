import { HStack } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { Link } from 'mobx-router'
import { useTranslation } from 'react-i18next'
import { useMst } from '../models/root'
import routes from '../routes'
import {
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
import { MoonIcon, SunIcon } from '@chakra-ui/icons'

export default observer(() => {
	const { t } = useTranslation('app')
	const {
		router,
		root: {},
	} = useMst()

	const { colorMode, toggleColorMode } = useColorMode()

	return (
		<div>
			<Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
				<Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
					<Box>{t('title')}</Box>

					<Flex alignItems={'center'}>
						<Stack direction={'row'} spacing={7}>
							<Button onClick={toggleColorMode}>
								{colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
							</Button>

							<Button
								display={{ base: 'none', md: 'inline-flex' }}
								fontSize={'sm'}
								fontWeight={600}
								color={'black'}
								bg={'green.400'}
								_hover={{
									bg: 'green.300',
								}}
							>
								{t('navbar.actions.request')}
							</Button>
						</Stack>
					</Flex>
				</Flex>
			</Box>
		</div>
	)
})
