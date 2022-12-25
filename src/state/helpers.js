import { mapState, mapGetters, mapActions } from 'vuex'

/* app state helpers -------------------------------------------------------- */
export const appComputed = {
  ...mapState('app', {
    menu: (state) => state.menu,
  }),
  ...mapGetters('app', [
    'appMenu',
  ]),
};
export const appMethods = mapActions('app', [
  'setAppMenu',
  'setAppAbility',
]);

/* auth state helpers ------------------------------------------------------- */
export const authComputed = {
  ...mapState('auth', {
    loadingValidateUser: (state) => state.loadingValidateUser,
    token: (state) => state.token,
    currentUser: (state) => state.currentUser,
  }),
  ...mapGetters('auth', [
    'loggedIn',
    'token',
    'currentUser',
    'isLoadingValidateUser'
  ]),
};
export const authMethods = mapActions('auth', [
  'logIn',
  'logOut',
  'validateUser',
  'register',
  'forgotPassword',
  'resetPassword',
  'updatePassword',
]);
