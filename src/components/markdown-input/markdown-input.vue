<!-- —————————————↓SCSS———————分界线————————————————————————— -->
<style lang="scss">
@import '../../scss/skin/default.scss';

#markdown-input {
  margin: 0 auto;
  z-index: 998; // 窗口大于800px时 #markdown-input 定位
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
    min-width: 320px;
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
    margin-right: 12px;
  }
  .cover {
    width: 100%;
    background: #e2e2e2;
    position: absolute;
    top: 30px;
    bottom: 0;
  }
  .edit-tip {
    color: red;
    line-height: 1.5;
    text-align: center;
    width: 100%;
    display: table;
    margin: auto 0;
    margin-top: 3em\0; //ie 9 10 11
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
      position: relative;
      margin: 0;
      &>a {
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
      .del,
      .revise {
        position: absolute;
        top: 0;
        height: 30px;
        width: 30px;
        overflow: hidden;
      }

      .del {
        right: 0;
        &:hover .del-file {
          display: block;
        }
        .del-file {
          display: none;
          font-size: 30px;
          margin-top: -7px;
          cursor: pointer;
          color: red;
        }
      }
      .revise {
        left: 0;

        &:hover .revise-info {
          display: block;
        }
        .revise-info {
          display: none;
          width: 30px;
          height: 30px;
          background-image: url('./revise.png');
          background-size: 20px 20px;
          background-position: center center;
          background-repeat: no-repeat;
        }
      }

      .sure-del {
        z-index: 10;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        line-height: 30px;
        opacity: 0.7;
        a {
          color: #ccc;
          display: inline-block;
          margin: 0 .3em;
          position: absolute;
          width: 20px;
          height: 20px;
          margin-top: 5px;
          line-height: 20px;
          border-radius: 50%;
          &.sure {
            left: 0;
            background: #d31919;
            color: white;
            &:hover {
              background: red;
            }
          }
          &.cancel {
            right: 0;
            background: green;
            color: white;
            line-height: 18px;
            &:hover {
              background: #029802;
            }
          }
          &.cancel:hover {
            color: white;
          }
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
      //- a(@click="save") 保存
      a(@click="importFile") 导入
      a(@click="exportFile") 导出
      a(@click="newMarkdown",:class="{active:!isEditing}") 新建文件
      a(@click="toggleFileListShow",:class="{active:fileListShow}") 文件列表
  textarea(spellcheck="false",
          ref="textarea",
          v-show="textareaShow",
          @keydown.tab.prevent="",
          @keydown.enter="save",
          @input="input2markdownData",

          )
  .cover(v-if="!isEditing")
  pre.edit-tip(v-if="!isEditing").
    请先创建文件
    或者从文件列表加载一个文件
    再开始编辑

  transition(name="fileListSlide")
    ul.fileList(v-show="fileListShow")
      li(v-for="v in fileList",@click="readFile")
        a {{v}}
        span.del
          span.del-file(@click.stop="del") ×
        .sure-del(style="display:none;",@click.stop="")
          a.sure(title="确认删除",@click.stop="sureDel") ×
          a.cancel(title="取消删除",@click.stop="cancelDel") >
        span.revise(@click.stop="reviseInfo")
          span.revise-info
</template>

<!-- ——————————————↓JS—————————分界线———————————————————————— -->
<script>
import BUS from '../bus.js'
var FileSaver = require('file-saver');
export default {
  name: 'markdown-input',
  data() {
    return {
      msg: 'this is from markdown-input.vue',
      textareaShow: true,
    }
  },
  computed: {

    isEditing() {
      return BUS.isEditing
    },
    fileList() {
      return BUS.fileList
    },
    markdownData() {
      return BUS.markdownData
    }
  },
  methods: {
    reviseInfo(e) {
      var fileName = e.target.parentNode.parentNode.children[0].textContent
      var fileInfo = BUS.getFileInfo(fileName)
      // 旧文件名用来删除原有数据
      fileInfo.oldFileName = fileInfo.fileName
      BUS.reviseingInfo = fileInfo
    },

    sureDel(e) {
      var parentEl = e.target.parentNode
      console.log(parentEl.previousSibling.previousSibling)
      var fileName = parentEl.previousSibling.previousSibling.textContent
      alert(e.target.title)
      if (e.target.title === '确认删除') {
        BUS.removeFileData(fileName)
      }
      parentEl.style.display = 'none'
    },
    cancelDel(e) {
      var parentEl = e.target.parentNode

      parentEl.style.display = 'none'
    },
    // 点击叉号
    del(e) {
      e.target.parentNode.nextSibling.style.display = 'block'
    },
    toggleFileListShow() {
      BUS.fileListShow = !BUS.fileListShow
    },
    toggleFoldTextarea() {
      // 无编辑文件时，点击此按钮是无效的
      if (!this.isEditing) return

      // if(BUS.fileListShow) BUS.fileListShow=false

      this.textareaShow = !this.textareaShow
      // 折叠事件,并且传递出折叠状态（需要响应）
      this.$emit('flod', this.textareaShow)
    },
    // 组件的双向绑定
    input2markdownData(event) {
      BUS.markdownData = event.target.value;
    },
    removeLeftAndTop() {
      // 桌面端缩放窗口，style属性中的 top left 值，让@media中css值生效
      var winWidth = window.innerWidth
      if (winWidth <= 500) {
        this.$el.style = "position:absolute;"
        // textarea缩放产生style的width和height属性， @media导致css无法生效
        this.$refs.textarea.style = ""
      } else if (winWidth <= 800) {
        this.$el.style = "position:absolute;"
      }
    },
    newMarkdown() {
      BUS.createShow = true
    },
    readFile(e) {

      // 切换
      BUS.save()
      var fileName = e.target.textContent
      BUS.openAfile(fileName)

      // 更新编译
    },
    save() {
      BUS.save()
    },
    // 定时保存second
    intervalSave(second) {
      setInterval(() => {
        BUS.save()
        console.log(second + '秒 定时保存成功')
      }, second * 1000)
    },
    exportFile() {
      // 获取innerHTML
      var catalogHTMLStr = document.querySelector('.markdown-catalog').innerHTML
      var contenthtmlStr = document.querySelector('.markdown-html').innerHTML
      console.log('catalog', catalogHTMLStr)
      console.log('content', contenthtmlStr)

      return
      BUS.save()

      if (!BUS.isEditing) {
        alert("当前没有文件正在编辑")
        return
      }
      var infoWrite2File = ''
      console.log(BUS.isEditing)
      if (BUS.isEditing.info.length > 0) {
        BUS.isEditing.info.forEach((v) => {
          infoWrite2File += '> **' + v.key + '**: ' + v.value + '\n\n'
        })

      }
      infoWrite2File = '---\n\n' + infoWrite2File + '---\n\n'

      alert(infoWrite2File)

      var blob = new Blob([infoWrite2File, BUS.markdownData], { type: "text/plain;charset=utf-8" })
      FileSaver.saveAs(blob, BUS.isEditing.fileName + ".md")
    },
    importFile() {
      BUS.readLocalFileShow = !BUS.readLocalFileShow
    }
  },
  mounted() {
    // this.intervalSave(30) // 单位秒
    window.addEventListener('resize', this.removeLeftAndTop)
  },
  watch: {
    markdownData: function (v) {
      // 更改BUS.markdownData -> computed(markdownData) -> 更新textarea.value
      this.$refs.textarea.value = v
    }
  }

}
</script>
