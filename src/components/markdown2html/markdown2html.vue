<!-- —————————————↓SCSS———————分界线————————————————————————— -->
<style lang="scss">
@import '../../scss/skin/default.scss';

.markdown2html {
  position: absolute;
  top: $header-height+$separation * 0.5;
  bottom: $separation;

  width: 100%;

  .markdown-catalog {
    position: absolute;
    left: $separation;
    border-top: $separation / 2 solid $main-color;
    border-bottom: $separation / 2 solid $main-color;

    overflow: auto;

    box-sizing: border-box;
    width: $catolog-width;
    height: 100%;
    padding: 1em .6em;

    li a {
      @extend %fontOver;
    }
  }
  .med-line {
    position: absolute;

    height: 100%;
    width: $separation / 2;
    margin-left: $catolog-width + $separation * 2;
    background: $main-color;
  }
  .markdown-html {
    position: relative; // 计算标题的offsetTop值
    overflow: auto;

    box-sizing: border-box;
    height: 100%;
    padding: $separation;
    margin-left: $catolog-width+$separation * 3.5;
    margin-right: $separation;
    border-top: $separation / 2 solid $main-color;
    border-bottom: $separation / 2 solid $main-color;

    a.link:hover {
      color:blue;
    }

    &:after {
      visibility: hidden;

      content: '输入辅助，不可见';
      font-size: 40px; // 这真是极好的
    }
  }
}
</style>

<!-- —————————————↓HTML————————分界线———————————————————————— -->
<template lang="pug">
.markdown2html
  transition(name="slide")
    .markdown-catalog(v-show="catalogShow", ref="catalog")
      //- 最多三层目录
      ul(v-for="v1 in catalogArr")
        li: a.title.level1(:href="'#'+v1.title") {{v1.title}}
        ul(v-if="v1.children && catalogLevel>=2",v-for="v2 in v1.children")
          li: a.title.level2(:href="'#'+v2.title") {{v2.title}}
          ul(v-if="v2.children && catalogLevel>=3",v-for="v3 in v2.children")
            li: a.title.level3(:href="'#'+v3.title") {{v3.title}}
  .med-line
  .markdown-html(v-html="markdownHtml", ref="markdownHtml")



</template>

<!-- ——————————————↓JS—————————分界线———————————————————————— -->
<script>
//import XXX from './components/XXX'
import BUS from '../bus.js'



import hljs from 'highlight.js'
import marked from 'marked'


