<template>
  <div>
    <div v-show="viewMode === 'grid'">
      <grid-toolbar
        :ref="gridToolbarName"
        :page-name="pageName"
        :module="module"
        :grid-ref-name="gridName"
        :grid-config="gridConfig"
        :selected-rows-data="selectedRowsData"
        :on-action-page-clicked="actionPageClicked"
        :on-selected-rows-command-clicked="selectedRowsCommand"
        :title="title" />

      <dx-data-grid
        class="dx-card wide-card"
        :ref="gridName"
        :on-content-ready="gridContentReady"
        :focused-column-index.sync="focusedRowIndex"
        :on-key-down="gridKeyDown"
        :on-focused-row-changing="gridFocusedRowChanging"
        :on-focused-row-changed="gridFocusedRowChanged"
        :on-focused-cell-changed="gridFocusedCellChanged"
        :on-focused-cell-changing="gridFocusedCellChanging"
        :on-selection-changed="selectionChanged"
        :height="gridHeight">
        <div slot="actionTpl" slot-scope="data">
          <dx-button :ref="gridName+'RowAction'+data.data.data.id" class="row-action" :class="gridName+'RowAction'+data.data.data.id" styling-mode="text">
            <base-feather-icon icon="MoreHorizontalIcon" size="16" class="align-middle text-body p-0" />
            <dx-context-menu :items="filterActionBtn(gridConfig.actionRowBtn, module)" :target="`.${gridName+'RowAction'+data.data.data.id}`" show-event="dxclick" css-class="user-menu">
              <dx-position my="left top" at="left bottom" />
              <template #item="{ data: e }">
                <div @click="actionRowClicked({mode: e.command, rowData: data.data.data})">
                  <base-feather-icon :icon="e.icon" class="dx-icon" />
                  <span class="dx-menu-item-text">{{ e.label }}</span>
                </div>
              </template>
            </dx-context-menu>
          </dx-button>
        </div>
        <dx-column-chooser mode="select"/>
      </dx-data-grid>
    </div>

    <div v-if="viewMode === 'form'" class="mb-3">
      <form-app
        :ref="formName"
        :form-data-id="formDataId"
        :title="title"
        :form-name="formName"
        :on-form-close="formOnHide"
        :on-form-add-new="formOnAddNew"
        :form-clone-mode="formCloneMode"
        :on-form-before-save="formBeforeSave">
        <div v-if="$refs[formName] !== undefined" slot="additionalForm" slot-scope="data">
          <hr />
          <div class="grid grid-cols-1 md:grid-cols-2">
            <DxTreeList
              ref="menuList"
              :data-source="menuList"
              :show-borders="true"
              :show-row-lines="true"
              :show-column-lines="true"
              :allow-column-reordering="true"
              :column-auto-width="false"
              :auto-expand-all="true"
              :height="treeHeight"
              key-expr="id"
              parent-id-expr="parent">
              <DxSelection :recursive="false" mode="multiple" />
              <DxColumn caption="Menu & Permission" data-field="text" width="400" />
              <DxColumn caption="Tipe" data-field="type" width="200" />
            </DxTreeList>
            {{ data.data }}
          </div>
        </div>
      </form-app>
    </div>

    <div v-if="viewMode === 'audit'">
      <audit-grid
        :ref="auditGridName"
        :title="title"
        :name="auditGridName"
        :hide-event="formOnHide" />
    </div>
  </div>
</template>

<script>
import { $appConfig } from '@src/app.config'
import { authComputed, appComputed } from '@state/helpers'
import { DefaultPageData } from '@mixins/default-data'
import axiosIns from '@libs/axios'
import {
  DxTreeList,
  DxColumn,
  DxSelection
} from 'devextreme-vue/ui/tree-list'

