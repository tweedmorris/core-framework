/**
* Core Framework
* http://code.google.com/p/core-framework/
* 
* @version 1.0.0
* @copyright Creozon
* @author Angel Kostadinov
*/
(function() 
{
	/**
	* Core (Singleton Pattern)
	*
	* @version 1.0
	* @copyright Creozon
	*/
	this.Core = {}; 
	
	/* Base class */
	Core.Class = function(){};
	
  	 /**
     * Copies all the properties of config to the specified object.
     */
	Core.apply = function(object, config, defaults) 
	{
        if (defaults) {
            Core.apply(object, defaults);
        }

        if (object && config && typeof config === 'object') 
        {
            for (var i in config) 
            {
                object[i] = config[i];
            }
        }
        
        return object;
    };
    
    /**
    * Delegate
    *
    * Delegates method execution to specified scope(target)
    * @version 1.0
    * @copyright Creozon
    */
    Core.delegate = function(target, method, args)
	{
		return (typeof method === "function") ? function() 
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
	};
	
	Core.pattern = (function()
	{
		return { /* Static patterns */
			isString: function(value)
			{
				return typeof value === 'string';
			},
			isArray: function(value) 
		 	{
		       	return value.constructor == Array;
		    },
		    isFilemap: function(value)
		    {
		    	if (this.isObject(value) && !this.isString(value))
		    	{	
		    		for (var key in value)
		    		{
		    			/* Return false immediatly if key is not string */
		    			if (!this.isString(key)) return false;

		    			/* Return false immediatly if value is not array */
		    			if (!this.isArray(value[key])) return false;
		    		}
		    	}
		    	else 
		    	{
		    		return false;
		    	}
		    	
		    	return true;
		    },
		    isNumber: function(value)
		    {
		    	return Object.prototype.toString.call(value) === '[object Number]';
		    },
		    isObject: function(value)
		    {
		    	return Object.prototype.toString.call(value) === '[object Object]';
		    },
		    isClass: function(value)
		    {
		    	return (typeof(value) == "function" && typeof(value.prototype) == "object") ? true : false; 
		    },
		    isFunction: function(value) 
			{
				return Object.toString.apply(value) === '[object Function]';
			},
			isBoolean: function(value) 
			{
				return Object.toString.apply(value) === '[object Boolean]';
			},
			isURI: function(value)
			{
				var regex =  new RegExp('(ftp|http|https)','ig');
				
				return value.match(regex) ? true : false;
			}
		}
	})();
    
    Core.mixin = (function()
    {
    	var options = /* Private options */
    	{
    		defer:	  [],
    		override: true
    	};
    	
    	/**
    	* Mixin Class 
    	* @version 1.0
    	* @copyright Core Framework 
    	*/
    	var Mixin = (function() /* Mixin Class */
    	{
    		return { 
    			proto: null,
    			mixins: null,
    			augment: function(args)
    			{
					this.proto   	 = args.shift(),
					this.mixins    	 = args.shift(),
					options.defer    = args.shift() || [],
					options.override = args.shift() || false;
					
					/* TODO: Determine whether to override or compose */
					this.override();
					
					return this.proto;
    			},
    			compose: function(){},
    			override: function()
    			{
    				for (var mixin in this.mixins)
    				{
						/* Allow both classes and objects to be used as mixin(s) */
						proto = this.mixins[mixin].prototype || this.mixins[mixin];
					
    					Core.apply(this.proto.prototype, proto);
    				
    					/* Store mixin prototype */	
    					this.proto.prototype.mixinPrototypes[mixin] = proto;
    				}
    			}
    		}
    	})();

    	return function()
    	{
    		var args = Array.prototype.slice.call(arguments);
    		
    		/* Unshift scope */
    		args.unshift(this);

    		return Mixin.augment(args);
    	}
    })();
    
	Core.Class.prototype = /* Auto-Inherited method(s) */
    {
    	mixinPrototypes:[],
    	delegate: Core.delegate,
		getMixin: function(name) 
		{
			return this.getMixins()[name];
		},
		getMixins: function() 
		{
			return this.mixinPrototypes || {};
		}
    };
 
    Core.apply(Core.Class,
    {
		extend: function(object)
		{
			Core.constructing = true;
			
			var proto = new this(), superclass = this.prototype;

			delete Core.constructing;

			/* Extend object prototypes */
			Core.apply(proto, object);
			
			// The dummy class constructor
			var Class = proto.constructor = function() 
			{
				// All construction is actually done in the init method
				if (!Core.constructing && this.init)
				{
					/* Apply constructor */
					this.init.apply(this, arguments);
				}
			};

			/* Associate superclass */
			proto.superclass = superclass;

			Core.apply(Class, 
			{
				prototype:   proto,
				constructor: Class,
				ancestor:    this,
				extend: 	 this.extend,
				mixin: 		 this.mixin
			});
			
			if (object.mixins)
			{
				this.mixin(object.mixins);
			}
			
			return Class;
		},
		mixin: Core.mixin
    });
    
    Core.apply(Core, 
    {
    	Array: (function()
    	{
    		var extendedPrototype = 
    		{
    			clear: function()
				{
					this.length = 0;
					
					return this;
				},
				map: function(mapper, context)
				{
					var result = new Array(this.length);
					
					for (var i = 0, n = this.length; i<n; i++)
					
					if (i in this) result[i] = mapper.call(context, this[i], i, this);
						
					return result;
				},
				invoke: function(method) 
				{
					var args = Array.prototype.slice.call(arguments, 1);
					
					return this.map(function(element) 
					{
						return element[method].apply(element, args);
					});
				},
				filter: function(fn) 
				{
				    var a = [];
				    
				    for ( var i=0, j=this.length; i < j; ++i ) 
				    {
				        if ( !fn.call(this, this[i], i, this) ) 
				        {
				            continue;
				        }
				        
				        a.push(this[i]);
				    }
				    return a;
				},
				clean: function()
				{
					return this.filter(function(value, index)
					{
						return null === value ? false : value.length;
					});
				},
				contains: function(obj) 
				{
					var i = this.length;
					
					while (i--) 
					{
						if (this[i] === obj) 
						{
							return true;
						}
					}
					return false;
				}

    		};
    		
    		return {
    			get: function(array)
    			{
    				Core.apply(array, extendedPrototype);
    				
    				return array;
    			}
    		}
    	})()
    });
    
    Core.apply(Core, 
    {
    	namespace: (function()
		{
			return Core.apply(Core,
			{
				register: function(namespace, scope, object)
				{
					var namespaces = namespace.split('.');
					
					for (var i = 0; i < namespaces.length; i++)
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
					return (!scope || typeof scope[namespace] === "undefined") ? false : true;
				},
				autoload: function(namespace, callback)
				{
					var scripts = {};
					
					/**
					* Transform string to secure path
					*/
					var toPath = function( string )
					{
						if (Core.pattern.isURI(namespace)) /* Skip manipulation of URI(s) */
						{
							return namespace;
						}
						
						var params = [], regex = new RegExp('((\.\.\/)+)','i');
						
						/* Relative path(s) */
						relative = regex.exec(string);
						
						if (relative && relative.length)
						{
							/* Get the relative part */
							relative = relative.shift();
							
							/* Get string */
							string = string.substring(relative.length);
							
							params.push(relative);
						}
						
						/* Push clear path */
						params.push(Core.Array.get(string.split('.')).invoke('toLowerCase').join('/'));
						
						/* Return safe path */
						return params.join('');
					}

					/* Queue script */
					var queue = function(namespace)
					{
						var script = toPath(namespace);
						
						scripts[script] = [];
					};

					if (Core.pattern.isFilemap(namespace))
					{
						/* Apply map directly */
						scripts = namespace;
					}
					else 
					{			
						if (Core.pattern.isString(namespace))
						{
							queue(namespace);
						}
						else 
						{
							for (var i in namespace)
							{
								queue(namespace[i]);
							}
						}
					}
					

					Core.loader.addScripts(scripts).autoload(callback);
				}
			})
		})(),
		extend: function(object)
		{
			return Core.Class.extend(object);
		},
		override: function(origclass, overrides)
		{
			Core.apply(origclass.prototype, overrides);
		},
		define: function(namespace, object)
		{
			return this.namespace.register(namespace, window, object);
		},
		require: function(namespace, callback)
		{
			this.namespace.autoload(namespace, callback);
		},
		loader: (function()
		{
			// Table of script names and their dependencies.
			var scripts = {}, queue = [], counter = 0, config = 
			{
				path: 	 	null,
				basePath:	null,
				cache: 		true,
				dataType: 	'script',
				type:		'.js',
				method: 	'GET'
			};

			/** @lends core.loader */
			return {
				setConfig: function(options)
				{
					$.extend(config, options);
					
					return this;
				},
				getConfig: function()
				{
					return config;
				},
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
				
					if(script.loaded) 
					{
						return callback.apply(context);
					}
				
					script.callbacks.push(
					{
						fn      : callback,
						context : context
					});

					if(script.callbacks.length == 1) 
					{
						var resource = [];
						
						resource.push(config.path);
						resource.push(config.basePath);
						resource.push(url + (config.type || ''));
						
						$.ajax(
						{
							type     : config.method,
							url      : Core.Array.get(resource).clean().join('/'),
							dataType : config.dataType,
							cache    : config.cache,
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
				clear: function()
				{
					this.queue.clear();
					
					return this;
				},
				queue: function()
				{
					var pushQueue = function(script)
					{
						if (-1 == $.inArray(script,queue) && script.length) /* Queue only script not loaded yet */
						{
							queue.push(script);
						}
					};
					
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
					var path = this.path();

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
				},
				path: (function(file)
				{
					if (!config.path)
					{
						var exists = $('script').filter(function()
						{
							return this.src.indexOf(file) != -1;
						}).eq(0);
						
						/* Core has been found */
						if (exists.size())
						{
							config.path = exists.attr('src').slice(0, -1 - file.length)
						}
					}
					
					return function()
					{
						return config.path;
					}
					
				})('core.js')
			}
		})(),
		 /**
		 * Parallel image preloader 
		 *
		 * @version 1.0
		 * @copyright Core Framework
		 */
		preloader: (function()
		{
			var queue = [], images = [], total = 0, config = 
			{
				cache: 		true,
				parallel: 	true
			};
			
			var time = 
			{
				start: 0,
				end: 0   
			}
			
			return {
				onComplete: function(ui){ /* Override */},
				images: function()
				{
					return images;
				},
				reset: function()
				{
					queue 	= [];
					images 	= [];
					total 	= 0;
					
					return this;
				},
				queue: function(element)
				{
					if (Core.pattern.isString(element))
					{
						queue.push(element)
					}
					else 
					{
						$.each(element, function(index, element)
						{
							queue.push(element);
						})
					}
					
					return this;
				},
				finish: function(event, index, image)
				{
					/* Decrease number of finished items */
					total--;
					
					images[index].size = 
					{
						width: 	image.width,
						height: image.height
					}
					
					/* Check if no more items to preload */
					if (0 == total)
					{
						time.end = new Date().getTime();
						
						this.onComplete.apply(this,[
						{
							time: ((time.end - time.start)/1000).toPrecision(2)
						}])
					}
				},
				preload: function(callback)
				{
					/* Set callback function */
					this.onComplete = callback || this.onComplete;
					
					time.start = new Date().getTime();
					
					/* Get queue length */
					total = i = queue.length;
					
					while(i--)
					{
						var image = new Image();
					
						image.onload  = Core.delegate(this, this.finish, [i,image]);
						image.onerror = Core.delegate(this, this.finish, [i,image]);
						image.onabort = Core.delegate(this, this.finish,[i,image]);
						
						/* Set image source */
						image.src = config.cache ? queue.shift() : (queue.shift() + '?u=' + (new Date().getTime()))
						
						/* Push image */
						images.push(
						{
							index: i,
							image: image,
							size: 
							{
								width:	0,
								height: 0
							}
						});
					}
				},
				preloadCssImages: function(callback)
				{
					var images = this.getCssImages();
					
					this.queue(images).preload(callback);
				},
				getCssRules: function()
				{
					var collection = [], data = {}
					
					/* Private colect method */
					var Collect = 
					{
						rules: function(rules)
						{
							var rule = rules.length;
						
							while(rule--)
							{
								data = 
								{
									rule: 		   rules[rule],
									selectorText: !rules[rule].selectorText ? null : rules[rule].selectorText,
									declaration:  (rules[rule].cssText) ? rules[rule].cssText : rules[rule].style.cssText
								}
						
								collection.push(data);
							}
						}
					}
					
					/* Loop stylesheets */
					var i = document.styleSheets.length;
					
					while(i--)
					{
						var sheet = 
						{
							rules: 	 document.styleSheets[i].rules || document.styleSheets[i].cssRules,
							imports: document.styleSheets[i].imports || []
						}
						
						/* Collect rules */
						Collect.rules(sheet.rules);
						
						/* Collecte imported rules */
						for (x = 0; x < sheet.imports; x++)
						{
							Collect.rules(document.styleSheets[x].imports[x].rules || document.styleSheets[i].imports[x].cssRules);
						}
					}
					
					return collection;
				},
				getCssImages: function()
				{
					var rules = this.getCssRules(), i = rules.length, images = [], regex = new RegExp('[^\(|\'\"]+\.(gif|jpg|jpeg|png)','ig');
					
					while(i--)
					{
						var img = rules[i].declaration.match(regex);
						
						if (img.length)
						{
							images.push(img);
						}
					}
					return images;
				}
			}
		})()
    });

    Core.validator = (function() /* TODO: Complete Validators */
	{
		/* Private var(s) */
		var data = 
		{
			form: null,
			map:
			{
				/* Override */
			}
		}, condition = Core.Array.get(
			[
				'required', 
				'message',
				'element',
				'error'
			]);
		
		return { /* Static patterns */
			tooltip: function()
			{
				var Tip = Core.extend(
				{
					tooltip: null,
					create: function()
					{
						this.tooltip = $('<div/>').addClass('coretip');
						
						return this;
					},
					empty: function()
					{
						this.tooltip.empty();
					},
					content: function(content)
					{
						this.tooltip.html(content);
						
						return this;
					},
					open: function(target)
					{
						var offset = target.offset();
						
						this.tooltip.css(
						{
							top: 	offset.top - 30,
							left: 	offset.left + target.width() - 15,
							opacity:0.95
						}).appendTo('body').fadeIn(200);
					},
					close: function()
					{
						this.tooltip.remove()
					}
				})
				
				return new Tip().create();
			},
			displayErrors: function()
			{
				var error = false;
				
				$.each(data.map, function(name, options)
				{
					/* Create error tooltip */	
					if (options.error)
					{	
						error = true; 
						
						options.element.addClass('invalid');

						/* Open tooltip */
						options.tooltip.content(options.message).open(options.element);
					}
					else 
					{
						options.element.removeClass('invalid');
						
						/* Close previously opened tooltip(s) */
						options.tooltip.close();
					}
				});
				
				if (error)
				{
					/* Disable submit buttons */
					data.form.find(':submit').parent().click(false).fadeTo(200,.5);
				}
				else 
				{
					/* Disable submit buttons */
					data.form.find(':submit').parent().unbind('click').fadeTo(200,1);
				}
			},
			map: function(form, map)
			{
				/* Store form */
				data.form = $(form)
					
				/* Mapping */
				$.each(map, function(element, options)
				{
					data.map[element] = $.extend(
					{
						error: 	 false,
						message: null,
						tooltip: Core.validator.tooltip()
					},options)
				})
				
				return this;
			},
			auto: function()
			{
				data.form.find(':input').unbind("blur").bind(
				{
					blur: Core.delegate(this, this.valid)
				});
				
				return this;
			},
			valid: function()
			{
				/* Smart validation */
				$.each(data.map, Core.delegate(this, this.filter));
				
				/* Display errors */
				this.displayErrors();
			},
			filter: function(name, options)
			{
				var element = $(':input[name=' + name + ']');
				
				if (options.required)
				{
					$.each(options, Core.delegate(this, this.check,[name, element]))
				}
			},
			check: function(fn, bool, name, element)
			{
				var error = false;

				if (!condition.contains(fn))
				{
					if (bool !== this[fn].apply(this, [element.val(), element]))
					{
						/* Rise error */
						error = true;
					}
					
					$.extend(true, data.map[name], 
					{
						error: 		error,
						element: 	element
					})
				}	
			},
			empty: function(value) /* Check whether value is empty string */
			{
				return null === value ? false : (value.length == 0 ? true : false);
			},
			email: function(value) /* Check whether the value is valid email */
			{
				var regex = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
				
				return regex.test(value);
			},
			alnum: function(value) /* Check whether value contains alphabetic or numeric characters only */ 
			{
				return true;
			},
			digit: function(value) /* Check whether value contains numeric characters only */ 
			{
				return Core.pattern.isNumber(value);
			},
			alpha: function(value) /* Check whether value contains alphabetic characters only */ 
			{
				return false;
			},
			lower: function(value) /* Check whether value contains only lower characters */ 
			{
				return (value == value.toLowerCase()); 
			},
			upper: function(value) /* Check whether value contains only upper characters */ 
			{
				return (value == value.toUpperCase()); 
			},
			extend: function(proto)
			{
				Core.apply(this, proto);
			},
			password: function(value)
			{
				return true;
			},
			checked: function(value, element)
			{
				return element.is(':checked') ? true : false
			}
		}
	})();
	
	/**
	* jQuery Adapter(s) 
	* 
	* The following methods can be used for creation of jQuery plugins & widgets
	* @version 1.0.0
	*/
	Core.jQuery = (function()
	{	
		return {
			plugin: function(name, proto) 
			{
				$.fn[name] = function(options) 
				{
					var args = Array.prototype.slice.call(arguments, 1);
					
					return this.each(function() 
					{
						var instance = $.data(this, name);
						
						
						
						if (instance) 
						{
							instance[options].apply(instance, args);
						} 
						else 
						{
							instance = $.data(this, name, new proto(options, this));
						}
					});
				};
			},
			widget: function(name, proto)
			{
				return $.widget(name, proto.prototype);
			}
		}
	})()
	
	
	/* Core UI */
	Core.widget =
	{
		tree: /* Sortable tree */
		{
			options: 
			{
				items: 'li',
				draggable: 
				{
					handle: 			' > div',
			        addClasses: 		false,
			        helper: 			'clone',
			        zIndex: 			100,
			        opacity: 			.8,
			        refreshPositions: 	true
				},
				droppable: 
				{
					accept: 			'li',
			        tolerance: 			'pointer',
			        refreshPositions: 	true
				}
			},
			init: function(index, item)
			{
				/* Append placeholder(s) */
				var placeholder = $('<div/>').addClass('placeholder'), item = $(item);
				
				placeholder.prependTo(item).animate(
				{
					height:5
				}, 300);
				
				/* Check wether item has OL children */
				this.refresh();
			},
			drop: function(event, ui)
			{
				var li = $(event.target).parent();
				
				var child = !$(event.target).hasClass('placeholder');
				
				if (child && li.children('ol').length == 0) 
				{
					li.append('<ol/>');
				}
				
				if (child) 
				{
					li.addClass('ui-state-expanded').removeClass('ui-state-collapsed').children('ol').append(ui.draggable).show(200);
				}
				else 
				{
					li.before(ui.draggable);
				}
				
				$('ol.sortable li.ui-state-expanded').not(':has(li:not(.ui-draggable-dragging))').removeClass('ui-state-expanded');
				
				li.find('.placeholder').removeClass('placeholder-active').find('>div').removeClass('ui-droppable-active');
				
				
				this.clear(this.element);
				
				this.refresh();
				
				/* Commit changes to history stack */
				this.history.commit();
			},
			over: function(event, ui)
			{
				$(event.target).filter('div:not(.placeholder)').addClass('ui-droppable-active').parent().children('ol').show(200).each(function()
				{
					$(this).parent().addClass('ui-parent-expanded');
				});
				
		        $(event.target).filter('.placeholder').addClass('placeholder-active');
			},
			out: function(event, ui)
			{
				$(event.target).filter('div').removeClass('ui-droppable-active');
		        $(event.target).filter('.placeholder').removeClass('placeholder-active');
			},
			refresh: function()
			{
				this.element.find('ol:hidden').each(function()
				{
					$(this).parent().addClass('ui-parent-collapsed');
				});
				
				this.element.find('ol:visible').each(function()
				{
					$(this).parent().addClass('ui-parent-collapsed ui-parent-expanded');
				});
				
				return this;
			},
			clear: function(element) /* Clear empty UL/LI*/
			{
				element.find('ol').filter(function()
				{
					return $(this).children().size() == 0;
				}).remove();
				
				this.serialize.serialize(this.element);
			},
			log: function(event, ui)
			{
				var item = $(event.target);
				
				$(ui.helper).addClass("ui-draggable-helper");
		
				/* Save state*/
				this.history.saveState(item);
			},
			undo: function(event)
			{
				 if (event.ctrlKey && (event.which == 122 || event.which == 26)) 
				 {
				 	this.history.restoreState();
				 	
					this.refresh();
				 }
			},
			toggle: function(event)
			{
				$(event.target).parents('li:first').toggleClass('ui-parent-expanded').children("ol").toggle(200);
				
				return false;
			},
			_create: function()
			{
				/* Extend draggable options */
				this.options.draggable = $.extend({}, this.options.draggable,
				{
					start: Core.delegate(this, this.log),
					delay: 200
				});
				
				
				/* Extend droppable options */
				this.options.droppable = $.extend({}, this.options.droppable, 
				{
			        drop: 				Core.delegate(this, this.drop),
			        over: 				Core.delegate(this, this.over),
			        out: 				Core.delegate(this, this.out)
				})
				
				/* Init */
				this.element.find(this.options.items)
						    .each(Core.delegate(this, this.init))
						    .bind("click",Core.delegate(this,this.toggle))
						    .draggable(this.options.draggable)
						    .end()
						    .find('div, .placeholder')
						    .droppable(this.options.droppable)
						    .disableSelection();
						    
			    $(document).bind('keypress', Core.delegate(this, this.undo));
			    
			    this.serialize.serialize(this.element);
			},
			history: (function()
			{
				return {
					stack: new Array(),
				    temp: null,
				    saveState: function(item) 
				    {
				        this.temp = 
				        { 
				        	item: 		item, 
				        	itemParent: item.parent(), 
				        	itemAfter: 	item.prev() 
				        };
				    },
				    commit: function() 
				    {
				        if (this.temp != null) 
				        {
				        	this.stack.push(this.temp);
				        }
				    },
				    restoreState: function() 
				    {
				        var h = this.stack.pop();
				        
				        if (h == null) return;
				        
				        if (h.itemAfter.length > 0) 
				        {
				            h.itemAfter.after(h.item);
				        }
				        else 
				        {
				            h.itemParent.prepend(h.item);
				        }
				    }
				}
			})(),
			serialize: (function()
			{
				return {
					level:		1,
					sequence:	1,
					items:		[],
					serialize: function(tree)
					{
						this.level   = 1;
						this.sequence = 2;
						
						/* Process tree */
						tree.children().each(Core.delegate(this,this.boundaries,[this.level]));
					},
					boundaries: function(index, element, level )
					{
						var item = 
						{
							element: 	$(element),
							level: 		level++,
							left: 		this.sequence++,
							right: 		null,
							parent:     $(element).parents('li:first[id]').attr('id')
						}
						
						item.element.children('ol').children(':not(.ui-draggable-helper)').each(Core.delegate(this,this.boundaries,[level]));
						
						item.right = this.sequence++;
						
						this.items.push(item);
					}
				}
			})()
		}	
	}
	/* EOF Core */
})(jQuery, window);