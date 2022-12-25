import ability from '@libs/acl/ability'
import { renameKeys } from '@utils/format-data'
import { saveState, getSavedState } from '@utils/local-storage'

/* state -------------------------------------------------------------------- */
export const state = {
  menu: getSavedState('app.menu') || [],
}

/* getters ------------------------------------------------------------------ */
export const getters = {
  appMenu() {
    return state.menu
  },
}

/* mutations ---------------------------------------------------------------- */
export const mutations = {
  SET_APP_MENU(state, value) {
    state.menu = value
    saveState('app.menu', value)
  },
  SET_APP_ABILITY(state, value) {
    ability.update(value)
  },
}

/* actions ------------------------------------------------------------------ */
export const actions = {
  delAppMenu({ commit, dispatch }, val) {
    commit('SET_APP_MENU', val)
  },
  setAppMenu({ commit, dispatch }, val) {
    commit('SET_APP_MENU', renameKeys(val.authorization.menu, { children: 'items', title: 'text', action: 'path' }))
  },
  setAppAbility({ commit, dispatch }, val) {
    commit('SET_APP_ABILITY', val.authorization.ability)
  },
}
