import { CopyIcon } from '@chakra-ui/icons'
import { Button } from '@chakra-ui/react'

export default (props: { toCopy: string }) => {
	return (
		<Button
			size={'xs'}
			mx={1}
			onClick={() => navigator.clipboard.writeText(props.toCopy)}
		>
			<CopyIcon />
		</Button>
	)
}
