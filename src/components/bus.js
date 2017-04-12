import Vue from 'vue'

export default new Vue({
  data: {
    // 移动端判断
    isMobile: false,
    // 目录的显示状态
    catalogShow: false,

    // 创建文件界面是否显示
    createShow: false,
    // 修改文件名
    reviseShow: false,
    // 正在修改文件信息
    reviseingInfo: null,

    // 时候已经加载文档或创建一个文档，进入编辑模式
    // editingFile正在编辑的文件数据对象（包括, fileName info）
    editingFile: null,
    // 正在编辑文件的markdown数据
    // 与markdown中同步
    markdownData: '',
    // localstorage中拉取的文件列表
    fileList: [],
    // markdown-input 文件列表显示
    fileListShow: false,
    // read-local-file 的显示
    readLocalFileShow: false,
    // 处理拖拽多文件名冲突组件
    renameShow: false,
    renameFileList: [],
    LoadFileList: []
  },
  computed: {

  },
  methods: {
    // ———————————————————————————初始化函数—————————————————————————————————————
    init() {
      this.initIsMobile()
    },
    // 初始化的函数 ------------------------
    initIsMobile() {
      if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|ios)/i)) this.isMobile = true
    },
    // ———————————————————————————初始化函数结束——————————————————————————————————


    // 修改localStorage信息
    reviseInfo(fileName) {
      // 弹出

      // 用户填写表单，通过后修改 reviseingInfo.revised = true
      //
      // 增加新的文件信息

      // 清除原有文件信息
    },
    removeFileData(fileName) {
      alert(fileName)
      localStorage.removeItem(fileName)
      localStorage.removeItem(fileName + '$Data$')
      // 刷新文件列表
      this.getFileList()
      // 如果当前文件为删除文件
      this.editingFile = null
      this.markdownData = ''
    },
    getFileInfo(fileName) {
      var infoStr = localStorage[fileName]
      var info = !infoStr ? [] : JSON.parse(infoStr)
      return { fileName, info }
    },
    openAfile(fileName) {

      this.editingFile = this.getFileInfo(fileName)
      this.markdownData = localStorage[fileName + '$Data$']
    },
    saveFiles2LocalStorage(fileArr) {
      fileArr.forEach((file) => {
        // 去除扩展名
        var fileName = file.fileName.replace('.md', '')
        this.saveInLocal(fileName, file.fileInfo, file.fileData)
      })
    },

    // 保存数据到 localStorage`
    saveInLocal(fileName, info, markdownData) {
      localStorage[fileName] = info ? JSON.stringify(info) : ''
      localStorage[fileName + '$Data$'] = markdownData
    },
    hadSameFile(fileName) {
      if (fileName) {
        // 存在相同文件名
        console.log(this.fileList)
        if (this.fileList.length != 0 && this.fileList.indexOf(fileName) != -1) return true
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
        console.log(this.editingFile.fileName + ' 保存成功')
      }
    },

    getFileList() {
      console.log('更新文件列表')
      this.fileList = Object.keys(localStorage).filter((v, i) => {

        // 去除'$Data$'后缀 表示文件的数据
        // 去除'$Data$'后缀 如果在arr中
        return v.indexOf('$Data$') === -1
      })
    }
  },
  created() {
    // localStorage.clear()
    this.init()

    this.getFileList()
  },
  watch: {
    markdownData: function () {
      console.log(this.markdownData)
    },
    renameFileList: function (renameFileList) {
      // rename 组件操作，然后把之后列表赋值给 LoadFileList
      if (renameFileList.length === 0) return
      // 1. 打开rename组件
      this.readLocalFileShow = false
      this.renameShow = true
      alert(1213)

    },
    LoadFileList: function (fileArr) {
      console.log('123', fileArr)


      // 储存到localStorage
      this.saveFiles2LocalStorage(fileArr)
      // 更新文件列表
      this.getFileList()

      // 如果操作的是一个文件，那么就打开这个文件
      if (this.LoadFileList.length === 1) {
        // 只有一个重名文件时就打开它
        this.openAfile(this.LoadFileList[0].fileName)
      } else { // 如果操作的是多个文件，那么就打开文件列表
        this.fileListShow = true
      }
    },
    // 有文件信息要修改
    // fileInfo格式 {fileName,info:[]}
    reviseingInfo: function (fileInfo) {
      alert('change')
      console.log('change', fileInfo)
      console.log('fileInfo', fileInfo, this.reviseingInfo)
      if (!fileInfo) return
      // 文件数据未修改过，所以要弹出组件践行修改
      if (!fileInfo.revised) {
        this.reviseShow = true
        return
      }

      alert('hehda')

      // 信息修改过了
      // 保存新的信息
      console.log(fileInfo.fileName, fileInfo.info, localStorage[fileInfo.fileName + '$Data$'])
      this.saveInLocal(fileInfo.fileName, fileInfo.fileInfo, localStorage[fileInfo.oldFileName + '$Data$'])

      // 删除旧得信息
      // 如果文件没有被修改，只是修改了文件信息
      // 上面保存发生了覆盖，所以不用移除就得文件数据
      if (fileInfo.oldFileName != fileInfo.fileName) this.removeFileData(fileInfo.oldFileName)

      // 更新文件列表
      this.getFileList()
      this.reviseShow = false

      // 打开修改的文件
      this.openAfile(this.reviseingInfo.fileName)

      // 清除 需要修改的文件
      this.reviseingInfo = null
    }
  }
})
