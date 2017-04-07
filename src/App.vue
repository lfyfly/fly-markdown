<template lang="pug">
#app
  markdown-header
  markdown-input(v-model="markdownStr", @flod="textareaFold", ref="markdownInput")
  markdown2html(:value="markdownStr")
</template>

<script>
import markdownInput from './components/markdown-input/markdown-input.vue'
import markdown2html from './components/markdown2html/markdown2html.vue'
import markdownHeader from './components/markdown-header//markdown-header.vue'




export default {
  name: 'app',
  data() {
    return {
      // 时候为移动设备
      isMobile: false,
      // 双向绑定 markdown-input组件
      markdownStr: "",

      // 只有在输入输入时滚动offsetHeight发生改变
      //  resposeScroll() 中绑定滚动事件使用
      oldScrollHeight: 0,
      inputScrollEl: null,
      htmlScrollEl: null,
      oldScrollTop: 0,

      //移动端 和 桌面端小于500px 折叠时，markdown-html 区域大小同步
      htmlContainerEl: null,
      markdownInputEl: null
    }
  },
  methods: {
    // 初始化一些data中的数据
    init() {
      this.getIsMobile()
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
    getIsMobile() {
      if (navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i)) {
        this.isMobile = true
      }
    },
    textareaFold() {
      if (this.isMobile || window.innerWidth <= 500) {
        // DOM 重渲了
        this.$nextTick(() => {
          this.htmlContainerEl.style.bottom = this.markdownInputEl.offsetHeight + 'px'
        })
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
      if (this.isMobile) {
        var oInput = document.querySelector('#markdown-input')
        var oTextarea = oInput.getElementsByTagName('textarea')[0]
        if (window.innerWidth <= 500) {
          var height = 110;
          oInput.style.bottom = '0'

        } else { // 屏幕大于500 的桌面端和移动端不一样
          this.htmlScrollEl.style.borderBottom = "none"
          var height = 210;
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
    }
  },
  mounted() {
    this.init()

    this.mobileInput()
    this.resposeScroll()
  },
  components: {
    markdownInput,
    markdown2html,
    markdownHeader
  }
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
