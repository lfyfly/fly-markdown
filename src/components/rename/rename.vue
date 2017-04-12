<!-- ——————————————————多文件拖拽上传,处理重名文件（覆盖，重命名, 不加载）组件———————————————————— -->

<!-- —————————————↓SCSS———————分界线————————————————————————— -->
<style lang="scss">
@import '../../scss/skin/default.scss';

$item-height: 30px;
// 标题背景色
$title-bg-color: #b61515;
.rename-cover {
  background: rgba(0, 0, 0, .8);
  position: absolute;
  z-index: 999;
  width: 100%;
  height: 100%;
}

.rename {
  position: absolute;
  margin: auto;
  left: 0;
  right: 0;
  top: 10%;
  z-index: 1000;
  width: 320px;
  border: 1px solid;
  background: black;
  .rename-title {
    text-align: center;
    background: $title-bg-color;
    color: white;
    line-height: $item-height*1.2;
  }
  .rename-item-container {
    margin-top: 2em;
    .rename-item {
      text-align: center;
      height: $item-height;
      position: relative;
      margin: 10px;
      input {
        outline: none;
        height: $item-height;
        box-sizing: border-box;
        margin-right: 1em;
        font-size: $font-size-sm;
        padding: 0 .6em;
      }
      select {
        height: 100%;
        font-size: $font-size-sm;

        option {
          text-align: center;
        }
      }
      .my-select {
        top: 0;
        right: 0;
      }
    }
  }
  .btns {
    margin-top: 1em;

    text-align: center;
    margin-bottom: .2em;
    a {
      margin: .5em 0;
      color: #ccc;
    }
    .sure {
      width: 100px;
      border: 1px solid $title-bg-color;
      &:hover {
        color: #e2e2e2;
      }
    }
  }
  .btns a,
  .batch-operation a {
    display: inline-block;

    line-height: 1.8;
    padding: 0 1em;
    margin-left: .5em;
    margin-right: .5em;
  }
  .batch-operation {
    text-align: center;
    .active {
      border: 1px solid $title-bg-color;
    }
    a {
      border: 1px solid #303030;
      &:hover {
        border: 1px solid $title-bg-color;
      }
    }
    .all-replace,
    .all-cancel {
      color: $title-bg-color;
    }
  }


  .repeat-error {
    border: 2px solid red; // box-shadow: 0 0 2px 1px #d81515 inset;
  }
  .passAll-error {
    color: red;
    width: 100%;
    text-align: center;
    font-size: $font-size-sm;
    position: absolute;
    bottom: 3em;
  }
}
</style>

<!-- —————————————↓HTML————————分界线———————————————————————— -->
<template lang="pug">
.rename-cover(v-if="renameShow")
  .rename
    h3.rename-title 重名文件处理
    .rename-item-container
      .rename-item(v-for="(v,i) in renameFileList")
        input.file-name-input(
          spellcheck="false",
          :value ="optionArr[i].rename",
          @input = "rename($event,i)",
          :class="{'repeat-error':optionArr[i].error}"
          )
        select(:value="optionArr[i].selected", @change="selectChange($event,i)")
          option(v-for="v1 in optionList") {{v1}}
    .batch-operation
      a.all-replace(:class="{active:allReplace}", @click="setAllReplace") 全部覆盖
      a.all-cancel(:class="{active:allCancel}", @click="setAllCancel") 全部抛弃
    .btns
      a.sure(@click="renamed") 确定

    div.passAll-error(v-if="passAllErrorShow") 验证未全部通过
</template>

<!-- ——————————————↓JS—————————分界线———————————————————————— -->
<script>
import BUS from '../bus.js'

// 添加rename属性，表示对同名文件的操作
// {fileName:'file.md',rename:'changge.md'|'cover'|'replace',fileData:""}

// 多文件拖拽中，非重名文件直接 先 储存到localStorage
// 用户修改 -> 文件名检测合法 -> computed属性 -> updated(renameFileList导出到BUS) -> updated(储存到localStorage)

