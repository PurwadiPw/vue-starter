import { toCurrency } from '@utils/format-string'

function currency (value, currency = 'GBP') {
  return toCurrency(value, currency)
}

export default currency
