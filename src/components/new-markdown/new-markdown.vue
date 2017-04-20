<!-- —————————————↓SCSS———————分界线————————————————————————— -->
<style lang="scss">
@import '../../scss/skin/default.scss';

.new-markdown {
  // 遮罩
  position: absolute;
  z-index: 9999;

  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, .7);
  .dialog {
    position: absolute;
    left: 0;
    right: 0;
    top: 2em;

    width: 400px;
    margin: auto;
    border: 1px solid $main-color;
    background: white;
    line-height: 2;
  }
  .dialog-title {
    margin-bottom: 2em;
    background: $main-color;

    text-align: center;
    color: $font-color-main;
  }
  .dialog-content {
    margin-bottom: 3.5em;

    .input {
      margin: 1em 0;
      position: relative;
    }
    .key {
      display: inline-block;

      width: 100px;
      margin-right: 1em;

      text-align: right;
    }
    input {
      width: 220px;
      height: 2em;
      box-sizing: border-box;

      font-size: $font-size-base;
      line-height: 2;
    }
    input.key {
      border: none;
      outline: none;
    }
    input.value {
      padding-left: 10px;

      border: 1px solid #ccc;
      border-radius: 4px;
    }
    .fileName-tip {
      position: absolute;

      margin-left: .5em;
      margin-top: 5px;

      font-size: 12px;
      color: red;
    }

    .tip {
      text-align: center;
      color: #ccc;
      font-size: 12px;
      margin: .2em;
    }
    .addlink {
      position: absolute;
      bottom: 0;

      display: inline-block;

      width: 30px;
      height: 2em;
      margin-left: -30px;

      text-align: center;

      .icon-iconfontlink {
        position: relative;

        display: inline-block;

        margin-top: .1em;

        color: #ccc;
      }
      .link {
        position: absolute;
        left: -630%;
        right: 0;

        height: 100%;
        padding-left: .6em;
        border: 1px solid black;
        border-radius: 4px;
        background: rgba(0, 0, 0, .7);

        font-size: 14px;
        color: #ccc;
      }
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
        .input(v-for="(v,i) in fileInfoArr")
          span.key(v-if="i===0") {{v.key}}
          input.key(v-else="",spellcheck="false", v-model="v.key")
          input.value(spellcheck="false", v-model="v.value")
          div.addlink(v-if="i!=0")
            transition(name="fade")
              input.link(spellcheck="false", type="url",v-show="linkInputShow[i]",v-model="v.link",@click.stop="",placeholder="请输入绑定链接")
            a(@click="addLink(i)").iconfont.icon-iconfontlink
          //- 只有文件名才有验证
          template(v-if="i===0")
            span.fileName-tip( v-show="fileNameIsEmpty" ) 必填
            span.fileName-tip( v-show="hadRepeatFile" ) 重名


        .tip 第二个第三个key值可以自定义
      .dialog-btns
        a.create(@click="sureFn") {{typeObject[type].sureBtn}}
        a.cancel(@click="cancelFn") {{typeObject[type].cancelBtn}}

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
      // 输入链接的input显示状态
      linkInputShow: [false, false, false],
      typeObject: {
        // 创建文件
        create: {
          dialogTile: '创建',
          sureBtn: '创建文件',
          cancelBtn: '取消'
        },

        // 修改文件名 和 文件信息
        revise: {
          dialogTile: '修改文件信息',
          sureBtn: '修改完成',
          cancelBtn: '取消修改'
        }

      },
      fileInfoArr: [
        { key: '文件名', value: '', link: '' },
        { key: '作者', value: '', link: '' },
        { key: '联系方式', value: '', link: '' }
      ],
      // 验证成功后的信息
      createInfo: null
    }
  },
  props: {
    type: { // 弹出框类型: 创建 | 重命名
      type: String // type: create | rename |
    },
  },
  computed: {
    // 共享数据
    reviseingInfo() {
      console.log('BUS.reviseingInfo', BUS.reviseingInfo)
      return BUS.reviseingInfo
    },
    // 组件状态
    createShow() {
      return BUS.createShow
    },
    reviseShow() {
      return BUS.reviseShow
    },
    // 验证
    fileName() {
      return this.fileInfoArr[0].value
    },
    fileNameIsEmpty() {
      return this.fileName === ''
    },
    hadSameFile() { // 只是localStorage 中是否存在相同的文件名
      return BUS.hadSameFile(this.fileName)
    },
    hadRepeatFile() {  // 去除 修改文件名时文件名不修改时的重名清空
      return (!this.fileNameIsEmpty && this.hadSameFile) && (!(this.reviseingInfo && this.reviseingInfo.oldFileName === this.fileName))
    },
    passValidate() {
      return !this.fileNameIsEmpty && !this.hadRepeatFile
    }

  },
  methods: {
    // 组件的双重功效（创建文件，修改文件信息）
    sureFn() {
      this.type === 'create' ? this.create() : this.revise()
    },
    cancelFn() {
      this.type === 'create' ? this.cancelCreate() : this.cancelRevise()
    },

    //————————————————————————————————验证和获取表单数据方法——————————————————————————

    getCreateInfo() {
      // 文件名为空弹窗警告
      if (!this.fileInfoArr[0].value) {
        alert('文件名不能为空')
        return
      }

      //  确保文件信息顺序与表单顺序吻合
      // 通过验证 || 组件作为修改信息时
      if (this.passValidate) {
        var obj = {
          fileName: this.fileInfoArr[0].value,
          info: []
        }
        this.fileInfoArr.forEach((v, i) => {
          // 深拷贝，否则因为在this.resetInfoValue()中清除的value值会影响到BUS.editingFile
          if (i >= 1 && v.key && v.value) obj.info.push({ key: v.key, value: v.value, link: v.link })
        })
        // createInfo 已经符合要求的创建信息
        this.createInfo = obj

        window.log('验证通过的数据', 'createInfo', this)
      }
    },
    //————————————————————————————————验证和获取表单数据方法-结束——————————————————————————

    //————————————————————————————————创建与修改操作方法—————————————————————————

    create() {

      // 保存原有工作
      BUS.save()

      // 获取更新createInfo
      this.getCreateInfo()
      // 表单数据验证未通过
      if (!this.createInfo) return
      // 表单数据验证通过
      // 将创建文件信息存在localStorage
      BUS.saveInLocal(this.createInfo.fileName, this.createInfo.info, '')

      // 清空上次文件的数据

      // 更新文件列表
      BUS.initFileList()
      // 关闭窗口
      BUS.createShow = false

      // 打开创建好的文件
      BUS.editingFile = this.createInfo
      BUS.markdownData = ''

      // 重置表单
      this.resetInfoValue()
      // 重置
      this.createInfo = null
    },
    cancelCreate() {
      BUS.createShow = false
    },

    revise() {

      BUS.save()

      // 验证通过的创建文件信息createInfo
      this.getCreateInfo()

      // 验证未通过（空文件名，或者重名）
      // 文件名不做修改是不会报错重名
      if (!this.createInfo) return

      var fileName = this.createInfo.fileName
      var oldFileName = BUS.reviseingInfo.oldFileName
      var revisedFileInfo = this.createInfo.info
      BUS.saveInLocal(fileName, revisedFileInfo, localStorage[oldFileName + '$Data$'])
      if (BUS.reviseingInfo.oldFileName != fileName) BUS.removeFileData(oldFileName)

      // 更新文件列表
      BUS.initFileList()
      BUS.reviseShow = false

      // 打开修改的文件
      BUS.openAfile(fileName)


      // 重置
      this.resetInfoValue()
      this.createInfo = null
      BUS.reviseingInfo = null
    },
    cancelRevise() {
      BUS.reviseShow = false
    },
    //————————————————————————————————创建与修改操作方法—————————————————————————


    // ————————————————————————————————工具函数——————————————————————————————————
    // 初始值
    reviseInit() {

      if (!this.reviseingInfo) return

      this.fileInfoArr[0].value = this.reviseingInfo.fileName
      if (this.reviseingInfo.info.length === 0) return

      if (this.reviseingInfo.info.length <= 2) {
        this.fileInfoArr[1] = this.reviseingInfo.info[0]
      }
      if (this.reviseingInfo.info.length === 2) { // reviseingInfo.info.length ===2
        this.fileInfoArr[2] = this.reviseingInfo.info[1]
      }
    },

    // 创建完毕后，清理数据值,保留修改的键值
    resetInfoValue() {
      this.fileInfoArr.forEach((v) => {
        v.value = ''
        v.link = ''
      })
    },
    // ————————————————————————————————工具函数-结束——————————————————————————————————

    // 显示link 的 input
    addLink(i) {
      // 数组操作
      this.$set(this.linkInputShow, i, !this.linkInputShow[i])
    },

  },
  watch: {
    reviseingInfo(v) {
      // reviseingInfo有文件了，就自动加载待修改文件消息
      if (!v) return
      this.reviseInit()
      BUS.reviseShow = true
    }
  }
}
</script>
