import PerfectScrollbar from "perfect-scrollbar";

export default {
  methods: {
    initPerfectScrollbar(container) {
      this.$nextTick(() => {
        this.ps = new PerfectScrollbar(container, {
          wheelPropagation: true,
        });
      })
    }
  }
}
