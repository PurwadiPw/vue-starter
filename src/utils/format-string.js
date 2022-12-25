export const toCurrency = (value, currency = 'GBP') => {
  var formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
  });
  return formatter.format(value)
}
