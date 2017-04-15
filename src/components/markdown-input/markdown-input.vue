<!-- —————————————↓SCSS———————分界线————————————————————————— -->
<style lang="scss">
@import '../../scss/skin/default.scss';

#markdown-input {
  margin: 0 auto;
  z-index: 998; // 窗口大于800px时 #markdown-input 定位
  top: 50%;
  left: 30%;
  .tip {
    text-align: center;
    font-size: 14px;

    position: absolute;
    top: -1.6em;
    width: 100%;

    &.warn {
      color: red;
    }
    &.correct {
      color: $active-color;
    }
  }
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
    overflow: hidden;
    line-height: 30px; // 操作栏文字激活为：绿色
    .active {
      color: $active-color;
    }
  }
  .option-list {
    float: right;
  }
  .iconfont {
    display: inline-block;
    width: 30px;
    text-align: center;
    margin-top: 1px;
    font-size: 18px;
    &.icon-shouqi1,
    &.icon-zhankai1 {
      margin-top: 2px;
    }
    &.icon-iconfontxinjian {
      margin-top: 0px;
    }
    &.icon-daoru-copy,
    &.icon-save {
      font-size: 19px;
      margin-top: 2px;
    }
    &.icon-daochubeifen,
    {
      font-size: 20px;
      margin-top: 2px;
    }
    &.icon-web_shouhu,
    &.icon-web_xiangxiazhankai {
      font-weight: bold;
    }
  }
  .option-list>* {
    float: left;
    color: $font-color-main;
    margin-right: 4px;
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
    width: 180px;
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
      .editActive {
        color: $active-color;
        &:hover {
          color: lighten($active-color, 10%);
        }
      }
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
          color: red;
          line-height: 30px;
        }
      }
      .revise {
        left: 0;

        &:hover .revise-info {
          display: block;
        }
        .revise-info {
          display: none;
          color: #ccc;
          line-height: 30px;
          margin-top: 2px;
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
            line-height: 19px;

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
    li.showIcon {
      .del-file,
      .revise-info {
        display: block;
      }
    }
  }
}
</style>

<!-- —————————————↓HTML————————分界线———————————————————————— -->
<template lang="pug">
#markdown-input
  read-local-file
  .markdown-option(v-drag="{moveElId:'markdown-input',dragOutX:30,dragOutY:30,cursor:'move'}")
    .option-list
      a.iconfont(:title="textareaShow?'收起编辑区':'展开编辑区'", :class="{active:!textareaShow,'icon-web_shouhui':textareaShow,'icon-web_xiangxiazhankai':!textareaShow}",@click="toggleFoldTextarea")
      //- a.iconfont.icon-dakai1(@click="")
      a.iconfont.icon-daoru-copy(title="导入本地文件", @click="importFile")
      a.iconfont.icon-daochubeifen(title="导出文件到本地", @click="exportFile")
      a.iconfont.icon-save(title="保存",@click="save")
      a.iconfont.icon-iconfontxinjian(title="新建", @click="newMarkdown", :class="{active:!editingFile}")
      a.iconfont(:title="fileListShow?'收起目录':'展开目录'", @click="toggleFileListShow", :class="{active:fileListShow,'icon-shouqi1':fileListShow,'icon-zhankai1':!fileListShow}")
  textarea(spellcheck="false",
          ref="textarea",
          v-show="textareaShow",
          @keydown.tab.prevent="",
          @keydown.enter="save",
          @input="input2markdownData",
          )
  .tip(v-show="tipShowState",:class="[tipShowStyle]",v-text="tipShowContent")
  .cover(v-if="!editingFile")
  pre.edit-tip(v-if="!editingFile").
    请先创建文件
    或者从文件列表加载一个文件
    再开始编辑

  transition(name="fileListSlide")
    ul.fileList(v-show="fileListShow")
      li(:class="{showIcon: isMobile}",v-for="v in fileList",@click="readFile")
        a.fileList-fileName(:class="{editActive: editingFile&&editingFile.fileName===v}") {{v}}
        span.del
          a.iconfont.icon-shanchu.del-file(@click.stop="del")
        .sure-del(style="display:none;",@click.stop="")
          a.sure(title="确认删除",@click.stop="sureDel") ×
          a.cancel(title="取消删除",@click.stop="cancelDel") >
        span.revise(@click.stop="reviseInfo")
           a.iconfont.icon-weibiaoti--.revise-info
</template>