export default {
  name: 'markdown2html',
  data() {
    return {
      msg: 'this is from markdown2html.vue',
      titleElsArr: [],
      catalogArr: [],
      colorArr: ['red', 'green', 'blue']
    }
  },
  props: {
    catalogLevel: { // 目录显示的标题级别数
      type: Number,
      default: 3  // 值 1 || 2 || 3
    },
    IgnoreCatalog: { // 忽略第一个标题（因为有时第一个标题是作为文章的标题）
      type: Boolean,
      default: false  // false || true
    },
    usehighLightCode: { // 时候使用代码高亮
      type: Boolean,
      default: true  // false || true
    }
  },
  computed: {
    winWidth() {
      return BUS.winWidth
    },
    catalogShow() {
      return BUS.catalogShow
    },
    markdownData() {
      return BUS.markdownData
    },
    markdownHtml() {
      return marked(this.ParsecolorTag(this.markdownData))
    },
  },
  created() {
    this.initCatalogShow()
    this.$watch('winWidth', this.initCatalogShow)
  },
  methods: {

    // —————————————————————————初始化————————————————————————————

    initCatalogShow() {  // 当屏幕宽度大于800时 有 media 来控制目录显示
      BUS.catalogShow = BUS.winWidth > 800 ? true : false
    },
    // ———————————————————————初始化-结束——————————————————————


    // —————————————————————————数据处理方法————————————————————————————
    trim(str) {
      return str.replace(/^\s|\s$/g, '')
    },

    titleElsForEach() {
      // window.eLog('重塑标题元素，获取titleElsArr', this)

      // 进行重置，在setTitle() 里重新进行添加
      this.titleElsArr = []
      var childrenEls = this.$refs.markdownHtml.children
      for (var i = 0; i < childrenEls.length; i++) {
        this.filterTitle(childrenEls[i], i, childrenEls)

        // 如果有表格就要移除一位
        if(this.setTableCaption(childrenEls[i], i, childrenEls)) i--
      }
      this.addLinkBlank()
    },
    // 重新设置标题元素（增加id 和 href）
    filterTitle(el, i) {
      // 非标题元素
      if (!el.tagName.toLowerCase().match(/^h\d*$/)) return

      this.titleElsArr.push(el)

      var hmtlText = this.trim(el.textContent)
      // marked的默认添加（中文字符就失效）
      el.removeAttribute('id')
      el.innerHTML = `<a class="title" href="#${hmtlText}" id="${hmtlText}">${el.innerHTML}</a>`

    },
    setTableCaption(el, i, children) {
      if (el.tagName.toLowerCase() === 'table' && i != 0 && children[i - 1].innerHTML.indexOf('T-T ') != -1) {
        var hmtlStr = children[i - 1].innerHTML
        var captionStr = hmtlStr.replace('T-T ', '')
        var oCaption = document.createElement('caption')
        oCaption.innerHTML = captionStr
        el.insertBefore(oCaption, el.children[0])
        this.$refs.markdownHtml.removeChild(children[i - 1])
        return true
      }
    },
    // 最多三级目录，最高级目录不一定是h1
    // 不要跳级使用目录（ 如：h1 后不要跟 h3 ）
    getCatalogArr(title) {
      //
      this.catalogArr = []

      // 第一级别的title可以是第一个title的级别
      if (this.titleElsArr.length === 0) return

      // 第一个目录标题的索引
      var firstIndex = this.titleElsArr.length > 2 && this.IgnoreCatalog ? 1 : 0

      var rootTitleIndex = parseInt(this.titleElsArr[firstIndex].tagName.substring(1))

      this.titleElsArr.forEach((v, i) => {
        var tagName = v.tagName.toLowerCase()
        switch (tagName) {
          case 'h' + rootTitleIndex:
            this.catalogArr.push({ title: v.textContent, level: 1 })
            break
          case 'h' + (rootTitleIndex + 1):
            // level1 最高级目录的最后一位（也就是当前操作的）
            var level1 = this.catalogArr[this.catalogArr.length - 1]
            if (!level1.children) this.$set(level1, 'children', [])
            level1.children.push({ title: v.textContent, level: 2 })
            break

          case 'h' + (rootTitleIndex + 2):
            var level1 = this.catalogArr[this.catalogArr.length - 1]

            // 错误消息
            if (BUS.showTipFn({ content: '目录不要跨级别使用', timeout: 5000, style: 'warn', condition: !level1.children })) return

            var level2 = level1.children[level1.children.length - 1]
            if (!level2.children) this.$set(level2, 'children', [])
            level2.children.push({ title: v.textContent, level: 3 })
            break
        }
      })
    },

    // —————————————————————————数据处理方法————————————————————————————


    // —————————————————————————具象方法————————————————————————————
    addLinkBlank() {
      var links = this.$refs.markdownHtml.getElementsByTagName('a')
      for (var i = 0; i < links.length; i++) {
        if (!links[i].className) {
          links[i].className = 'link'
          links[i].target = '_blank'
          links[i].title = links[i].href
          links[i].style.textDecoration = 'underline'
        }
      }
    },
    highLightCode() {
      if (!this.usehighLightCode) return

      var codeEls = document.querySelectorAll('code')
      if (codeEls.length === 0) return
      for (var i = 0; i < codeEls.length; i++) {
        hljs.highlightBlock(codeEls[i])
      }
    },
    ParsecolorTag(markdownStr) {
      var htmlStr = markdownStr
      this.colorArr.forEach((color) => {
        htmlStr = htmlStr.replace(new RegExp('\<' + color + '\>', "g"), `\<font color="${color}"\>`)
      })
      htmlStr = htmlStr.replace(/\<\/\>/g, `</font>`)
      return htmlStr
    }
    // —————————————————————————具象方法-结束————————————————————————————

  },

  watch: {
    markdownHtml: function () {
      this.$nextTick(() => {
        this.highLightCode()

        this.titleElsForEach()

        if (!BUS.catalogShow) return
        this.getCatalogArr()
      })
    },
    catalogShow: function (catalogShow) {
      // 懒渲染目录
      // 展开目录的时候渲染新的目录
      if (!catalogShow) return
      this.getCatalogArr()
    }
  }
}
</script>
