<!-- —————————————↓SCSS———————分界线————————————————————————— -->
<style lang="scss">
@import '../../scss/style.scss';
.new-markdown {
  z-index: 9999;

  a {
    cursor: pointer;
  }
  width: 100%;
  height: 100%;
  position: absolute;
  background: rgba(0, 0, 0, .7);
  .dialog {
    margin: auto;
    background: white;
    position: absolute;
    left: 0;
    right: 0;
    top: 2em;
    width: 400px;
    border: 1px solid $main-color;
    line-height: 1.8;
  }
  .dialog-title {

    text-align: center;
    background: $main-color;
    color: $font-color-main;
    margin-bottom: 2em;
  }
  .dialog-content {
    margin-bottom: 4em;

    label,
    .label {
      display: block;
      margin: 1em 0;
    }
    .key {
      display: inline-block;
      width: 100px;
      text-align: right;
      margin-right: 1em;
      line-height: 2;
      height: 2em;
    }
    input {
      font-size: $font-size-base;
      line-height: 2;
      height: 2em;

      width: 220px;
    }
    input.value {
      border-radius: 4px;
      border: 1px solid #ccc;
      padding-left: .6em;
    }
    .fileName-tip {
      color: red;
      font-size: 12px;
      margin-left: 1em;
      margin-top: 5px;
      position: absolute;
    }
    input.key {
      // width: 100%;
      text-align: right;
      border: none;
      box-sizing: border-box;
      outline: none;
    }
    .tip {
      text-align: center;
      color: #ccc;
      font-size: 12px;
      margin: .2em;
    }
  }
  .dialog-btns {
    position: absolute;
    bottom: .4em;
    right: .4em;
    &>* {
      padding: 0 1em;
      display: inline-block;
    }
    .create {
      background: $main-color;
      border: 1px solid $main-color;
      color: $font-color-main;
    }
    .cancel {
      border: 1px solid;
      box-sizing: border-box;
    }
  }
}
</style>

<!-- —————————————↓HTML————————分界线———————————————————————— -->
<template lang="pug">
transition(name="slide2bottom")
  .new-markdown(v-if="type==='create'?createShow:reviseShow")
    .dialog
      .dialog-title
        h4 {{typeObject[type].dialogTile}}
      .dialog-content
        label.filename
          span.key 文件名
          input.value(v-model="fileName")
          span.fileName-tip(v-show="!fileName") 必填
          //- 修改时不显示重名提示
          span.fileName-tip(v-show="(fileName&&hadSameFile) && (!(reviseingInfo&&reviseingInfo.oldFileName === fileName))") 重名
        .label
          input.key(v-model="fileInfo[0].key")
          input.value(v-model="fileInfo[0].value")
        .label
          input.key(v-model="fileInfo[1].key")
          input.value(v-model="fileInfo[1].value")

        .tip 第二个第三个key值可以自定义
      .dialog-btns
        a.create(@click="btn1Fn") {{typeObject[type].btn1}}
        a.cancel(@click="btn2Fn") {{typeObject[type].btn2}}

</template>

<!-- ——————————————↓JS—————————分界线———————————————————————— -->
<script>
//import XXX from './components/XXX'
import BUS from '../bus.js'

export default {
  name: 'new-markdown',
  data() {
    return {
      msg: 'this is from new-markdown.vue',

      typeObject: {
        // 创建文件
        create: {
          dialogTile: '创建',
          btn1: '创建文件',
          btn2: '取消'
        },

        // 修改文件名 和 文件信息
        revise: {
          dialogTile: '修改文件信息',
          btn1: '修改完成',
          btn2: '取消修改'
        }

      },
      fileName: '',
      fileInfo: [
        { key: '作者', value: '' },
        { key: '联系方式', value: '' }
      ],
      createInfo: null
    }
  },
  props: {
    // 弹出框类型: 创建 | 重命名
    // type: create | rename |
    type: {
      type: String
    },
  },
  computed: {
    reviseingInfo() {
      return BUS.reviseingInfo
    },

    createShow() {
      return BUS.createShow
    },
    reviseShow() {
      return BUS.reviseShow
    },
    hadSameFile() {
      return BUS.hadSameFile(this.fileName)
    },
    passValidation() {
      // 验证通过
      return this.fileName && !this.hadSameFile
    },

  },
  methods: {
    // 初始值
    reviseInit() {

      if (!this.reviseingInfo) return

      console.log(this.reviseingInfo)

      this.fileName = this.reviseingInfo.fileName
      if (this.reviseingInfo.info.length === 0) return
      if (this.reviseingInfo.info.length === 1) {
        this.fileInfo[0] = this.reviseingInfo.info[0]
      } else { // reviseingInfo.info.length ===2
        this.fileInfo = this.reviseingInfo.info
      }
    },

    btn1Fn() {
      this.type === 'create' ? this.create() : this.revise()
    },
    btn2Fn() {
      this.type === 'create' ? this.cancelCreate() : this.cancelRevise()
    },

    revise() {
      if (!this.fileName) {
        alert('文件名不能为空')
        return
      }


      BUS.save()

      // 验证通过的创建文件信息createInfo
      this.getCreateInfo()
      // 信息未修改
      if (this.createInfo) {
        BUS.$set(BUS.reviseingInfo, 'revised', true)
        BUS.reviseingInfo.fileName = this.createInfo.fileName
        BUS.reviseingInfo.fileInfo = this.createInfo.info
      }
    },
    cancelRevise() {
      BUS.reviseShow = false
    },

    // 创建完毕后，清理数据值,保留修改的键值
    resetInfoValue() {
      this.fileName = ''
      this.fileInfo[0].value = ''
      this.fileInfo[1].value = ''
    },
    getCreateInfo() {
      //  确保顺序与表单顺序吻合
      if (this.passValidation || this.type === 'revise') {
        var obj = {
          fileName: this.fileName,
          info: []
        }
        if (this.fileInfo[0].key && this.fileInfo[0].value) obj.info.push({ key: this.fileInfo[0].key, value: this.fileInfo[0].value })
        if (this.fileInfo[1].key && this.fileInfo[1].value) obj.info.push({ key: this.fileInfo[1].key, value: this.fileInfo[1].value })
        console.log(obj, 'onj')
        this.createInfo = obj
      }
    },
    create() {
      if (!this.fileName) {
        alert('文件名不能为空')
        return
      }
      // 保存原有工作
      BUS.save()

      // 获取更新createInfo
      this.getCreateInfo()
      // 验证通过的创建文件信息createInfo
      if (this.createInfo) {
        // 将创建文件信息存在localStorage
        BUS.saveInLocal(this.createInfo.fileName, this.createInfo.info, '')

        // 清空上次文件的数据
        BUS.markdownData = ''
        console.log(this.createInfo, 'this.createInfo')

        // 更新文件列表

        BUS.getFileList()
        BUS.$emit('created', this.createInfo)
        BUS.createShow = false
        // 正在编辑文件的文件信息
        BUS.isEditing = this.createInfo
        this.resetInfoValue()
      }

    },
    cancelCreate() {
      BUS.createShow = false
    },
  },
  created() {

  },
  watch: {
    reviseingInfo: function (v) {
      if (v && !v.revised) {
        this.reviseInit()
      }
    }
  }
}
</script>
