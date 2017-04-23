var document = `
# 什么是fly-markdown?
> **fly-markdown**是一款在线markdown编辑器，不依赖服务器

## 支持标准的markdown语法

- [**markdown语法参考**](http://www.appinn.com/markdown)

- 支持html标签

- 使用的是[**marked**](https://github.com/chjj/marked)，将markdown转为html

## 软件特性

- 响应式的操作界面
- 可加载本地的markdown文件
- 同步生成目录
 - **注意<red>不要跨级别</>使用目录**
 - **文章中<red>第一个标题等级</>就是作为<red>一级目录</>**
 - 目录自动添加锚点
 - 目录的级别最多为3级
- **markdown文件转HTML（响应式网页）**

## 一些新语法的特性

- 表格标题

T-T 表格标题

header 1 | header 2
---|---
row 1 col 1 | row 1 col 2
row 2 col 1 | row 2 col 2

- 新增颜色标签 （暂时只支持以下三种）

 - <red>红色</><green>绿色</><blue>蓝色</>

- 代码高亮

 - 使用的是[**highlight.js**](https://highlightjs.org/)，
将markdown转为html

 \`\`\`js
 var a=1;
 \`\`\`
 \`\`\`html
 <html></html>
 \`\`\`
`
