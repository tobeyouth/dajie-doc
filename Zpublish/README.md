#Zpublist

a simple subscribe&publish plugin for zepto

##how to use
	// bind event
	$.subscribe('say',function () {
		console.log('hello world');
	});

	// fire
	$.publish('say'); // hello world;

##if you want to use some parameter in your callback
	
	// bind event
	$.subscribe('say',function (name) {
		console.log('hello ' + name);
	});

	// fire
	$.publish('say','world'); // hello world;