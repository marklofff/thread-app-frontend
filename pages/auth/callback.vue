<template>
  <section/>
</template>

<script>
export default {
  data() {
    return {
      loadingComponent: null,
      isFullPage: true
    }
  },
  mounted() {
    this.loadingComponent = this.$loading.open({
      container: this.isFullPage ? null : this.$refs.element.$el
    })
  },
  beforeDestroy() {
    loadingComponent.close()
  },
}
</script>