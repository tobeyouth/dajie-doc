/*
	a subscribe & publish plugin for zepto
	基于zepto的自定义事件绑定机制

	by jn
	2013 04 18
*/
;(function ($) {
	var o = document.createElement('div');
	// 绑定
	$.subscribe = function () {
		$(o).bind.apply($(o),arguments);
	};

	// 触发
	$.publish = function () {
		$(o).trigger.apply($(o),arguments);
	};
})(Zepto);
