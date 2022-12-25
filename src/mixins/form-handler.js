import axiosIns from '@libs/axios'
import { getSavedState } from '@utils/local-storage'

const enterKeySubmitVoidComp = [
  'dxSelectBox',
  'dxLookup',
  'dxTagBox',
  'dxDateBox',
  'dxColorBox'
]

export default {
  computed: {
    formSubtitle() {
      return this.formDataId !== null && !this.formCloneMode ? 'Edit Data' : 'Tambah Data'
    },
    formMethod() {
      return this.formDataId !== null && !this.formCloneMode ? 'PUT' : 'POST'
    },
    formAction() {
      return this.formDataId !== null && !this.formCloneMode ? `${this.formActionRoute}/${this.formDataId}` : this.formActionRoute
    },
    formIcon() {
      return this.formDataId !== null && !this.formCloneMode ? 'EditIcon' : 'FilePlusIcon'
    }
  },
  mounted() {

  },
  methods: {
    focusFormOnInit(fieldName) {
      if (this.form.getEditor(fieldName) !== undefined) {
        this.focusField = this.form.getEditor(fieldName).instance()
        this.focusField.focus()
      }
    },
    formConfigInit(config) {
      const vm = this
      try {
        this.form = this.$refs[this.formName].$_instance
        this.formConfig = config
        this.formActionRoute = this.formConfig.formActionRoute
      } catch (e) {
        vm.msgShow(e, 'error')
        vm.$events.fire(vm.onFormClose)
      }
    },
    formMounted() {
      const vm = this
      vm.$nextTick().then(() => {
        if (vm.formConfig.formDataInit !== undefined) {
          // vm.formData = Object.assign({}, vm.formConfig.formDataInit)
          vm.formData = JSON.parse(JSON.stringify(vm.formConfig.formDataInit))
        }
      }).then(() => {
        if (vm.formDataEdit !== null) {
          vm.formData = JSON.parse(JSON.stringify(vm.formDataEdit))
          // vm.formData = Object.assign({}, vm.formDataEdit)
        }
      }).then(() => {
        const config = vm.formConfig
        try {
          if (config.formOption.itemsGroup !== undefined) {
            this.$_each(config.formOption.items, (valGroup, keyGroup) => {
              this.$_each(valGroup.items, (val, key) => {
                if (val.editorOptions !== undefined && val.editorOptions.dataSource !== undefined) {
                  config.formOption.items[keyGroup].items[key].editorOptions.dataSource.store = vm.$aspnet.createStore({
                    key: val.editorOptions.dataSource.key,
                    loadUrl: `${process.env.VUE_APP_API_URL}/${val.editorOptions.dataSource.loadUrl}`,
                    loadParams: val.editorOptions.dataSource.loadParams,
                    onBeforeSend(operation, ajaxSettings) {
                      if (operation === 'load') {
                        const { token_type: tokenType, access_token: accessToken } = getSavedState('auth.token');
                        ajaxSettings.headers = {
                          Authorization: `${tokenType} ${accessToken}`
                        }
                        ajaxSettings.data = {
                          data: JSON.stringify(ajaxSettings.data)
                        }
                      }
                    }
                  })
                }

                if (val.editorOptions !== undefined && val.editorOptions.customStore !== undefined) {
                  config.formOption.items[keyGroup].items[key].editorOptions.dataSource = vm[val.editorOptions.customStore]()
                }

                if (val.methods !== undefined) {
                  this.$_each(val.methods, (valOption, keyOption) => {
                    if (vm.$parent[valOption] !== undefined && typeof vm.$parent[valOption] === 'function') {
                      config.formOption.items[keyGroup].items[key].editorOptions[keyOption] = vm.$parent[valOption]()
                    } else {
                      throw `Method ${valOption} tidak ditemukan`
                    }
                  })
                }
              })
            })
          } else if (config.formOption.itemsTab !== undefined) {
            console.log('itemsTab')
            console.log('config.formOption.items', config.formOption.items)
            this.$_each(config.formOption.items[0].tabs, (valGroup, keyGroup) => {
              console.log('valGroup', valGroup)
              this.$_each(valGroup.items, (val, key) => {
                // level 2
                if (val.editorOptions !== undefined && val.editorOptions.dataSource !== undefined) {
                  console.log('val.editorOptions', val.editorOptions)
                  config.formOption.items[0].tabs[keyGroup].items[key].editorOptions.dataSource.store = vm.$aspnet.createStore({
                    key: val.editorOptions.dataSource.key,
                    loadUrl: `${process.env.VUE_APP_API_URL}/${val.editorOptions.dataSource.loadUrl}`,
                    loadParams: val.editorOptions.dataSource.loadParams,
                    onBeforeSend(operation, ajaxSettings) {
                      if (operation === 'load') {
                        const { token_type: tokenType, access_token: accessToken } = getSavedState('auth.token');
                        ajaxSettings.headers = {
                          Authorization: `${tokenType} ${accessToken}`
                        }
                        ajaxSettings.data = {
                          data: JSON.stringify(ajaxSettings.data)
                        }
                      }
                    }
                  })
                }

                if (val.editorOptions !== undefined && val.editorOptions.customStore !== undefined) {
                  config.formOption.items[0].tabs[keyGroup].items[key].editorOptions.dataSource = vm[val.editorOptions.customStore]()
                }

                if (val.methods !== undefined) {
                  this.$_each(val.methods, (valOption, keyOption) => {
                    if (vm.$parent[valOption] !== undefined && typeof vm.$parent[valOption] === 'function') {
                      config.formOption.items[0].tabs[keyGroup].items[key].editorOptions[keyOption] = vm.$parent[valOption]()
                    } else {
                      throw `Method ${valOption} tidak ditemukan`
                    }
                  })
                }

                // level 3
                if (val.itemsGroup !== undefined) {
                  this.$_each(val.items, (valSubGroup, keySubGroup) => {
                    if (valSubGroup.editorOptions !== undefined && valSubGroup.editorOptions.dataSource !== undefined) {
                      config.formOption.items[0].tabs[keyGroup].items[key].items[keySubGroup].editorOptions.dataSource.store = vm.$aspnet.createStore({
                        key: valSubGroup.editorOptions.dataSource.key,
                        loadUrl: `${process.env.VUE_APP_API_URL}/${valSubGroup.editorOptions.dataSource.loadUrl}`,
                        loadParams: valSubGroup.editorOptions.dataSource.loadParams,
                        onBeforeSend(operation, ajaxSettings) {
                          if (operation === 'load') {
                            const { token_type: tokenType, access_token: accessToken } = getSavedState('auth.token');
                            ajaxSettings.headers = {
                              Authorization: `${tokenType} ${accessToken}`
                            }
                            ajaxSettings.data = {
                              data: JSON.stringify(ajaxSettings.data)
                            }
                          }
                        }
                      })
                    }

                    if (valSubGroup.editorOptions !== undefined && valSubGroup.editorOptions.customStore !== undefined) {
                      config.formOption.items[0].tabs[keyGroup].items[key].items[keySubGroup].editorOptions.dataSource = vm[valSubGroup.editorOptions.customStore]()
                    }

                    if (valSubGroup.methods !== undefined) {
                      this.$_each(valSubGroup.methods, (valSubOption, keySubOption) => {
                        if (vm.$parent[valSubOption] !== undefined && typeof vm.$parent[valSubOption] === 'function') {
                          config.formOption.items[0].tabs[keyGroup].items[key].items[keySubGroup].editorOptions[keySubOption] = vm.$parent[valSubOption]()
                        } else {
                          throw `Method ${valSubOption} not found`
                        }
                      })
                    }
                  })
                }
              })
            })
          } else {
            console.log('config.formOption', config.formOption)
            if (config.formOption !== undefined) {
              this.$_each(config.formOption.items, (val, key) => {
                if (val.editorOptions !== undefined && val.editorOptions.dataSource !== undefined) {
                  config.formOption.items[key].editorOptions.dataSource.store = vm.$aspnet.createStore({
                    key: val.editorOptions.dataSource.key,
                    loadUrl: `${process.env.VUE_APP_API_URL}/${val.editorOptions.dataSource.loadUrl}`,
                    loadParams: val.editorOptions.dataSource.loadParams,
                    onBeforeSend(operation, ajaxSettings) {
                      if (operation === 'load') {
                        const { token_type: tokenType, access_token: accessToken } = getSavedState('auth.token');
                        ajaxSettings.headers = {
                          Authorization: `${tokenType} ${accessToken}`
                        }
                        ajaxSettings.data = {
                          data: JSON.stringify(ajaxSettings.data)
                        }
                      }
                    }
                  })
                }

                if (val.editorOptions !== undefined && val.editorOptions.customStore !== undefined) {
                  config.formOption.items[key].editorOptions.dataSource = vm[val.editorOptions.customStore]()
                }

                if (val.methods !== undefined) {
                  this.$_each(val.methods, (valOption, keyOption) => {
                    if (vm.$parent[valOption] !== undefined && typeof vm.$parent[valOption] === 'function') {
                      config.formOption.items[key].editorOptions[keyOption] = vm.$parent[valOption]()
                    } else {
                      throw `Method ${valOption} tidak ditemukan`
                    }
                  })
                }
              })
            }
          }
          vm.formConfig = config
          vm.form.option(config.formOption)
          vm.formItems = vm.formConfig.formOption.items
        } catch (e) {
          vm.msgShow(e, 'error')
          vm.$events.fire(vm.onFormClose)
        }
      })
        .then(() => {
          vm.focusFormOnInit(vm.formConfig.onInitfocusField)
          vm.formItemsSetStatus = true
          vm.loading = false
          vm.$events.fire(`${vm.formName}FormMountedEvent`)
        })
        .then(() => {
          // if (vm.formDataEdit === null) {
          //     vm.formConfig.formDataInit = Object.assign({}, vm.formData)
          // }
        })
    },
    getOrgData(data) {
      let organisasiItems = null
      let organisasiId = null
      let organisasiFilter = ['organisasi.id', 'notnull', null]
      if (this.$store.getters.getUser.profile.organisasi_id !== null) {
        organisasiItems = [this.$store.getters.getUser.profile.pegawai.organisasi]
        organisasiId = this.$store.getters.getOrgActive.id
      } else if (data !== null) {
        organisasiItems = [data.organisasi]
      }

      organisasiFilter = ['organisasi.id', '=', organisasiId]

      return {
        organisasiItems,
        organisasiFilter
      }
    },
    unbindMousetrap() {
      this.$mousetrap.reset()
      this.bindMoustrapFocusedMenu()
    },
    setBlur(e = null) {
      if (this.focusFieldName !== null && this.focusFieldName !== undefined && this.form !== undefined) {
        if (e === null || e.component.NAME === 'dxForm') {
          this.form.getEditor(this.focusFieldName).instance().blur()
        } else {
          e.component.instance().blur()
        }
      }
    },
    setFocus() {
      const vm = this
      console.log('this.focusFieldName', this.focusFieldName)
      console.log('this.form', this.form)
      if (this.focusField !== null && this.focusField !== undefined && this.form !== undefined) {
        setTimeout(() => {
          vm.focusField.focus()
        }, 500)
      }
    },
    setFocusField(e) {
      this.focusFieldName = e.component.instance().option('name')
    },
    resetForm(opt = null) {
      const vm = this
      vm.setBlur()
      let txt = 'Batalkan pengisian data'
      let callbackEventName = vm.onFormClose

      if (opt !== null) {
        if (opt.confirmationTxt !== undefined) {
          txt = opt.confirmationTxt
        }

        if (opt.callbackEventName !== undefined) {
          callbackEventName = opt.callbackEventName
        }
      }

      const title = ''
      this.$swal({
        title,
        text: txt,
        icon: 'question',
        reverseButtons: false,
        focusCancel: false,
        showCancelButton: true,
        customClass: {
          confirmButton: 'btn btn-outline-success rounded-pill text-success',
          cancelButton: 'btn btn-outline-warning rounded-pill text-warning ml-1'
        },
        confirmButtonText: 'Ya',
        cancelButtonText: 'Tidak'
      }).then(result => {
        if (result) {
          // this.form.resetValues()
          if (result.isConfirmed) {
            this.loading = false
            vm.form.resetValues()
            if (callbackEventName !== undefined) {
              vm.$events.fire(callbackEventName, vm.hasSubmitData)
            }
          } else {
            vm.setFocus()
          }
        } else {
          vm.setFocus()
        }
      }).catch(() => {
        vm.setFocus()
      })
    },
    submitForm() {
      this.submitFormProcess()
    },
    submitFormNew() {
      this.submitFormProcess(null, true)
    },
    onEditorEnterKeyCallback(e) {
      e.event.preventDefault()
      e.event.stopPropagation()

      const el = (e.component.NAME === 'dxForm') ? this.form.getEditor(e.dataField).instance() : e.component.instance()
      const check = (e.component.NAME === 'dxForm') ? enterKeySubmitVoidComp.includes(el.NAME) : enterKeySubmitVoidComp.includes(e.component.NAME)
      if (!check) {
        el.blur()
        this.submitFormProcess(e)
      } else {
        setTimeout(() => {
          if (el.option('readOnly') === true || el.option('disabled') === true) return false

          if (el._$popup === undefined || el._$popup.hasClass('dx-state-invisible')) {
            el.open()
          } else {
            el.close()
          }
        }, 100)
      }
    },
    formValidate(formRefName, formMethod, formAction, formData, uploadFiles = false, txt = null) {
      const vm = this
      const form = this.$refs[formRefName].$_instance
      return new Promise((done, fail) => {
        let valid = true
        const checkForm = form.validate()
        if (checkForm !== undefined) {
          valid = checkForm.isValid
        }
        if (valid) {
          if (txt === null) txt = 'Proses Simpan data'

          const title = ''
          this.$swal({
            title,
            text: txt,
            icon: 'question',
            reverseButtons: false,
            focusCancel: false,
            showCancelButton: true,
            allowOutsideClick: false,
            customClass: {
              confirmButton: 'btn btn-outline-success rounded-pill text-success',
              cancelButton: 'btn btn-outline-warning rounded-pill text-warning ml-1'
            },
            confirmButtonText: 'Ya',
            cancelButtonText: 'Tidak'
          }).then(result => {
            const opt = {
              method: formMethod,
              url: formAction,
              data: formData
            }

            console.log('uploadFiles', uploadFiles)

            if (uploadFiles) {
              opt.headers = { 'content-type': 'multipart/form-data' }
            }

            if (result.isConfirmed) {
              return axiosIns(opt).then(resp => {
                vm.msgShow('Data sudah tersimpan')
                done(resp)
              }).catch(resp => {
                this.loading = false
                const field = this.$_chain(resp.data.errors).map((val, key) => key).first().value()
                if (field !== undefined) {
                  if (form.getEditor(field) !== undefined) {
                    form.getEditor(field).focus()
                  }
                  // vm.msgShow(resp.data.errors[field].join(', '), 'error')
                }
                // else if (resp.data.message !== undefined) {
                //   vm.msgShow(resp.data.message, 'error', 'PROSES GAGAL')
                // } else if (resp.status === 500) {
                //   vm.msgShow(resp.statusText, 'error', 'PROSES GAGAL')
                // }
                fail('ERROR')
              })
            }
            fail('cancel')
          }).catch(() => {
            this.loading = false
            this.setFocus()
            fail('cancel')
            return false
          })
        } else {
          vm.msgShow('Pastikan pengisian data sudah sesuai', 'error')
          if (checkForm !== undefined) {
            checkForm.brokenRules[0].validator._$element.data().dxValidationTarget.focus()
          }
          // eslint-disable-next-line prefer-promise-reject-errors
          fail('formNotValid')
        }
      })
    },
    formNotValid(error, e) {
      const vm = this
      vm.loading = false
      if (error === 'formNotValid') {
        return false
      }
      if (e !== undefined && e !== null) {
        setTimeout(() => {
          if (vm.form.getEditor(e.dataField) !== undefined) {
            vm.form.getEditor(e.dataField).instance().focus()
          }
        }, 500)
      } else {
        vm.setFocus()
      }
    },
    confirm(msg, opt = null) {
      const optDefault = {
        html: msg,
        icon: 'question',
        reverseButtons: false,
        focusCancel: false,
        showCancelButton: true,
        customClass: {
          confirmButton: 'btn btn-outline-success rounded-pill text-success',
          cancelButton: 'btn btn-outline-warning rounded-pill text-warning ml-1'
        },
        confirmButtonText: 'Ya',
        cancelButtonText: 'Tidak',
        ...opt
      }

      // eslint-disable-next-line consistent-return
      return this.$swal(optDefault).then(result => {
        if (result.isConfirmed) {
          return true
        }
      }).catch(() => false)
    },
    delRowsProcess(data) {
      const count = this.$_size(data.dataDeleted)
      const vm = this
      const textQuestion = (data.textQuestion !== undefined && data.textQuestion !== null) ? data.textQuestion : 'Hapus data sekarang'
      const textSuccess = (data.textSuccess !== undefined && data.textSuccess !== null) ? data.textSuccess : 'Data sudah dihapus'
      const skipConfirm = (data.skipConfirm !== undefined) ? data.skipConfirm : false
      const html = (data.html !== undefined) ? data.html : ''
      const type = (data.hideIcon !== undefined) ? '' : 'question'
      console.log('textQuestion', textQuestion)
      console.log('textSuccess', textSuccess)
      console.log('skipConfirm', skipConfirm)
      console.log('type', type)
      if (count > 0) {
        if (skipConfirm) {
          return axiosIns.post(data.route, { id: data.dataDeleted })
            .then(resp => {
              vm.msgShow(textSuccess, 'success', 'PROSES SUKSES')
              return resp
            })
            .catch(error => {
              if (error.response.data.message !== undefined) {
                vm.msgShow(error.response.data.message, 'error', 'PROSES GAGAL')
              } else {
                vm.msgShow('Internal Server Error', 'error', 'PROSES GAGAL')
              }
            })
        }
        return this.$swal({
          text: textQuestion,
          html,
          icon: type,
          reverseButtons: false,
          focusCancel: false,
          showCancelButton: true,
          customClass: {
            confirmButton: 'btn btn-outline-success rounded-pill text-success',
            cancelButton: 'btn btn-outline-warning rounded-pill text-warning ml-1'
          },
          confirmButtonText: 'Ya',
          cancelButtonText: 'Tidak'
        }).then(result => {
          if (result.isConfirmed) {
            return axiosIns.post(data.route, { id: data.dataDeleted })
              .then(resp => {
                vm.msgShow(textSuccess, 'success', 'PROSES SUKSES')
                return resp
              })
              .catch(error => {
                console.log('error', error.response)
                if (error.response.data.message !== undefined) {
                  vm.msgShow(error.response.data.message, 'error', 'PROSES GAGAL')
                } else {
                  vm.msgShow('Internal Server Error', 'error', 'PROSES GAGAL')
                }
              })
          }
        }).catch(() => false)
      }
    },
    updateStatusProcess(data) {
      const count = this.$_size(data.dataStatus)
      const vm = this
      const textQuestion = (data.textQuestion !== undefined) ? data.textQuestion : 'Update data sekarang'
      const textSuccess = (data.textSuccess !== undefined) ? data.textSuccess : 'Data sudah Diupdate'
      const skipConfirm = (data.skipConfirm !== undefined) ? data.skipConfirm : false
      const html = (data.html !== undefined) ? data.html : ''
      const type = (data.hideIcon !== undefined) ? '' : 'question'
      if (count > 0) {
        if (skipConfirm) {
          return axiosIns.post(data.route, { dataStatus: data.dataStatus, addData: data.addData })
            .then(resp => {
              vm.msgShow(textSuccess, 'success', 'PROSES SUKSES')
              return resp
            })
            .catch(error => {
              if (error.response.data.message !== undefined) {
                vm.msgShow(error.response.data.message, 'error', 'PROSES GAGAL')
              } else {
                vm.msgShow('Internal Server Error', 'error', 'PROSES GAGAL')
              }
            })
        }
        return this.$swal({
          text: textQuestion,
          html,
          icon: type,
          reverseButtons: false,
          focusCancel: false,
          showCancelButton: true,
          customClass: {
            confirmButton: 'btn btn-outline-success rounded-pill text-success',
            cancelButton: 'btn btn-outline-warning rounded-pill text-warning ml-1'
          },
          confirmButtonText: 'Ya',
          cancelButtonText: 'Tidak'
        }).then(result => {
          if (result.isConfirmed) {
            return axiosIns.post(data.route, { dataStatus: data.dataStatus, addData: data.addData })
              .then(resp => {
                vm.msgShow(textSuccess, 'success', 'PROSES SUKSES')
                return resp
              })
              .catch(error => {
                if (error.response.data.message !== undefined) {
                  vm.msgShow(error.response.data.message, 'error', 'PROSES GAGAL')
                } else {
                  vm.msgShow('Internal Server Error', 'error', 'PROSES GAGAL')
                }
              })
          }
        }).catch(() => false)
      }
    },
    getVuex() {
      return JSON.parse(window.localStorage.vuex)
    },
    updateNofitCounter(unreadNotifications, event = null) {
      const vm = this
      vm.$store.commit('setUnreadNotifications', unreadNotifications)

      vm.$nextTick().then(() => {
        vm.$events.fire('NotificationCounterEvent')
        vm.$events.fire('NotificationGridRefreshEvent')

        if (event !== undefined && event !== null) {
          vm.$events.fire(event)
        }
      })
    }
  }
}
