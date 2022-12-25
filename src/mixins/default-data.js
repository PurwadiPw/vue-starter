const formSettingRouteReq = '/storage/formSetting/'

module.exports = {
  DefaultPageData: {
    loading: false,
    gridLoaded: false,
    grid: null,
    gridConfig: null,
    formDataId: null,
    formSettingRouteReq,
    formCloneMode: false,
    focusedRowKey: undefined,
    focusedRowIndex: 0,
    search: '',
    selectedRowsData: [],
    trashedMode: false,
    refreshOnActiveStateChanged: false,
    freeFieldTabShow: false,
    attachmentTabShow: false,
    additionalFormVisible: false
  },
  DefaultFormData: {
    hasSubmitData: false,
    formItemsSetStatus: false,
    loading: false,
    focusFieldName: null,
    focusField: null,
    formItems: [],
    form: null,
    formatDecimal: { type: 'fixedPoint', precision: 2 },
    formDataEdit: null,
    formConfig: null,
    formActionRoute: null,
    formSettingRouteReq,
    formColCount: 1,
    formDataHasUploadFiles: null
  }
}
