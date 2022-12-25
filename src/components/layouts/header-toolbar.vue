<template>
  <header class="header-component">
    <dx-toolbar class="header-toolbar">
      <dx-item :visible="menuToggleEnabled" location="before" css-class="menu-button">
        <template #default>
          <dx-button icon="menu" styling-mode="text" @click="toggleMenuFunc" />
        </template>
      </dx-item>

      <dx-item v-if="title" location="before" css-class="header-title max-w-none dx-toolbar-label">
        <template>
          <div>{{ title }}</div>
        </template>
      </dx-item>

      <dx-item location="after" locate-in-menu="auto" menu-item-template="menuUserItem">
        <template #default>
          <div>
            <dx-button class="user-button authorization" styling-mode="text">
              <user-panel :user="user" :menu-items="userMenuItems" menu-mode="context" />
            </dx-button>
          </div>
        </template>
      </dx-item>
      <template #menuUserItem>
        <user-panel :user="user" :menu-items="userMenuItems" menu-mode="list" />
      </template>
    </dx-toolbar>
  </header>
</template>

<script>
import DxButton from "devextreme-vue/button";
import DxToolbar, { DxItem } from "devextreme-vue/toolbar";
import UserPanel from "@components/layouts/user-panel.vue";
import { authComputed } from '@state/helpers'

export default {
  props: {
    menuToggleEnabled: Boolean,
    title: String,
    toggleMenuFunc: Function,
    logOutFunc: Function
  },
  components: {
    DxButton,
    DxToolbar,
    DxItem,
    UserPanel
  },
  computed: {
    ...authComputed,
  },
  created() {
    this.user = this.currentUser
  },
  data() {
    return {
      user: { },
      userMenuItems: [
        {
          text: "Profile",
          icon: "user",
          onClick: this.onProfileClick
        },
        {
          text: "Logout",
          icon: "runner",
          onClick: this.onLogoutClick
        }
      ]
    };
  },
  methods: {
    onLogoutClick() {
      this.$tabs.reset()
      this.$router.push({
        name: "logout",
        query: { redirect: { name: 'home' } },
      }).catch(() => {});
    },
    onProfileClick() {
      console.log('onProfileClick');
    }
  }
};
</script>

<style lang="scss">
@import "@themes/generated/variables.base.scss";
@import "~@design/variables/general";

.header-component {
  flex: 0 0 auto;
  z-index: 1;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);

  .dx-toolbar .dx-toolbar-item.menu-button > .dx-toolbar-item-content .dx-icon {
    color: $base-accent;
  }
}

.dx-toolbar.header-toolbar .dx-toolbar-items-container .dx-toolbar-after {
  padding: 0 40px;

  .screen-x-small & {
    padding: 0 20px;
  }
}

.dx-toolbar .dx-toolbar-item.dx-toolbar-button.menu-button {
  width: $side-panel-min-width;
  text-align: center;
  padding: 0;
}

.header-title .dx-item-content {
  padding: 0;
  margin: 0;
}

.dx-theme-generic {
  .dx-toolbar {
    padding: 10px 0;
  }

  .user-button > .dx-button-content {
    padding: 3px;
  }
}
</style>
