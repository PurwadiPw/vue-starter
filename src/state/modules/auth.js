import axiosIns from '@libs/axios'
import { saveState, getSavedState } from '@utils/local-storage'

/* state -------------------------------------------------------------------- */
export const state = {
  loadingValidateUser: false,
  token: getSavedState('auth.token'),
  currentUser: getSavedState('auth.currentUser'),
}

/* getters ------------------------------------------------------------------ */
export const getters = {
  // Whether the user is currently logged in.
  loggedIn(state) {
    return !!state.token
  },
  token() {
    return state.token
  },
  currentUser() {
    return state.currentUser
  },
  isLoadingValidateUser() {
    return state.loadingValidateUser
  },
}

/* mutations ---------------------------------------------------------------- */
export const mutations = {
  SET_LOADING_VALIDATE_USER(state, value) {
    state.loadingValidateUser = value
  },
  SET_CURRENT_TOKEN(state, value) {
    state.token = value
    saveState('auth.token', value)
    setDefaultAuthHeaders(state)
  },
  SET_CURRENT_USER(state, value) {
    state.currentUser = value
    saveState('auth.currentUser', value)
  },
}

/* actions ------------------------------------------------------------------ */
export const actions = {
  // This is automatically run in `src/state/store.js` when the app
  // starts, along with any other actions named `init` in other modules.
  init({ state, dispatch }) {
    setDefaultAuthHeaders(state)
    dispatch('validateUser')
  },

  // Register user.
  register({ commit, dispatch, getters }, ...args) {
    if (getters.loggedIn) return dispatch('validateUser')

    return axiosIns.post('/register', ...args).then((response) => {
      const token = response.data
      commit('SET_CURRENT_TOKEN', token)
      return token
    })
  },

  // Logs in the current user.
  logIn({ commit, dispatch, getters }, ...args) {
    if (getters.loggedIn) return dispatch('validateUser')

    return axiosIns.post('/login', ...args).then((response) => {
      const token = response.data.data
      commit('SET_CURRENT_TOKEN', token)
      return token
    })
  },

  // Logs out the current user.
  logOut({ commit, dispatch }) {
    commit('SET_CURRENT_TOKEN', null)
    commit('SET_CURRENT_USER', null)

    dispatch('app/delAppMenu', [], { root: true })
  },

  // Forgot password
  forgotPassword({ commit, dispatch, getters }, ...args) {
    return axiosIns.post('/password/forgot', ...args).then((response) => {
      const { success, data } = response.data
      return data
    })
  },

  // Reset password
  resetPassword({ commit, dispatch, getters }, ...args) {
    return axiosIns.post('/password/reset', ...args).then((response) => {
      const { success, message } = response.data
      return message
    })
  },

  // Update password
  updatePassword({ commit, state, dispatch, getters }, ...args) {
    return axiosIns.put(`user/${state.currentUser.id}/updatePassword`, ...args).then((response) => {
      const { success, data } = response.data
      return success
    })
  },

  // Validates the current user's token and refreshes it
  // with new data from the API.
  validateUser({ commit, state, dispatch }) {
    if (!state.token) return Promise.resolve(null)

    commit('SET_LOADING_VALIDATE_USER', true)
    return axiosIns.get('/user').then((response) => {
      commit('SET_LOADING_VALIDATE_USER', false)

      const { success, data } = response.data
      if (success) {
        commit('SET_CURRENT_USER', data)

        dispatch('app/setAppMenu', data, { root: true })
        dispatch('app/setAppAbility', data, { root: true })
        return data
      } else {
        dispatch('logOut')
      }
      return null
    }).catch((error) => {
      if (error.response && error.response.status === 401) {
        dispatch('logOut')
      } else {
        console.warn(error)
      }
      commit('SET_LOADING_VALIDATE_USER', false)
      return null
    });
  },
}

/* private helper ----------------------------------------------------------- */
function setDefaultAuthHeaders(state) {
  axiosIns.defaults.headers.common.Authorization = state.token ? `${state.token.token_type} ${state.token.access_token}` : ''
}
