export interface AddressToConsumer {
	address: string
	id: string
	name: string
	anonymous: boolean
}

export function getAnonymousConsumer(address: string): AddressToConsumer {
	return {
		address,
		id: 'anonymous',
		name: 'Anonymous',
		anonymous: true,
	}
}

export const KNOWN_CONSUMERS: Array<{ address: string; name: string }> = [
	{
		address: '0x2325aa20deaa9770a978f1dc7c073589ffc79dc3',
		name: 'B Protocol',
	},
	{
		address: '0x12ee7e3369272cee4e9843f36331561dbf9ae6b4',
		name: 'MCDEX',
	},
	{
		address: '0x65c79fcb50ca1594b025960e539ed7a9a6d434a3',
		name: 'MakerDAO',
	},
	{
		address: '0x70adcbaa7cd000973c37c9368f2d299f56f82442',
		name: 'MakerDAO',
	},
	{
		address: '0xa580BBCB1Cee2BCec4De2Ea870D20a12A964819e',
		name: 'MakerDAO',
	},
	{
		address: '0x75ef8432566A79C86BBF207A47df3963B8Cf0753',
		name: 'dYdX',
	},
	{
		address: '0x538038e526517680735568f9c5342c6e68bbda12',
		name: 'dYdX',
	},
	{
		address: '0xD27Fa2361bC2CfB9A591fb289244C538E190684B',
		name: '0x',
	},
	{
		address: '0x60da93D9903cb7d3eD450D4F81D402f7C4F71dd9',
		name: 'Gnosis',
	},
	{
		address: '0xd5885fbcb9a8a8244746010a3bc6f1c6e0269777',
		name: 'Gnosis',
	},
	{
		address: '0x71eCFF5261bAA115dcB1D9335c88678324b8A987',
		name: 'Etherscan',
	},
	{
		address: '0x77eb6cf8d732fe4d92c427fcdd83142db3b742f7',
		name: 'Gitcoin',
	},
	{
		address: '0xD09506dAC64aaA718b45346a032F934602e29cca',
		name: 'Kyber Network',
	},
	{
		address: '0xe1bdeb1f71b1cd855b95d4ec2d1bfdc092e00e4f',
		name: 'Kyber Network',
	},
	{
		address: '0x8ff6a38A1CD6a42cAac45F08eB0c802253f68dfD',
		name: 'Infura',
	},
	{
		address: '0x130431b4560Cd1d74A990AE86C337a33171FF3c6',
		name: 'Argent',
	},
	{
		address: '0x3cb645a8f10fb7b0721eabae958f77a878441cb9',
		name: 'MyCrypto',
	},
	{
		address: '0xd72ba9402e9f3ff01959d6c841ddd13615ffff42',
		name: 'DeFi Saver',
	},
	{
		address: '0xeaa474cbffa87ae0f1a6f68a3aba6c77c656f72c',
		name: 'DeFi Saver',
	},
	{
		address: '0xcf63089a8ad2a9d8bd6bb8022f3190eb7e1ed0f1',
		name: 'Yearn',
	},
	{
		address: '0x82c93333e4e295aa17a05b15092159597e823e8a',
		name: 'Yearn',
	},
	{
		address: '0x4935b1188eb940c39e22172cc5fe595e267706a1',
		name: 'DDEX',
	},
]

export const ADDRESS_TO_CONSUMER: Map<string, AddressToConsumer> = new Map<
	string,
	AddressToConsumer
>(
	KNOWN_CONSUMERS.map((consumer) => {
		const address = consumer.address.toLowerCase()
		const id = consumer.name.replaceAll(' ', '').toLowerCase()
		const name = consumer.name
		const anonymous = false
		return [address, { address, id, name, anonymous }]
	}),
)
