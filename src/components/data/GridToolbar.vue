<template>
  <div class="mb-2">
    <slot name="toolbarSlotFirst"/>

    <div class="flex justify-between items-center mb-1">
      <div class="m-0 grid-toolbar">
        <slot name="toolbarSlotBefore"/>

        <DxToolbar ref="gridToolbar" :items="toolbarItems" :visible="actionButtonGroupVisible">
          <template #gridOperationItem="{ data }">
            <div>
              <base-feather-icon :icon="data.icon" class="dx-icon" />
            </div>
          </template>

          <template #selectedRowsBtnItem="{ data }">
            <div class="flex items-center">
              <base-feather-icon :icon="data.icon" class="dx-icon mr-1" />
              <span>{{ data.label }}</span>
            </div>
          </template>
        </DxToolbar>

        <slot name="toolbarSlot"/>
      </div>

      <div class="m-0">
        <h4 v-if="pageTitleVisible" class="page-title mb-0 flex items-center leading-none" :style="titleStyle">
          <base-feather-icon icon="MonitorIcon" size="20" class="mr-2" />
          <span>{{ title }}</span>
          <small class="font-light uppercase mb-[3px] place-self-end" :class="subtitle ? 'ml-1' : '' ">{{ subtitle }}</small>
        </h4>
      </div>
    </div>

    <slot name="toolbarSlotSecond"/>
  </div>
</template>

<script>
import { getSavedState } from '@utils/local-storage'