<!-- ——————————————↓JS—————————分界线———————————————————————— -->
<script>
import BUS from '../bus.js'
import readLocalFile from '../read-local-file/read-local-file.vue'


var FileSaver = require('file-saver');
export default {
  components: {
    readLocalFile
  },
  name: 'markdown-input',
  data() {
    return {
      msg: 'this is from markdown-input.vue',
    }
  },
  computed: {
    isMobile() {
      return BUS.isMobile
    },
    textareaShow() {
      return BUS.textareaShow
    },
    editingFile() {
      return BUS.editingFile
    },
    fileList() {
      return BUS.fileList
    },
    markdownData() {
      return BUS.markdownData
    },
    fileListShow() {
      return BUS.fileListShow
    },

    tipShowState() {
      return BUS.tipShow.state
    },
    tipShowStyle() {
      return BUS.tipShow.style
    },
    tipShowContent() {
      return BUS.tipShow.content
    },
  },
  methods: {
    nofileEditingTipFn() {
      return BUS.showTipFn({
        content: '当前没有文件正在编辑',
        style: 'warn',
        condition: !BUS.editingFile,
      })
    },
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
      parentEl.style.display = 'none'
      if (e.target.title === '确认删除') {
        BUS.removeFileData(fileName)
      }
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
      console.log('this.editingFile', this.editingFile)

      // 返回值为true时，就是说嘛显示tip，
      if (this.nofileEditingTipFn()) return


      // 正在执行导入时，点击此按钮是无效的
      // if (BUS.readLocalFileShow) return
      BUS.readLocalFileShow = false
      // if(BUS.fileListShow) BUS.fileListShow=false

      BUS.textareaShow = !BUS.textareaShow
      // 折叠事件,并且传递出折叠状态（需要响应）
      this.$emit('flod', BUS.textareaShow)
    },
    // 组件的双向绑定
    input2markdownData(event) {
      BUS.markdownData = event.target.value;
    },
    removeLeftAndTop() {
      // 桌面端缩放窗口，style属性中的 top left 值，让@media中css值生效

      var winWidth = window.innerWidth
      if (winWidth <= 800) {
        var textareaStyle = ''
        // 调整窗口时, 如果textarea本来就为隐藏状态，保持其隐藏状态
        if (!BUS.textareaShow) textareaStyle = 'display:none;'
        this.$refs.textarea.style = textareaStyle

        this.$el.style = 'position:absolute'
        // 在大于 800px 的时候，textarea窗口是可以调整
        // 让css接受width 和 height
        if (winWidth <= 440) {
          // textarea缩放产生style的width和height属性， @media导致css无法生效
          // this.$el.style = 'position:absolute'

          return
        }
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
    save(e) {

      if (this.nofileEditingTipFn()) return

      BUS.save()

      if (e.type !== 'keydown') {
        BUS.showTipFn({
          content: '文件保存成功',
          style: 'correct',
          condition: BUS.editingFile,
        })
      }

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
      var headerHTMLStr = document.querySelector('.markdown-header').outerHTML
      // var catalogHTMLStr = document.querySelector('.markdown-catalog').outerHTML
      var contenthtmlStr = document.querySelector('.markdown2html').outerHTML
      // 重写 目录动画需要
      contenthtmlStr = contenthtmlStr.replace('class=\"markdown-catalog\"', 'class=\"markdown-catalog catalog-hide\"')

      console.log(headerHTMLStr + '\n' + contenthtmlStr)



      return
      BUS.save()
      if (this.nofileEditingTipFn()) return

      var infoWrite2File = ''
      console.log(BUS.editingFile)
      if (BUS.editingFile.info.length > 0) {
        BUS.editingFile.info.forEach((v) => {
          var value = v.value
          if (v.link) {
            var link = v.link
            if (v.link.indexOf('http://') === -1) {
              link = 'http://' + v.link
            }
            value = `[${value}](${link})`
          }

          infoWrite2File += '> **' + v.key + '**: ' + value + '\n\n'
        })

      }
      infoWrite2File = '---\n\n' + infoWrite2File + '---\n\n'

      alert(infoWrite2File)

      var blob = new Blob([infoWrite2File, BUS.markdownData], { type: "text/plain;charset=utf-8" })
      FileSaver.saveAs(blob, BUS.editingFile.fileName + ".md")
    },
    importFile() {
      // 可能是收起状态
      BUS.textareaShow = true
      BUS.readLocalFileShow = !BUS.readLocalFileShow
    }
  },
  mounted() {
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
