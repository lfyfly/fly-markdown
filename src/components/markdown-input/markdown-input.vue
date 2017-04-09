<!-- —————————————↓SCSS———————分界线————————————————————————— -->
<style lang="scss">
@import '../../scss/style.scss';
#markdown-input {
  margin: 0 auto;
  z-index: 999; // 窗口大于800px时 #markdown-input 定位
  top: 50%;
  left: 30%;
  a {
    cursor: pointer;
  }
  textarea {
    font-size: 14px;
    line-height: 20px;
    padding: 9px; // 加上边框1px，正好地区一个line-height
    width: 440px;
    height: 220px;
    box-sizing: border-box;
    vertical-align: bottom;
  }
  .markdown-option {
    width: 100%;
    min-width: 350px;
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
  .edit-tip {
    color: red;
    line-height: 1.5;
    text-align: center;
    width: 100%;
    display: table;
    margin: auto 0;
    position: absolute;
    top: 30px;
    bottom: 0;
  }
  .fileList {
    list-style: none;
    margin: 0;
    height: 100%;
    min-height: 90px;
    width: 160px;
    background: $main-color;
    overflow: auto;
    z-index: -1;


    position: absolute;
    bottom: 0;
    left: 100%;
    text-align: center;
    box-sizing: border-box;
    li {
      margin: 0;
      a {
        display: block;
        border-bottom: 1px dashed #777777;
        box-sizing: border-box;
        color: #ccc;
        line-height: 30px;
        box-sizing: border-box;
        padding: 0 .4em;

        @extend %fontOver;

        &:hover {
          color: #f1f1f1;
        }
      }
    }
  }
}
</style>

<!-- —————————————↓HTML————————分界线———————————————————————— -->
<template lang="pug">
#markdown-input
  .markdown-option(v-drag="{moveElId:'markdown-input',dragOutX:30,dragOutY:30,cursor:'move'}")
    .option-list
      a(:class="{active:!textareaShow}",@click="toggleFoldTextarea") {{textareaShow?'收起':'展开'}}
      a 保存
      a 导出
      a(@click="newMarkdown",:class="{active:!isEditing}") 新建文件
      a(@click="toggleFileListShow",:class="{active:fileListShow}") 文件列表
  textarea(spellcheck="false",
          ref="textarea",
          :value="markdownData",
          v-show="textareaShow",
          @keydown.tab.prevent="",
          @input="handleInput")
  pre.edit-tip(v-if="!isEditing").
    请先创建文件
    或者从文件列表加载一个文件
    再开始编辑

  transition(name="fileListSlide")
    ul.fileList(v-show="fileListShow")
      li(v-for="v in fileList",@click="readFile"): a {{v}}
</template>

<!-- ——————————————↓JS—————————分界线———————————————————————— -->
<script>
import BUS from '../bus.js'

export default {
  name: 'markdown-input',
  data() {
    return {
      msg: 'this is from markdown-input.vue',
      textareaShow: true,
      // markdown 文件已经创建了吗 或者 读取了本地文件
      fileListShow: false,
      //  markdown内容
      markdownData: ''
    }
  },
  // 组件的双向绑定
  props: ['value'],
  computed: {

    isEditing() {
      return BUS.isEditing
    },
    fileList() {
      return BUS.fileList
    }
  },
  methods: {
    toggleFileListShow() {
      this.fileListShow = !this.fileListShow
    },
    toggleFoldTextarea() {
      if (!this.isEditing) return

      this.textareaShow = !this.textareaShow
      // 折叠事件,并且传递出折叠状态（需要响应）
      this.$emit('flod', this.textareaShow)
    },
    // 组件的双向绑定
    handleInput(event) {
      var value = event.target.value;
      this.$emit('input', value);
    },
    removeLeftAndTop() {
      // 桌面端缩放窗口，style属性中的 top left 值，让@media中css值生效
      var winWidth = window.innerWidth
      if (winWidth <= 500) {
        this.$el.style = "position:absolute;"
        // textarea缩放产生style的width和height属性， @media导致css无法生效
        this.$refs.textarea.style = ""
      }
    },
    newMarkdown() {
      BUS.createShow = true
    },
    readFile(e) {
      alert(JSON.parse(localStorage[e.target.textContent]).length)
      BUS.isEditing = { fileName: e.target.textContent, info: JSON.parse(localStorage[e.target.textContent]) }
      this.markdownData = "asdasdadas"
      // 更新编译
    }
  },
  mounted() {
    window.addEventListener('resize', this.removeLeftAndTop)
  },
}
</script>
