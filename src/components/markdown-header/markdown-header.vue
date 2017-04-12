<!-- —————————————↓SCSS———————分界线————————————————————————— -->
<style lang="scss">
@import '../../scss/skin/default.scss';


.markdown-header {
  height: $header-height;
  border-top: $separation /2 solid $main-color;
  margin: 0 $separation;
  position: relative;


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
    min-width: 300px;
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
  a.catalog-btn
  .document-header
    h1.document-title {{isEditing?isEditing.fileName: 'fly-markdown'}}
    a.title-icon.iconfont.icon-github
  .document-info
    //- 还未开始编辑显示初始值，如果没有填入信息就不写入info
    .info(v-if="isEditing===null||isEditing!==null&&isEditing.info.length!=0",v-for="v in fileInfo")
      span().info-key {{v.key+': '}}
      span().info-value: a {{v.value}}



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
    isEditing() {
      return BUS.isEditing
    },
    fileInfo() {
      // 默认信息
      return BUS.isEditing && BUS.isEditing.info.length > 0 ? BUS.isEditing.info : [{ key: '软件作者', value: 'lfyfly' }, { key: '邮箱', value: '410793635@qq.com' }]
    }
  },
}
</script>