export default {
  name: 'GridToolbar',
  components: {},
  props: {
    title: {
      type: String,
      required: true
    },
    titleStyle: {
      type: String,
      default: ''
    },
    subtitle: {
      type: String,
      default: ''
    },
    pageName: {
      type: String,
      required: true
    },
    module: {
      type: String,
      required: ''
    },
    actionButtonGroupVisible: {
      type: Boolean,
      default: true
    },
    onActionPageClicked: {
      type: Function,
      default: () => {}
    },
    onSelectedRowsCommandClicked: {
      type: Function,
      default: () => {}
    },
    pageTitleVisible: {
      type: Boolean,
      default: true
    },
    gridRefName: {
      type: String,
      required: true
    },
    gridConfig: {
      type: Object,
      default: null
    },
    selectedRowsDropdownVisible: {
      type: Boolean,
      default: true
    },
    selectedRowsData: {
      type: Array,
      required: false,
      default: function _default() {
        return []
      }
    },
    columnChooserVisible: {
      type: Boolean,
      default: true
    },
    trashBtnVisible: {
      type: Boolean,
      default: false
    },
    searchInputVisible: {
      type: Boolean,
      default: true
    },
    searchVisible: {
      type: Boolean,
      default: true
    },
    exportBtnVisible: {
      type: Boolean,
      default: true
    },
    refreshBtnVisible: {
      type: Boolean,
      default: true
    },
    clearFilterBtnVisible: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      search: '',
      trashBtnActive: false,
      toolbarItems: [
        {
          refs: 'selectedRowsBtn',
          visible: this.selectedRowsDropdownVisible,
          location: 'before',
          widget: 'dxDropDownButton',
          options: {
            text: '0 Data Dipilih',
            displayExpr: 'label',
            stylingMode: 'contained',
            noDataText: 'Pilih data terlebih dahulu',
            dropDownOptions: { width: 150 },
            itemTemplate: 'selectedRowsBtnItem',
            items: [],
            onSelectionChanged: (e) => {
              this.onSelectedRowsCommandClicked(e.item.command);
            },
          },
        },
        {
          visible: this.actionButtonGroupVisible,
          location: 'before',
          widget: 'dxButtonGroup',
          options: {
            keyExpr: 'command',
            selectionMode: 'none',
            stylingMode: 'contained',
            buttonTemplate: 'gridOperationItem',
            items: [
              {
                visible: this.refreshBtnVisible,
                icon: 'RefreshCwIcon',
                command: 'refreshGrid',
                hint: 'Muat Ulang'
              },
              {
                visible: this.clearFilterBtnVisible,
                icon: 'FilterIcon',
                command: 'clearFilterClicked',
                hint: 'Hapus Filter'
              },
              {
                visible: this.columnChooserVisible,
                icon: 'ColumnsIcon',
                command: 'showColumnChooserClicked',
                hint: 'Pilihan Kolom'
              },
              {
                visible: this.trashBtnVisible,
                icon: 'Trash2Icon',
                command: 'trashBtnClicked',
                hint: 'Trash'
              },
            ],
            onItemClick: (e) => {
              this[e.itemData.command]();
            }
          },
        },
        {
          visible: this.exportBtnVisible,
          location: 'before',
          widget: 'dxDropDownButton',
          options: {
            dropDownOptions: { width: 150 },
            text: 'Cetak',
            displayExpr: 'text',
            stylingMode: 'contained',
            items: [
              { id: '0', command: 'exportGridClicked', text: 'Hanya Data Dipilih' },
              { id: '1', command: 'exportGridClicked', text: 'Semua Data' },
            ],
            onSelectionChanged: (e) => {
              this[e.item.command](e.item.id);
            },
          },
        },
        {
          visible: this.searchInputVisible,
          location: 'before',
          widget: 'dxTextBox',
          options: {
            placeholder: 'Cari...',
            showClearButton: true,
            onValueChanged: this.searchValueChanged
          }
        },
        {
          visible: this.searchInputVisible,
          location: 'before',
          widget: 'dxButton',
          options: {
            icon: 'search',
            onClick: (e) => {
              this.searchProcess()
              // this.dxNotify({
              //   message: 'Hahahaha',
              //   type: 'error'
              // })
            }
          }
        }
      ],
    }
  },
  computed: {
    selectedRowsCount() {
      return this.selectedRowsData.length
    },
    grid() {
      return this.$parent.$refs[this.gridRefName].instance
    },
    trashBtnType() {
      return this.trashBtnActive ? 'danger' : 'default'
    }
  },
  watch: {
    selectedRowsData(val) {
      let routeData = this.toolbarItems.find(r => r.refs === 'selectedRowsBtn');
      routeData.options.text = `${val.length} Data Dipilih`
      if (this.gridConfig !== null && this.gridConfig.actionMultipleRowBtn !== undefined) {
        if (val.length) {
          routeData.options.items = this.filterActionBtn(this.gridConfig.actionMultipleRowBtn, this.module)
        } else {
          routeData.options.items = []
        }
      }
      this.$refs.gridToolbar.instance.option('items', this.toolbarItems)
    },
    gridConfig(val) {
      if (val !== null) {
        this.appendActionPageBtn()
      }
    },
  },
  beforeDestroy() {

  },
  mounted() {
    this.appendActionPageBtn()
  },
  methods: {
    appendActionPageBtn() {
      if (this.gridConfig !== null && this.gridConfig.actionPageBtn !== undefined) {
        const actionPageBtn = []
        this.$_each(this.gridConfig.actionPageBtn, (val, key) => {
          actionPageBtn.push({
            location: 'before',
            widget: 'dxButton',
            options: {
              text: val.label,
              hint: val.title,
              stylingMode: 'contained',
              onClick: (e) => {
                this.onActionPageClicked(val.command)
              }
            },
          })
        })

        this.toolbarItems = [...actionPageBtn, ...this.toolbarItems]
        this.$refs.gridToolbar.instance.option('items', this.toolbarItems)
      }
    },
    refreshGrid() {
      this.$events.fire(`${this.pageName}GridRefreshEvent`)
    },
    selectedRowsCommand(command) {
      this.$parent.selectedRowsCommand(command, this.selectedRowsData)
    },
    // eslint-disable-next-line consistent-return
    exportGridClicked(command) {
      this.$nextTick().then(() => {
        const allData = command === '1'
        if (!allData && this.grid.getSelectedRowsData().length <= 0) {
          this.msgShow('Belum ada data yang dipilih', 'warning')
          this.grid.endCustomLoading()
          return false
        }
        this.grid.exportToExcel(!allData)
      })
    },
    clearSelectionClicked() {
      this.grid.clearSelection()
      const index = this.grid.option('focusedRowIndex')
      this.grid.focus(this.grid.getCellElement(index, 2))
    },
    clearFilterClicked() {
      this.search = ''
      this.grid.clearFilter()
      const index = this.grid.option('focusedRowIndex')
      this.grid.focus(this.grid.getCellElement(index, 2))
    },
    showColumnChooserClicked() {
      this.grid.showColumnChooser()
    },
    trashBtnClicked() {
      this.trashBtnActive = !this.trashBtnActive
      this.$parent.trashedMode = this.trashBtnActive

      const dataSource = this.grid.option('dataSource')
      const trash = this.trashBtnActive ? { trashed: true } : { trashed: false }
      const loadParams = { ...dataSource.loadParams, ...trash }

      console.log('loadParams', loadParams)
      const db = this.$aspnet.createStore({
        key: dataSource.id,
        loadUrl: dataSource.loadUrl,
        loadParams,
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
      this.grid.clearFilter()
      this.grid.clearSorting()
      this.grid.option('dataSource.store', db)
    },
    searchValueChanged(data) {
      this.search = data.value
    },
    searchProcess() {
      const vm = this
      if (this.search.trim().length > 0) {
        const filterFields = []
        const fields = vm.grid.getVisibleColumns().filter(o => o.calculateSortValue !== undefined || o.allowFiltering === true).map(o => {
          if (vm.$parent[o.calculateFilterExpressionMethod] !== undefined && typeof vm.$parent[o.calculateFilterExpressionMethod] === 'function') {
            return vm.$parent[o.calculateFilterExpressionMethod](vm.search.trim(), 'contains', o.dataField)
          }
          if (o.calculateSortValue !== undefined && !o.ignoreFilterBycalculateSortValue) {
            return [o.calculateSortValue, 'contains', vm.search.trim()]
          }
          return [o.dataField, 'contains', vm.search.trim()]
        })

        fields.forEach((val, i) => {
          filterFields.push(val)
          if (i !== fields.length - 1) {
            filterFields.push('or')
          }
        })
        vm.grid.filter(filterFields)
      } else {
        vm.grid.clearFilter()
      }

      setTimeout(() => {
        vm.grid.focus(vm.grid.getCellElement(vm.$parent.focusedRowIndex, 2))
      }, 100)
    }
  }
}
</script>

<style lang="scss">
.grid-toolbar {
  .dx-toolbar {
    @apply bg-transparent;
    .dx-toolbar-items-container {
      height: 27px !important;
    }
  }
  .dx-button-has-icon {
    .dx-icon {
      line-height: 16px;
    }
  }
  .dx-button {
    .dx-button-content {
      height: 25px !important;
    }
    .dx-button-text {
      @apply uppercase;
    }
  }
  .dx-texteditor {
    &.dx-editor-outlined {
      border: 1px solid #a2b4b8;
    }
  }
}
.dx-list .dx-empty-message {
  min-height: auto !important;
}
</style>
