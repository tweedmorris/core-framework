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
Core.define('Core.ui.forms', Core.ui.extend(
{
	options: 
	{
		themes:[
		{
			minimal:
			{
				classes:
				{
					select:	  'ui-form-select',
					selected: 'ui-form-select-option-selected',
					dropdown: 'ui-form-select-dropdown'
				},
				effect: 'slide',
				timeout: 300
			}
		}],
		theme:  'minimal',
		speed:  300
	},
	getTheme: function()
	{
		return $.grep(this.themes, this.delegate(this, this.activeTheme));
	},
	activeTheme: function(theme)
	{
		return theme.indexOf(this.options.theme) == -1 ? false : true;
	},
	applyTheme: function()
	{
		/* Replace select input(s) */
		$('select').each(this.delegate(this, this.replaceSelect));
	},
	listeners: 
	{
		select: function(event)
		{
			event.stopPropagation();
			
			/* Hide active drops */
			$('.ui-form-select-dropdown').slideUp(Functions.timeout.slide);

			$(this).next().slideToggle(Functions.timeout.slide);
			
			$(document.body).bind('click', function(event)
			{
				$('.ui-form-select-dropdown').slideUp(Functions.timeout.slide);
				
				$(this).unbind('click');
			});
		}
		
	},
	replaceSelect: function(index, item)
	{
		var Replace = /* Bundle of select and corresponding dropdown */
		{
			select:   $('<div/>').addClass(this.options.defaultClass.select).bind('click',this.delegate(this, this.listeners.select)),
			dropdown: $('<div/>').addClass(this.options.defaultClass.dropdown)
		}

		/* Collect options */
		$('option',item).each(this.delegate(this, this.bindOption,[Replace.dropdown]));
	},
	bindOption: function(index, option, dropdown)
	{
		var option = 
		[
			$(option).text(), 
			$(option).attr('value')
		];
		
		var row = $('<div/>').html($(this).text());
		
		if ($(this).attr(this.options.defaultClass.selected))
		{
			row.addClass(this.options.defaultClass.selected);
			
			/* Select the default value */
			bundle.select.text(option[0]);
		}
		
		row.bind('click', this.delegate(this, this.selectOption,[this]));
		
		dropdown.append(row);
	},
	selectOption: function(option, select, element, text, value)
	{
		/* Deselect siblings and select the element */
		$(option).siblings().removeClass(this.options.defaultClass.selected).end().addClass(this.options.defaultClass.selected);
		
		/* Hide dropdown */
		$(option).parents().filter('.ui-form-select-dropdown').slideUp(Functions.timeout.slide);
	
		/* Show the selected option */
		$(element).text(text);
		
		$('option', $(select)).each(function()
		{
			if ($(this).attr('value') == value)
			{
				$(this).attr('selected', true);
			}
			else $(this).attr('selected', false);
		});
	};
}));