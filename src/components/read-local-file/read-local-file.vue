<!-- —————————————↓SCSS———————分界线————————————————————————— -->
<style lang="scss">
// 接受托在文件的区域大小
.read-local-file {
  width: 100%;
  background: rgba(0, 0, 0, .8);
  color: #ccc;
  position: absolute;
  z-index: 1000;
  top: 30px;
  bottom: 0;
  text-align: center;
  .info-wraper {
    width: 100%;
    display: table;
    margin: auto 0;
    position: absolute;
    top: 0;
    bottom: 0;
    &>* {
      display: inline-block;
    }
  }

  h3 {
    width: 100%;
    margin: auto;
  }
  .icon {
    font-size: 50px;
    color: #ccc;
    &:hover {
      cursor: pointer;
      color: #17bd2b;
    }
    input {
      display: none;
    }
  }
  .file-type-tip1,
  .file-type-tip2 {
    position: absolute;
    width: 100%;
    text-align: center;
    top: 1em;
    color: red;
  }
  .cancel-import {
    position: absolute;
    line-height: 1;
    color: #919191;
    font-size: 30px;
    right: .2em;
    &:hover {
      color: #c92828;
    }
  }
}
</style>

<!-- —————————————↓HTML————————分界线———————————————————————— -->
<template lang="pug">
transition(name="fade")
  .read-local-file(v-show="readLocalFileShow")
    .info-wraper
      h3(v-if="!isMobile") 拖拽 .md 扩展名文件到此处加载
      label.icon(title="打开一个markdown文件") +
        input(type="file",style="display:none;",ref="fileInput",@change="openFile")
    .file-type-tip1(v-show="showTip1") 非 .md 扩展名文件自动过滤
    .file-type-tip2(v-show="showTip2") 请选择正确 .md 文件再打开
    a.cancel-import(@click="cancelImport") ×
</template>

<!-- ——————————————↓JS—————————分界线———————————————————————— -->
<script>
import BUS from '../bus.js'

export default {
  name: 'read-local-file',
  data() {
    return {
      msg: 'this is from read-local-file.vue',
      showTip1: false,
      showTip2: false
    }
  },
  computed: {
    isMobile() {
      return BUS.isMobile
    },
    readLocalFileShow() {
      return BUS.readLocalFileShow
    }
  },
  methods: {
    readFile2Str(file) {
      // 返回promise对象
      return new Promise(function (reslove, reject) {
        var reader = new FileReader()
        reader.readAsText(file)
        reader.onload = function () {
          // 解析文件信息数据
          var fileContent = reader.result

          // 前者匹配
          var fileInfo = null
          var fileData = fileContent
          var fileInfoRes = fileContent.match(/^\-\-\-([\w\W]*)\-\-\-/)
          if (fileInfoRes) {
            var fileInfoStr = fileInfoRes[1]
            fileData = fileContent.replace(fileInfoStr, '')
          }

          if (fileInfoStr) {
            var keyPattern = /\*\*(.+)\*\*/g
            var keyPattern1 = /\*\*(.+)\*\*/
            var keys = fileInfoStr.match(keyPattern)
            var keysArr = keys.map((key) => {
              return key.match(keyPattern1)[1]
            })

            var valuePattern = /\:\s(.+)\n\n/g
            var valuePattern1 = /\:\s(.+)\n\n/
            var values = fileInfoStr.match(valuePattern)
            var valuesArr = values.map((value) => {
              return value.match(valuePattern1)[1]
            })
            // 在这呢
            fileInfo = keysArr.map((key, i) => {
              return { key, value: valuesArr[i] }
            })
          }

          console.log('---------------', fileInfo)

          reslove({ fileName: file.name.replace('.md', ''), fileInfo, fileData })
        }
      })
    },
    // 获取文件扩展名
    getFileExtension(fileName) {
      return fileName.match(/\.([^.]+)$/)[1]
    },
    // 判断是否为markdown文件
    isMarkdownFile(fileName) {
      return this.getFileExtension(fileName) === 'md'
    },
    // 重名过滤
    // 文件过滤
    //
    dragFn(event) {
      event.preventDefault()

      var hasReapetFile = false

      // 过滤出来的.md文件
      // 符合要求文件md文件（文件名未冲突）
      var tasks = []
      var repeatFilesTasks = []
      if (event.type == "drop") {
        var files = event.dataTransfer.files;
        for (var i = 0; i < files.length; i++) {
          // md文件过滤，显示提示
          if (!this.isMarkdownFile(files[i].name)) {
            this.showTip1 = true
            this.showTip2 = false
            continue
          }
          // 返回重名的文件对象
          // 检查结果重名文件返回添加 rename属性的文件对象, 不重名文件返回undefined
          if (BUS.hadSameFile(files[i].name.replace('.md', ''))) {
            repeatFilesTasks.push(this.readFile2Str(files[i]))
            continue
          }

          // 非同名文件 异步
          tasks.push(this.readFile2Str(files[i]))

        }
        // 多文件拖拽中有重名文件
        if (repeatFilesTasks.length > 0) {
          hasReapetFile = true
          Promise.all(repeatFilesTasks).then((reslove) => {
            console.log(reslove)
            BUS.renameFileList = reslove
          })
        }

        // 拖拽文件中没有md文件

        if (tasks.length === 0) {
          // 重复文件不触发 非md 文件提示
          if (!hasReapetFile) {
            this.showTip1 = false
            this.showTip2 = true
          }
          return
        }
        Promise.all(tasks).then((reslove) => {
          // .md文件加载完成，把文件数据组成的数组传递出去
          BUS.$emit('mdFilesloaded', reslove)
          // 符合要求的文件列表储存到bus中
          BUS.LoadFileList = reslove
          console.log(reslove)
        })
      }
    },
    openFile(e) {
      //
      var file = e.target.files[0]
      if (!file) return
      // 不是md文件
      if (!this.isMarkdownFile(file.name)) {
        this.showTip1 = false
        this.showTip2 = true
        return
      }
      // 清除所有tip显示
      this.showTip1 = false
      this.showTip2 = false


      // 读取数据
      this.readFile2Str(file).then((reslove) => {

        if (BUS.hadSameFile(reslove.fileName)) {
          BUS.renameFileList = [reslove]
          this.renameShow = true
        } else {
          BUS.saveInLocal(reslove.fileName, reslove.fileInfo, reslove.fileData)
          BUS.readLocalFileShow = false
          BUS.openAfile(reslove.fileName)
        }
      })
    },

    cancelImport() {
      BUS.readLocalFileShow = false
    },
    // 重名检测（本地文件与localStorage）
  },
  mounted() {
    console.log(localStorage)
    // 关闭加载组件
    BUS.$on('mdFilesloaded', () => {
      BUS.readLocalFileShow = false
    })


    // 展开文件列表
    BUS.$on('mdFilesloaded', () => {
      if (BUS.LoadFileList.length > 1) BUS.fileListShow = true

      console.log(localStorage)
    })

    this.$el.addEventListener("dragenter", this.dragFn)
    this.$el.addEventListener("dragover", this.dragFn)
    this.$el.addEventListener("drop", this.dragFn);
  }
}
</script>
