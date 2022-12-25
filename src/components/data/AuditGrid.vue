<template>
  <div class="mb-2">
    <div class="flex justify-between items-center mb-1">
      <div class="m-0 grid-toolbar">
        <DxToolbar ref="gridToolbar" :items="toolbarItems">
          <template #gridOperationItem="{ data }">
            <div>
              <base-feather-icon :icon="data.icon" class="dx-icon" />
            </div>
          </template>
        </DxToolbar>
      </div>
      <div class="m-0">
        <h4 class="page-title mb-0 flex items-center leading-none">
          <base-feather-icon icon="DatabaseIcon" size="20" class="mr-2" />
          <span>Audit</span>
          <small class="font-light uppercase mb-[3px] place-self-end ml-1">{{ title }}</small>
        </h4>
      </div>
    </div>

    <dx-data-grid
      class="dx-card wide-card"
      :ref="name"
      :element-attr="{class: 'shadow-datagrid rounded-lg'}"
      :show-borders="false"
      :data-source="dataSource"
      :column-auto-width="true"
      :word-wrap-enabled="false"
      :show-column-lines="true"
      :show-row-lines="true"
      :row-alternation-enabled="true"
      :repaint-changes-only="true"
      :focused-row-enabled="false"
      :focus-state-enabled="true"
      :filter-sync-enabled="true"
      :filter-value="null"
      :on-content-ready="gridAuditContentReady">

      <dx-filter-row :visible="false"/>
      <dx-column-chooser mode="select"/>
      <dx-pager
        :visible="true"
        :show-page-size-selector="true"
        :show-info="true"
        :show-navigation-buttons="true"/>
      <dx-paging :page-size="20"/>
      <dx-sorting mode="none"/>

      <div slot="eventTpl" slot-scope="data">
        <span class="badge text-white uppercase" :class="statusType[data.data.value]">
          {{ data.data.value }}
        </span>
      </div>

    </dx-data-grid>
  </div>
</template>

<script>
import { getSavedState } from '@utils/local-storage'

export default {
  name: 'AuditGrid',
  components: {},
  props: {
    title: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    hideEvent: {
      type: String,
      required: true
    },
    gridHeight: {
      type: Number,
      default: function _default() {
        return window.innerHeight - 142
      }
    },
    gridKey: {
      type: String,
      default: 'id'
    }
  },
  data() {
    return {
      dataGrid: null,
      dataSource: null,
      route: null,
      statusType: {
        created: 'success',
        updated: 'warning',
        deleted: 'danger',
        restored: 'primary'
      },
      dataSourceLookup: {
        store: {
          type: 'array',
          data: [
            { id: 'created', name: 'created' },
            { id: 'updated', name: 'updated' },
            { id: 'deleted', name: 'deleted' },
            { id: 'restored', name: 'restored' }
          ],
          key: 'id'
        },
        pageSize: 10,
        paginate: true
      },
      toolbarItems: [
        {
          location: 'before',
          widget: 'dxButtonGroup',
          options: {
            keyExpr: 'command',
            selectionMode: 'none',
            stylingMode: 'contained',
            buttonTemplate: 'gridOperationItem',
            items: [
              {
                icon: 'XIcon',
                command: 'back',
                hint: 'Tutup'
              },
              {
                icon: 'RefreshCwIcon',
                command: 'refreshGrid',
                hint: 'Muat Ulang'
              },
            ],
            onItemClick: (e) => {
              this[e.itemData.command]();
            }
          },
        },
      ],
    }
  },
  created() {

  },
  mounted() {

  },
  methods: {
    gridAuditContentReady(e) {
      const vm = this
      if (e.component.shouldSkipNextReady) {
        e.component.shouldSkipNextReady = false

        e.component.columnOption('id', {
          visible: false
        })

        e.component.columnOption('_id', {
          visible: false
        })

        e.component.columnOption('description', {
          caption: 'Aksi',
          cellTemplate: 'eventTpl',
          width: 70
        })

        e.component.columnOption('causer_name', {
          caption: 'User',
          width: 150
        })

        e.component.columnOption('created_by', {
          visible: false
        })

        e.component.columnOption('updated_by', {
          visible: false
        })

        e.component.columnOption('deleted_by', {
          visible: false
        })

        e.component.columnOption('updated_at', {
          visible: false
        })

        e.component.columnOption('deleted_at', {
          visible: false
        })

        e.component.columnOption('created_at', {
          width: 145,
          caption: 'Tanggal',
          format: 'd/M/yyyy',
          displayFormat: 'DD MMM YYYY, HH:mm:ss',
          dataType: 'date',
          dataField: 'created_at',
          calculateCellValue(data) {
            return vm.calculateDateCellValue(data.created_at, null, 'DD MMM YYYY, HH:mm:ss')
          }
        })
      } else {
        e.component.shouldSkipNextReady = true
      }
    },
    back() {
      // if (this.dataGrid != null) {
      //   this.dataGrid.dispose()
      // }
      this.$events.fire(this.hideEvent)
    },
    refreshGrid() {
      this.dataGrid = this.$refs[this.name].instance
      this.dataGrid.refresh()
    },
    updateRoute(data) {
      this.route = data
      const vm = this
      vm.$nextTick().then(() => {
        vm.renderGrid()
      })
    },
    renderGrid() {
      const vm = this

      if (this.dataGrid != null) {
        this.dataGrid.dispose()
      }

      const url = this.route

      this.dataSource = vm.$aspnet.createStore({
        key: 'id',
        loadUrl: url,
        loadParams: {},
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

      this.dataGrid = this.$refs[this.name].instance
    }
  },
  events: {
    // eslint-disable-next-line no-unused-vars
    RepaintAuditGridEvent(data) {
      this.renderGrid()
    }
  }
}
</script>
