<template>
  <div class="clearfix">
    <div v-if="formHeaderVisible" class="flex items-center justify-between mb-0">
      <div class="m-0">
        <h4 class="page-title mb-0 flex items-center leading-none">
          <base-feather-icon :icon="formIcon" size="20" class="mr-2" />
          <span>{{ formSubtitle }}</span>
          <small class="font-light uppercase mb-[3px] place-self-end ml-1">{{ title }}</small>
        </h4>
      </div>
    </div>

    <hr v-if="formHeaderVisible">

    <dx-form
      :ref="formName"
      :form-data="formData"
      :on-field-data-changed="onFormFieldDataChanged"
      :element-attr="elementAttr"
      :on-editor-enter-key="onEditorEnterKeyCallback">

      <template v-for="(slot) in formSlot" :slot="slot" slot-scope="data">
        <slot :name="slot" v-bind="data" />
      </template>
    </dx-form>

    <slot name="additionalForm"/>

    <hr />

    <div class="form-toolbar">
      <DxToolbar ref="gridToolbar" :items="toolbarItems" :visible="formItemsSetStatus" />
    </div>
  </div>
</template>

<script>
import { stateMerge } from 'vue-object-merge'
import { DefaultFormData } from '@mixins/default-data'
import axiosIns from '@libs/axios'

