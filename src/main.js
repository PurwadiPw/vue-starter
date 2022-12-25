import Vue from 'vue'

import moment from 'moment'
import aspnet from 'devextreme-aspnet-data-nojquery'
import { stateMerge } from 'vue-object-merge'
import {
  chain, map, filter, each, values, size
} from 'lodash/core'
import cloneDeep from 'lodash/cloneDeep'
import findIndex from 'lodash/findIndex'
import remove from 'lodash/remove'

import router from '@router'
import store from '@state/store'
import App from './app.vue'

// import RouterTab and styles
import RouterTab from 'vue-router-tab'
import 'vue-router-tab/dist/lib/vue-router-tab.css'

// global filters
import * as filters from '@filters';

// global mixins
import * as mixins from '@mixins';

// global directives
import directives from '@directives'

// Styles
import 'floating-vue/dist/style.css'
import '@design/index.scss'
import '@design/icons.scss'

// libs
import '@libs/acl'
import '@libs/events'
import '@libs/toastification'
import '@libs/floating-vue'
import '@libs/sweet-alerts'

// Globally register all `_base`-prefixed components
import '@components/_base'
import '@components/_globals'

// Directives
Object.keys(directives).forEach(name => Vue.directive(name, directives[name]))

// register global utility filters.
for (const key of Object.keys(filters)) {
  Vue.filter(key, filters[key]);
}

// register global utility mixins.
for (const key of Object.keys(mixins)) {
  Vue.mixin(mixins[key]);
}

Vue.use(RouterTab)

Vue.prototype.$aspnet = aspnet
Vue.prototype.$moment = moment
Vue.prototype.$_map = map
Vue.prototype.$_each = each
Vue.prototype.$_filter = filter
Vue.prototype.$_remove = remove
Vue.prototype.$_chain = chain
Vue.prototype.$_values = values
Vue.prototype.$_size = size
Vue.prototype.$_cloneDeep = cloneDeep
Vue.prototype.$_findIndex = findIndex
Vue.prototype.$stateMerge = stateMerge

// Don't warn about using the dev version of Vue in development.
Vue.config.productionTip = process.env.NODE_ENV === 'production'

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app')
