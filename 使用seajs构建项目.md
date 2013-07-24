#spm和combo

##spm

项目模块的构建

##combo

线上使用到模块的js合并

##关系与区别

``spm``用于项目的构建，但是合并之后，一个页面仍然可能会引用几个js文件，所以要用``combo``来合并http请求。


#seajs & grunt

##使用grunt进行简单的构建
1. 在项目中添加``package.json``和``Gruntfile.js``两个文件。``package.json``用于配置Grunt和在流程中用到的插件,``Gruntfile.js``定义项目的流程。
2. 构建项目的流程可以是这样的：

- transport - 解析依赖
- concat - 合并代码
- clean - 删除临时文件
- uglify - 压缩代码


