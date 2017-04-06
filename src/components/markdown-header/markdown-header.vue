<!-- —————————————↓SCSS———————分界线————————————————————————— -->
<style lang="scss">
@import '../../scss/layout.scss';

.markdown-header {
  height: $header-height;
  border-top: $separation /2 solid $line-color;
  margin: 0 $separation;
  position: relative;


  .document-title {
    font-size: $font-size-l1;
    height: 100%;
    display: inline-block;
    line-height: $header-height;
    vertical-align: middle;
    padding: 0 .4em;
  }
  .github-icon {
    vertical-align: middle;
    display: inline-block;
    width: $icon-size;
    height: $icon-size;
    background-image: $icon-url;
    background-size: $icon-size $icon-size;
    background-repeat: no-repeat;
  }
  .document-info {
    min-width: 300px;
    position: absolute;
    right: 0;
    bottom: .2em;
    .author:before {
      content: 'athour: ';
      font-weight: bold;
    }
    .e-mail:before {
      content: 'e-mail: ';
      font-weight: bold;
    }
  }
  .document-info>* {
    display: inline-block;
    margin: 0;
    padding-right: .8em;
  }
}
</style>

<!-- —————————————↓HTML————————分界线———————————————————————— -->
<template lang="pug">
.markdown-header
  a.catalog-btn
  .document-header
    h1.document-title 文档标题
    a.github-icon(href="")
  .document-info
    .author: a lfyfly
    .e-mail: a 410793635@qq.com


</template>

<!-- ——————————————↓JS—————————分界线———————————————————————— -->
<script>
//import XXX from './components/XXX'

export default {
  name: 'markdown-header',
  data() {
    return {
      msg: 'this is from markdown-header.vue'
    }
  },
  methods: {

  }
}
</script>
