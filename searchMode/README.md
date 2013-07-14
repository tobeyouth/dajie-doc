#searchModes
一个简单的工具，用于组织简单的``搜索条件更新 -->刷新页面局部``的过程。

基于``jquery``和``artTemplate``。

##用法：
###创建
	
	 /* *
	 	* 新建一个searchMode对象
	 	* defaultMode是搜索对象的模版
	  	* options是进行ajax过程时配置的一些参数,可以配置的项有：
	  		{
	  			'url' : '',
	  			'type' : 'post/get',
	  			'dataType' : 'json/html/jsonp',
	  			'tpl' : '要渲染的模版文件'
	  		}
	 */
	 var searchMode = $.searchModes(defaultMode,options);
	 
	 
###使用

以下这些方法，都支持链式调用

	/**
		* 改变数据，并更新视图
		* 其中fun是更新视图的函数
	*/	 
	 searchMode.change(data,fun);
	 
	
	/**
		* 更新视图
		* 最后的just参数是用来表明是否“仅仅”刷新视图
		* true为"仅仅"刷新视图，而不请求数据，false则为"请求数据，并刷新视图"
	*/
	 searchMode.changeView(fun,just)
	 
	
	/**
		*  更新搜索条件，并不发起请求
	*/
	 searchMode.changeData(data);
	 
	
	/**
		* 更新搜索条件，并发起请求，触发回调
		* 是整个searchMode对象最为重要的方法
		* 不过建议使用"change"方法，这样语法看起来更加简明易懂。
	*/
	 searchMode.ajax(data,fun);
	 
	/** 
		* 过滤数据
		* 会返回给fun回调一个option
		* 其中包括了"searchData"和“callbackData”，分别是“搜索条件”和“返回数据”
		* 可以对其进行过滤。
	*/ 
	searchMode.filter(fun); 
	
	 

###增强 - 使用flow定制回调流程模版
考虑到可能会有很多地方用到同样或者类似的``更新数据 --> 刷新页面局部``的流程，如果每个都写一大串，语法上会很难看，所以可以创建一个``searchFlow``对象，用于管理和调用相同或者相似的``步骤``，例如：

	// 创建一个flow对象
	var flow = $.searchFlow('flowName'，{
		'step' : ['filter','changeData']
		'filterFun' : fun,
		'changeDataFun' : fun
	}); 
	
也可以创建了flow对象之后，通过config方法设置flow的内容：
	
	var flow = $.searchFlow('flowName');
	flow.config({
		'step' : ['changeData','filter','changeView'], // searchMode要进行的操作
		'changeDataFun' : fun, // 每部操作触发的回调
		'filterFun' : fun,
		'changeView' : fun
	});

定制好的flow可以这么使用：
	
	searchMode.use(flow); // 使用flow
	searchMode.user(data,flow); // 传入要改变的数据，并使用flow
	

###通用规则

- 所有的``fun``回调，如果需要传入多个回调方法，可以用输入的方式传入，例如``[fun1,fun2,fun3]``。
- flow中也可以设置多个回调，例如：

		var flow = $.searchFlow('flowName',{
			'step' : ['filter','changeData'],
			'filterFun' : [fun1,fun2,fun3]
		});

- 带入其他参数，searchMode的各个方法，都支持带入其他参数，例如：

		searchMode.changeData(data,fun,param1,param2,param3);

这些参数，都会被带入到fun中执行


- flow中也可以带入其他参数，例如：
	
		var flow = $.searchFlow('flowName',{
			'step' : ['filter','changeData'],
			'filterFun' : {
				'fun' : function () {}, // 回调
				'param' : 'hi world' // param参数要传入多个，可以通过数组的方式
			},
			'changeDataFun' : fun
		});

	
 



	
	 	 