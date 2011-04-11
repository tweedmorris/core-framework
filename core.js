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
* Core.ui
* @version 1.0.0
*/
Core.define('Core.ui', Core.data.extend(
{
}));

/**
* Core.ui.forms
* @version 1.0.0
*/
Core.define('Core.ui.element', Core.data.extend(
{
	element: null,
	init: function(element, config)
	{
		this.element = $(element);
		
		/* Apply additional configuration directives */
		Core.apply(this, config);
	},
	replace: function(){ /* Override */ } /* Abstract method */
}))

/** 
* Core.ui.element.select
*/
Core.define('Core.ui.element.select', Core.ui.element.extend(
{
	bindOption: function(index, option, data)
	{
		var o = 
		{
			text:  $(option).text(), 
			value: $(option).val()
		}
		
		var row = $('<div/>').css(
		{
			cursor: 'pointer'
		}).html(o.text);
		
		if ($(option).attr('selected'))
		{
			/* Select the default value */
			data.container.text(o.text);
		}
		
		/* Bind option click */
		row.bind('click', this.delegate(this, this.selectOption,[$(option), data,  o.text, o.value])).appendTo(data.dropdown);
	},
	selectOption: function(event, option, data, text, value)
	{
		/* Show the selected option */
		data.container.text(text);
		
		/* Refresh real select element */
		$('option', this.element).each(function()
		{
			if ($(this).attr('value') == value)
			{
				$(this).attr('selected', true);
				
				/* Trigger onChange */
				data.element.trigger('onchange');
			}
			else 
			{
				$(this).attr('selected', false);
			}
		});
	},
	replace: function()
	{
		var data =
		{
			element: 	this.element,
			container:  $('<div/>').bind('click',this.delegate(this, this.open)),
			dropdown: 	$('<div/>').css(
			{
				position:'absolute',
				top:	 20,
				left:	 0
			})
		}

		/* Collect options */
		$('option',this.element).each(this.delegate(this, this.bindOption,[data]));
		
		/* Wrapper */
		var wrapper = $('<div/>').css(
		{
			position: 'relative'
		});
		
		wrapper.append(data.container).append(data.dropdown);
		
		/* Replace select */
		this.element.replaceWith(wrapper);
	},
	test: function()
	{
		alert(1);
	}
}));


/**
* Core.ui.forms
* @version 1.0.0
*/
Core.define('Core.ui.forms', Core.ui.extend(
{
	options: 
	{
		themes:[
		{
			name: 'minimal',
			classes:
			{
				select:	  'ui-form-select',
				selected: 'ui-form-select-option-selected',
				dropdown: 'ui-form-select-dropdown'
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
		return (new Core.ui.element[element](item)).replace()
	}
}));