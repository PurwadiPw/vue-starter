import Vue from 'vue'

import GridToolbar from '@components/data/GridToolbar.vue'
import AuditGrid from '@components/data/AuditGrid.vue'
import FormApp from '@components/data/FormApp.vue'

/* devextreme --------------------------------------------------------------- */
import {
  DxDataGrid,
  DxColumn,
  DxPager,
  DxPaging,
  DxFilterRow,
  DxLookup,
  DxFormat,
  DxColumnChooser,
  DxSorting,
  DxEditing,
  DxSelection,
} from 'devextreme-vue/ui/data-grid'
import { DxForm, DxItem } from 'devextreme-vue/ui/form'
import { DxValidationRule, DxValidator } from 'devextreme-vue/ui/validator'
import { DxCheckBox } from 'devextreme-vue/ui/check-box'
import { DxSwitch } from 'devextreme-vue/ui/switch'
import { DxTagBox } from 'devextreme-vue/ui/tag-box'
import { DxTextBox } from 'devextreme-vue/ui/text-box'
import { DxTextArea } from 'devextreme-vue/ui/text-area'
import { DxNumberBox } from 'devextreme-vue/ui/number-box'
import { DxSelectBox } from 'devextreme-vue/ui/select-box'
import { DxDateBox } from 'devextreme-vue/ui/date-box'
import { DxButton } from "devextreme-vue/ui/button";
import { DxButtonGroup } from "devextreme-vue/ui/button-group";
import { DxContextMenu, DxPosition } from "devextreme-vue/ui/context-menu";
import { DxToolbar } from 'devextreme-vue/ui/toolbar';

Vue.component('GridToolbar', GridToolbar)
Vue.component('AuditGrid', AuditGrid)
Vue.component('FormApp', FormApp)

Vue.component('DxForm', DxForm)
Vue.component('DxItem', DxItem)
Vue.component('DxCheckBox', DxCheckBox)
Vue.component('DxSwitch', DxSwitch)
Vue.component('DxTagBox', DxTagBox)
Vue.component('DxValidationRule', DxValidationRule)
Vue.component('DxValidator', DxValidator)

Vue.component('DxDataGrid', DxDataGrid)
Vue.component('DxColumn', DxColumn)
Vue.component('DxPager', DxPager)
Vue.component('DxPaging', DxPaging)
Vue.component('DxFilterRow', DxFilterRow)
Vue.component('DxLookup', DxLookup)
Vue.component('DxFormat', DxFormat)
Vue.component('DxColumnChooser', DxColumnChooser)
Vue.component('DxSorting', DxSorting)
Vue.component('DxEditing', DxEditing)
Vue.component('DxSelection', DxSelection)
Vue.component('DxTextBox', DxTextBox)
Vue.component('DxTextArea', DxTextArea)
Vue.component('DxNumberBox', DxNumberBox)
Vue.component('DxSelectBox', DxSelectBox)
Vue.component('DxDateBox', DxDateBox)
Vue.component('DxButton', DxButton)
Vue.component('DxButtonGroup', DxButtonGroup)
Vue.component('DxContextMenu', DxContextMenu)
Vue.component('DxPosition', DxPosition)
Vue.component('DxToolbar', DxToolbar)
