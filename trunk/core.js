/**
* Core Framework
* 
* @version 1.0.0
* @copyright Creozon
* @author Angel Kostadinov
*/


(function() {
	
	this.Core = function() {}
	
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


	Core.apply = function(object, config)
	{
		return $.extend(object, config);
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
* Core.data.FileUpload - Ajax File Upload
* @version 1.0.0
*/
Core.define('Core.data.FileUpload', Core.data.extend(
{
	form: 		null,
	iframe: 	null,
	listeners: 
	{
		before: function(event, response){},
		success: function(event, response){}
	},
	options:
	{
		id: "myAjaxUpload"
	},
	complete:function(event, response) /* Upload complete */
	{
		this.getForm().removeAttr('target');
		
		var json = $.parseJSON(response.text());
		
		this.listeners.success.apply(this, [event, json]);
	},
	loaded: function(id)
	{
		if (this.iframe.contents().attr("location") == "about:blank")
		{
			return;
		}
		
		/* Loaded callback */
		this.iframe.trigger("complete",[this.iframe.contents()]);
		
		return false;
	},
	upload: function()
	{	
		/* Call before listener  */
		this.listeners.before.apply(this, [{}]);
		
		return this.getForm().attr("target",this.options.id).trigger("submit");
	},
	submit: function()
	{
		return true;
	},
	getFileInput: function()
	{
		var uniqueId = (new Date().getTime());

		return $('<input/>',
		{
			id: 	uniqueId,
			name: 	"file"
		}).attr(
		{
			type: "file"
		}).bind('change', this.delegate(this, this.upload));
	},
	getForm: function()
	{
		if (!this.form)
		{
			this.form = $(this.renderTo).parents('form:first');
		}
		return this.form;
	},
	render: function()
	{
		/* Create hidden IFrame */
		this.iframe = $('<iframe />',
		{
			id: 	this.options.id,
			name:	this.options.id,
			scr: 	"about:blank"
		}).hide().load(this.delegate(this,this.loaded)).bind("complete",this.delegate(this,this.complete)).appendTo(document.body);

		/* Internet Explorer 6 and 7 fix */
		if ($.browser.msie) 
		{
			document.frames[this.options.id].name = this.options.id;
		}
		
		this.getFileInput().appendTo(this.renderTo);
	},
	renderTo: null
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
		this.options = $.extend(true,{}, this.options, options);
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
}));

/** 
* Core.ui.element.input
*/
Core.define('Core.element.input', Core.element.extend(
{
	replace: function(options)
	{
		/* Replace element */
		return (new Core.element[this.element.attr('type').toLowerCase()](this.element)).replace(
		{
			theme: options.theme
		});
	}
}));

/** 
* Core.ui.element.select
*/
Core.define('Core.element.checkbox', Core.element.extend(
{
	options: 
	{
		theme: {},
		placeholder: null
	},
	listeners:
	{
		click: function(event, ui){}
	},
	click: function()
	{
		if (this.element.attr('checked'))
		{
			this.placeholder.find('a').removeClass('checked');
			
			/* Uncheck hidden element */
			this.element.attr('checked', false)
		}
		else 
		{
			this.placeholder.find('a').addClass('checked'); 
			
			/* Uncheck hidden element */
			this.element.attr('checked', true);
		}
		
		return false;
	},
	placeholder: function()
	{
		if (!this.options.placeholder)
		{
			this.options.placeholder = 
			{
				element: function( select )
				{
					var placeholder =  $('<div/>').addClass('ui-form-checkbox')
									  .addClass(this.options.theme.classes.checkbox)
									  .bind(
									  {
									  		click: this.delegate(this, this.click)
									  });
					
					var C = $('<a/>').appendTo(placeholder);
					
					if (this.element.attr('checked'))
					{
						C.addClass('checked');
					}
					
					return placeholder;
				},
				update: function( placeholder )
				{
					var label = $('label[for=' + this.element.attr('id') + ']');
					
					/* Hide label & element */
					this.element.add(label).hide();
					
					this.placeholder.append(label.text());
					
					
				}
			}
		}
		
		this.placeholder = this.options.placeholder.element.apply(this,[this.element]);
		
		/* Update placeholder */
		this.options.placeholder.update.apply(this,[this.placeholder]);
		
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
	replace: function(options)
	{
		/* Set options */
		this.options = $.extend(true,{},this.options,options);

		/* Create placeholder */
		this.placeholder().insertAfter(this.element);
	}
}));

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
		$.extend(
		{
			position:	'absolute',
			top: 		this.placeholder.offset().top + this.placeholder.height(),
			left: 		this.placeholder.offset().left,
			width: 		this.placeholder.outerWidth() - 4
		}, this.options.theme.css)).appendTo(document.body);
		
		if ($('option',this.element).length > this.options.theme.options.limit)
		{
			dropdown.css(
			{
				height: this.options.theme.options.maxHeight,
				overflow: 'auto'
			});
		}
		
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
		
		if (!abort && !$(event.target).is('.ui-form-select-dropdown'))
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
				element: function( select )
				{
					var placeholder =  $('<div/>').addClass('ui-form-select')
									  .addClass(this.options.theme.classes.select)
									  .bind(
									  {
									  		mouseenter: this.delegate(this, this.mouse.over),
									  		mouseleave: this.delegate(this, this.mouse.out),
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
				    }).appendTo(wrapper).val();
				    
				    /* Simulate dropdown arrow */
				    var arrow = $('<span/>').addClass('ui-form-select-arrow').appendTo(placeholder);
				    
					return placeholder;
				},
				update: function( placeholder )
				{
					placeholder.find(':text').val(this.element.find('option:selected').text());
				}
			}
		}
		
		this.placeholder = this.options.placeholder.element.apply(this,[this.element]);
		
		/* Update placeholder */
		this.options.placeholder.update.apply(this,[this.placeholder]);
		
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
			this.placeholder.addClass(this.options.theme.classes.selectOver);
		},
		out: function(event)
		{
			this.placeholder.removeClass(this.options.theme.classes.selectOver);
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
			
			row.addClass('ui-form-select-option-selected');
		}
	},
	replace: function(options)
	{
		/* Set options */
		this.options = $.extend(true,{},this.options,options);

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
		applyTo: null,
		theme:
		{
			options: 
			{
				limit: 		20,
				maxHeight: 	320,
			},
			classes:
			{	
				arrow:	  	'ui-form-select-arrow',
				select:	  	'ui-form-select',
				selectOver: 'ui-form-select-over',
				selected: 	'ui-form-select-option-selected',
				dropdown: 	'ui-form-select-dropdown'
			},
			effect: 		'slide',
			timeout: 		300
		},
		speed:  			300
	},
	applyTheme: function()
	{
		if (this.options.applyTo)
		{
			var applyTo = $(this.options.applyTo);

			$('select',applyTo).add(':checkbox',applyTo).each(this.delegate(this, this.replace));
		}
	},
	replace: function(index, item)
	{	
		var element = item.tagName.toLowerCase();
		/* Replace element */
		return (new Core.element[element]($(item))).replace(
		{
			theme: this.options.theme
		});
	},
	init: function(options)
	{
		this.options = $.extend(true, {}, this.options, options);
	}
}));