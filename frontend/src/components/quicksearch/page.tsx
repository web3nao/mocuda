import {
	Box,
	Button,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Tag,
	Text,
} from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { useTranslation } from 'react-i18next'
import { useMst } from '../../models/root'
import { SEARCH_ID } from './model'

export default observer(() => {
	const { t } = useTranslation('app')
	const {
		root: {
			components: { quickSearch: component },
		},
	} = useMst()

	return (
		<Modal isOpen={component.isOpen} onClose={component.close}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>
					<Input
						placeholder="Type to search"
						value={component.searchTerm}
						onChange={(event) => component.updateSearchTerm(event.target.value)}
					/>
				</ModalHeader>
				<ModalBody>
					{component.getSearchResults().map((action) => {
						return (
							<Box
								bg={component.selectedId === action.id ? 'pink.300' : undefined}
								p={2}
								rounded={'md'}
								key={action.id}
								onClick={action.action}
								cursor={'pointer'}
								_hover={{ bg: 'pink.300' }}
							>
								<Text>
									{action.title}
									{action.tag && (
										<Tag size={'sm'} ml={2}>
											{action.tag}
										</Tag>
									)}
								</Text>
								{action.subtitle && (
									<Text fontSize={'xs'}>{action.subtitle}</Text>
								)}
							</Box>
						)
					})}
				</ModalBody>
			</ModalContent>
		</Modal>
	)
})