export default {
  components: {
  },
  props: {
    formName: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    formDataId: {
      default: null
    },
    onFormClose: {
      type: String,
      default: null,
      required: true
    },
    onFormFieldDataChanged: {
      type: Function,
      default: function _default() {
        return false
      }
    },
    onFormAddNew: {
      type: String,
      default: null
    },
    onFormShow: {
      type: String,
      default: null
    },
    onFormAfterSave: {
      type: String,
      default: null
    },
    onFormBeforeSave: {
      type: Function,
      default: function _default() {
        return new Promise((done, fail) => {
          done(true)
        })
      }
    },
    editorEnterKeySubmitVoid: {
      type: Array,
      default: function _default() {
        return []
      }
    },
    formSlot: {
      type: Array,
      default: function _default() {
        return []
      }
    },
    formCloneMode: {
      type: Boolean,
      default: false
    },
    hasUploadFiles: {
      type: Boolean,
      default: false
    },
    btnSubmitVisible: {
      type: Boolean,
      default: true
    },
    btnSubmitAndNewVisible: {
      type: Boolean,
      default: true
    },
    cancelBtnVisible: {
      type: Boolean,
      default: true
    },
    formHeaderVisible: {
      type: Boolean,
      default: true
    },
    elementAttr: {
      type: Object,
      default: null
    },
    submitBtnClass: {
      type: String,
      default: 'float-left'
    }
  },
  data() {
    const data = { ...DefaultFormData }
    stateMerge(data, {
      formData: {},
      toolbarItems: [
        {
          visible: this.btnSubmitVisible,
          location: 'before',
          widget: 'dxButton',
          options: {
            type: 'default',
            text: 'Simpan',
            hint: 'Simpan',
            stylingMode: 'contained',
            onClick: (e) => {
              this.submitFormProcess()
            }
          },
        },
        {
          visible: (this.formDataId === null || this.formCloneMode) && this.btnSubmitVisible && this.btnSubmitAndNewVisible,
          location: 'before',
          widget: 'dxButton',
          options: {
            type: 'success',
            text: 'Simpan & Tambah Baru',
            hint: 'Simpan & Tambah Baru',
            stylingMode: 'contained',
            onClick: (e) => {
              this.submitFormProcess(null, true)
            }
          },
        },
        {
          visible: this.formDataId !== null && !this.formCloneMode && this.btnSubmitVisible,
          location: 'before',
          widget: 'dxButton',
          options: {
            type: 'success',
            text: 'Simpan & Tutup',
            hint: 'Simpan & Tutup',
            stylingMode: 'contained',
            onClick: (e) => {
              this.submitFormProcess(null, false, true)
            }
          },
        },
        {
          visible: this.cancelBtnVisible,
          location: 'before',
          widget: 'dxButton',
          options: {
            type: 'danger',
            text: 'Batal',
            hint: 'Batal',
            stylingMode: 'contained',
            onClick: (e) => {
              this.resetForm()
            }
          },
        },
      ]
    })
    return data
  },
  computed: {

  },
  created() {
    const vm = this
    // vm.unbindMousetrap()
    // vm.bindMoustrapForm(this)
    vm.$nextTick().then(() => {
      vm.loading = true
      vm.form = vm.$refs[vm.formName] && vm.$refs[vm.formName].instance

      axiosIns.get(`${vm.formSettingRouteReq + vm.formName}.json`, { headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' } })
        .then(resp => {
          try {
            if (resp.data === undefined || resp.status === 404) {
              throw 'konfigurasi form tidak ditemukan'
            } else if (resp.data.data.formActionRoute === undefined) {
              throw 'konfigurasi formActionRoute tidak ditemukan'
            }
            vm.formConfigInit(resp.data.data)
          } catch (e) {
            vm.msgShow(e, 'error')
          }
        })
        .then(() => {
          if (vm.formDataId !== null) {
            const route = vm.formConfig.formActionRouteEdit !== undefined ? `/${vm.formConfig.formActionRouteEdit}/${vm.formDataId}` : `/${vm.formActionRoute}/${vm.formDataId}/edit`
            axiosIns.get(route)
              .then(resp => {
                if (resp.data.success && resp.data.data !== undefined) {
                  vm.formDataEdit = resp.data.data
                } else {
                  vm.formDataEdit = resp.data
                }
              }).then(() => {
                vm.formMounted()
              }).catch(error => {
                vm.loading = false
                if (error.response.data !== undefined) {
                  vm.msgShow(error.response.data.message, 'error')
                }
                vm.$events.fire(vm.onFormClose)
              })
          } else {
            vm.formMounted()
          }
        })
        .then(() => {
          if (vm.onFormShow !== null) {
            vm.$events.fire(vm.onFormShow)
          }
        })
        .catch(error => {
          console.log(error)
          vm.loading = false
          if (error.status === 404) {
            vm.msgShow('konfigurasi form tidak ditemukan', 'error')
          } else if (error.response.data !== undefined) {
            vm.msgShow(error.response.data.message, 'error')
          }
          vm.$events.fire(vm.onFormClose)
        })
    })
  },
  beforeDestroy() {
    // vm.unbindMousetrap()
  },
  methods: {
    submitFormProcess(e, addNew = false, closeForm = false) {
      const vm = this
      vm.loading = true
      vm.setBlur()

      new Promise((done, fail) => {
        let valid = true
        const form = vm.$refs[vm.formName].$_instance
        const checkForm = form.validate()
        if (checkForm !== undefined) {
          valid = checkForm.isValid
        }
        console.log('valid', valid)
        if (valid) {
          return done(true)
        }
        vm.loading = false
        console.log('checkForm', checkForm)
        console.log('validator', checkForm.brokenRules[0].validator.instance())
        if (checkForm !== undefined) {
          checkForm.brokenRules[0].validator.instance().focus()
        }
        return fail('Pastikan pengisian data sudah sesuai')
      }).then(() => vm.onFormBeforeSave().then(resp => {
        console.log('onFormBeforeSave', resp)
        if (resp) {
          return true
        }
        vm.loading = false
        return false
      })).then(resp => {
        console.log('after onFormBeforeSave', resp)
        if (resp) {
          const fd = (vm.hasUploadFiles) ? vm.formDataHasUploadFiles : vm.formData
          let method = vm.formMethod.toLowerCase()
          if (vm.hasUploadFiles) {
            if (vm.formMethod === 'PUT') {
              method = 'post'
              fd.append('_method', 'put')
            }
          }
          vm.formValidate(vm.formName, method, vm.formAction, fd, vm.hasUploadFiles)
            // eslint-disable-next-line no-shadow
            .then(resp => {
              vm.loading = false

              if (vm.onFormAfterSave !== null) {
                vm.$events.fire(vm.onFormAfterSave, resp.data)
              }

              if (addNew || (vm.formDataId !== null && !vm.formCloneMode && !closeForm)) {
                vm.hasSubmitData = true
                if (addNew) {
                  vm.$nextTick().then(() => {
                    if (vm.formConfig.formDataInit !== undefined) {
                      vm.formData = JSON.parse(JSON.stringify(vm.formConfig.formDataInit))
                      // vm.formData = Object.assign({}, vm.formConfig.formDataInit)
                    }

                    if (vm.focusField !== undefined && vm.focusField !== null) {
                      vm.focusField.focus()
                    }

                    if (vm.onFormAddNew) {
                      vm.$events.fire(vm.onFormAddNew)
                    }
                  }).then(() => {
                    vm.form.resetValues()
                  })
                } else {
                  vm.focusField.focus()
                }
              } else {
                vm.$events.fire(vm.onFormClose, true)
              }
            })
            .catch(error => {
              vm.formNotValid(error, e)
            })
        }
      }).catch(resp => {
        console.log('resp', resp.response)
        vm.msgShow(resp, 'error')
        vm.loading = false
      })
    }
  },
  events: {}
}
</script>
