<!-- —————————————↓SCSS———————分界线————————————————————————— -->
<style lang="scss">
@import '../../scss/skin/default.scss';


.markdown-header {
  height: $header-height;
  border-top: $separation /2 solid $main-color;
  margin: 0 $separation;
  position: relative;
  .catalog-btn {
    display: inline-block;
    position: absolute;
    top: .9em;
    left: .4em;
    font-size: $font-size-l3;
    background: $main-color;
    width: 1em;
    height: .2em;
    padding: .2em 0;
    background-clip: content-box;
    border-top: .2em solid $main-color;
    border-bottom: .2em solid $main-color;
    display: none; // 屏幕宽度大于800px默认隐藏
  }

  .document-title,
  .title-icon {
    font-size: $font-size-l1;
    display: inline-block;
    line-height: $header-height;
  }
  .document-title {
    padding: 0 .4em;
  }

  .document-info {
    // min-width: 300px;
    text-align: right;
    position: absolute;
    right: 0;
    bottom: .2em;
    span.info-key {
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
  a.catalog-btn(@click="toggleCatalog")
  .document-header
    h1.document-title {{editingFile?editingFile.fileName: 'fly-markdown'}}
    a.title-icon.iconfont.icon-github
  .document-info
    //- 还未开始编辑显示初始值，如果没有填入信息就不写入info
    .info(v-if="editingFile===null||editingFile!==null&&editingFile.info.length!=0",v-for="v in fileInfo")
      span().info-key {{v.key+': '}}
      span().info-value: a(:href="v.link?v.link.indexOf('http://')===-1?'http://'+v.link:v.link:'javescript:void(0);'", :target="v.link?'_blank':''") {{v.value}}

</template>

<!-- ——————————————↓JS—————————分界线———————————————————————— -->
<script>
//import XXX from './components/XXX'
import BUS from '../bus.js'

export default {
  name: 'markdown-header',
  data() {
    return {
      msg: 'this is from markdown-header.vue',
    }
  },
  computed: {
    editingFile() {
      return BUS.editingFile
    },
    fileInfo() {
      // 默认信息
      return BUS.editingFile && BUS.editingFile.info.length > 0 ? BUS.editingFile.info : [{ key: '软件作者', value: 'lfyfly' }, { key: '邮箱', value: '410793635@qq.com' }]
    },
    catalogShow() {
      return BUS.catalogShow
    }
  },
  methods: {
    toggleCatalog() {
      BUS.catalogShow = !BUS.catalogShow
    },
  }
}
</script>
