<!-- —————————————↓SCSS———————分界线————————————————————————— -->
<style lang="scss">
@import '../../scss/skin/default.scss';

#markdown-input {
  z-index: 998; // 窗口大于800px时 #markdown-input 定位
  top: 50%;
  left: 30%;

  margin: 0 auto;
  li {
    list-style: none;
  }
  textarea {
    box-sizing: border-box;
    vertical-align: bottom;

    width: 440px;
    height: 220px;
    padding: 9px; // 加上边框1px，正好地区一个line-height
    font-size: 14px;
    line-height: 20px;
  }
  .tip {
    position: absolute;
    top: -1.6em;
    width: 100%;

    text-align: center;
    font-size: 14px;

    &.warn {
      color: red;
    }
    &.correct {
      color: $active-color;
    }
  } //
  // ————————————操作栏————————————————
  .markdown-option {
    overflow: hidden;
    box-sizing: border-box;

    width: 100%;
    min-width: 320px;
    height: 30px;
    background: $main-color;

    line-height: 30px; // 操作栏文字激活为：绿色
    .active {
      color: $active-color!important;
    }
    .option-list>* {
      float: left;
      color: $font-color-main;
    }
    .option-list {
      float: right;
    } // 图标不配套调整
    .iconfont:before {
      margin-top: 1px;
      margin-top: 2px\0;

      display: inline-block;
      width: 30px;
      text-align: center;
      font-size: 20px;


    }
    a.icon-html:before{
      margin-top: 2px;
      margin-top: 3px\0;
      font-size: 21px;
    }
    a.icon-daochu2:before{
      font-size: 19px!important;
    }
  } // ————————————操作栏-结束—————————————
  //
  // ————————————未开始操作时提示—————————————
  .cover {
    position: absolute;
    top: 30px;
    bottom: 0;

    width: 100%;
    background: #e2e2e2;
    .edit-tip {
      // 多行文字的垂直居中
      position: absolute;
      top: 50%;
      width: 100%;
      margin-top: -2.2em;
      text-align: center;
      color: red;
      line-height: 1.5;
    }
  } // ————————————未开始操作时提示-结束—————————————
  //
  // ————————————文件列表—————————————
  .fileList {
    position: absolute;
    z-index: -1;
    bottom: 0;
    left: 100%;

    box-sizing: border-box;
    width: 160px;
    height: 100%;
    min-height: 90px;
    margin: 0;
    background: $main-color;

    overflow: auto;
    text-align: center;
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
        box-sizing: border-box;

        padding: 0 .4em;
        border-bottom: 1px dashed #777777;

        color: #ccc;
        line-height: 30px;

        @extend %fontOver;

        &:hover {
          color: #f1f1f1;
        }
      }
      .del,
      .revise {
        position: absolute;
        top: 0;

        overflow: hidden;

        width: 30px;
        height: 30px;
      }

      .del {
        right: 0;
        .del-file {
          display: none;

          color: red;
          line-height: 30px;
        }
        &:hover .del-file {
          display: block;
        }
      }
      .revise {
        left: 0;
        .revise-info {
          display: none;

          margin-top: 2px;

          color: #ccc;
          line-height: 30px;
        }
        &:hover .revise-info {
          display: block;
        }
      }

      .sure-del {
        position: absolute;
        z-index: 10;
        top: 0;
        left: 0;

        width: 100%;
        height: 100%;
        opacity: 0.7;

        line-height: 30px;


        a {
          position: absolute;

          display: inline-block;

          width: 20px;
          height: 20px;
          margin: 5px .3em 0 .3em;
          border-radius: 50%;

          color: #ccc;
          line-height: 20px;


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

  .markdown-option( v-drag="{moveElId:'markdown-input', dragOutX:30, dragOutY:30, cursor:'move'}" )
    .option-list
      a.iconfont( @click="toggleFoldTextarea", :title="textareaShow? '收起编辑区': '展开编辑区'", :class="{ active: !textareaShow, 'icon-web_shouhui' :textareaShow, 'icon-web_xiangxiazhankai': !textareaShow }" )
      a.iconfont.icon-daoru-copy( @click="importFile", title="导入本地markdown文件" )
      a.iconfont.icon-daochu2( @click="exportFileSure('markdown')", title="导出markdown文件到本地" )
      a.iconfont.icon-html( @click="exportFileSure('html')", title="导出html文件到本地" )
      a.iconfont.icon-baocun( @click="save", title="保存" )
      a.iconfont.icon-iconfontxinjian( @click="newMarkdown", title="新建",  :class="{active:!editingFile}" )
      a.iconfont( :title="fileListShow?'收起目录':'展开目录'", @click="toggleFileListShow", :class="{active:fileListShow,'icon-shouqi':fileListShow,'icon-zhankai1':!fileListShow}" )

  textarea( spellcheck="false",
            ref="textarea",
            v-show="textareaShow",
            @keydown.tab.prevent="",
            @keydown.enter="save",
            @input="input2markdownData" )

  .tip( v-show="tipShowState",:class="[tipShowStyle]",v-text="tipShowContent" )

  .cover(v-if="!editingFile")
    pre.edit-tip.
      请先创建文件
      或者从文件列表加载一个文件
      再开始编辑

  //- 文件列表
  transition( name="fileListSlide" )
    ul.fileList( v-show="fileListShow" )
      li( :class="{showIcon: isMobile}", v-for="v in fileList", @click="readFile" )
        //- 高亮文件列表中 当前编辑文件
        a.fileList-fileName( :class="{editActive: editingFile && editingFile.fileName === v}" ) {{v}}
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
import htmlTemplate from './html-template.min.js'
import readLocalFile from './read-local-file/read-local-file.vue'


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
    // 设备
    isMobile() {
      return BUS.isMobile
    },
    winWidth() {
      return BUS.winWidth
    },
    // 组件状态
    textareaShow() {
      return BUS.textareaShow
    },
    fileListShow() {
      return BUS.fileListShow
    },
    // 共享数据
    editingFile() {
      return BUS.editingFile
    },
    fileList() {
      return BUS.fileList
    },
    markdownData() {
      return BUS.markdownData
    },

    // tip
    tipShowState() {
      return BUS.tipShow.state
    },
    tipShowStyle() {
      return BUS.tipShow.style
    },
    tipShowContent() {
      return BUS.tipShow.content
    }
  },
  methods: {

    // —————————————————————————.option-list编辑栏的方法———————————————————————————

    toggleFoldTextarea() {
      // 返回值为true时，就是说要显示tip，当前无文件在编辑
      if (this.nofileEditingTipFn()) return

      BUS.textareaShow = !BUS.textareaShow
      // 折叠事件,并且传递出折叠状态（需要响应）
      this.$emit('flod')
    },
    importFile() {
      // 可能是收起状态
      var oldTextareaShow = BUS.textareaShow
      BUS.textareaShow = true
      if (!oldTextareaShow && !BUS.readLocalFileShow) return

      BUS.readLocalFileShow = !BUS.readLocalFileShow
    },
    exportFileSure(fileType) {
      BUS.save()

      if (this.nofileEditingTipFn()) return
      // 重要，因为目录是懒渲染的，所以就要确保目录已经渲染
      // 打开目录就可以触发目录渲染
      var catalogShow = BUS.catalogShow
      if (!catalogShow) BUS.catalogShow = true
      this.$nextTick(() => {
        if (fileType === 'markdown') this.exportMdFile()
        if (fileType === 'html') this.exportHtmlFile()

        if (!catalogShow) BUS.catalogShow = false
      })
    },
    save(e) {
      if (this.nofileEditingTipFn()) return

      BUS.save()

      if (e.type === 'keydown') return // enter换行自动保存，但是不想是保存提示

      BUS.showTipFn({
        content: '文件保存成功',
        style: 'correct',
        condition: BUS.editingFile,
      })
    },
    newMarkdown() {
      BUS.createShow = true
    },
    toggleFileListShow() {
      BUS.fileListShow = !BUS.fileListShow
    },
    // ———————————————————————.option-list编辑栏的方法-结束———————————————————————————

    // —————————————————————————显示tip方法————————————————————————————
    nofileEditingTipFn() { // 显示tip(当前没有文件正在编辑)
      return BUS.showTipFn({
        // 无编辑文件时，点击此按钮是无效的
        condition: !BUS.editingFile,
        content: '当前没有文件正在编辑',
        style: 'warn'
      })
    },
    // —————————————————————————显示tip方法-结束————————————————————————————

    // ———————————————————————textarea的input事件——————————————————————
    // 组件的双向绑定
    input2markdownData(event) {
      BUS.markdownData = event.target.value;
    },
    // ———————————————————————textarea的事件方法——————————————————————

    //——————————————————————————文件列表操作方法————————————————————————
    readFile(e) {
      // 可能为切换文件，保存上一个文件
      // 可能为还是点击自身文件，保存自身
      BUS.save()

      // 可能为还是点击自身文件，不执行读取
      var fileName = e.target.textContent
      if (BUS.editingFile && fileName === BUS.editingFile.fileName) return

      BUS.openAfile(fileName)

    },
    // 点击叉号
    del(e) {
      e.target.parentNode.nextSibling.style.display = 'block'
    },
    sureDel(e) {
      var parentEl = e.target.parentNode

      var fileName = parentEl.previousSibling.previousSibling.textContent
      parentEl.style.display = 'none'
      if (e.target.title === '确认删除') {

        BUS.removeFileData(fileName)

        BUS.showTipFn({
          content: `文件 [${fileName}] 删除成功`,
          style: 'correct',
        })
      }
    },
    cancelDel(e) {
      var parentEl = e.target.parentNode
      parentEl.style.display = 'none'
    },

    reviseInfo(e) {
      var fileName = e.target.parentNode.parentNode.children[0].textContent
      var fileInfo = BUS.getFileInfo(fileName)
      // 旧文件名用来删除原有数据
      fileInfo.oldFileName = fileInfo.fileName

      BUS.reviseingInfo = fileInfo
    },
    //——————————————————————————文件列表操作方法————————————————————————

    // 导出文件核心方法
    exportHtmlFile() {
      // 读取模板文件
      // 获取innerHTML
      var headerHtmlStr = document.querySelector('.markdown-header').outerHTML
      var contenthtmlStr = document.querySelector('.markdown2html').innerHTML
      // 重写 目录动画需要
      contenthtmlStr = contenthtmlStr.replace(/class=\"markdown-catalog.*?\"/, 'class=\"markdown-catalog catalog-hide\"')
      // 去除markdown2html的style属性
      contenthtmlStr = `<div class="markdown2html">${contenthtmlStr}</div>`

      var bodyHtml = headerHtmlStr + contenthtmlStr
      var htmlFileStr = htmlTemplate.replace('这里注入html的位置', bodyHtml)

      var blob = new Blob([htmlFileStr], { type: "text/plain;charset=utf-8" })
      FileSaver.saveAs(blob, BUS.editingFile.fileName + ".html")

    },
    exportMdFile() {


      var infoWrite2File = ''
      if (BUS.editingFile.info.length > 0) {
        BUS.editingFile.info.forEach((v) => {
          var value = `[${v.value}]`
          if (v.link) {
            var link = v.link
            if (v.link.indexOf('http://') === -1) {
              link = 'http://' + v.link
            }
            value = `[${v.value}](${link})`
          }

          infoWrite2File += '> **' + v.key + '**: ' + value + '\n\n'
        })

      }
      infoWrite2File = infoWrite2File === '' ? '' : '---\n\n' + infoWrite2File + '---\n\n'


      var blob = new Blob([infoWrite2File, BUS.markdownData], { type: "text/plain;charset=utf-8" })
      FileSaver.saveAs(blob, BUS.editingFile.fileName + ".md")
    },

    //-----------移除组件被拖拽移动参圣的style 属性（left，top）-------------
    removeLeftAndTop(newWinWidth, oldWinWidth) {
      // 桌面端缩放窗口，style属性中的 top left 值，让@media中css值生效
      if (newWinWidth <= 800) {
        // textarea在屏幕>800px拉伸,拉伸产生style（width，height）
        this.$refs.textarea.removeAttribute('style')
        // 调整窗口时, 如果textarea本来就为隐藏状态，保持其隐藏状态
        if (!BUS.textareaShow) this.$refs.textarea.style.display = 'none'
        // 浏览器宽度跨度：>800 -> <=800 ||  浏览器宽度跨度：>440 -> <=440
        if ((oldWinWidth && oldWinWidth > 800) || (newWinWidth <= 440 && oldWinWidth && oldWinWidth > 440)) {
          this.$el.removeAttribute('style')
          this.$el.style.position = 'absolute'
        }
      }
    },
  },
  mounted() {
    this.$watch('winWidth', this.removeLeftAndTop)
  },
  watch: {
    markdownData: function (v) {
      // 更改BUS.markdownData -> computed(markdownData) -> 更新textarea.value
      this.$refs.textarea.value = v
    }
  }
}
</script>
