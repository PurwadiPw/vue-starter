<template>
  <section class="h-screen flex items-center justify-center bg-[url('@assets/images/company/klinik-bg.svg')] bg-no-repeat bg-center">
    <div class="absolute inset-0 bg-gradient-to-b from-transparent to-black"></div>
    <div class="container">
      <div class="flex justify-center">
        <div class="max-w-[400px] w-full m-auto p-6 bg-white shadow-md rounded-md">
          <BaseLink tag='a' :to="{ name: 'home' }"><img src="@assets/images/logo.png" class="mx-auto" alt=""></BaseLink>
          <h5 class="my-6 text-xl font-semibold">Reset Your Password</h5>

          <div v-if="!isTokenGenerated" class="grid grid-cols-1">
            <p class="text-slate-400 mb-6">Please enter your email address. You will receive a code to create a new password via email.</p>
            <validation-observer ref="requestPasswordForm">
            <form class="text-left">
              <div class="grid grid-cols-1">
                <div class="mb-4">
                  <label class="font-semibold" for="LoginEmail">Email Address:</label>
                  <validation-provider name="Email" v-slot="{ errors }" rules="required|email" mode="aggressive">
                    <input v-model="formData.email" id="LoginEmail" type="email" class="form-input mt-1" placeholder="name@example.com" :class="errors.length > 0 ? 'is-invalid':null">
                    <small class="text-error">{{ errors[0] }}</small>
                  </validation-provider>
                </div>

                <div class="mb-4">
                  <BaseButton :disabled="tryingToLogIn" @click.prevent="requestResetPassword" type="submit" class="btn bg-theme-orange hover:bg-theme-orange/75 border-theme-orange hover:border-theme-orange/75 text-white rounded-md w-full">
                    <BaseIcon v-if="tryingToLogIn" name="sync" spin />
                    <span v-else>
                      Send
                    </span>
                  </BaseButton>
                </div>

                <div class="mb-4 text-center">
                  <span class="text-slate-400 me-2">Remember your password ?</span> <BaseLink tag='a' :to="{ name: 'login' }" class="text-theme-orange font-bold">Sign In</BaseLink>
                </div>

                <div class="text-center">
                  <BaseLink tag='a' :to="{ name: 'home' }" class="text-theme-orange font-bold">Back to Home</BaseLink>
                </div>
              </div>
            </form>
            </validation-observer>
          </div>

          <div v-if="isTokenGenerated" class="grid grid-cols-1">
            <p class="text-slate-400 mb-6"> {{ responseMsg || 'You have recently generated a password reset token. Please check emails.' }}</p>
            <validation-observer ref="resetPasswordForm">
            <form class="text-left">
              <div class="grid grid-cols-1">
                <div class="mb-4">
                  <label class="font-semibold" for="RePasswordToken">Password Reset Code:</label>
                  <validation-provider name="Password Reset Code" v-slot="{ errors }" rules="required|min:6" mode="aggressive">
                    <input v-model="formData.token" id="RePasswordToken" type="text" class="form-input mt-1" placeholder="Code:" :class="errors.length > 0 ? 'is-invalid':null">
                    <small class="text-error">{{ errors[0] }}</small>
                  </validation-provider>
                </div>

                <div class="mb-4">
                  <label class="font-semibold" for="RePassword">Password:</label>
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
                  <label class="font-semibold" for="RePasswordConfirm">Password Confirmation:</label>
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
                  <BaseButton :disabled="tryingToLogIn" @click.prevent="doResetPassword" type="submit" class="btn bg-theme-orange hover:bg-theme-orange/75 border-theme-orange hover:border-theme-orange/75 text-white rounded-md w-full">
                    <BaseIcon v-if="tryingToLogIn" name="sync" spin />
                    <span v-else>
                      Send
                    </span>
                  </BaseButton>
                </div>

                <div class="mb-4 text-center">
                  <span class="text-slate-400 me-2">Remember your password ?</span> <BaseLink tag='a' :to="{ name: 'login' }" class="text-theme-orange font-bold">Sign In</BaseLink>
                </div>
              </div>
            </form>
            </validation-observer>
          </div>

        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import { required, min, length, integer, email, confirmed } from '@utils/validations'
import { authMethods } from '@state/helpers'

export default {
  page: {
    title: 'Reset Password',
    meta: [{ name: 'description', content: 'Reset Your Password' }],
  },
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  data() {
    return {
      required, min, length, integer, email, confirmed,
      formData: {
        email: '',
        token: '',
        password: '',
        password_confirmation: '',
      },
      authError: null,
      tryingToLogIn: false,
      isTokenGenerated: false,
      responseMsg: null,
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
    requestResetPassword() {
      const vm = this
      vm.$refs.requestPasswordForm.validate().then(success => {
        if (success) {
          vm.tryingToLogIn = true
          vm.authError = null

          return vm.forgotPassword(vm.formData).then((response) => {
            vm.tryingToLogIn = false
            vm.isTokenGenerated = true
            vm.responseMsg = response.message
          }).catch((error) => {
            vm.tryingToLogIn = false
            vm.authError = error
          });
        }
      })
    },
    doResetPassword() {
      const vm = this
      vm.$refs.resetPasswordForm.validate().then(success => {
        if (success) {
          this.tryingToLogIn = true
          this.authError = null

          return vm.resetPassword(vm.formData).then((response) => {
            vm.$events.fire('showNotif', { title: 'Success!', msg: response, variant: 'success' })
            vm.tryingToLogIn = false
            vm.isTokenGenerated = false
            vm.$router.push({ name: 'login' })
          }).catch((error) => {
            vm.tryingToLogIn = false
            vm.authError = error
          });
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
