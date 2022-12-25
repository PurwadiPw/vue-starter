<template>
  <div class="toastification">
    <div class="flex items-start">
      <div class="avatar placeholder mr-2" :class="variant">
        <div class="flex items-center justify-center rounded-full w-8 h-8" :class="`bg-${selectedClass}`">
          <span class="text-xs text-white"><base-feather-icon :icon="icon" size="15" /></span>
        </div>
      </div>
      <div class="flex grow">
        <div>
          <h5 v-if="title" v-text="title" class="toastification-title font-bold uppercase leading-none" :class="`text-${selectedClass}`"/>
          <small v-if="text" class="text-black leading-none font-light" v-text="text" />
        </div>
        <span class="toastification-close-icon cursor-pointer ml-auto text-slate-400" @click.prevent="$emit('close-toast')">
          <base-feather-icon v-if="!hideClose" icon="XIcon" />
        </span>
      </div>
      <div class="hidden bg-[#3cbab2] bg-green-500 bg-blue-500 bg-yellow-500 bg-red-500 text-[#3cbab2] text-green-500 text-blue-500 text-yellow-500 text-red-500"></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    variant: {
      type: String,
      default: "primary",
    },
    icon: {
      type: String,
      default: null,
    },
    title: {
      type: String,
      default: null,
    },
    text: {
      type: String,
      default: null,
    },
    hideClose: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    selectedClass() {
      return this.colors[this.variant]
    },
  },
  data() {
    return {
      colors: {
        default: '[#3cbab2]',
        success: 'green-500',
        info: 'blue-500',
        warning: 'yellow-500',
        error: 'red-500',
        danger: 'red-500',
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.toastification-close-icon,
.toastification-title {
  line-height: 26px;
}

.toastification-title {
  color: inherit;
}
</style>
