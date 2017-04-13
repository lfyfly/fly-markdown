<template lang="pug">
#app
  markdown-header
  markdown2html
  markdown-input(v-model="markdownStr", @flod="textareaFold", ref="markdownInput")
  new-markdown(type="create")
  new-markdown(type="revise")
  rename(:renameFileList="renameFileList")
</template>

<script>
import BUS from './components/bus.js'

import markdownInput from './components/markdown-input/markdown-input.vue'
import markdown2html from './components/markdown2html/markdown2html.vue'
import markdownHeader from './components/markdown-header/markdown-header.vue'
import newMarkdown from './components/new-markdown/new-markdown.vue'
import rename from './components/rename/rename.vue'



export default {
  name: 'app',
  data() {
    return {
      // 双向绑定 markdown-input组件
      markdownStr: "",

      // 只有在输入输入时滚动offsetHeight发生改变
      //  resposeScroll() 中绑定滚动事件使用
      oldScrollHeight: 0,
      inputScrollEl: null,
      htmlScrollEl: null,
      oldScrollTop: 0,

      //移动端 和 桌面端小于440px 折叠时，markdown-html 区域大小同步
      htmlContainerEl: null,
      markdownInputEl: null,

      // 手机的markdown-input高度
      phoneInputHeight: 110,
      // 平板的markdown-input高度
      padInputHeight: 210,

      // 自动保存数据到localStorage中的时间间隔
      autoSaveInterval: 3000
    }
  },
  computed: {
    renameFileList() {
      return BUS.renameFileList
    }
  },
  methods: {
    // 初始化一些data中的数据
    init() {
      this.getInputScrollEl()
      this.getHtmlScrollEl()
      // markdown转义为html后转进的日期元素
      this.getHtmlContainerEl()
      // markdown-input 组件元素
      this.getMarkdownInputEl()
    },
    getInputScrollEl() {
      this.inputScrollEl = document.querySelector('textarea')
    },
    getHtmlScrollEl() {
      this.htmlScrollEl = document.querySelector('.markdown-html')
    },
    getHtmlContainerEl() {
      this.htmlContainerEl = document.querySelector('.markdown2html')
    },
    getMarkdownInputEl() {
      this.markdownInputEl = this.$refs.markdownInput.$el
    },
    // 调整底部给markdown-input 腾出的空间
    //同时也会在resize中调用（因为可能textarea可能在收起的状态下，进入<440px）
    // 当屏幕小于440px，markdown-input 发生折叠事件，会产生bottom，再次resize window时需要清除
    // winWidth> 440,清除markdown-html 的bottom
    textareaFold() {
      if (BUS.isMobile || window.innerWidth <= 440) {
        // DOM 重渲了
        this.$nextTick(() => {
          this.htmlContainerEl.style.bottom = this.markdownInputEl.offsetHeight + 'px'
        })
      } else {
        this.htmlContainerEl.style = ''
      }
    },
    resposeScroll() {
      // 内容区域
      var inputScrollFn = (e) => {
        if (e.target.scrollTop < this.oldScrollTop || this.oldScrollHeight === e.target.scrollHeight) return
        this.oldScrollTop = e.target.scrollTop
        this.oldScrollHeight = e.target.scrollHeight
        console.log(e.target.scrollTop, e.target.scrollHeight, e.target.scrollHeight - e.target.scrollTop, e.target.offsetHeight)
        var whenScroll = e.target.scrollHeight - e.target.scrollTop
        if (whenScroll > e.target.offsetHeight && whenScroll <= e.target.offsetHeight + 10) {
          // 滚动到最底部
          // 由于换行的时机不一样
          this.htmlScrollEl.scrollTop = this.htmlScrollEl.scrollHeight
        }
      }
      this.inputScrollEl.addEventListener('scroll', inputScrollFn)
    },
    mobileInput() {
      if (BUS.isMobile) {
        var oInput = document.querySelector('#markdown-input')
        var oTextarea = oInput.getElementsByTagName('textarea')[0]
        if (window.innerWidth <= 440) {
          var height = this.phoneInputHeight;
          oInput.style.bottom = '0'

        } else { // 屏幕大于440 的桌面端和移动端不一样
          this.htmlScrollEl.style.borderBottom = "none"
          var height = this.padInputHeight;
          oInput.style.left = '0'
          oInput.style.bottom = '0'
          oInput.style.top = 'auto'
          oInput.style.right = 'auto'
          oInput.style.width = '100%'
          oTextarea.style.width = '100%'
        }
        // oInput.style.height = height + 'px'
        oTextarea.style.height = (height - 30) + 'px' // 20 的整数
        document.querySelector('.markdown2html').style.bottom = height + 'px'
      }
    },

    // 数据保存
    saveToLocalStorage() {
      // 文件是否存在
      alert(123)
      // 没有则创建一个
    },
    setAutoSave() {
      setInterval(this.saveToLocalStorage, saveToLocalStorage, this.autoSaveInterval)
    },


  },
  mounted() {
    this.init()
    this.mobileInput()
    this.resposeScroll()

    window.addEventListener('resize', this.textareaFold)
  },
  components: {
    markdownInput,
    markdown2html,
    markdownHeader,
    newMarkdown,
    rename
  },

}
</script>

<style>
body,
html {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}

body>#app {
  height: 100%;
  overflow: hidden;
}
</style>
