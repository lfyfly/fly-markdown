<!-- —————————————↓SCSS———————分界线————————————————————————— -->
<style lang="scss">
@import '../../scss/skin/default.scss';
</style>

<!-- ——————————————↓HTML—————————分界线———————————————————————— -->

<template lang="pug">
.super-markdown
  slot
</template>

<!-- ——————————————↓JS—————————分界线———————————————————————— -->
<script>
// import hljs from 'highlight.js'
// import 'highlight.js/styles/darcula.css'
// hljs.initHighlightingOnLoad();


export default {
  name: 'super-markdown',
  data() {
    return {
      msg: 'this is from super-markdown.vue'
    }
  },
  methods: {

  },
  mounted() {
    this.childrenForEach()
    alert(document.getElementsByTagName('html')[0].innerHTML)
  }
}
</script>
