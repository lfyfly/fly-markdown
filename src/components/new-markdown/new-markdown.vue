<!-- —————————————↓SCSS———————分界线————————————————————————— -->
<style lang="scss">
@import '../../scss/skin/default.scss';

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
    margin-bottom: 3.5em;

    .input {
      display: block;
      margin: 1em 0;
      position: relative;
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
    .addlink {
      position: absolute;
      bottom: 0;
      width: 30px;
      height: 2em;
      display: inline-block;
      margin-left: -30px;
      text-align: center;
      .icon-iconfontlink {
        display: inline-block;
        margin-top: .2em;
        position: relative;
        color: #ccc;
        z-index: 2;
      }
      .link {
        height: 100%;
        border: 1px solid black;
        width: 220px;
        background: rgba(0, 0, 0, .7);
        color: #ccc;
        font-size: 14px;
        padding-left: .6em;
        box-sizing: border-box;
        position: absolute;
        left: -630%;
        right: 0;
        border-radius: 4px;
      }
    }
    input.value {
      border-radius: 4px;
      border: 1px solid #ccc;
      padding-left: 10px;
      box-sizing: border-box;
    }
    .fileName-tip {
      color: red;
      font-size: 12px;
      margin-left: .5em;
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
        .input(v-for="(v,i) in fileInfoArr")
          span.key(v-if="i===0") {{v.key}}
          input.key(v-else="",spellcheck="false", v-model="v.key")
          input.value(spellcheck="false", v-model="v.value")
          div.addlink(v-if="i!=0")
            transition(name="fade")
              input.link(spellcheck="false", type="url",v-show="linkInputShow[i]",v-model="v.link",@click.stop="",placeholder="请输入绑定链接")
            a(@click="addLink(i)").iconfont.icon-iconfontlink
          //- 只有文件名才有验证
          span.fileName-tip(v-if="i===0 && !v.value") 必填
          span.fileName-tip(v-show="i===0 &&(v.value && hadSameFile) && (!(reviseingInfo && reviseingInfo.oldFileName === v.value))") 重名


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
      // 输入链接的input显示状态
      linkInputShow: [false, false, false],
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
    // 弹出框类型: 创建 | 重命名
    // type: create | rename |
    type: {
      type: String
    },
  },
  computed: {
    reviseingInfo() {
      console.log('BUS.reviseingInfo', BUS.reviseingInfo)
      return BUS.reviseingInfo
    },

    createShow() {
      return BUS.createShow
    },
    reviseShow() {
      return BUS.reviseShow
    },
    hadSameFile() {
      return BUS.hadSameFile(this.fileInfoArr[0].value)
    },
    passValidation() {
      // 验证通过
      return this.fileInfoArr[0].value && !this.hadSameFile
    },

  },
  methods: {
    addLink(i) {
      this.$set(this.linkInputShow, i, !this.linkInputShow[i])

    },
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

    btn1Fn() {
      this.type === 'create' ? this.create() : this.revise()
    },
    btn2Fn() {
      this.type === 'create' ? this.cancelCreate() : this.cancelRevise()
    },

    revise() {

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
      this.fileInfoArr.forEach((v) => {
        v.value = ''
        v.link = ''
      })
    },
    getCreateInfo() {
      // 文件名为空弹窗警告
      if (!this.fileInfoArr[0].value) {
        alert('文件名不能为空')
        return
      }

      //  确保文件信息顺序与表单顺序吻合
      // 通过验证 || 组件作为修改信息时
      if (this.passValidation || this.type === 'revise') {
        var obj = {
          fileName: this.fileInfoArr[0].value,
          info: []
        }
        this.fileInfoArr.forEach((v, i) => {
          if (i >= 1) {
            console.log(v.value)
            // 深拷贝，否则因为在this.resetInfoValue()中清除的value值会影响到BUS.editingFile
            //BUS.editingFile = this.createInfo

            if (v.key && v.value) obj.info.push({ key: v.key, value: v.value, link: v.link })
          }
        })
        // createInfo 已经符合要求的创建信息
        this.createInfo = obj
        console.log(this.createInfo, '验证通过的数据')
      }
    },
    create() {

      // 保存原有工作
      BUS.save()

      // 获取更新createInfo
      this.getCreateInfo()
      // 验证通过的创建文件信息createInfo
      if(!this.createInfo) alert('文件名验证不通过')
      if (this.createInfo) {
        // 将创建文件信息存在localStorage
        BUS.saveInLocal(this.createInfo.fileName, this.createInfo.info, '')

        // 清空上次文件的数据
        BUS.markdownData = ''

        // 更新文件列表

        BUS.getFileList()
        // BUS.$emit('created', this.createInfo)
        BUS.createShow = false
        // 正在编辑文件的文件信息
        BUS.editingFile = this.createInfo
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
    reviseShow(v) {
      // 每次修改信息界面退出,重置表单数据
      if (!v) this.resetInfoValue()
    },
    reviseingInfo(v) {
      if (v && !v.revised) {
        this.reviseInit()
      }
    }
  }
}
</script>
