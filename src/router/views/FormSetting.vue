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
          <dx-button :ref="gridName+'RowAction'+data.data.data._id" class="row-action" :class="gridName+'RowAction'+data.data.data._id" styling-mode="text">
            <base-feather-icon icon="MoreHorizontalIcon" size="16" class="align-middle text-body p-0" />
            <dx-context-menu :items="filterActionBtn(gridConfig.actionRowBtn, module)" :target="`.${gridName+'RowAction'+data.data.data._id}`" show-event="dxclick" css-class="user-menu">
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
        :form-clone-mode="formCloneMode">
        <div v-if="$refs[formName] !== undefined" slot="additionalForm" slot-scope="data">
          <hr />
          <v-jsoneditor
            v-model="$refs[formName].formData.config"
            :options="opt"
            :height="`${jsonEditorHeight}px`"/>
            {{ data.data }}
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
import VJsoneditor from 'v-jsoneditor'

export default {
  page: {
    title: "Form Setting",
    meta: [{ name: "description", content: $appConfig.app.appDescription }],
  },
  components: {
    VJsoneditor
  },
  props: {
    pageName: {
      type: String,
      default: 'FormSetting'
    },
    title: {
      type: String,
      default: 'Form Setting'
    },
    module: {
      type: String,
      default: 'formSetting'
    },
    gridHeight: {
      type: Number,
      default: function _default() {
        return window.innerHeight - 141
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
      delRowsRoute: 'formSettingDelBatch',
      restoreRowsRoute: 'formSettingRestoreBatch',
      jsonEditorHeight: window.innerHeight - 280,
      opt: {
        mode: 'code',
        modes: ['tree', 'code', 'form', 'text', 'view'],
        navigationBar: false,
        statusBar: false,
        enableTransform: false,
        enableSort: false
      }
    })
    return data
  },
  created() {
    const vm = this
    vm.gridCreated()
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
          console.log('command.rowData', command.rowData);
          // vm.$refs[`${vm.gridName}RowAction${command.rowData.id}`].hide()
          vm.formDataId = command.rowData._id
          vm.formCloneMode = command.mode === 'cloneRow'
          vm.viewMode = 'form'
        } else if (command.mode === 'deleteRow') {
          vm.delRows([command.rowData.id], false)
        } else if (command.mode === 'restoreRow') {
          vm.restoreRows([command.rowData.id], false)
        } else if (command.mode === 'auditRow') {
          // vm.$refs[`${vm.gridName}RowAction${command.rowData.id}`].hide()
          const route = `api/formSetting/${command.rowData.id}/audit`
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
    }
  }
};
</script>
