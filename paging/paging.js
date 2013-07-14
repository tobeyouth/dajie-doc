/**
	* 一个生成页码的小插件
	* 基于jquery和arttemplate

	* 2013 05 20
	* by jn
*/
(function (exports,$) {
	// 默认的页码模版
	// o(╯□╰)o 其实整个插件最重要的也就是这个模版了
	
	var defaultPage =  '<% if (page > 1) { %>\
							<a class="prev" href="<%= page - 1 %>" data-page="<%= page - 1 %>"></a>\
						<% } %>\
						<% for (var i = start;i <= end;i++) { %>\
							<% if (i == page) { %>\
								<span class="current"><%= page %></span>\
							<% } else { %>\
								<a href = <%= i %> data-page = <%= i %>><%= i %></a>\
							<% } %>\
						<% } %>\
						<% if (end < total) { %>\
							<a class="dot" href="<%= end + 1 %>" data-page = <%= end + 1 %> title="第<%= end + 1 %>页"></a>\
						<% } %>\
						<% if (end != total) { %>\
							<a href="<%= total %>" data-page="<%= total %>">20</a>\
						<% } %>\
						<% if (page != total) { %>\
							<a class="next" href="<%= page + 1 %>" data-page="<%= page + 1 %>"></a>\
						<% } %>';

	/**
	 * 主要方法
	 * @param  {[type]} page     [当前页码]
	 * @param  {[type]} total    [页码总数]
	 * @param  {[type]} interval [每次显示多少页]
	 * @param  {[type]} tmpl     [模版文件,不传入参数的话，会选defaultPage]
	 * @return {[html]}          [返回html片段]
	 */
	function pagingIt(page,total,interval,tmpl) {
		var	page = parseInt(page,10),
			total = parseInt(total,10),
			interval = parseInt(interval,10) || 10, // 默认是显示10个页码
			tmpl = tmpl || defaultPage,// 渲染模版
			nowInterval = Math.floor(page / interval) < 1 ? 0 : Math.floor(page / interval), // 当前页是在哪个区间
			nowPoint = page % interval, // 当前页在当前区间的位置
			intervalNum = Math.floor(total / interval), // 一共可以分成多少区间
			end = (nowInterval + 1) * interval < total ? (nowInterval + 1) * interval : total,
			start = (end - interval) < 1 ? 1 : end - interval,
			renderData = {
				'page' : page,
				'total' : total,
				'start' : start,
				'end' : end
			},
			render = template.compile(defaultPage),
			html = render(renderData);
		return html;
	};

	if (!$.paging) {
		$.extend({
			"paging" : pagingIt
		})
	};
})(window,jQuery);
