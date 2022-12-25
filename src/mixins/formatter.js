export default {
  methods: {
    dateFormatter(val, sourceFormat, format = 'DD MMM YYYY, HH:mm:ss') {
      return val !== null ? this.$moment(val, sourceFormat).format(format) : ''
    },
    dateFormatterMicro(val, sourceFormat, format = 'DD MMM YYYY, HH:mm:ss') {
      return val !== null ? this.$moment(val * 1000).format(format) : ''
    },
    dateFormatterAgo(val, sourceFormat) {
      return val !== null ? this.$moment(val, sourceFormat).fromNow() : ''
    },
    currencyFormatter(val, format = '0,0.00') {
      window.numeral.defaultFormat(format)
      return window.numeral(parseFloat(val)).format()
    },
    numberFormatter(val) {
      window.numeral.defaultFormat('0,0')
      return window.numeral(parseInt(val)).format()
    }
  }
}
