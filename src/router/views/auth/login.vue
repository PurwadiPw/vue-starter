<template>
  <section class="h-screen flex items-center justify-center bg-[url('@assets/images/company/klinik-bg.svg')] bg-no-repeat bg-center">
    <div class="absolute inset-0 bg-gradient-to-b from-transparent to-black"></div>
    <div class="container">
      <div class="flex justify-center">
        <div class="max-w-[400px] w-full m-auto p-6 bg-white shadow-md rounded-md">
          <BaseLink tag='a' :to="{ name: 'home' }"><img src="@assets/images/logo.png" class="mx-auto" alt=""></BaseLink>
          <h5 class="my-6 text-xl font-semibold">Log In</h5>
          <validation-observer ref="loginForm">
            <form class="text-left">
              <div class="grid grid-cols-1">
                <div class="mb-4">
                  <label class="font-semibold" for="LoginEmail">Username:</label>
                  <validation-provider name="Email" v-slot="{ errors }" rules="required" mode="aggressive">
                    <input v-model="username" id="LoginEmail" type="text" class="form-input mt-1" placeholder="name@example.com" :class="errors.length > 0 ? 'is-invalid':null">
                    <small class="text-error">{{ errors[0] }}</small>
                  </validation-provider>
                </div>

                <div class="mb-4">
                  <div class="flex justify-between">
                    <label class="font-semibold" for="LoginPassword">Password:</label>
                    <p class="text-slate-400 mb-0"><BaseLink tag='a' :to="{ name: 're-password' }" class="text-theme-orange">Forgot password ?</BaseLink></p>
                  </div>
                  <validation-provider name="Password" v-slot="{ errors }" rules="required|min:8" mode="aggressive">
                    <div class="relative mt-1">
                      <input v-model="password" :type="passwordFieldType" id="LoginPassword" class="form-input pr-16" placeholder="Password:" :class="errors.length > 0 ? 'is-invalid':null">
                      <div class="absolute inset-y-0 right-0 flex items-center justify-end pr-2">
                        <div @click.prevent="togglePasswordVisibility" class="bg-gray-300 hover:bg-gray-400 rounded px-2 py-1 text-xs text-gray-600 font-mono cursor-pointer absolute">{{ passwordToggleTxt }}</div>
                      </div>
                    </div>
                    <small class="text-error">{{ errors[0] }}</small>
                  </validation-provider>
                </div>

                <div class="mb-4">
                  <BaseButton :disabled="tryingToLogIn" @click.prevent="tryToLogIn" type="submit" class="btn bg-red-500 hover:bg-red-500/75 border-red-500 hover:border-red-500/75 text-white rounded-md w-full">
                    <BaseIcon v-if="tryingToLogIn" name="sync" spin />
                    <span v-else>
                      Log In
                    </span>
                  </BaseButton>
                </div>

                <div class="mb-4 text-center">
                  <span class="text-slate-400 me-2">Don't have an account ?</span> <BaseLink tag='a' :to="{ name: 'register' }" class="text-theme-orange font-bold">Sign Up</BaseLink>
                </div>
              </div>
            </form>
          </validation-observer>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import { required, min, length, integer, email } from '@utils/validations'
import { authMethods } from '@state/helpers'
import { $appConfig } from '@src/app.config'

export default {
  page: {
    title: 'Log in',
    meta: [{ name: 'description', content: `Log in to ${$appConfig.app.appName}` }],
  },
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  data() {
    return {
      required, min, length, integer, email,
      username: 'sonny',
      password: 'qwerty1234',
      authError: null,
      tryingToLogIn: false,
      passwordFieldType: 'password',
    }
  },
  computed: {
    passwordToggleTxt() {
      return this.passwordFieldType === 'password' ? 'show' : 'hide'
    },
  },
  methods: {
    ...authMethods,
    // Try to log the user in with the username
    // and password they provided.
    tryToLogIn() {
      const vm = this
      vm.$refs.loginForm.validate().then(success => {
        if (success) {
          vm.tryingToLogIn = true
          vm.authError = null

          return vm.logIn({
            username: vm.username,
            password: vm.password,
            grant_type: 'password',
            client_id: process.env.VUE_APP_PASSPORT_CLIENT_ID,
            client_secret: process.env.VUE_APP_PASSPORT_CLIENT_SECRET,
          })
            .then((token) => {
              vm.validateUser().then((validUser) => {
                if (!validUser) {
                  vm.$events.fire('showNotif', { msg: 'There was an error logging in to your account.', variant: 'error' })
                }

                vm.tryingToLogIn = false
                // Redirect to the originally requested page, or to the home page
                vm.$router.push(vm.$route.query.redirectFrom || { name: 'home' })
              })
            })
            .catch((error) => {
              const { data, success, status_code } = error.response.data
              vm.$events.fire('showNotif', { msg: data.message, variant: 'error' })
              vm.tryingToLogIn = false
              vm.authError = error
            })
        }
      })
    },
    togglePasswordVisibility() {
      this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password'
    },
  },
}
</script>
