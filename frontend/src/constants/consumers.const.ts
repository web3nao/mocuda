export interface AddressToConsumer {
	address: string
	id: string
	name: string
}

export const KNOWN_CONSUMERS: Array<{ address: string; name: string }> = [
	{
		address: '0xa580BBCB1Cee2BCec4De2Ea870D20a12A964819e',
		name: 'MakerDAO',
	},
	{
		address: '0x75ef8432566A79C86BBF207A47df3963B8Cf0753',
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
]

export const ADDRESS_TO_CONSUMER: Map<string, AddressToConsumer> = new Map<
	string,
	AddressToConsumer
>(
	KNOWN_CONSUMERS.map((consumer) => {
		const address = consumer.address.toLowerCase()
		const id = consumer.name.replaceAll(' ', '').toLowerCase()
		const name = consumer.name
		return [address, { address, id, name }]
	}),
)
