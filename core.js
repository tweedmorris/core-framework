/**
* Core Framework
* 
* @version 1.0.0
* @copyright Creozon
* @author Angel Kostadinov (angel.kostadinov@toxicmedia.bg)
*/
(function() {
	
	this.Core = function() {}

	Core.apply = function(object, config)
	{
		return $.extend(true, object, config);
	}
	
	/* Inheritance */
	Core.extend = function(object)
	{
		var prototype = new this();
		
		$.extend(true, prototype, object);
		
		// The dummy class constructor
		function Class() 
		{
			// All construction is actually done in the init method
			if (this.init)
			{
				this.init.apply(this, arguments);
			}
		}
		
		// Populate our constructed prototype object
		Class.prototype = prototype;
		
		// Enforce the constructor to be what we expect
		Class.constructor = Class;
		
		// And make this class extendable
		Class.extend = arguments.callee;
		
		return Class;
	}

	Core.apply(Core, 
	{
		namespace: (function()
		{
			return {
				register: function(namespace, scope, object)
				{
					var namespaces = namespace.split('.');
					
					for (var i in namespaces)
					{
						var namespace = namespaces[i];

						if (!this.exists(namespace, scope))
						{
							scope[namespace] = object;
						}

						scope = scope[namespace];
					}
					
					return scope;
				},
				exists: function(namespace, scope)
				{
					return typeof scope[namespace] === "undefined" ? false : true;
				}
			}
		})(),
		define: function(namespace, object)
		{
			return this.namespace.register(namespace, window, object);
		},
		loader: (function()
		{
			// Table of script names and their dependencies.
			var scripts = {}
			
			var queue = [], counter = 0;
			
			/** @lends core.loader */
			return {
				addScripts: function( collection )
				{
					scripts = $.extend(true, {}, scripts, collection);
					
					return this;
				},
				loadScript: function(url, callback, context) 
				{
					var script = queue[url] || (queue[url] = 
					{
						loaded    : false,
						callbacks : []
					});
				
					if(script.loaded) {
						return callback.apply(context);
					}
				
					script.callbacks.push({
						fn      : callback,
						context : context
					});
				
					if(script.callbacks.length == 1) 
					{
						$.ajax(
						{
							type     : 'GET',
							url      : url + '.js',
							dataType : 'script',
							cache    : false,
							success  : function() 
							{
								script.loaded = true;
								
								$.each(script.callbacks, function() 
								{
									this.fn.apply(this.context);
								});
								
								script.callbacks.length = 0;
							}
						});
					}
				
				},
				queue: function()
				{
					var pushQueue = function(script)
					{
						if (-1 == $.inArray(script,queue)) /* Queue only script not loaded yet */
						{
							queue.push(script);
						}
					}
					
					$.each(scripts, function(script, scripts)
					{
						/* Queue dependencies first */
						$.each(scripts, function(index, script)
						{
							pushQueue(script);
						});
	
						/* Queue script */
						pushQueue(script);
					});
					
					return this;
				},
				autoload: function( callback )
				{
					/* Build queue */
					this.queue();
					
					/* Sequential loading via closure */
					(function() 
					{
						if(counter == queue.length) 
						{
							return callback.apply(window);
						}
						
						Core.loader.loadScript(queue[counter++], arguments.callee);
					})();
				}
			}
		})()
	});
})();


Core.define('Core.Class', Core.extend(
{
	delegate: function(target, method, args) /* Javascript Delegate */
	{
		return (typeof method == "function") ? function() 
		{ 
			/* Override prototype */
			arguments.push = Array.prototype.push;
			
			/* Push additional arguments */
			for (var arg in args)
			{
				arguments.push(args[arg]);
			}
			return method.apply(target, arguments); 
		} : function()
		{
			return false;
		};
	}
}));

/**
* Core.data
* @version 1.0.0
*/
Core.define('Core.data', Core.Class.extend(
{
	init: function(config)
	{
		Core.apply(this, config);
	}
}));

/**
* Core.animation
* @version 1.0.0
*/
Core.define('Core.animation', Core.Class.extend(
{
	options:
	{
		speed:  300,
		easing: 'linear'
	},
	animationQueue:[],
	listeners: 
	{
		complete: function(event, ui){}
	},
	init: function(options)
	{
		Core.apply(this.options, options);
	},
	queue: function(item, animation, callback)
	{
		this.animationQueue.push(
        {
        	item:	 	item,
        	callback:   callback,
        	animation:  $.extend(true, {}, animation)
        });
        
        return this;
	},
	reset: function()
	{
		this.animationQueue = [];
		
		return this;
	},
	animate: function()
	{
		for (i = 0; i < this.animationQueue.length; i++)
		{
			var callback = i == this.animationQueue.length - 1 ? this.listeners.complete: this.animationQueue[i].callback;
			
			this.animationQueue[i].item.animate(this.animationQueue[i].animation, this.options.speed, this.options.easing, callback);
		}
		
		/* Reset animation queue */
		this.reset();
	},
	addListener: function(listener, fn)
	{
		this.listeners[listener] = fn;
	}
}))


/**
* Core.ui.forms
* @version 1.0.0
*/
Core.define('Core.element', Core.data.extend(
{
	element: null,
	init: function(element, config)
	{
		this.element = element;
		
		/* Apply additional configuration directives */
		Core.apply(this, config);
	},
	replace: function(){ /* Override */ } /* Abstract method */
}))

