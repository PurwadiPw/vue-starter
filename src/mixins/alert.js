import notify from 'devextreme/ui/notify'

export default {
  methods: {
    msgShow(text, type, title, loginForm = false, duration = 5) {
      const vm = this
      // console.log('msgShow text', text)
      // console.log('msgShow title', title)
      let typeTxt = 'success'
      let titleTxt = ''
      let confirmButtonClass = 'btn-succes'

      if (type) {
        typeTxt = type
        if (type === 'warning') {
          confirmButtonClass = 'btn-warning'
        } else if (type === 'error') {
          typeTxt = (loginForm) ? 'error' : 'danger'
          confirmButtonClass = 'btn-danger'
        }
      }

      if (title) {
        titleTxt = title
      } else if (typeTxt === 'success') {
        titleTxt = 'Proses Sukses'
      } else {
        titleTxt = 'Proses Gagal'
      }

      if (loginForm) {
        return vm.$swal({
          text,
          title: titleTxt,
          icon: typeTxt,
          showCancelButton: false,
          customClass: {
            confirmButton: `btn btn-outline-success rounded-pill text-success ${confirmButtonClass}`
          }
        }).then(result => result).catch(() => vm.$swal.noop)
      }

      vm.$events.fire('showNotif', { title: titleTxt, msg: text, variant: typeTxt })
    },
    dxNotify(options) {
      const positions = options.positions || 'bottom center'
      const direction = options.direction || 'up-push'

      notify({
        message: options.message,
        type: options.type,
        width: options.width || 'auto',
      }, { positions, direction })
    },
    aspOnLoaded(result) {
      const vm = this
      console.log('aspOnLoaded', result)
      if (result.code !== undefined && result.code === 5) {
        vm.tokenException(result.message)
      }
      if (result.code !== undefined && result.code === 3) {
        vm.tokenException(result.message)
      }
    },
    tokenException(msg) {
      const vm = this
      vm.msgShow(msg, 'error')

      vm.$tabs.reset()
      vm.$router.push({
        name: "logout",
        query: { redirect: { name: 'home' } },
      }).catch(() => {});
    }
  }
}
