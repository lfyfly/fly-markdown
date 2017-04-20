(function () {
  /*options{contextSel, catalogScrollEl, contentScrollEl, catalog, catalogSel, contentSel, contentTitleActive, resize}
   *
   */
  var ScrollResponse = function (options) {
    var contextEl = options.context ? document.querySelector(options.contextSel) : document

    this.options = options

    this.catalogScrollEl = contextEl.querySelector(options.catalogSel || '.catalog')
    this.contentScrollEl = contextEl.querySelector(options.contentSel || '.content')

    this.catalogTitleEls = this.catalogScrollEl.querySelectorAll(options.title || '.title')
    this.contentTitleEls = this.contentScrollEl.querySelectorAll(options.title || '.title')

    this.prevActiveIndex = 0
    this.titlesTopArr = []

    this.init()
  }
  // 暴露接口
  window.ScrollResponse = ScrollResponse

  ScrollResponse.prototype = {
    construtor: ScrollResponse,
    init: function () {

      var _this = this

      this.initTitlesTopArr(_this)
      // 可能在调整窗口大小的时候，initTitlesTopArr的内的值会发生变化
      if (this.options.resize) window.addEventListener('resize', function () {
        _this.initTitlesTopArr(_this)
      })

      // 初始化第一个标题为激活状态
      this.initFirstTitle(this)
      this.contentScrollEl.addEventListener('scroll', function (e) {
        _this.responseActiveCatalog(e, _this)
        _this.catalogCovered(e, _this)
      })
    },
    initTitlesTopArr: function (_this) {
      // 清空，可能会多次初始化
      _this.titlesTopArr = []
      _this.contentTitleEls = _this.contentScrollEl.querySelectorAll(_this.options.title || '.title')

      if (_this.contentTitleEls.length === 0) return

      for (var i = 1; i < _this.contentTitleEls.length; i++) {
        _this.titlesTopArr.push(_this.contentTitleEls[i].offsetTop)
      }
      // 最后一项为 scrollHeight，在滚动函数中赋值（可能会变化）
      _this.titlesTopArr.push(_this.contentScrollEl.scrollHeight)
    },
    initFirstTitle: function () {
      this._addClass(this.catalogTitleEls[0], 'catalog-active')
      if (this.options.contentTitleActive !== 'off') this._addClass(this.contentTitleEls[0], 'catalog-active')
    },


    // 根据scrollTop 给 目录添加激活状态
    responseActiveCatalog: function (e, _this) {
      var sTop = e.target.scrollTop
      for (var i = 0; i < _this.titlesTopArr.length; i++) {
        // 10 容宽度
        if (sTop < _this.titlesTopArr[i]) {
          // 只有当前激活的index改变了,才会进行演示切换
          if (i !== _this.prevActiveIndex) {

            _this._addClass(_this.catalogTitleEls[i], 'catalog-active')
            _this._removeClass(_this.catalogTitleEls[_this.prevActiveIndex], 'catalog-active')

            // 内容区标题激活样式是否开启
            if (_this.options.contentTitleActive !== 'off') {
              _this._addClass(_this.contentTitleEls[i], 'catalog-active')
              _this._removeClass(_this.contentTitleEls[_this.prevActiveIndex], 'catalog-active')
            }
            _this.prevActiveIndex = i
          }
          break
        }
      }
    },
    // 目录被滚动到看不见的区域(自动滚动目录到可视区)
    catalogCovered: function (e, _this) {
      var activeCatalog = _this.catalogScrollEl.getElementsByClassName('catalog-active')[0]
      // 在下面看不见 || 在上面看不见
      // 在下面看不见 || 在上面看不见
      if (activeCatalog.offsetTop + activeCatalog.offsetHeight >= (_this.catalogScrollEl.scrollTop + _this.catalogScrollEl.clientHeight)) {
        _this.catalogScrollEl.scrollTop = activeCatalog.offsetTop

      } else if (activeCatalog.offsetTop < _this.catalogScrollEl.scrollTop) {
        _this.catalogScrollEl.scrollTop = activeCatalog.offsetTop - _this.catalogScrollEl.offsetHeight + activeCatalog.offsetHeight * 2

      }
    },
    // ————————————————————————————内部工具函数————————————————————————————————
    _removeClass: function (el, className) {
      el.className = el.className.replace(className, '')
    },
    // 添加className
    _addClass: function (el, className) {
      el.className += (' ' + className)
    }
  }
})()
