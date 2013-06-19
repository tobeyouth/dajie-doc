关于cookie的控制
---
###cookie整理
1. 统计1/100用户的cookie使用情况，用户进入时，发起一个请求，带上cookie信息，统计时间大概是一周左右。
2. 整理统计数据,以``uid``作为``key``，统计每个用户所用到的cookie
3. 对cookie进行分类，区分出``用户权限相关cookie``和``样式相关cookie``还有``失效cookie``
4. 咨询各业务部门，统计各业务部门对于cookie的需求
5. 对于相似功能的cookie，可以进行合并
6. 终极目的是整理出``cookie白名单``

###剩余问题：
1. 对于操作过程中通过js写入的cookie怎么统计
2. ``dajie.com``下的资源，怎么获取到``job.dajie.com``下的cookie

###问题解决方案
1. 修改``$.cookie``插件，在每次修改cookie的时候都发出一个请求，用于统计cookie
2. 不同domain下存放不同的相应请求，目前可见的几个domain有：
	- www.dajie.com
	- job.dajie.com
	- cu.dajie.com
	- fnma.dajie.com
	- xo.dajie.com
	- campus.dajie.com
	- company.dajie.com
	- zhuanti.dajie.com
	- ats.dajie.com
	- 公司频道各个付费公司…
3. 可以预见的是，订制类的公司频道用到的一些cookie应该都是``dajie.com``这个domain中的

###cookie的自动检测
1. 还是在``$.cookie``上做改进，在上线之后，对``1/1000``的用户进行cookie统计。每次统计的cookie都要与白名单中的cookie进行对比，每天统计一次，发现不在白名单内的cookie，整理之后发送邮件给相关人进行确认。
2. 在预发布测试的过程中，cookie的检测要拓展到``100/100``的用户。


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
					"path" : "cookie左右的路径",
					"expir" : "cookie的持续时间",
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
	

###时间表

####cookie统计：
- 预计劳动节之后开始，统计``1/100``的pv量，持续时间两周，5.8开始,5.19结束
- 需要覆盖的域,``www.dajie.com``，``job.dajie.com``，``campus.dajie.com``，``company.dajie.com``
- 需要后台支持，将统一得来的数据不做区分统一入库
- 统计数据需求：
	- 根据统计得到的所有cookie，可以做排序，得出使用量最多的cookie
	- 可以根据``uid``删选cookie,整理得出``每个用户在使用过程中，需要用到的所有cookie``

####白名单整理：
- 预计时间一周，需要根据统计数据，和与各业务组沟通，整理出白名单（json格式）
- 完成时间5.26

####$.cookie改造
- 在cookie统计阶段进行，5.19完成代码和文档

####线上跟踪统计：
- 统计``1/1000``的pv量，每周整理一次，需要逐个跟白名单做对比
- 需要后台支持，追踪系统完成时间预计在白名单整理完成之前，完成时间暂定5.26

####白名单维护：
- 需要一个后台系统，可以提交cookie到白名单中，白名单中cookie超过15个就做警示，每次更新白名单都会生成日志和备份，并会自动发送邮件给前端。预计开始时间 5.26 之后。

####使用本地存储替换cookie，控制样式
- 插件在5.26开始制作，两天可以完成
- 推广和进行线上替换需要一些时间，预计时间为两周







