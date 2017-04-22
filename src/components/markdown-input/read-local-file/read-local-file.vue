<!-- —————————————↓SCSS———————分界线————————————————————————— -->
<style lang="scss">
// 接受托在文件的区域大小
.read-local-file {
  position: absolute;
  z-index: 1000;
  top: 30px;
  bottom: 0;

  overflow: hidden;

  width: 100%;
  background: rgba(0, 0, 0, .8);

  color: #ccc;
  text-align: center;

  .info-wraper {
    position: absolute;
    top: 0;
    bottom: 0;

    display: table;

    width: 100%;
    margin: auto 0;

    h3 {
      width: 100%;
      margin: auto;
    }
    .add-icon {
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
  }


  .file-type-tip {
    position: absolute;
    top: 1em;

    width: 100%;

    text-align: center;
    color: red;
  }
  .cancel-import {
    position: absolute;
    right: .2em;

    font-size: 30px;
    line-height: 1;
    color: #919191;
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
      label.add-icon(title="打开一个markdown文件") +
        input(type="file",style="display:none;",ref="fileInput",@change="openFile")
    a.cancel-import(@click="cancelImport") ×
</template>

<!-- ——————————————↓JS—————————分界线———————————————————————— -->
<script>
import BUS from '../../bus.js'

export default {
  name: 'read-local-file',
  data() {
    return {
      msg: 'this is from read-local-file.vue'
    }
  },
  computed: {
    isMobile() {
      return BUS.isMobile
    },
    readLocalFileShow() {
      return BUS.readLocalFileShow
    },
  },
  methods: {
    // ——————————————————————具象操作方法————————————————————————————
    openFile(e) {
      var file = e.target.files[0]
      if (!file) return
      // 不是md文件
      if (!this.isMarkdownFile(file.name)) {
        BUS.showTipFn({
          content: '请选择正确 .md 文件再打开',
          style: 'warn'
        })
        return
      }
      // 读取数据
      this.readFile2Str(file).then((reslove) => {
        // 读取完文件数据之后
        if (BUS.hadSameFile(reslove.fileName)) { // 文件名冲突，弹出修改组件
          BUS.renameFileList = [reslove]
          this.renameShow = true
        } else { // 文件名不冲突， 保存数据到localStorage, 打开文件
          BUS.saveInLocal(reslove.fileName, reslove.fileInfo, reslove.fileData)
          BUS.readLocalFileShow = false
          BUS.openAfile(reslove.fileName)
        }
      })
    },

    cancelImport() {
      BUS.readLocalFileShow = false
    },
    //——————————————————————具象操作方法-结束————————————————————————————

    readFile2Str(file) { // 返回promise对象

      return new Promise(function (reslove, reject) {
        var reader = new FileReader()
        reader.readAsText(file)
        reader.onload = function () {
          // 解析文件信息数据
          var fileContent = reader.result

          // (如果有)匹配出文件信息
          var fileInfo = null
          var fileData = fileContent
          var fileInfoRes = fileContent.match(/^\-\-\-([\w\W]*)\-\-\-\n\n/)
          if (fileInfoRes) {
            var fileInfoStr = fileInfoRes[0]
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
            var valuePattern1 = /\:\s\[(.+)\](?:\((.+)\))?\n\n/
            var values = fileInfoStr.match(valuePattern)

            var valuesArr = values.map((value) => {
              var match = value.match(valuePattern1)

              return { value: match[1], link: match[2] ? match[2] : '' }
            })
            // 在这呢
            fileInfo = valuesArr.map((info, i) => {
              info.key = keysArr[i]
              return info
            })
          }


          reslove({ fileName: file.name.replace('.md', ''), fileInfo, fileData })
        }
      })
    },

    // 拖拽多文件
    // 符合要求的文件数组
    dragFn(event) {
      event.preventDefault()

      if (event.type === 'dragover' || event.type === 'dragenter') {
        return
      }

      var hasReapetFile = false

      // 过滤出来的.md文件
      // 符合要求文件md文件（文件名未冲突）BUS.LoadFileList
      // 不符合要求（重名）md的文件， BUS.renameFileList -> 用户处理 ->BUS.LoadFileList
      var tasks = []
      var repeatFilesTasks = []
      if (event.type == "drop") {
        var files = event.dataTransfer.files
        for (var i = 0; i < files.length; i++) {
          // md文件过滤，显示提示
          if (!this.isMarkdownFile(files[i].name)) {
            this.showTipFn()
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
            BUS.renameFileList = reslove
          })
        }

        // 拖拽文件中没有md文件

        if (tasks.length === 0) {

          return
        }
        Promise.all(tasks).then((reslove) => {
          // 符合要求的文件列表储存到bus中
          BUS.LoadFileList = reslove

          // 关闭加载组件
          BUS.readLocalFileShow = false
          // 展开文件列表
          if (BUS.LoadFileList.length > 1) BUS.fileListShow = true

        })
      }
    },
    // 获取文件扩展名
    getFileExtension(fileName) {
      return fileName.match(/\.([^.]+)$/)[1]
    },
    // 判断是否为markdown文件
    isMarkdownFile(fileName) {
      return this.getFileExtension(fileName) === 'md'
    },
  },
  mounted() {

    this.$el.addEventListener("dragenter", this.dragFn)
    this.$el.addEventListener("dragover", this.dragFn)
    this.$el.addEventListener("drop", this.dragFn);
  },
}
</script>
