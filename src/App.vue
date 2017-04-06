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
      markdownStr: ""
    }
  },
  methods: {
    mobile() {
      if (navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i)) {
        var oInput = document.querySelector('#markdown-input')
        oInput.style.height = '100px'
        oInput.getElementsByTagName('textarea')[0].style.height='70px'
        document.querySelector('.markdown2html').style.bottom="100px"
      }
    }
  },
  mounted() {
    // 移动端
    this.mobile()
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