export default {
  page: {
    title: "Role",
    meta: [{ name: "description", content: $appConfig.app.appDescription }],
  },
  components: {
    DxTreeList,
    DxColumn,
    DxSelection
  },
  props: {
    pageName: {
      type: String,
      default: 'Role'
    },
    title: {
      type: String,
      default: 'Role'
    },
    module: {
      type: String,
      default: 'role'
    },
    gridHeight: {
      type: Number,
      default: function _default() {
        return window.innerHeight - 141
      }
    },
    treeHeight: {
      type: Number,
      default: function _default() {
        return window.innerHeight - 270
      }
    }
  },
  computed: {
    ...appComputed,
    ...authComputed,
  },
  data() {
    const data = { ...DefaultPageData }
    this.$stateMerge(data, {
      viewMode: 'grid',
      gridName: `${this.pageName}Grid`,
      gridToolbarName: `${this.pageName}GridToolbar`,
      actionRowButtonName: `${this.pageName}GridActionRowBtn`,
      auditGridName: `${this.pageName}GridAudit`,
      formName: `${this.pageName}Form`,
      formOnHide: `${this.pageName}FormHideEvent`,
      formOnAddNew: `${this.pageName}FormAddNewEvent`,
      delRowsRoute: 'roleDelBatch',
      restoreRowsRoute: 'roleRestoreBatch',
      menuList: null
    })
    return data
  },
  created() {
    const vm = this
    vm.gridCreated()

    vm.$events.$on(`${vm.formName}FormMountedEvent`, () => {
      const formRef = this.$refs[vm.formName]

      if (formRef !== undefined && formRef.formItemsSetStatus) {
        const { formDataEdit } = formRef
        axiosIns.get('menuTreeView')
          .then(resp => {
            this.menuList = resp.data.data
          })
          .then(() => {
            if (formDataEdit !== null) {
              console.log('formDataEdit', formDataEdit)
              this.$refs.menuList.instance.selectRows(formDataEdit.permissions)
            }
          })
      }
    })

    // eslint-disable-next-line no-unused-vars
    vm.$events.$on(`${vm.pageName}FormAddNewEvent`, data => {
      this.$refs.menuList.instance.clearSelection()
    })
  },
  mounted() {
    const vm = this
    vm.gridMount()
  },
  methods: {
    bindMoustrap() {

    },
    actionPageClicked(command) {
      if (command === 'addNew') {
        this.viewMode = 'form'
      }
    },
    actionRowClicked(command) {
      const vm = this
      setTimeout(() => {
        if (command.mode === 'editRow' || command.mode === 'cloneRow') {
          // vm.$refs[`${vm.gridName}RowAction${command.rowData.id}`].hide()
          vm.formDataId = command.rowData.id
          vm.formCloneMode = command.mode === 'cloneRow'
          vm.viewMode = 'form'
        } else if (command.mode === 'deleteRow') {
          vm.delRows([command.rowData.id], false)
        } else if (command.mode === 'restoreRow') {
          vm.restoreRows([command.rowData.id], false)
        } else if (command.mode === 'auditRow') {
          // vm.$refs[`${vm.gridName}RowAction${command.rowData.id}`].hide()
          const route = `api/role/${command.rowData.id}/audit`
          vm.viewMode = 'audit'
          vm.$nextTick().then(() => {
            vm.$refs[vm.auditGridName].updateRoute(route)
          })
        } else {
          vm.msgShow('Unauthorized access', 'error')
        }
      })
    },
    selectedRowsCommand(command) {
      if (command === 'deleteRow') {
        const vm = this
        setTimeout(() => {
          vm.delRows(this.$_map(this.selectedRowsData, 'id'))
          vm.$refs[vm.gridToolbarName].$refs[`${vm.gridName}SelectedRowsButton`].hide()
        }, 200)
      }
    },
    formBeforeSave() {
      const { formData } = this.$refs[this.formName]

      return new Promise(done => {
        formData.menus = []
        const selectedRowKeys = this.$refs.menuList.instance.getSelectedRowKeys('all')
        formData.permissions = Array.from(new Set(Array.from(this.getAllPermissions(selectedRowKeys))))
        formData.menus = Array.from(new Set(Array.from(this.getAllParents(selectedRowKeys))))
        console.log('formData.permissions', formData.permissions)
        console.log('formData.menus', formData.menus)
        done(true)
      }).catch(error => {
        this.msgShow(error, 'error')
        return false
      })
    },
    testClicked() {
      const vm = this
      const { formData } = vm.$refs[vm.formName]
      formData.menus = []
      formData.permissions = this.$refs.menuList.instance.getSelectedRowKeys('leavesOnly')
      formData.menus = Array.from(new Set(Array.from(this.getAllParents(formData.permissions))))
    },
    * getAllPermissions(arr) {
      const vm = this
      // eslint-disable-next-line no-restricted-syntax,guard-for-in
      for (const i in arr) {
        const node = vm.$refs.menuList.instance.getNodeByKey(arr[i])
        console.log('node', node)
        if (!node.hasChildren) {
          yield node.key
        }
      }
    },
    * getAllParents(arr) {
      const vm = this
      // eslint-disable-next-line no-restricted-syntax,guard-for-in
      for (const i in arr) {
        const node = vm.$refs.menuList.instance.getNodeByKey(arr[i])

        if (node.hasChildren) {
          yield node.key
        }

        if (node.parent.level >= 0) {
          yield node.parent.key

          const resArray = Array.from(vm.getAllParents([node.parent.key]))
          // eslint-disable-next-line no-undef,guard-for-in,no-restricted-syntax
          for (const j in resArray) {
            yield resArray[j]
          }
        }
      }
    }
  }
};
</script>
