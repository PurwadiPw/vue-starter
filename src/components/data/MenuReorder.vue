<template>
  <div class="clearfix">
    <div class="flex items-center justify-between mb-0">
      <div class="m-0">
        <h4 class="page-title mb-0 flex items-center leading-none">
          <base-feather-icon :icon="formIcon" size="20" class="mr-2" />
          <span>{{ formSubtitle }}</span>
          <small class="font-light uppercase mb-[3px] place-self-end ml-1">{{ title }}</small>
        </h4>
      </div>
    </div>

    <hr />

    <DxTreeList
      key-expr="id"
      parent-id-expr="parent_id"
      :height="gridHeight"
      :data-source="formData.menus"
      :show-borders="true"
      :show-row-lines="true"
      :show-column-lines="true"
      :allow-column-reordering="true"
      :column-auto-width="true"
      :auto-expand-all="true">
      <DxColumn
        caption="Nama"
        data-field="name"
        width="100%"
      />
      <DxRowDragging
        :on-drag-change="onDragChange"
        :on-reorder="onReorder"
        :allow-drop-inside-item="true"
        :allow-reordering="true"
      />
    </DxTreeList>

    <hr/>

    <div class="form-toolbar">
      <DxToolbar ref="gridToolbar" :items="toolbarItems" />
    </div>
  </div>
</template>
<script>
import { DefaultFormData } from '@mixins/default-data'
import {
  DxTreeList,
  DxColumn,
  DxRowDragging
} from 'devextreme-vue/ui/tree-list'
import axiosIns from '@libs/axios'

export default {
  name: 'MenuReorder',
  components: {
    DxTreeList,
    DxColumn,
    DxRowDragging
  },
  props: {
    formName: {
      type: String,
      default: 'MenuForm'
    },
    title: {
      type: String,
      required: true
    },
    formDataId: {
      type: String,
      default: null
    },
    formHideEventName: {
      type: String,
      default: 'MenuFormHideEvent'
    },
    onFormClose: {
      type: String,
      default: null,
      required: true
    },
    gridHeight: {
      type: Number,
      default: function _default() {
        return window.innerHeight - 190
      }
    }
  },
  data() {
    const data = { ...DefaultFormData }
    this.$stateMerge(data, {
      formData: {
        menus: null
      },
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
    formSubtitle() {
      return 'Reorder'
    },
    formMethod() {
      return 'POST'
    },
    formAction() {
      return 'menuReorder'
    },
    formIcon() {
      return 'ListIcon'
    }
  },
  mounted() {
    this.loading = true
    axiosIns.post('/getTreeViewReorder')
      .then(resp => {
        this.formData.menus = resp.data.data
        this.loading = false
      })
      .catch(error => {
        console.log(error)
      })
  },
  methods: {
    onDragChange(e) {
      const visibleRows = e.component.getVisibleRows()
      const sourceNode = e.component.getNodeByKey(e.itemData.id)
      let targetNode = visibleRows[e.toIndex].node

      while (targetNode && targetNode.data !== undefined) {
        if (targetNode.data.id === sourceNode.data.id) {
          e.cancel = true
          break
        }
        targetNode = targetNode.parent
      }
    },
    onReorder(e) {
      const visibleRows = e.component.getVisibleRows()
      const sourceData = e.itemData
      const targetData = visibleRows[e.toIndex].data

      if (e.dropInsideItem) {
        if (targetData.has_children) {
          e.itemData.parent_id = targetData.id
          e.component.refresh()
        }
      } else {
        const sourceIndex = this.formData.menus.indexOf(sourceData)
        let targetIndex = this.formData.menus.indexOf(targetData)

        if (sourceData.parent_id !== targetData.parent_id) {
          sourceData.parent_id = targetData.parent_id
          if (e.toIndex > e.fromIndex) {
            // eslint-disable-next-line no-plusplus
            targetIndex++
          }
        }
        this.formData.menus.splice(sourceIndex, 1)
        this.formData.menus.splice(targetIndex, 0, sourceData)
        this.formData.menus = this.formData.menus.slice()
      }
    },
    submitFormProcess() {
      console.log('this.formData.menus', this.formData.menus)
      this.loading = true

      this.$swal({
        // title: '',
        text: 'Proses Simpan data',
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
          method: this.formMethod,
          url: this.formAction,
          data: this.formData
        }

        if (result.isConfirmed) {
          return axiosIns(opt).then(() => {
            this.msgShow('Data sudah tersimpan')
            this.$events.fire(this.onFormClose, true)
          })
        }
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    resetForm() {
      this.$events.fire(this.onFormClose, false)
    }
  }

}
</script>
