关于cookie的控制
---
###插件控制：
1. cookieTracker插件，检测页面中所有的cookie，并与白名单中的cookie做对比，对于白名单中没有的cookie，标红提示。
2. 修改``$.cookie``插件，在测试环境中，每次用``$.cookie``写入cookie的时候，都要跟白名单验证一下。
3.  还是``$.cookie``插件，在每次写入cookie的时候，都会判断一下当前页面cookie的长度，如果长度超过``20``个，则要进行提示，并且记录这个超出长度范围的``cookie``。
4.  cookieTracker插件检测``dajie.com``域下，当前页面cookie的变化，添加cookie的时候要跟白名单做对比，如果不在白名单中，要进行提示。


###维护``cookie白名单``的方法。
1. ``cookie``白名单只能由前端来修改和添加，每一版都要添加版本号和说明，格式如下：

		{
			"version":"0.0.1",
			"author" : [a,b,c], // 可以是前端+后端
			"description" : "修改描述，类似于svn的log",
			"cookies" : [
				{
					"name" : "cookie name",
					"domain" : "cookie要作用的域",
					"intro" : "关于该cookie的描述",
					"editer" : "添加这个cookie的人"
				}
			]
		}

2. 添加cookie白名单可以通过后台提交申请，具体的流程可以是这样:

	业务需求人提出申请 ---> 填写cookie的各个变量 ---> 后台先校验该域下的cookie是否已经满20个 ---> 通过 ---> 更新白名单

3. 后台会记录白名单的每一次更新，生成日志和白名单的备份 


###插件数量的控制
现在的想法是用本地存储的方式替换cookie，举例说明：
	
	// 记录一个弹层是否被关闭
	
	// cookie 方法
	$.cookie("layer_switch", 0/1,{"expires":"24*60*60*1000"})
	
	// 本地存储方法（以localstorage为例）
	localstorage.setItem('layer_switch',new Date() + 24*60*60*1000);
	
	