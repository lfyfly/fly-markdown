<!-- —————————————↓SCSS———————分界线————————————————————————— -->
<style lang="scss">
@import '../../scss/style.scss';

#markdown-input {
  margin: 0 auto;
  z-index: 999;
  // 窗口大于800px时 #markdown-input 定位
  top: 50%;
  left: 50%;
  textarea {
    font-size: 14px;
    line-height: 20px;
    padding: 9px; // 加上边框1px，正好地区一个line-height
    width: 500px;
    height: 220px;
    box-sizing: border-box;
    vertical-align: bottom;
  }
  .markdown-option {
    width: 100%;
    min-width: 280px;
    box-sizing: border-box;
    background: $main-color;
    height: 30px;
    line-height: 30px; // 操作栏文字激活为：绿色
    .active {
      color: $active-color;
    }
  }
  .option-list {
    float: right;
  }
  .option-list>* {
    float: left;
    color: $font-color-main;
    margin-right: 1em;
  }
}
</style>

<!-- —————————————↓HTML————————分界线———————————————————————— -->
<template lang="pug">
#markdown-input
  .markdown-option(v-drag="{moveElId:'markdown-input',dragOutX:30,dragOutY:30,cursor:'move'}")
    .option-list
      a(href="javascript:void(0)",:class="{active:!textareaShow}",@click="toggleFoldTextarea") {{textareaShow?'收起':'展开'}}
      a 保存
      a 导出
      a 文件列表
  textarea(spellcheck="false",
          :value="value",
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
   // 组件的双向绑定
  props: ['value'],
  methods: {
    toggleFoldTextarea() {
      this.textareaShow = !this.textareaShow
      // 折叠事件,并且传递出折叠状态（需要响应）
      this.$emit('flod',this.textareaShow)
    },
    // 组件的双向绑定
    handleInput(event) {
      var value = event.target.value;
      this.$emit('input', value);
    },
    removeLeftAndTop() {
      // 桌面端缩放窗口，style属性中的 top left 值，让@media中css值生效
      if (window.innerWidth <= 500) {
        this.$el.style = "position:absolute;"
      }
    },

  },
  mounted() {
    window.addEventListener('resize', this.removeLeftAndTop)
  }
}
</script>
