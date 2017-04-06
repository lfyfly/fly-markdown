<!-- —————————————↓SCSS———————分界线————————————————————————— -->
<style lang="scss">
#markdown-input {
  margin: 0 auto;
  z-index: 999;
  top: 50%;
  left: 50%;
  textarea {
    resize: none;
    font-size: 14px;
    padding: 10px;
    width: 500px;
    height: 220px;
    box-sizing: border-box;
    vertical-align: bottom;
  }
  textarea a {
    margin: 0 auto;
    background: #ccc;
    padding: 20px;
  }
  .markdown-option {
    width: 100%;
    box-sizing: border-box;
    background: black;
    overflow: hidden;
    padding: 0 20px;
    height: 30px;
    .active{
      color:#17bd2b;
    }
  }
  .markdown-option>* {
    float: right;
    display: inline-block;
    color: #ccc;
    padding: 0 8px;
    line-height: 30px;
  }

}
</style>

<!-- —————————————↓HTML————————分界线———————————————————————— -->
<template lang="pug">
#markdown-input
  .markdown-option(v-drag="{moveElId:'markdown-input',dragOutX:30,dragOutY:30,cursor:'move'}")
    a 文件列表
    a 导出
    a 保存
    //- label( for="highlight")
    //-   input(type="checkbox",id="highlight")
    //-   | 代码高亮
    a(href="javascript:void(0)",:class="{active:!textareaShow}",@click="toggleFoldTextarea",) {{textareaShow?'收起':'展开'}}
  textarea(spellcheck="false", :value="value",
          key="textarea",
          v-show="textareaShow",
          @keydown.tab.prevent="",
          @input="handleInput")
</template>

<!-- ——————————————↓JS—————————分界线———————————————————————— -->
<script>
//import XXX from './components/XXX'

export default {
  name: 'markdown-input',
  data() {
    return {
      msg: 'this is from markdown-input.vue',
      textareaShow: true
    }
  },
  props: ['value'],
  methods: {
    toggleFoldTextarea() {
      this.textareaShow = !this.textareaShow
      console.log(this.value)
    },
    handleInput(event) {
      var value = event.target.value;
      this.$emit('input', value);
    },
    removeLeftAndTop() {
      if (window.innerWidth <= 500) {
        this.$el.style = "position:absolute;"
      }
    },

  },
  mounted() {
    window.addEventListener('resize', this.removeLeftAndTop)
  },
  watch: {

  }
}
</script>
