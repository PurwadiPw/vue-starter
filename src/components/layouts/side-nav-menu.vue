<template>
  <div
    class="dx-swatch-additional side-navigation-menu"
    @click="forwardClick"
  >
    <slot />
    <div class="menu-container">
      <dx-tree-view
        :ref="treeViewRef"
        :items="items"
        :focus-state-enabled="false"
        :search-enabled="true"
        expand-event="click"
        key-expr="path"
        selection-mode="single"
        width="100%"
        @item-click="handleItemClick"
      >
        <template #item="item">
          <div class="flex" :class="{ 'ml-4': item.data.icon }">
            <base-feather-icon v-if="item.data.icon" :icon="item.data.icon" class="mr-3.5" />
            <span class="uppercase truncate">{{ item.data.text }}</span>
          </div>
        </template>
      </dx-tree-view>
    </div>
  </div>
</template>

<script>
import DxTreeView from "devextreme-vue/ui/tree-view";
import { sizes } from '@utils/media-query';
import { appComputed } from '@state/helpers'

const treeViewRef = "treeViewRef";
const isLargeScreen = sizes()['screen-large'];

export default {
  props: {
    compactMode: Boolean
  },
  computed: {
    ...appComputed,
  },
  data() {
    return {
      treeViewRef,
      items: [],
      ps: null
    };
  },
  methods: {
    forwardClick(...args) {
      this.$emit("click", args);
    },

    handleItemClick(e) {
      if (!e.itemData.path || this.compactMode) {
        return;
      }
      // console.log(this.$router.options.routes);
      // console.log(this.$router.getRoutes());

      this.$router.push({
        name: e.itemData.route
      }).catch(() => {});

      const pointerEvent = e.event;
      pointerEvent.stopPropagation();
    },

    updateSelection() {
      if (!this.treeView) {
        return;
      }

      this.treeView.selectItem(this.$route.path);
      this.treeView.expandItem(this.$route.path);
    },
  },
  mounted() {
    const menuTmp = this.$_cloneDeep(this.menu)
    let menu = menuTmp.map((item) => {
      if(item.path && !(/^\//.test(item.path))){
        item.path = `/${item.path}`;
      }
      return {...item, expanded: false}
    });
    this.items = menu

    this.treeView = this.$refs[treeViewRef] && this.$refs[treeViewRef].instance;
    this.updateSelection();
    if (this.compactMode) {
      this.treeView.collapseAll();
    }

    this.initPerfectScrollbar('.dx-scrollable-container')
  },
  watch: {
    $route() {
      this.updateSelection();
    },
    compactMode() {
      if (this.compactMode) {
        this.treeView.collapseAll();
      } else {
        this.updateSelection();
      }
    }
  },
  components: {
    DxTreeView
  }
};
</script>

<style lang="scss">
@import "~@design/variables/general";
@import "@themes/generated/variables.additional.scss";

.side-navigation-menu {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  height: 100%;
  width: 200px !important;

  .menu-container {
    min-height: 100%;
    display: flex;
    flex: 1;

    .dx-treeview {
      // ## Long text positioning
      white-space: nowrap;
      // ##

      // ## Icon width customization
      .dx-treeview-item {
        @apply flex items-center;
        padding-left: 0;
        padding-right: 0;

        .dx-icon {
          width: $side-panel-min-width !important;
          margin: 0 !important;
        }
      }
      // ##

      .dx-treeview-toggle-item-visibility {
        right: 10px;
        left: auto;
      }

      .dx-rtl .dx-treeview-toggle-item-visibility {
        left: 10px;
        right: auto;
      }
      // ##

      // ## Item levels customization
      .dx-treeview-node {
        padding: 0 0 !important;

        .dx-treeview-node-container {
          &.dx-treeview-node-container-opened {
            @apply relative;
            // border-top: 1px solid #596980;
            &::before {
              content: "";
              display: block;
              position: absolute;
              z-index: 1;
              left: 23px;
              top: 0;
              bottom: 12px;
              border-left: 1px solid #aab2b5;
            }
          }
        }

        &[aria-level="1"] {
          font-weight: normal;
          border-bottom: 1px solid $base-border-color;
        }

        &[aria-level="2"] {
          .dx-treeview-item-content {
              font-weight: normal;
              width: 200px;
              @apply py-0 pl-11;
              &::before {
                content: "";
                display: inline-block;
                position: absolute;
                width: 5px;
                height: 5px;
                left: 21px;
                top: 12px;
                background-color: #aab2b5;
                border: 1px solid #aab2b5;
                z-index: 2;
                @apply rounded-full;
              }
            }
          }
        }
      // ##
    }

    // ## Selected & Focuced items customization
    .dx-treeview {
      .dx-treeview-node-container {
        .dx-treeview-node {
          &.dx-state-selected:not(.dx-state-focused) > .dx-treeview-item {
            background: transparent;
          }

          &.dx-state-selected > .dx-treeview-item * {
            color: $base-accent;
          }

          &:not(.dx-state-focused) > .dx-treeview-item.dx-state-hover {
            background-color: lighten($base-bg, 4);
          }
        }
      }
    }

    .dx-theme-generic .dx-treeview {
      .dx-treeview-node-container
        .dx-treeview-node.dx-state-selected.dx-state-focused
        > .dx-treeview-item
        * {
        color: inherit;
      }
    }
    // ##
  }
}
</style>
