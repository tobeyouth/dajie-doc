#项目构建

###使用spm进行构建：

#####文件目录：
	
	|- model
	|-- dest(压缩合并之后的目录)
	|-- src (源代码)
	|-- package.json(模块信息)
	

#####构建文件：（package.json）
 
在模块的文件中，声明一个``package.json``，用来声明模块的``依赖``,``名字``,``所属的大模块``,``版本号``,``输出名字``，一个简单的模块的``package.json``如下：
	
	{
  		"family": "examples",
  		"name": "hello",
  		"version": "1.0.0",

  		"spm": {
    		"alias": {
      			"jquery": "jquery" // 外部引用
    			},
    		"output": ["main.js", "style.css"] // 输出的模块名称
  			}
	}

#####spm的基本流程：
1. clean - 清除多余模块
2. transport - 解决依赖
3. concat - 合并文件
4. copy - 生成debug文件
5. uglify - 压缩
6. clean - 在dist文件夹中清多余文件
7. 构建完成
8. 通过``make``命令部署模块

在文件夹中编写模块
执行 ``spm build``完成模块的压缩和构建


#####优缺点
- 简单
- 如果是全站的项目，只需要在顶级目录中创建一个``sea_modules``，然后将所有的非业务模块放到其中，便可以在各个业务模块中引用
- 缺点是流程全部不可定义。完成之后，可以通过创建``Makefile``文件和``make``命令执行部署等任务


###使用grunt构建

#####文件目录：
	
	|- model
	|- dest(压缩合并之后的目录)
	|- src(源代码)
	|- package.json(配置文件)
	|- Gruntfile.js(流程控制)
	|- node_modules(流程依赖的模块)
	
#####构建文件：(package.json & Gruntfile.js)

package.json:
	
	{
		"name" : "",
		"version" : "",
		"devDependencies": { //Grunt过程需要依赖的模块
    		"grunt": "~0.4.1",
    		"grunt-contrib-jshint": "~0.6.0",
    		"grunt-contrib-nodeunit": "~0.2.0",
    		"grunt-contrib-uglify": "~0.2.2"
    	}
	}
	
"Gruntfile.js":（定义流程）

	module.exports = function (grunt) {
		var pkg = grunt.file.readJSON('package.json');
		console.log(pkg);
	
		grunt.initConfig({
	    	pkg: grunt.file.readJSON('package.json'),
	    	uglify: {
	      			options: {
	        		banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
	      		},
	      	build: {
	        		src: 'src/<%= pkg.name %>.js',
	        		dest: 'dest/<%= pkg.name %>.min.js'
	      		}
	    	}
		});
		// Load the plugin that provides the "uglify" task.
		grunt.loadNpmTasks('grunt-contrib-uglify');
		// Default task(s).
		grunt.registerTask('default', ['uglify']);
	};
	
#####流程：
- 自定义，可以定义特殊模块的流程

#####优缺点
- 优点是可以自定义流程，包括不进行压缩或者合并的模块等
- 缺点是目前来看，每个模块都需要定义``package.json``和``Gruntfile.js``，这个比较麻烦（目前在找办法试试看能不能在顶级目录放一个``Gruntfile.js``来执行绝大多数的流程）



	
	