import Vue from 'vue'
import '../js/vue-log.js'
// ________ console.log辅助_____________________________


var RE = (observerData) => {
  return JSON.parse(JSON.stringify(observerData))
}
// ___________________________________________________

export default new Vue({
  name: 'bus.js',
  data: {
    //——————————————————————————————设备信息——————————————————————————————————————————

    isMobile: false, // 是否移动端判断
    winWidth: NaN, //  window.innerWidth , 浏览器窗口调整时会动态更改

    //———————————————————————————设备信息-结束——————————————————————————————————————————


    //———————————————————————————————组件状态——————————————————————————————————————————

    //【 markdown-html.vue 】
    catalogShow: false, // 目录的显示状态
    //【 markdown-input.vue 】
    textareaShow: true, // textarea 是否被折叠
    fileListShow: false, // 文件列表显示
    //【 组件：new-markdown.vue 】
    createShow: false, // 创建文件界面显示状态
    reviseShow: false, // 修改文件信息界面显示状态
    //【 组件：rename.vue 】
    renameShow: false, // 处理拖拽时多文件名冲突组件显示状态
    // 【 组件：read-local-file.vue 】
    readLocalFileShow: false, // read-local-file 的显示

    //  显示tip，一段时间后消失
    tipShow: { content: '', state: 'false', style: '', timer: null },

    //—————————————————————————组件状态-结束———————————————————————————————————————

    //———————————————————————————共享数据——————————————————————————————————————————
    // 正在编辑文件数据
    // 【数据来源】
    //    1.新建文件
    //    2.localStorage读取
    //    2.导入本地文件
    editingFile: null, //（对象格式：{ fileName,info:[{key ,value, link}]}）
    markdownData: '', // 正在编辑文件的markdown内容字符串

    // 正在修改的文件的文件信息
    // 【数据来源】： 点击文件列表左边的修改图标，从localStorage读取
    reviseingInfo: null, // 对象格式同 [ editingFile ]

    // 文件列表
    // 【数据来源】 从localstorage中拉取
    fileList: [],

    // 待-重名的文件列表
    // 【数据来源】 拖拽多文件加载时，文件名与localStroge冲突
    renameFileList: [],

    // 待-加载如localStroge的文件列表
    // 【数据来源】 拖拽多文件加载时，符合要求的.md文件组成的数组
    LoadFileList: [],

    //—————————————————————————共享数据-结束———————————————————————————————————

  },
  computed: {

  },
  methods: {
    // ———————————————————————————初始化数据方法—————————————————————————————————————
    // created生命周期中调用
    init() {
      this.initIsMobile()
      this.initFileList()
      this.initWinWidth()
      // 动态数据初始化
      window.addEventListener('resize', this.resizeInitWinWidth)
    },


    initIsMobile() {
      if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|ios)/i)) this.isMobile = true

      // window.log('是否为移动端?', 'isMobile', this)
    },

    initWinWidth() {
      this.winWidth = window.innerWidth
    },
    resizeInitWinWidth() {
      this.initWinWidth()
    },

    initFileList() {
      // localStorage 数据结构
      // localStorage.fileName = [{key, value, link},{key, value, link}]  最多两条数据
      // localStorage.$Data$fileName = markdownData
      this.fileList = Object.keys(localStorage).filter((v, i) => {
        // 去除'$Data$'后缀 表示文件的数据
        return v.indexOf('$Data$') === -1
      })
      // window.log('文件列表', 'fileList', this)
    },


    //———————————————————————————初始化数据方法-结束———————————————————————————————————

    //————————————————————————————全局方法———————————————————————————————————
    // 获得文件的信息数组 [格式: {key, value, link}]
    getFileInfo(fileName) {
      var infoStr = localStorage[fileName]
      var info = !infoStr ? [] : JSON.parse(infoStr)
      return { fileName, info }
    },

    // 保存【一个】文件数据到 localStorage
    saveInLocal(fileName, info, markdownData) {
      localStorage[fileName] = info ? JSON.stringify(info) : ''
      localStorage[fileName + '$Data$'] = markdownData
    },

    // 保存【一组】文件数据到 localStorage
    saveFiles2LocalStorage(fileArr) {
      fileArr.forEach((file) => {
        // 去除扩展名
        var fileName = file.fileName.replace('.md', '')
        this.saveInLocal(fileName, file.fileInfo, file.fileData)
      })
    },

    // 检测加载文件（新建文件名，修改文件名）是否和 localStorage 中的文件数据重名
    hadSameFile(fileName) {
      if (!fileName) return

      // window.vLog('是否重名', this.fileList.length != 0 && this.fileList.indexOf(fileName) != -1, this)
      // 存在相同文件名
      if (this.fileList.length != 0 && this.fileList.indexOf(fileName) != -1) return true
    },
    //——————————————————————————————全局方法-结束——————————————————————————————————

    //———————————————————————————抽象的操作方法———————————————————————————————————
    // 删除文件在 localStorage 的数据
    removeFileData(fileName) {
      localStorage.removeItem(fileName)
      localStorage.removeItem(fileName + '$Data$')
      // 刷新文件列表
      this.initFileList()
      // 如果当前文件为删除文件
      if (this.editingFile && fileName === this.editingFile.fileName) {
        this.textareaShow = true
        this.editingFile = null
        this.markdownData = ''
      }
    },
    // 完善的数据保存
    // - enter换行保存
    // - 新建文件
    // - 切换文件保存
    // - 定时保存
    save() {
      if (this.editingFile && this.editingFile.fileName) {
        localStorage[this.editingFile.fileName + '$Data$'] = this.markdownData

        // window.eLog(`文件 [${this.editingFile.fileName}] 保存成功`, this)
      }
    },
    // 从localstorage中打开一个文件
    openAfile(fileName) {
      this.editingFile = this.getFileInfo(fileName)
      this.markdownData = localStorage[fileName + '$Data$']

      // window.eLog(`打开一个文件 [${this.editingFile.fileName}] `, this)

    },
    //———————————————————————————共享数据处理方法-结束———————————————————————————————————

    // 显示tip，一段时间后消失
    // 未完成，将所有组件的tip进行集中管理
    showTipFn({ content, timeOut = 2000, style, condition = 'withoutCondition' }) {
      if (!condition) return

      this.tipShow.content = content
      this.tipShow.style = style
      this.tipShow.state = true

      if (this.tipShow.timer) clearTimeout(this.tipShow.timer)

      this.tipShow.state = true

      this.tipShow.timer = setTimeout(() => {
        this.tipShow.state = false
      }, timeOut)

      window.eLog(`显示tip`, this)

      // 显示tip
      return true
    },
  },

  created() {
    // localStorage.clear()
    this.init()
  },
  watch: {
    renameFileList: function (renameFileList) {
      // window.wLog('renameFileList', arguments, this)

      // rename 组件操作，然后把之后列表赋值给 LoadFileList
      if (renameFileList.length === 0) return
      // 1. 打开rename组件
      this.readLocalFileShow = false
      this.renameShow = true
    },
    LoadFileList: function (fileArr) {


      // window.wLog('LoadFileList', arguments, this)

      // 储存到localStorage
      this.saveFiles2LocalStorage(fileArr)
      // 更新文件列表
      this.initFileList()

      // 如果操作的是一个文件，那么就打开这个文件
      if (this.LoadFileList.length === 1) {
        // 只有一个重名文件时就打开它
        this.openAfile(this.LoadFileList[0].fileName)
      } else { // 如果操作的是多个文件，那么就打开文件列表
        this.fileListShow = true
      }
    },
  }
})
