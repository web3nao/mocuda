export function doit(value: string, precision: number) {
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

const ethusd = '2928340000000000000000'
const maticusd = '1147335672300000000'

const response = doit(maticusd, 18)
console.log(response)
