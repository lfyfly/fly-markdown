<template lang="pug">
#app
  markdown-header
  markdown-input(v-model="markdownStr")
  markdown2html(:value="markdownStr")
</template>

<script>
import markdownInput from './components/markdown-input/markdown-input.vue'
// import superMarkdown from './components/super-markdown/super-markdown.vue'
import markdown2html from './components/markdown2html/markdown2html.vue'
import markdownHeader from './components/markdown-header//markdown-header.vue'




export default {
  name: 'app',
  data() {
    return {
      markdownStr: "",
      // 只有在输入输入时滚动offsetHeight发生改变
      oldScrollHeight: 0,
      oldScrollTop: 0
    }
  },
  methods: {
    resposeScroll() {
      // 滚动区域
      var inputScrollEl = document.querySelector('textarea')
      // 内容区域
      var htmlScrollEl = document.querySelector('.markdown-html')
      var inputScrollFn = (e) => {
        if( e.target.scrollTop < this.oldScrollTop || this.oldScrollHeight=== e.target.scrollHeight) return
        this.oldScrollTop = e.target.scrollTop
        this.oldScrollHeight = e.target.scrollHeight
        console.log(e.target.scrollTop , e.target.scrollHeight, e.target.scrollHeight- e.target.scrollTop,e.target.offsetHeight)
        var whenScroll = e.target.scrollHeight- e.target.scrollTop
        if(whenScroll>e.target.offsetHeight && whenScroll<= e.target.offsetHeight +10 ) {
          // 滚动到最底部
          // 由于换行的时机不一样
          htmlScrollEl.scrollTop = htmlScrollEl.scrollHeight
        }
      }
      inputScrollEl.addEventListener('scroll',inputScrollFn )
    },
    mobile() {
      if (navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i)) {
        var oInput = document.querySelector('#markdown-input')
        var oTextarea = oInput.getElementsByTagName('textarea')[0]
        if (window.innerWidth <= 500) {
          var height = 110;

        } else { // 屏幕大于500 的桌面端和移动端不一样
          var height = 210;
          oInput.style.left = '0'
          oInput.style.bottom = '0'
          oInput.style.top = 'auto'
          oInput.style.right = 'auto'
          oInput.style.width = '100%'
          oTextarea.style.width = '100%'
        }
        oInput.style.height = height + 'px'
        oTextarea.style.height = (height - 30) + 'px' // 20 的整数
        document.querySelector('.markdown2html').style.bottom = height + 'px'
      }
    }
  },
  mounted() {
    // 移动端
    this.mobile()
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
