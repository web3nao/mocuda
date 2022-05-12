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