/** 
* Core.ui.element.select
*/
Core.define('Core.element.select', Core.element.extend(
{
	options: 
	{
		theme: {},
		placeholder: null
	},
	listeners:
	{
		select: function(event, ui){},
		change: function(event, ui){}
	},
	animation: new Core.animation(
	{
		speed: 100
	}),
	open: function(event)
	{
		/* Close previously opened dropdowns */
		this.closeAll();
		
		var dropdown = $('<div/>').addClass('ui-form-select-dropdown').addClass(this.options.theme.classes.dropdown).css(
		{
			position:	'absolute',
			top: 		this.placeholder.offset().top + this.placeholder.height(),
			left: 		this.placeholder.offset().left,
			width: 		this.placeholder.outerWidth() - 4
		}).appendTo(document.body);
		
		$('option',this.element).each(this.delegate(this, this.collect,[dropdown]));
		
		/* Animate dropdown */
		this.animation.reset().queue(dropdown,
		{
			height: "show"
		}).animate();
		
		/* Bind document */
		$(document).bind('mousedown',this.delegate(this, this.forceClose));
	},
	close: function(index, item)
	{
		this.animation.queue($(item),
		{
			height: "hide"
		}, function()
		{
			$(this).remove();
		});
	},
	closeAll: function()
	{
		$(document.body).children('.ui-form-select-dropdown').each(this.delegate(this, this.close));
		
		/* Hide all dropdowns */
		this.animation.animate();
	},
	forceClose: function(event)
	{
		var abort = $(event.target).parents('.ui-form-select-dropdown').length;
		
		if (!abort)
		{
			this.closeAll();
		}
	},
	placeholder: function()
	{
		if (!this.options.placeholder)
		{
			this.options.placeholder = 
			{
				element: function()
				{
					var placeholder =  $('<div/>').addClass('ui-form-select')
									  .addClass(this.options.theme.classes.select)
									  .bind(
									  {
									  		mouseenter: this.delegate(this, this.mouse.over),
									  		mouseleave: this.delegate(this,this.mouse.out),
									  		click: this.delegate(this, this.open)
									  });
					
				    var wrapper = $('<div/>').appendTo(placeholder), input = $('<input/>',
				    {
				    	type: "text"
				    }).css(
				    {
				    	cursor: 		'pointer',
				    	width: 			100 + '%',
				    	background: 	'none',
				    	border: 		'none'
				    }).appendTo(wrapper);
					
					return placeholder;
				}
			}
		}
		
		this.placeholder = this.options.placeholder.element.apply(this,[]);
		
		return this.placeholder;
	},
	update: function(index, option, newOption )
	{
		if ($(option).val() == newOption.val())
		{
			$(option).attr('selected', true);
			
			this.placeholder.find(':text').val($(option).text());
			
			/* Trigger used defined onchange event(s) */
			this.element.trigger('onchange');
			
			/* Trigger listener */
			this.listeners.change.apply(this,[]);
		}
		else 
		{
			$(option).attr('selected', false);
		}
	},
	selectOption: function(event)
	{
		this.element.find('option').each(this.delegate(this, this.update,[$(event.target).data('option')]));
		
		this.closeAll();
	},
	mouse:
	{
		over: function(event)
		{
			$(event.target).addClass(this.options.theme.classes.selectOver);
		},
		out: function(event)
		{
			$(event.target).addClass(this.options.theme.classes.selectOver);
		}
	},
	collect: function(index, option, dropdown)
	{
		var row = $('<a/>', 
		{
			title: $(option).text()
		}).data('option', $(option)).appendTo(dropdown).bind('click', this.delegate(this, this.selectOption)).html($(option).text());
		
		/* Check selected state */
		if ($(option).attr('selected'))
		{
			this.placeholder.find(':text').val($(option).text());
		}
	},
	replace: function(options)
	{
		/* Set options */
		$.extend(true, this.options,options);
		
		/* Create placeholder */
		this.placeholder().insertAfter(this.element);
	}
}));


/**
* Core.ui.forms
* @version 1.0.0
*/
Core.define('Core.forms', Core.Class.extend(
{
	options: 
	{
		themes:[
		{
			name: 'minimal',
			classes:
			{	
				arrow:	  	'ui-form-select-arrow',
				select:	  	'ui-form-select',
				selectOver: 'ui-form-select-over',
				selected: 	'ui-form-select-option-selected',
				dropdown: 	'ui-form-select-dropdown'
			},
			effect: 'slide',
			timeout: 300
		},
		{
			name: 'my'
		}
		],
		theme:  'minimal',
		speed:  300
	},
	getTheme: function()
	{
		return $.grep(this.options.themes, this.delegate(this, this.activeTheme))[0];
	},
	activeTheme: function(theme)
	{
		return theme.name.indexOf(this.options.theme) == -1 ? false : true;
	},
	applyTheme: function()
	{
		$('select').each(this.delegate(this, this.replace));
	},
	replace: function(index, item)
	{
		var element = item.tagName.toLowerCase();
		
		/* Replace element */
		return (new Core.element[element]($(item))).replace(
		{
			theme: this.getTheme()
		});
	}
}));