import axiosIns from '@libs/axios'
import { getSavedState } from '@utils/local-storage'

export default {
  methods: {
    gridMount() {
      const vm = this
      axiosIns.get(`${this.formSettingRouteReq + this.pageName }.json`, {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        }
      })
        .then(resp => {
          try {
            console.log('resp', resp)
            if (!resp.data.success) {
              throw 'konfigurasi form tidak ditemukan'
            }
            vm.gridConfigInit(resp.data.data)
          } catch (e) {
            vm.msgShow(e, 'error')
          }
        })
        .catch(error => {
          console.log(error)
          if (error.status === 404) {
            vm.msgShow('konfigurasi form tidak ditemukan', 'error')
          } else if (error.response.data !== undefined) {
            vm.msgShow(error.response.data.message, 'error')
          }
        })
    },
    gridConfigInit(config) {
      const vm = this
      vm.grid = vm.$refs[vm.gridName].instance
      vm.gridConfig = config
      vm.grid.option(config.gridOption)

      if (config.gridOption !== undefined && config.gridOption.dataSource !== undefined) {
        vm.grid.option('dataSource.store', vm.$aspnet.createStore({
          key: config.gridOption.dataSource.key,
          loadUrl: `${process.env.VUE_APP_API_URL}/${config.gridOption.dataSource.loadUrl}`,
          loadMethod: config.gridOption.dataSource.loadMethod !== undefined ? config.gridOption.dataSource.loadMethod : 'GET',
          loadParams: config.gridOption.dataSource.loadParams,
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
          },
          onAjaxError(e) {
            console.log('onAjaxError', e)
          },
          onLoaded(result) {
            console.log('onLoaded', result)
            vm.aspOnLoaded(result)
          }
        }))
      }

      if (config.gridMethods !== undefined) {
        this.$_each(config.gridMethods, (valOption, keyOption) => {
          vm.grid.option(keyOption, vm[valOption])
        })
      }

      setTimeout(() => {
        vm.focusedRowIndex = 0
        setTimeout(() => {
          vm.focusGrid()
          vm.$events.fire(`${vm.pageName}GridMountedEvent`)
        }, 200)
      }, 200)
    },
    gridCollapse(e) {
      e.event.preventDefault()
      e.event.stopPropagation()

      if (e.rowType === 'data' && e.handled !== true) {
        const { component } = e
        const prevClickTime = component.lastClickTime
        component.lastClickTime = new Date()
        if (prevClickTime && (component.lastClickTime - prevClickTime < 300)) {
          const key = e.component.getKeyByRowIndex(e.rowIndex)
          const expanded = e.component.isRowExpanded(key)
          if (expanded) {
            e.component.collapseRow(key)
          } else {
            e.component.expandRow(key)
          }
        }
      }
    },
    filterActionBtn(arr, module) {
      const vm = this
      const actionRowBtn = vm.$_cloneDeep(arr).filter(btn => (btn.permission === undefined || (btn.permission !== undefined && vm.$can(btn.permission, module))) && ((!vm.trashedMode && btn.trashedModeOnly===undefined) || (vm.trashedMode && (btn.trashedMode || btn.trashedModeOnly))))

      return actionRowBtn
    },
    calculateDateCellValue(data, sourceFormat = 'YYYY-MM-DD H:m:s', format = 'DD MMM YYYY, HH:mm:ss') {
      if (data !== null && data !== undefined) {
        if (sourceFormat === 'microtime') {
          return this.dateFormatterMicro(data, sourceFormat, format)
        }
        return this.dateFormatter(data, sourceFormat, format)
      }
      return '-'
    },
    refresh() {
      this.grid.refresh()
      const index = this.grid.option('focusedRowIndex')
      this.grid.focus(this.grid.getCellElement(index, 2))
    },
    focusRowGrid() {
      const vm = this
      if (vm.grid !== undefined && vm.grid !== null) {
        const index = vm.grid.option('focusedRowIndex')
        setTimeout(() => {
          if (vm.grid !== undefined) {
            if (index > 0) {
              vm.grid.focusedRowIndex = index
            } else {
              vm.grid.focusedRowIndex = 0
            }
            setTimeout(() => {
              vm.focusGrid()
            }, 200)
          }
        }, 200)
      }
    },
    focusGrid() {
      const vm = this
      if (this.grid === undefined) {
        return false
      }
      setTimeout(() => {
        vm.grid.focus(vm.grid.getCellElement(vm.focusedRowIndex, 2))
      }, 100)
    },
    gridKeyDown(e) {
      const id = this.grid.getKeyByRowIndex(this.focusedRowIndex)
      if (e.event && e.event.key === 'Enter' && `${this.pageName}GridKeyDownRowEvent` !== null) {
        this.$events.fire(`${this.pageName}GridKeyDownRowEvent`, this.grid, id)
      }
    },
    gridFocusedRowChanging(e) {
      const pageSize = e.component.pageSize()

      const pageIndex = e.component.pageIndex()

      const isLoading = e.component.getController('data').isLoading()

      if (!isLoading) {
        if (e.event.key && e.prevRowIndex === e.newRowIndex) {
          if (e.newRowIndex === pageSize - 1) {
            e.component.pageIndex(pageIndex + 1).done(() => {
              e.component.option('focusedRowIndex', 0)
            })
          } else if (e.newRowIndex === 0) {
            e.component.pageIndex(pageIndex - 1).done(() => {
              e.component.option('focusedRowIndex', pageSize - 1)
            })
          }
        }
      }

      if (`${this.pageName}GridFocusedRowChangingEvent` !== null) {
        this.$events.fire(`${this.pageName}GridFocusedRowChangingEvent`, e)
      }
    },
    gridFocusedRowChanged(e) {
      this.focusedRowIndex = e.component.option('focusedRowIndex')
    },
    // eslint-disable-next-line no-unused-vars
    gridFocusedCellChanging(e) {
    },
    gridFocusedCellChanged(e) {
      this.focusedRowIndex = e.rowIndex
    },
    selectionChanged() {
      this.selectedRowsData = this.grid.getSelectedRowsData()
    },
    delRows(dataId, delMultiple = true, textQuestion = null, textSuccess = null) {
      const vm = this
      vm.delRowsProcess({
        route: vm.delRowsRoute,
        dataDeleted: dataId,
        textQuestion,
        textSuccess
      }).then(resp => {
        if (resp !== undefined && resp !== false) {
          vm.grid.clearSelection()
          vm.$events.fire(`${vm.pageName}GridRefreshEvent`)
        } else if (!delMultiple) {
          if (vm.$refs[`${vm.gridName}RowAction${dataId[0]}`] !== undefined) {
            vm.$refs[`${vm.gridName}RowAction${dataId[0]}`].hide()
          }
        } else {
          vm.focusRowGrid()
        }
      }).catch(error => {
        console.log(error)
        vm.focusRowGrid()
      })
    },
    restoreRows(dataId, delMultiple = true) {
      const vm = this
      const textQuestion = 'Proses pemulihan data sekarang'
      const textSuccess = 'Data sudah dipulihkan'
      vm.delRowsProcess({
        route: vm.restoreRowsRoute,
        dataDeleted: dataId,
        textQuestion,
        textSuccess
      }).then(resp => {
        if (resp !== undefined && resp !== false) {
          vm.grid.clearSelection()
          vm.grid.refresh()
          vm.focusRowGrid()
        } else if (!delMultiple) {
          vm.$refs[`${vm.gridName}RowAction${dataId[0]}`].hide()
        } else {
          vm.focusRowGrid()
        }
      }).catch(error => {
        console.log(error)
        vm.focusRowGrid()
      })
    },
    gridContentReadySelectionColumn(e) {
      if (e.component.shouldSkipNextReady) {
        e.component.shouldSkipNextReady = false
      } else {
        e.component.shouldSkipNextReady = true
        e.component.columnOption('command:select', 'visibleIndex', 99)
        e.component.columnOption('command:select', 'width', 40)
        e.component.updateDimensions()
      }
    },
    actionRowToggleVisible(e) {
      if (!e) {
        this.focusRowGrid()
      }
    },
    updateDimension() {
      this.$events.fire(`${this.pageName}GridUpdateDimensionEvent`)
      this.focusRowGrid()
    },
    columnChooserViewConfig(e) {
      const columnChooserView = e.component.getView('columnChooserView')
      if (!columnChooserView._popupContainer) {
        columnChooserView._initializePopupContainer()
        columnChooserView.render()
        columnChooserView._popupContainer.option('position', {
          of: e.element,
          my: 'left top',
          at: 'left top'
        })
      }
    },
    columnFilterExpressionRender(e) {
      const vm = this
      const columns = this.$_filter(this.gridConfig.gridOption.columns, o => o.dataField !== undefined)

      this.$_each(columns, val => {
        if (val.dataType !== undefined && (val.dataType === 'date')) {
          e.component.columnOption(val.dataField, {
            calculateCellValue(data) {
              if (val.displayFormat !== undefined) {
                const formatVal = val.calculateDateField !== undefined ? val.calculateDateField : val.dataField

                if (val.sourceFormat !== undefined && (val.sourceFormat === 'microtime')) {
                  return vm.calculateDateCellValue(data[formatVal], 'microtime', val.displayFormat)
                }
                return vm.calculateDateCellValue(data[formatVal], null, val.displayFormat)
              }
              return vm.calculateDateCellValue(data[val.dataField])
            }
          })
        }

        if (val.calculateSortValue !== undefined) {
          if (vm[val.calculateFilterExpressionMethod] !== undefined && typeof vm[val.calculateFilterExpressionMethod] === 'function') {
            e.component.columnOption(val.dataField, {
              calculateFilterExpression(filterValue, selectedFilterOperation) {
                return vm[val.calculateFilterExpressionMethod](filterValue, selectedFilterOperation, val.dataField)
              }
            })
          } else if (!(val.lookup !== undefined && val.lookup.customStore)) {
            e.component.columnOption(val.dataField, {
              calculateFilterExpression(filterValue, selectedFilterOperation) {
                return [[!val.ignoreFilterBycalculateSortValue ? val.calculateSortValue : val.dataField, selectedFilterOperation, filterValue]]
              }
            })
          }
        }

        if (val.lookup !== undefined && val.lookup.customStore) {
          if (typeof val.lookup.customStore === 'boolean') {
            e.component.columnOption(val.dataField, {
              'lookup.dataSource': vm.$aspnet.createStore(val.lookup.store)
            })
          } else if (typeof vm[val.lookup.customStore] === 'function') {
            e.component.columnOption(val.dataField, {
              'lookup.dataSource': vm[val.lookup.customStore](e)
            })
          }
        }
      })
    },
    gridContentReady(e) {
      if (this.grid !== null) {
        if (!this.gridLoaded) {
          this.columnChooserViewConfig(e)
          this.columnFilterExpressionRender(e)
        }
        this.gridLoaded = true
      }
    },
    gridCreated() {
      const vm = this

      vm.$events.$on(`${vm.pageName}FormHideEvent`, (refreshGrid = false) => {
        vm.$nextTick().then(() => {
          vm.viewMode = 'grid'
          vm.formDataId = null
          vm.formCloneMode = false
          vm.additionalFormVisible = false
        }).then(() => {
          vm.$events.fire(`${vm.pageName}GridUpdateDimensionEvent`)
          vm.focusRowGrid()
          // vm.bindMoustrap()
          if (refreshGrid) {
            vm.$events.fire(`${vm.pageName}GridRefreshEvent`)
          }
        })
      })

      vm.$events.$on(`${vm.pageName}GridUpdateDimensionEvent`, () => {
        vm.$nextTick().then(() => {
          if (vm.grid !== null) {
            vm.grid.updateDimensions()
          }
        })
      })

      vm.$events.$on(`${vm.pageName}GridRefreshEvent`, () => {
        vm.$nextTick().then(() => {
          if (vm.grid !== null) {
            vm.grid.refresh()
            setTimeout(() => {
              vm.focusGrid()
            }, 200)
          }
        })
      })

      vm.$events.$on(`${vm.pageName}GridAddEvent`, () => {
        vm.viewMode = 'form'
      })

      vm.$events.$on(`${vm.pageName}GridKeyDownRowEvent`, (gridEl, id) => {
        const dropDownEl = vm.$refs[`${vm.gridName }RowAction${ id}`]
        if (dropDownEl !== undefined) {
          dropDownEl.show()
          setTimeout(() => {
            dropDownEl.dropdownElm.firstElementChild.focus()
          })
        }
      })

      vm.$events.$on(`${vm.pageName}GridFocusedRowChangingEvent`, data => {
        if (data.prevRowIndex !== -1 && data.prevRowIndex !== undefined) {
          if (data.rows[data.prevRowIndex] !== undefined) {
            const id = data.rows[data.prevRowIndex].key
            vm.$refs[`${vm.gridName }RowAction${ id}`].hide()
          }
        }
      })
    },
    gridBeforeDestroy() {
      this.unbindMousetrap()
      this.$events.$off(`${this.pageName}GridUpdateDimensionEvent`)
      this.$events.$off(`${this.pageName}GridRefreshEvent`)
      this.$events.$off(`${this.pageName}GridAddEvent`)
      this.$events.$off(`${this.pageName}GridKeyDownRowEvent`)
      this.$events.$off(`${this.pageName}GridFocusedRowChangingEvent`)
      this.$events.$off(`${this.pageName}GridFocusedRowChangingEvent`)
      this.$events.$off(`${this.pageName}GridMountedEvent`)

      this.$events.$off(`${this.pageName}FormHideEvent`)
      this.$events.$off(`${this.pageName}FormAddNewEvent`)
      this.$events.$off(`${this.pageName}FormOnCloseEvent`)
      this.$events.$off(`${this.pageName}FormOnShowEvent`)
      this.$events.$off(`${this.formName}FormMountedEvent`)
      this.$events.$off(`${this.formName}FormAfterSaveEvent`)
    }
  }
}
