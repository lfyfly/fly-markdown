<!-- —————————————↓SCSS———————分界线————————————————————————— -->
<style lang="scss">
@import '../../scss/skin/default.scss';


.markdown-header {
  position: relative;

  height: $header-height;
  border-top: $separation /2 solid $main-color;
  margin: 0 $separation;

  .catalog-btn {
    position: absolute;
    top: .9em;
    left: .4em;

    display: none; // 屏幕宽度大于800px默认隐藏
    width: 1em;
    height: .2em;
    padding: .2em 0;
    border-top: .2em solid $main-color;
    border-bottom: .2em solid $main-color;
    background: $main-color;
    background-clip: content-box;

    font-size: $font-size-l3;
  }
  .made-by {
    position: absolute;
    z-index: 9999;
    right: .2em;
    top: .2em;

    background: black;
    padding: 0 .2em;
    border-radius: 2px;

    color: white;
    font-size: 12px;
  }
  .document-title,
  .title-icon {
    display: inline-block;

    font-size: $font-size-l1;
    line-height: $header-height;
    vertical-align: middle;
  }
  .document-title {
    padding: 0 .4em;
  }

  .document-info {
    position: absolute;
    right: 0;
    bottom: .2em;

    min-width: 300px;

    text-align: right;

    span.info-key {
      font-weight: bold;
    }
  }
  .document-info>* {
    display: inline-block;

    padding-right: .8em;
    margin: 0;
  }
}
</style>

<!-- —————————————↓HTML————————分界线———————————————————————— -->
<template lang="pug">
.markdown-header
  a.catalog-btn(@click="toggleCatalog")
  a(href="", target="_blank", title="制作软件地址").made-by made by flyMarkdown

  .document-header(:class="{noFileInfo: IsNoFileInfo }")
    h1.document-title {{editingFile? editingFile.fileName: 'fly-markdown'}}
    a.title-icon.iconfont.icon-github(v-if="!editingFile")

    //- 还未开始编辑显示初始值(软件作者信息)，如果没有填入信息就不写入info
  .document-info(v-if="editingFile===null || ( editingFile!==null && editingFile.info.length!=0 )")
    .info(v-for="v in fileInfo")
      span.info-key {{v.key+': '}}
      span.info-value: a(:href="v | addHttp", :title="v | addHttp", :target="v.link?'_blank':false") {{v.value}}

</template>

<!-- ——————————————↓JS—————————分界线———————————————————————— -->
<script>
import BUS from '../bus.js'

export default {
  name: 'markdown-header',
  data() {
    return {
      msg: 'this is from markdown-header.vue',
    }
  },
  filters:{
    addHttp(v) {
      return v.link?(v.link.indexOf('http://')===-1? 'http://'+v.link:v.link): false
    }
  },
  computed: {
    winWidth() {
      return BUS.winWidth
    },
    editingFile() {
      return BUS.editingFile
    },
    fileInfo() {
      // 默认信息
      return BUS.editingFile && BUS.editingFile.info.length > 0 ?
        BUS.editingFile.info :
        BUS.editingFile?null:[{ key: '软件作者', value: 'lfyfly' }, { key: '邮箱', value: '410793635@qq.com' }]
    },
    catalogShow() {
      return BUS.catalogShow
    },
    IsNoFileInfo() {
      return  Boolean(BUS.editingFile && !this.fileInfo)
    }
  },
  methods: {
    toggleCatalog() {
      BUS.catalogShow = !BUS.catalogShow
    }
  }
}
</script>