export default {
  name: 'rename',
  data() {
    return {
      msg: 'this is from rename.vue',
      optionList: ['重命名', '覆盖', '放弃加载'],
      // 对应每个文件的操作状态
      optionArr: [],
      passAllErrorShow: false
    }
  },
  props: {
    renameFileList: {
      type: Array,
      default() {
        return ['文件1', '文件2', '文件2']
      }
    }
  },
  computed: {
    // disabled() {

    //   return this.optionArr[i].selected === '覆盖' || this.optionArr[i].selected === '放弃加载' ? true : false
    // },
    renameShow() {
      return BUS.renameShow
    },
    hadSameFile() {
      return BUS.hadSameFile()
    },
    // 全部通过
    passAll() {
      return this.optionArr.every((v) => {
        return !v.error
      })
    },
    allReplace() {
      return this.optionArr.every((v) => {
        return v.selected === '覆盖'
      })
    },
    allCancel() {
      return this.optionArr.every((v) => {
        return v.selected === '放弃加载'
      })
    }
  },
  methods: {
    disabledAllInput() {
      var inputEls = document.querySelectorAll('.file-name-input')
      for (var i = 0; i < inputEls.length; i++) {
        inputEls[i].disabled = true
      }
    },
    setAllReplace() {
      this.optionArr.forEach((v, i) => {
        v.error = false
        v.selected = '覆盖'
        v.rename = BUS.renameFileList[i].fileName
      })
      // 禁用之后 value值无法修改
      // this.$nextTick(() => {
      this.disabledAllInput()
      // })
    },
    setAllCancel() {
      this.optionArr.forEach((v, i) => {
        v.error = false
        v.selected = '放弃加载'
        v.rename = BUS.renameFileList[i].fileName
      })
      // this.$nextTick(() => {
      this.disabledAllInput()
      // })
    },
    selectChange(e, i) {
      var el = e.target
      if (el.value === '重命名') {
        this.$set(this.optionArr[i], 'error', true)
        if (el.previousSibling.disabled) el.previousSibling.removeAttribute('disabled')
        return
      }

      if (!el.previousSibling.disabled) el.previousSibling.setAttribute('disabled', 'disabled')

      this.$set(this.optionArr[i], 'selected', el.value)
      this.$set(this.optionArr[i], 'error', false)
      this.$set(this.optionArr[i], 'rename', BUS.renameFileList[i].fileName)

    },
    rename(e, i) {
      // 如果选择 (覆盖 | 放弃加载) 文件名回到原来文件名,将无法修改文件名
      var value = e.target.value
      this.$set(this.optionArr[i], 'rename', value)
      this.$set(this.optionArr[i], 'error', value === '' || BUS.hadSameFile(value) ? true : false)

    },
    renamed() {
      if (this.passAll) {
        // 覆盖生成 LoadFileList
        console.log('this.optionArr', this.optionArr)
        this.optionArr.forEach((v, i) => {

          switch (v.selected) {
            case '重命名':
              BUS.renameFileList[i].fileName = v.rename
              BUS.LoadFileList.push(BUS.renameFileList[i])
              break
            case '覆盖':
              BUS.LoadFileList.push(BUS.renameFileList[i])
              break
            case '放弃加载':
              alert('不要了')
              break
          }
        })

        console.log(BUS.LoadFileList)
        alert(123)
        BUS.renameShow = false

        // 清空BUS.renameFileList
        BUS.renameFileList = []
        this.optionArr = []
        return
      }
      // 验证未通过提示
      this.passAllErrorShow = true

      setTimeout(() => {
        this.passAllErrorShow = false
      }, 5000)
    },
    initOptionArr() {
      for (var i = 0; i < BUS.renameFileList.length; i++) {
        this.optionArr.push({ rename: BUS.renameFileList[i].fileName, error: true, selected: '重命名' })
      }
    },
  },
  created() {
    // this.initOptionArr()
  },
  components: {
  },
  watch: {
    renameFileList: function () {
      this.initOptionArr()
      alert(this.optionArr.length)
      console.log(this.optionArr)
    }
  }
}
</script>
