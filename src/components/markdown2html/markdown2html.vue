<!-- —————————————↓SCSS———————分界线————————————————————————— -->
<style lang="scss">
@import '../../scss/skin/default.scss';


.markdown2html {
  width: 100%;
  position: absolute;
  top: $header-height+$separation * 0.5;
  bottom: $separation; // 展开
  $catalog-btn-height: 20px;
  $catalog-btn-color: #606060;
  $catalog-btn-height-s: $catalog-btn-height / 5;



  .markdown-catalog {
    position: absolute;
    left: $separation;
    width: $catolog-width;
    height: 100%;
    overflow: auto;
    box-sizing: border-box; // border: 1px solid;
    border-top: $separation / 2 solid $main-color;
    border-bottom: $separation / 2 solid $main-color;
  }
  .med-line {
    position: absolute;
    height: 100%;
    width: $separation / 2;
    background: $main-color;
    margin-left: $catolog-width+$separation * 2;
  }
  .markdown-html {
    margin-left: $catolog-width+$separation * 3.5;
    margin-right: $separation; // border: $separation / 2 solid;
    border-top: $separation / 2 solid $main-color;
    border-bottom: $separation / 2 solid $main-color;
    padding: $separation;
    height: 100%;
    overflow: auto;
    box-sizing: border-box; // 这真是极好的
    &:after {
      content: '输入辅助，不可见';
      font-size: 40px;
      opacity: 0;
    }
  }
}
</style>

<!-- —————————————↓HTML————————分界线———————————————————————— -->
<template lang="pug">
.markdown2html
  transition(name="slide")
    .markdown-catalog(v-show="catalogShow", ref="catalog")
      ul(v-for="v1 in catalogArr")
        li: a.title.level1(:href="'#'+v1.title") {{v1.title}}
        ul(v-if="v1.children",v-for="v2 in v1.children")
          li: a.title.level2(:href="'#'+v2.title") {{v2.title}}
          ul(v-if="v2.children",v-for="v3 in v2.children")
            li: a.title.level3(:href="'#'+v3.title") {{v3.title}}
  .med-line
  .markdown-html(ref="markdownContent")



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
      oldWindowWidth: 0,
      titleElsArr: [],
      catalogArr: []
    }
  },
  computed: {
    catalogShow() {
      return BUS.catalogShow
    },
    markdownData() {
      return BUS.markdownData
    }
  },
  methods: {

    // 当屏幕宽度大于800时 有media 来控制目录显示
    removeCatalogDisplay() {
      var winWidth = window.innerWidth
      // 不变 发生在移动端（输入法回收或者进入时会触发 resie）
      if (winWidth === this.oldWindowWidth) return
      this.oldWindowWidth = winWidth
      if (window.innerWidth > 800) {
        BUS.catalogShow = true
      } else {
        BUS.catalogShow = false
      }
    },

    // 最多三级目录，最高级目录不一定是h1
    // 不要跳级使用目录（ 如：h1 后不要跟 h3 ）
    getCatalogArr(title) {
      this.catalogArr = []
      // 第一级别的title是h1 或者 h2 。。。

      if (this.titleElsArr.length === 0) return
      var rootTitleIndex = parseInt(this.titleElsArr[0].tagName.substring(1))
      console.log('rootTitleIndex', rootTitleIndex, typeof rootTitleIndex)
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
            var level2 = level1.children[level1.children.length - 1]
            if (!level2.children) this.$set(level2, 'children', [])
            level2.children.push({ title: v.textContent, level: 3 })
            break
        }
      })
    },
    childrenForEach() {
      // 进行重置，在setTitle() 里进行添加
      this.titleElsArr = []

      var children = this.$refs.markdownContent.children
      for (var i = 0; i < children.length; i++) {
        this.setTitle(children[i], i, children)
        this.setTableCaption(children[i], i, children)
      }
    },
    setTitle(v, i, children) {
      if (v.tagName.toLowerCase().match(/^h\d*$/)) {
        this.titleElsArr.push(v)

        var hmtlText = v.textContent
        v.innerHTML = `<a class="title" href="#${hmtlText}" id="${hmtlText}">${v.innerHTML}</a>`
      }
    },
    setTableCaption(v, i, children) {
      if (v.tagName.toLowerCase() === 'table' && i != 0 && children[i - 1].innerHTML.indexOf('T-T ') != -1) {
        var hmtlStr = children[i - 1].innerHTML
        var captionStr = hmtlStr.replace('T-T ', '')
        var oCaption = document.createElement('caption')
        oCaption.innerHTML = captionStr
        v.insertBefore(oCaption, v.children[0])
        this.$refs.markdownContent.removeChild(children[i - 1])
      }
    }
  },
  mounted() {
    // 初始判断
    this.removeCatalogDisplay()
    window.addEventListener('resize', this.removeCatalogDisplay)
  },
  watch: {
    markdownData: function () {
      this.$refs.markdownContent.innerHTML = marked(this.markdownData)

      this.$nextTick(() => {
        this.childrenForEach()
        this.getCatalogArr()
        var codeEls = document.querySelectorAll('code')
        for (var i = 0; i < codeEls.length; i++) {
          hljs.highlightBlock(codeEls[i]);
        }

      })
    }
  }
}
</script>
