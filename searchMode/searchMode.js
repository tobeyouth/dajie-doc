/*
	一个方便当前页面刷新的工具
	
	具体原理就是：
	刷新数据 <--> 更新视图
	
	主要功能点在于本地搜索数据和内容部分的更新，对于请求过来的数据不关心
	
	2013 05 22
	by jn
*/

;(function (exports,$) {

	/*
		default是模版data，也就是一个列表，列出所有的搜索条件
		ps:当然，也可以不全部放入，但是还是建议全部放入，因为这样看起来比较清晰

		options是一些设置参数，默认模版为:

		options = {
			'class' : 'static/private/public' , // 数据类型，现在还么想好要做啥，先占上坑
			'tpl' : '', // 模版文件
			'url' : '', // ajax设置
			'type' : 'GET/POST' , 
			'dataType' : ''
		}

	*/

	/*
		searchMode对象
	*/
	var searchModes = function (defaultData,options) {
		this.data = defaultData;
		this.options = options;
	};

	var searchFlow = function (flowName,options) {
		this.name = flowName;
	};

	searchModes.modList = []; // searchMod的列表
	searchFlow.flowList = []; // searchflow的列表


	/*
		这里是主要内容
	*/
	searchModes.prototype = {
		'constructor' : searchModes,
		// ajax请求回来的数据存放在这里
		// 目前还没有做本地存储，因为考虑到这个东西可能经常性的更新
		// 如果做了本地存储，效率可能会更低下
		'callbackData' : null, 
		// changeData方法基本不需要回调
		// 如果写了回调，那也应该是在searchMode外进行操作
		'changeData' : function (data,fun) { // 更新搜索条件,但不改变视图
			var searchMode = this,
				data = data,
				fun = fun,
				args = [].slice.call(arguments),
				param = args.slice(2,args.length);

			if (!!data && !$.isFunction(data)) {
				$.extend(searchMode.data,data);
			};

			// 将data添加到调用的数组顶端
			param.unshift(searchMode.data);

			// 调用回调
			if ($.isArray(fun)) {
				for (var i = 0,len = fun.length;i < len;i++) {
					fun[i].apply(searchMode,param);
				};
			} else if ($.isFunction(fun)) {
				fun.apply(searchMode,param);
			};
			return searchMode;
		},
		// 刷新视图；
		// fun这参数可以传入n个，就是可以有多个刷新视图的回调
		// just表示是否仅仅刷新视图
		'changeView' : function (fun,just) {
			var searchMode = this,
				fun = fun,
				args = [].slice.call(arguments),
				just = args[1],
				param = typeof(just) == 'boolean' ? args.slice(2,args.length) : args.slice(1,args.length),
				funArr = $.isArray(fun) ? fun : [fun];
				// fun = ($.isFunction(just) || $.isArray(just)) ? just : fun, // 这里做这个恶心的判断，是因为use中会统一塞入参数 data和fun

			if (typeof(just) == 'boolean' && !!just) { // 写了just且just为true时，只刷新页面
				param.unshift(searchMode.callbackData); // 推入数据
				// 调用所有的changeView的回调
				for (var i = 0,len = funArr.length;i < len;i++) {
					// funArr[i].call(searchMode,searchMode.callbackData); 
					funArr[i].apply(searchMode,param); 
				};
			} else { // 只有fun的情况
				// 方法比较丑陋...
				param.unshift(funArr);
				param.unshift(searchMode.data);
				searchMode.ajax.apply(searchMode,param); // 请求数据，并刷新页面
			};
			return searchMode;
		},
		'ajax' : function (data,fun) { // 只请求数据，存入到searchModes的callbackData中
			var searchMode = this,
				data = data,
				fun = fun,
				args = [].slice.call(arguments),
				param = args.slice(2,args.length);

			if (!!data && !$.isFunction(fun) && !$.isArray(fun)) { // 传入数据时，就先更新数据
				searchMode.changeData(data);
			}

			var options = searchMode.options,
				searchData = searchMode.data;

			// 这里做ajax请求
			$.ajax({
				'url' : options['url'],
				'type' : options['type'] || 'get',
				'dataType' : options['dataType'] || 'json',
				'data' : searchData,
				'success' : function (callbackData) {
					searchMode.callbackData = callbackData; // 将缓存更新
					param.unshift(callbackData); // 推入到回调的参数中

					if ($.isArray(fun)) {
						for (var i = 0,len = fun.length;i < len;i++) {
							// 只有function才会被回调
							// 因为在使用use方法的时候，会有obj混入fun列表中 o(╯□╰)o
							if ($.isFunction(fun[i])) {
								fun[i].apply(searchMode,param);
							}
						}
					} else {
						fun.apply(searchMode,param);
					}
					return searchMode; // 异步过程结束之后再返回对象，便于链式调用
				},
				'error' : function (err) {
					return searchMode;
				}
			});
		},
		'change' : function (data,fun) { // 更新搜索条件 -> 请求ajax -> 改变视图
			var searchMode = this,
				data = data,
				fun = fun,
				args = [].slice.call(arguments),
				param = args.slice(1,args.length);

			$.extend(searchMode.data,data); // 更新搜索条件

			searchMode.changeView.call(searchMode,param); // 这些都在这里面做了
			return searchMode;
		},
		// 仅仅是创建一个过滤的动作，不关心数据是什么，和下一步动作是什么;
		// 目前来看，主要应用在请求前的数据过滤，和请求后，刷新视图前的数据过滤
		// 会给回调中塞入一个对象，包含两个属性，callbackData和searchData
		// 根据use方法的需要，这里需要做一下判断
		'filter' : function (fun) {
			var searchMode = this,
				callbackData = searchMode.callbackData,
				data = searchMode.data,
				dataOption = {
					'callbackData' : callbackData,
					'searchData' : data
				},
				args = [].slice.call(arguments),
				fun = fun,
				param = args.slice(1,args.length);

			param.unshift(dataOption);

			if ($.isArray(fun)) {
				for (var i = 0,len = fun.length;i < len;i++) {
					fun[i].apply(searchMode,param);
				};
			} else {
				fun.apply(searchMode,param);
			}

			return this;
		},
		// 使用flow对象
		'use' : function (data,flow) {
			var searchMode = this,
				isPrototypeOf = Object.prototype.isPrototypeOf,
				flowProto = searchFlow.prototype,
				data = data,
				flow = flow,
				step = !flow ? [] : flow['step'];

			// 有可能有不传入data的情况
			// 这个时候要凭空创建一个空的对象作为data
			// 因为有可能changeData会被调用
			// 这个时候data这个变量还是要有的才行
			if (!flow) {
				flow = data;
				data = {};
				step = flow['step'];
			};

			// 改变data
			searchMode.changeData(data);

			// 判断是否是flow对象
			if (!isPrototypeOf.call(flowProto,flow)) {
				console.log('请传入flow类型的对象');
				return;
			}

			// 按照step中的步骤来执行
			if (!!step && $.isArray(step)) {
				for (var i = 0,len = step.length;i < len;i++) {
					// 去找对应的方法，如果没有该方法，则跳过该方法继续执行并作出提示
					var stepName = step[i],
						funName = stepName+'Fun',
						stepFun = flow[funName], 
						fun, // 要执行的方法
						param; // 要传入的参数，不一定用的上

					// 支持flow中传入参数
					if ($.isArray(stepFun) || $.isFunction(stepFun)) {
						fun = stepFun;
						param = [fun];
					} else if(typeof(stepFun) == 'object') {
						fun = stepFun['fun'];
						param = stepFun['param'];
						param.unshift(fun);
					} else {
						console.log(funName + '参数不正确');
					};
					
					// 执行动作
					// 由于各个动作所需要的参数不同，所以在这里做一下判断
					if (stepName === 'changeView') {
						searchMode[stepName].apply(searchMode,param);
					} else if (stepName === 'filter') {
						searchMode[stepName].apply(searchMode,param);
					} else {
						if (!!fun) {
							param.unshift(searchMode.data);
							searchMode[stepName].apply(searchMode,param);
						}
					};

				}
			} else {
				console.log('使用flow要先指定step才行');
				return;
			}

			return searchMode;
		},
		// 返回搜索条件，虽然现在没什么用吧...
		getData : function (type) {
			var searchMode = this,
				data;
			if (!!type) {
				data = searchMode.data[type];
			} else {
				data = searchMode.data;
			};

			return data;
		},
		// 检测对象某属性的变化
		'watch' : function (type,setter) {

		}
	};

	searchFlow.prototype = {
		'constructor' : searchFlow,
		/*
			flow的格式:
			flow = {
				'name' : 'flow的名称',
				'step' : '[filter,change,changeView,changeData等方法的顺序]',
				'filterFun' : fun / [fun1,fun2], // filter要调用的函数，以下的参数都遵循这个原则
				'changeFun' : '',
				'changeViewFun' : '',
				'ajaxFun' : ''
			}
		*/
		'config' : function (flow) {
			for (key in flow) {
				this[key] = flow[key]
			}
		}
	};


	// 绑定到jQuery上
	$.extend({
		'searchModes' : function (defaultData,options) {
			var obj = new searchModes(defaultData,options);
			searchModes.modList.push(obj); // 推入到列表
			return obj;
		},
		'searchFlow' : function (flowName,flowConfig) { // 返回一个工作流程对象
			// 检查flowlist中是否已经存在了一个同名的flow
			for (var i = 0 ,len = searchFlow.flowList.length;i < len;i++) {
				if (searchFlow.flowList[i].name == flowName) {
					console.log('已存在同名的flow,请重新命名');
					return;
				}
			}
			var flow = new searchFlow(flowName);
			flow.config(flowConfig);
			searchFlow.flowList.push(flow);
			return flow;
		}
	});
})(window,jQuery);
