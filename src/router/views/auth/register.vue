<template>
  <section class="h-screen flex items-center justify-center bg-[url('@assets/images/company/klinik-bg.svg')] bg-no-repeat bg-center">
    <div class="absolute inset-0 bg-gradient-to-b from-transparent to-black"></div>
    <div class="container">
      <div class="flex justify-center">
        <div class="max-w-[400px] w-full m-auto p-6 bg-white shadow-md rounded-md">
          <BaseLink tag='a' :to="{ name: 'home' }"><img src="@assets/images/logo.png" class="mx-auto" alt=""></BaseLink>
          <h5 class="my-6 text-xl font-semibold">Register</h5>

          <validation-observer ref="registerForm">
          <form class="text-left">
            <div class="grid grid-cols-1">
              <div class="mb-4">
                <label class="font-semibold" for="RegisterName">Full Name:</label>
                <validation-provider name="Full Name" v-slot="{ errors }" rules="required" mode="aggressive">
                  <input v-model="formData.name" id="RegisterName" type="text" class="form-input mt-1" placeholder="Your Full Name" :class="errors.length > 0 ? 'is-invalid':null">
                  <small class="text-error">{{ errors[0] }}</small>
                </validation-provider>
              </div>

              <div class="mb-4">
                <label class="font-semibold" for="RegisterEmail">Email Address:</label>
                <validation-provider name="Email" v-slot="{ errors }" rules="required|email" mode="aggressive">
                  <input v-model="formData.email" id="RegisterEmail" type="email" class="form-input mt-1" placeholder="name@example.com" :class="errors.length > 0 ? 'is-invalid':null">
                  <small class="text-error">{{ errors[0] }}</small>
                </validation-provider>
              </div>

              <div class="mb-4">
                <label class="font-semibold" for="RegisterPassword">Password:</label>
                <validation-provider name="Password" v-slot="{ errors }" rules="required|min:8" mode="aggressive" vid="password">
                  <div class="relative mt-1">
                    <input v-model="formData.password" :type="passwordFieldType" id="RePassword" class="form-input pr-16" placeholder="Password:" :class="errors.length > 0 ? 'is-invalid':null">
                    <div class="absolute inset-y-0 right-0 flex items-center justify-end pr-2">
                      <div @click.prevent="togglePasswordVisibility" class="bg-gray-300 hover:bg-gray-400 rounded px-2 py-1 text-xs text-gray-600 font-mono cursor-pointer absolute">{{ passwordToggleTxt }}</div>
                    </div>
                  </div>
                  <small class="text-error">{{ errors[0] }}</small>
                </validation-provider>
              </div>

              <div class="mb-4">
                <label class="font-semibold" for="RegisterPasswordConfirm">Password Confirmation:</label>
                <validation-provider name="Password Confirmation" v-slot="{ errors }" rules="required|min:8|confirmed:password" mode="aggressive">
                  <div class="relative mt-1">
                    <input v-model="formData.password_confirmation" :type="passwordConfirmFieldType" id="RePasswordConfirm" class="form-input pr-16" placeholder="Password Confirmation:" :class="errors.length > 0 ? 'is-invalid':null">
                    <div class="absolute inset-y-0 right-0 flex items-center justify-end pr-2">
                      <div @click.prevent="togglePasswordConfirmVisibility" class="bg-gray-300 hover:bg-gray-400 rounded px-2 py-1 text-xs text-gray-600 font-mono cursor-pointer absolute">{{ passwordConfirmToggleTxt }}</div>
                    </div>
                  </div>
                  <small class="text-error">{{ errors[0] }}</small>
                </validation-provider>
              </div>

              <div class="mb-4">
                <BaseButton :disabled="tryingToRegister" @click.prevent="tryToRegister" type="submit" class="btn bg-theme-orange hover:bg-theme-orange/75 border-theme-orange hover:border-theme-orange/75 text-white rounded-md w-full">
                  <BaseIcon v-if="tryingToRegister" name="sync" spin />
                  <span v-else>
                    Register
                  </span>
                </BaseButton>
              </div>

              <div class="mb-4 text-center">
                <span class="text-slate-400 me-2">Already have an account ?</span> <BaseLink tag='a' :to="{ name: 'login' }" class="text-theme-orange font-bold">Sign In</BaseLink>
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
import { required, min, length, integer, email, confirmed } from '@utils/validations'
import { authMethods } from '@state/helpers'
import { $appConfig } from '@src/app.config'

export default {
  page: {
    title: 'Register',
    meta: [{ name: 'description', content: `Register to ${$appConfig.app.appName}` }],
  },
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  data() {
    return {
      formData: {
        provider: 'default',
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
      },
      authError: null,
      tryingToRegister: false,
      passwordFieldType: 'password',
      passwordConfirmFieldType: 'password',
    }
  },
  computed: {
    passwordToggleTxt() {
      return this.passwordFieldType === 'password' ? 'show' : 'hide'
    },
    passwordConfirmToggleTxt() {
      return this.passwordConfirmFieldType === 'password' ? 'show' : 'hide'
    },
  },
  methods: {
    ...authMethods,
    // Try to log the user in with the username
    // and password they provided.
    tryToRegister() {
      const vm = this

      vm.$refs.registerForm.validate().then(success => {
        if (success) {
          vm.tryingToRegister = true
          // Reset the authError if it existed.
          vm.authError = null
          return vm.register(vm.formData).then((token) => {
            vm.validateUser().then((validUser) => {
              if (!validUser) {
                vm.$events.fire('showNotif', { msg: 'There was an error logging in to your account.', variant: 'error' })
              }

              vm.tryingToRegister = false
              // Redirect to the originally requested page, or to the home page
              vm.$router.push(this.$route.query.redirectFrom || { name: 'home' })
            })
          }).catch((error) => {
            vm.tryingToRegister = false
            vm.authError = error
          })
        }
      })
    },
    togglePasswordVisibility() {
      this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password'
    },
    togglePasswordConfirmVisibility() {
      this.passwordConfirmFieldType = this.passwordConfirmFieldType === 'password' ? 'text' : 'password'
    }
  },
}
</script>
