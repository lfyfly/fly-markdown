# 什么是fly-markdown
> 运行在浏览器的markdown编辑器

> 马上使用[**fly-markdown**]()

## 支持标准markdown语法
- [**markdown语法参考**](http://www.appinn.com/markdown)

- 使用的是[**marked**](https://github.com/chjj/marked)，将markdown转为html

- 支持**html标签**

## 软件特点

### **响应式**的操作界面

### **实时目录**
 - 目录自动添加锚点
 - 目录的级别最多为3级
 - 不要跨级别使用目录
 - 文章中第一个标题等级就是作为一级目录

### 导入和导出markdown文件

- 虽然作为浏览器端运行，依旧可以有导入导出本地文件的能力
- 部分浏览器会识别为非法下载链接，而无法导出文件到本地

### 代码高亮
- 使用的是[**highlight.js**](https://highlightjs.org/)
- 需要在代码块指定高亮的语言（像这样: **```js**）
 ```js
 var a=1;
 ```
 ```html
 <html></html>
 ```

### 一键导出响应式网页

- 响应式网页（移动端），目录随着当前内容的滚动而改变激活的目录
- 支持代码高亮

## fly-markdown特有语法
> **在一般的markdown下是不起作用的**

### 表格标题
> **语法：** 在表格的上一个段落加上 **T-T 我是表格标题**

T-T 我是表格标题

header 1 | header 2
---|---
row 1 col 1 | row 1 col 2
row 2 col 1 | row 2 col 2
### 颜色标签
> **暂时只支持以下三种**

- **语法：**&lt;red>红色&lt;/> - &lt;green>绿色&lt;/> - &lt;blue>蓝色&lt;/>

- **编译后样式：** <red>红色</> - <green>绿色</> - <blue>蓝色</>

##  欢迎使用[**fly-markdown**]()
