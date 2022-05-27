import { DAY, HOUR, MINUTE, SECOND } from '../constants/duration.const'

export const formatDateTime = (date: Date) => {
	return Intl.DateTimeFormat('en-US', {
		hour12: true,
		day: '2-digit',
		month: 'long',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	}).format(date)
}

export const formatDate = (date: Date) => {
	return Intl.DateTimeFormat('en-US', {
		day: '2-digit',
		month: 'long',
		year: 'numeric',
	}).format(date)
}

export const prettyDuration = (ts1: Date, ts2: Date) => {
	const milliseconds = Math.abs(ts1.getTime() - ts2.getTime())
	if (milliseconds < SECOND) {
		return 'Just now'
	}
	if (milliseconds < MINUTE) {
		return `${(milliseconds / SECOND).toFixed(0)} sec ago`
	}
	if (milliseconds < HOUR) {
		return `${(milliseconds / MINUTE).toFixed(0)} min ago`
	}
	if (milliseconds < DAY) {
		return `${(milliseconds / HOUR).toFixed(0)} h ago`
	}
	return 'More than a day ago'
}

export function convertStringToDecimal(
	value: string,
	precision: number,
): number {
	const splitted = value.split('').reverse()
	if (splitted.length < precision) {
		for (let i = 0; i < precision - splitted.length; i++) {
			splitted.push('0')
		}
	}
	const updatedValue = []

	for (let index = 0; index < splitted.length; index++) {
		updatedValue.push(splitted[index])
		if (index === precision - 1) {
			updatedValue.push('.')
		}
	}
	const updatedValueString = updatedValue.reverse().join('')
	const asNumber = Number(updatedValueString)
	return asNumber
}

export function feedIcon(feed: string): string {
	const feedLower = feed.toLowerCase()
	const base = '/coins'
	if (feedLower.startsWith('eth')) {
		return `${base}/ethereum.png`
	}
	if (feedLower.startsWith('btc')) {
		return `${base}/bitcoin.png`
	}
	if (feedLower.startsWith('mana')) {
		return `${base}/decentraland.png`
	}
	if (feedLower.startsWith('wsteth')) {
		return `${base}/lido-finance-wsteth.png`
	}
	if (feedLower.startsWith('uni')) {
		return `${base}/uniswap.png`
	}
	if (feedLower.startsWith('yfi')) {
		return `${base}/yearn-finance.png`
	}
	if (feedLower.startsWith('bat')) {
		return `${base}/basic-attention-token.png`
	}
	if (feedLower.startsWith('bal')) {
		return `${base}/balancer.png`
	}
	if (feedLower.startsWith('usdt')) {
		return `${base}/tether.png`
	}
	if (feedLower.startsWith('knc')) {
		return `${base}/kyber-network.png`
	}
	if (feedLower.startsWith('zrx')) {
		return `${base}/0x.png`
	}
	if (feedLower.startsWith('comp')) {
		return `${base}/compound.png`
	}
	if (feedLower.startsWith('lrc')) {
		return `${base}/loopring.png`
	}
	if (feedLower.startsWith('aave')) {
		return `${base}/aave.png`
	}
	return `${base}/ethereum.png`
}
