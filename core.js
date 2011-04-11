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

Core.define('Core.ui.forms', Core.ui.extend(
{
	
}));