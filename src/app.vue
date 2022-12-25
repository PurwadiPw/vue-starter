<template>
  <div id="root">
    <div :class="cssClasses">
      <router-view name="layout" :title="title" :is-x-small="screen.isXSmall" :is-large="screen.isLarge">
        <div class="content">
          <router-view name="content" />
        </div>
      </router-view>
    </div>
  </div>
</template>

<script>
import { $appConfig } from '@src/app.config'
import { sizes, subscribe, unsubscribe } from "@utils/media-query";

import ToastificationContent from '@components/plugins/toastification-content.vue'

function getScreenSizeInfo() {
  const screenSizes = sizes();

  return {
    isXSmall: screenSizes["screen-x-small"],
    isLarge: screenSizes["screen-large"],
    cssClasses: Object.keys(screenSizes).filter(cl => screenSizes[cl])
  };
}

export default {
  page: {
    // All subcomponent titles will be injected into this template.
    titleTemplate(title) {
      title = typeof title === 'function' ? title(this.$store) : title
      return title ? `${title} | ${$appConfig.app.appName}` : $appConfig.app.appName
    },
  },
  data() {
    return {
      title: $appConfig.app.appName,
      screen: getScreenSizeInfo()
    };
  },
  computed: {
    cssClasses() {
      return ["app"].concat(this.screen.cssClasses);
    }
  },
  methods: {
    screenSizeChanged() {
      this.screen = getScreenSizeInfo();
    }
  },
  events: {
    showNotif(payloads) {
      this.$toast.clear();
      this.$toast({
        component: ToastificationContent,
        props: {
          title: payloads.title !== undefined && payloads.title !== '' ? payloads.title : 'Proses Gagal',
          text: payloads.msg !== undefined ? payloads.msg : '',
          icon: payloads.icon !== undefined ? payloads.icon : 'BellIcon',
          variant: payloads.variant !== undefined ? payloads.variant : 'success'
        }
      });
    }
  },
  mounted() {
    subscribe(this.screenSizeChanged);
  },
  beforeDestroy() {
    unsubscribe(this.screenSizeChanged);
  },
}
</script>

<style lang="scss">

// @import '@design/index.scss';
// @import '@design/icons.scss';

// Normalize default styles across browsers,
// https://necolas.github.io/normalize.css/
@import '~normalize.css/normalize.css';

// Style loading bar between pages.
// https://github.com/rstacruz/nprogress
@import '~nprogress/nprogress.css';

#nprogress .bar {
  // background: $color-link-text;
}

html,
body {
  margin: 0px;
  min-height: 100%;
  height: 100%;
}

#root {
  height: 100%;
}

* {
  box-sizing: border-box;
}

.app {
  @import "@themes/generated/variables.base.scss";
  background-color: darken($base-bg, 5);
  // display: flex;
  height: 100%;
  width: 100%;
}
</style>
