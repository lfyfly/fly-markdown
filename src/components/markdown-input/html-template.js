var htmlTemplate =`<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1,maximum-scale=1, user-scalable=no">
  <title>Document</title>
  <script>
    var winWdith = window.innerWidth
    if (winWdith < 320 || winWdith > 440) winWdith = 320
    document.documentElement.style.fontSize = winWdith / 3.75 + 'px';
    window.addEventListener('resize', function () {
      winWdith = window.innerWidth
      if (winWdith > 800) document.querySelector('.markdown-catalog').className = "markdown-catalog catalog-hide"
      if (winWdith < 320 || winWdith > 440) return
      document.documentElement.style.fontSize = winWdith / 3.75 + 'px';
    })
  </script>
  <style>
    body,
    html {
      width: 100%;
      height: 100%;
      margin: 0;
      padding: 0
    }

    body>#app {
      height: 100%;
      overflow: hidden
    }

    .markdown2html .markdown-catalog li a {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis
    }

    .markdown2html {
      position: absolute;
      top: 65px;
      bottom: 10px;
      width: 100%
    }

    .markdown2html .markdown-catalog {
      position: absolute;
      left: 10px;
      border-top: 5px solid #000;
      border-bottom: 5px solid #000;
      overflow: auto;
      box-sizing: border-box;
      width: 220px;
      height: 100%;
      padding: 1em .6em
    }

    .markdown2html .med-line {
      position: absolute;
      height: 100%;
      width: 5px;
      margin-left: 240px;
      background: #000
    }

    .markdown2html .markdown-html {
      position: relative;
      overflow: auto;
      box-sizing: border-box;
      height: 100%;
      padding: 10px;
      margin-left: 255px;
      margin-right: 10px;
      border-top: 5px solid #000;
      border-bottom: 5px solid #000
    }



    blockquote,
    body,
    button,
    code,
    dd,
    div,
    dl,
    dt,
    fieldset,
    form,
    h1,
    h2,
    h3,
    h4,
    h5,
    h6,
    input,
    legend,
    li,
    ol,
    p,
    pre,
    td,
    textarea,
    th,
    ul {
      margin: 0;
      padding: 0
    }

    a {
      text-decoration: none;
      outline: none;
      cursor: pointer
    }

    input,
    textarea {
      spellcheck: false
    }

    .clearfix:after {
      content: ".";
      display: block;
      height: 0;
      clear: both;
      visibility: hidden
    }

    .clearfix {
      *zoom: 1
    }

    @media (max-width:800px) {
      table {
        width: 100%
      }
      .warn {
        color: orange
      }
      div.markdown-header {
        padding-left: 30px;
        margin: 0
      }
      div.markdown-header a.catalog-btn {
        display: block
      }
      div.markdown-header div.document-info {
        line-height: 1em;
        bottom: 1px
      }
      div.markdown-header div.document-info .info-key,
      div.markdown-header div.document-info .info-value a {
        font-size: 14px
      }
      div.markdown2html {
        bottom: 0
      }
      div.markdown2html .markdown-catalog {
        transition: transform .5s
      }
      div.markdown2html .catalog-hide {
        transform: translateX(-220px)
      }
      div.markdown2html .catalog-show {
        transform: translateX(0)
      }
      div.markdown2html .med-line {
        display: none
      }
      div.markdown2html .markdown-html {
        margin: 0
      }
      div.markdown2html .markdown-catalog {
        z-index: 1;
        background: rgba(0, 0, 0, .8);
        left: 0;
        border: none
      }
      div.markdown2html .markdown-catalog a {
        color: #ccc
      }
      div.markdown2html .markdown-catalog a:hover {
        color: #fff
      }
    }

    @media screen and (max-width:440px) {
      div.markdown-header {
        margin: 0;
        padding-left: .42456rem;
        height: .51rem
      }
      div.markdown-header .catalog-btn {
        position: absolute;
        left: .4em;
        line-height: .51rem;
        font-size: .183rem
      }
      div.markdown-header .made-by {
        top: auto;
        bottom: -.24rem
      }
      div.markdown-header .document-title,
      div.markdown-header .title-icon {
        font-size: .21228rem;
        line-height: .306rem;
        padding-left: 0
      }
      div.markdown-header .document-header.noFileInfo .document-title{
        font-size: .24625rem;
        line-height: .51rem
      }
      div.markdown-header div.document-info {
        position: static;
        text-align: left;
        line-height: .11724rem
      }
      div.markdown-header div.document-info .info-key,
      div.markdown-header div.document-info .info-value a {
        font-size: .11724rem
      }
      div.markdown2html {
        top: .5525rem
      }
      div.markdown2html .markdown-html {
        border-bottom: 0 solid
      }
      div.markdown2html .markdown-catalog {
        border: none
      }
      div.markdown2html .markdown-html {
        margin: 0
      }
      div.markdown2html .markdown-html h1 a.title {
        font-size: 26px
      }
      div.markdown2html .markdown-html h2 a.title {
        font-size: 22px
      }
      div.markdown2html .markdown-html h3 a.title {
        font-size: 19px
      }
      div.markdown2html .markdown-html h4 a.title {
        font-size: 16px
      }
      div.markdown2html .markdown-html h5 a.title {
        font-size: 14px
      }
    }

    body {
      min-width: 320px
    }

    .iconfont {
      color: #303030;
      font-size: 19.2px
    }

    a,
    body {
      color: #303030;
      font-size: 16px;
      font-family: Verdana, Arial, Helvetica, sans-serif
    }

    .catalog-active {
      color: #e32020!important
    }

    .markdown-catalog li {
      list-style: none
    }

    .markdown-catalog .level1 {
      font-size: 16px;
      font-weight: 700
    }

    .markdown-catalog .level2 {
      font-size: 14.4px;
      font-weight: 700;
      margin-left: .8em
    }

    .markdown-catalog .level3 {
      font-size: 12.8px;
      margin-left: 1.6em
    }

    .title {
      display: block;
      padding: .4em 0
    }

    .markdown-html>* {
      margin-bottom: 1em
    }

    .markdown-html h1 a.title,
    .markdown-html h2 a.title {
      border-bottom: 1px solid #ccc
    }

    .markdown-html h1 a.title {
      font-size: 30px
    }

    .markdown-html h2 a.title {
      font-size: 26px
    }

    .markdown-html h3 a.title {
      font-size: 22px
    }

    .markdown-html h4 a.title {
      font-size: 19px
    }

    .markdown-html h5 a.title {
      font-size: 16px
    }

    .markdown-html p {
      font-size: 16px;
      margin: .4em 0
    }

    .markdown-html ol,
    .markdown-html ul {
      margin-left: 2em
    }

    .markdown-html ol ol,
    .markdown-html ol ul,
    .markdown-html ul ol,
    .markdown-html ul ul {
      margin: .5em 0 .5em 1.5em
    }

    .markdown-html ol .s-list-title,
    .markdown-html ul .s-list-title {
      font-size: 19px;
      font-weight: 700;
      padding: .2em 0
    }

    .markdown-html ol ol li,
    .markdown-html ol ul li,
    .markdown-html ul ol li,
    .markdown-html ul ul li {
      font-size: 14px
    }

    .markdown-html ol ol .s-list-title,
    .markdown-html ol ul .s-list-title,
    .markdown-html ul ol .s-list-title,
    .markdown-html ul ul .s-list-title {
      font-size: 16px;
      font-weight: 700;
      padding: .2em 0
    }

    .markdown-html ol>li,
    .markdown-html ul>li {
      margin: .4em 0
    }

    .markdown-html table {
      border-collapse: collapse;
      border: 1px solid #969696
    }

    .markdown-html table caption {
      font-size: 19px;
      padding: .4em 0;
      font-weight: 700
    }

    .markdown-html table td,
    .markdown-html table th {
      padding: .4em 1em;
      text-align: center;
      border: 1px solid #969696
    }

    .markdown-html table thead th {
      color: #000;
      font-weight: 700
    }

    .markdown-html table tbody tr {
      color: #303030
    }

    .markdown-html table tbody tr:nth-child(odd) {
      background: #e2e2e2
    }

    .markdown-html blockquote {
      border-left: .4em solid #e2e2e2;
      padding-left: 1em
    }

    .markdown-html blockquote p {
      text-indent: 0
    }

    .markdown-html pre {
      margin-top: 1em;
      margin-bottom: 1em
    }

    .markdown-header {
      position: relative;
      height: 60px;
      border-top: 5px solid #000;
      margin: 0 10px
    }

    .markdown-header .catalog-btn {
      position: absolute;
      top: .9em;
      left: .4em;
      display: none;
      width: 1em;
      height: .2em;
      padding: .2em 0;
      border-top: .2em solid #000;
      border-bottom: .2em solid #000;
      background: #000;
      background-clip: content-box;
      font-size: 22px
    }

    .markdown-header .made-by {
      position: absolute;
      z-index: 2;
      right: .2em;
      top: .2em;
      background: #000;
      padding: 0 .2em;
      border-radius: 2px;
      color: #fff;
      font-size: 12px
    }

    .markdown-header .document-title,
    .markdown-header .title-icon {
      display: inline-block;
      font-size: 30px;
      line-height: 60px;
      vertical-align: middle
    }

    .markdown-header .document-title {
      padding: 0 .4em
    }

    .markdown-header .document-info {
      position: absolute;
      right: 0;
      bottom: .2em;
      min-width: 300px;
      text-align: right
    }

    .markdown-header .document-info span.info-key {
      font-weight: 700
    }

    .markdown-header .document-info>* {
      display: inline-block;
      padding-right: .8em;
      margin: 0
    }
  </style>
  <style>
    /*

Darcula color scheme from the JetBrains family of IDEs

*/

    .hljs {
      display: block;
      overflow-x: auto;
      padding: 0.5em;
      background: #2b2b2b;
    }

    .hljs {
      color: #bababa;
    }

    .hljs-strong,
    .hljs-emphasis {
      color: #a8a8a2;
    }

    .hljs-bullet,
    .hljs-quote,
    .hljs-link,
    .hljs-number,
    .hljs-regexp,
    .hljs-literal {
      color: #6896ba;
    }

    .hljs-code,
    .hljs-selector-class {
      color: #a6e22e;
    }

    .hljs-emphasis {
      font-style: italic;
    }

    .hljs-keyword,
    .hljs-selector-tag,
    .hljs-section,
    .hljs-attribute,
    .hljs-name,
    .hljs-variable {
      color: #cb7832;
    }

    .hljs-params {
      color: #b9b9b9;
    }

    .hljs-string {
      color: #6a8759;
    }

    .hljs-subst,
    .hljs-type,
    .hljs-built_in,
    .hljs-builtin-name,
    .hljs-symbol,
    .hljs-selector-id,
    .hljs-selector-attr,
    .hljs-selector-pseudo,
    .hljs-template-tag,
    .hljs-template-variable,
    .hljs-addition {
      color: #e0c46c;
    }

    .hljs-comment,
    .hljs-deletion,
    .hljs-meta {
      color: #7f7f7f;
    }
  </style>

</head>

<body>
  这里注入html的位置
  <script>
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
  </script>
  <script>
    console.log(ScrollResponse)
    new ScrollResponse({ contentSel: '.markdown-html', catalogSel: '.markdown-catalog', resize: true })


    var catalogBtnEl = document.querySelector('.catalog-btn')
    var catalogEl = document.querySelector('.markdown-catalog')
    catalogBtnEl.onclick = function () {
      var className = catalogEl.className
      if (className.indexOf('hide') != -1) {
        catalogEl.className = className.replace('hide', 'show')
      } else if ((className.indexOf('show') != -1)) {
        catalogEl.className = className.replace('show', 'hide')
      }
    }
  </script>
</body>

</html>`

alert(htmlTemplate)
export default htmlTemplate
