/**
* Core.draw
* 
* VML/SVG Draw implementation
* @version 1.0
*/
Core.draw = (function()
{
	/**
	* Shape Class
	*/
	var Shape = Core.extend(
	{
		id: 		null,
		element: 	null,
		fill: 		null,
		stopped:  	false,
		timeout: 	null,
		options:
		{
			top:		0,
			left: 		0,
			width:  	0,
			height:	 	0,
			opacity: 	0,
			endOpacity: 1,
			radius: 	0,
			speed: 		0.05,
			color: 		'#ffffff',
			angle: 		0,
			scale: 		1
		},
		init: function(id, options)
		{
			/* Set shape id */
			this.id = id;
			
			/* Extend shape options */
			$.extend(this.options, options);
			
			/* Calculate radius */
			this.options.width = this.options.height = options.radius;
		},
		config: function(element, styles, attributes)
		{
			styles 	   = styles || {};
			attributes = attributes || {};
			
			/* Config element */
			$(element).css(styles);
			
			/* Set attributes */
			$.each(attributes,  function(attribute, value)
			{
				element.setAttribute(attribute, value);
			})
		},
		output: function()
		{
			if ($.browser.msie) /* Use VML */
			{
				/* Create element */
				this.element = document.createElement('v:oval');
				
				this.config(this.element, 
				{
					left:		this.options.left,
					top:		this.options.top,
					width:		this.options.size,
					height:		this.options.size
				}, {
					stroked: false
				});
				
				/* Create fill */
				this.fill = document.createElement('v:fill');
		
				this.config(this.fill, null, 
				{
					type:		'solid',
					color: 		this.options.color,
					opacity: 	this.options.opacity
				})
				/* Full type */
				
				/* Append fill */
				this.element.appendChild(this.fill);
				
				return this.element;
			}
			else /* Use canvas */ 
			{
				this.element = document.createElementNS("http://www.w3.org/2000/svg", "circle");
				
				this.config(this.element, null, 
				{
					cx: 		this.options.left,
					cy: 		this.options.top,
					r: 			this.options.size/2,
					opacity: 	this.options.opacity,
					fill: 		this.options.color,
					transform:  "translate(" + (this.options.size/2) + " " +  (this.options.size/2) + ")"
				});
				
			
				return this.element;
			}
		},
		animate: function(timeout)
		{
			this.timeout = this.timeout || timeout;
			
			setTimeout(this.delegate(this, $.browser.msie ? this.fade : this.fadeSVG), this.timeout);
		},
		fade: function()
		{
			if (this.fill.opacity >= this.options.speed)
			{
				this.fill.opacity -= this.options.speed;
			}
			else 
			{
				if (!this.stopped)
				{
					this.fill.opacity = this.options.endOpacity;
				}
				else 
				{
					this.fill.opacity = 0;
					
					return;
				}
			}
			
			setTimeout(this.delegate(this, this.fade), 10);
		},
		fadeSVG: function()
		{
			var opacity = this.element.getAttribute("opacity");
			
			if (opacity >= this.options.speed)
			{
				this.element.setAttribute("opacity", opacity - this.options.speed);
			}
			else 
			{
				if (!this.stopped)
				{
					this.element.setAttribute("opacity",this.options.endOpacity);
				}
				else
				{
					 this.element.setAttribute("opacity",0);
					
					 return;
				}
			}
			
			setTimeout(this.delegate(this, this.fadeSVG), 10);
			
		},
		stop: function()
		{
			this.stopped = true;
			
			return this;
		},
		hide: function()
		{
			return this;	
		},
		cast: function(arg) /* Cast array parameters to integer */
		{
			for ( var i=0, j = arg.length; i < j; ++i ) 
		    {
		        arg[i] = Math.round(arg[i]);
		    }
		    
		    return arg;
		}
	});
	
	var Path = Shape.extend(
	{
		output: function()
		{
			var path = null, points = [], coords = [];
			
			points.push([0,0]);
			points.push([20,20]);
			points.push([20,40]);
			points.push([0,20]);
			
			for (var i in points)
			{
				coords.push([points[i][0], points[i][1]].join(" "));
			}
			
			
			
			/* Twitter Path */
			if ($.browser.msie) /* Use VML */
			{
				/* Create element */
				this.element = document.createElement('v:shape');

				this.config(this.element, 
				{
					top: 		this.options.top, 
					left: 		this.options.left,
					width:		this.options.scale, 
					height: 	this.options.scale,
					rotation: 	this.options.angle
				}, {
					coordorigin: "0 0",
					coordsize: "10 10",
					path: Core.SVG.path(this.options.path),
					stroked: false
				});
				
				/* Create fill */
				this.fill = document.createElement('v:fill');
		
				this.config(this.fill, null, 
				{
					type:		'solid',
					color: 		this.options.color,
					opacity: 	this.options.opacity
				})

				/* Append fill */
				this.element.appendChild(this.fill);

				return this.element;
			}
			else /* Use canvas */ 
			{
				this.element = document.createElementNS("http://www.w3.org/2000/svg", "path");
				
				this.config(this.element, null, 
				{	
					d: 			this.options.path,
					opacity: 	this.options.opacity,
					fill: 		this.options.color,
					transform:  "scale(" + this.options.scale + "  " + this.options.scale + ") translate(" + (this.options.left) + "," + (this.options.top) + ") rotate(" + this.options.angle + " 0 0)"
				});
				 	
				return this.element;
			}
		},
		update: function(options)
		{
			this.config(this.element, null,
			{
				d: options.path
			})
		}
	});
	
	
	var AnimatedLoader = Core.extend(
	{
		options: 	null,
		shapes:		[],
		init: function(options)
		{
			this.shapes = [];
			
			/* Default options */
			this.options = $.extend(
			{
				offset: 
				{
					top:0,
					left:0
				},
				size: 		8,
				radius: 	15,
				opacity:	1,
				points: 	8,
				speed: 		2,
				scale: 		1,
				angle: 		0,
				clockwise:  true,
				shape: 		'circle',
				scale: 		1,
				color: 		'#000000'
			},options);

			return this;
		},
		create: function(canvas)
		{
			/* Calculate points */
			var points = this.points(this.options.offset.left,this.options.offset.top,this.options.radius,this.options.radius,this.options.angle,this.options.points);
			
			var x = this.options.opacity/this.options.points, opacity = 0;
			
			for (var point in points)
			{
				var pointOptions = 
				{
					top: 	 	points[point].y,
					left: 	 	points[point].x,
					angle: 		points[point].angle,
					radius:  	this.options.radius,
					opacity: 	(opacity += x),
					endOpacity: this.options.opacity,
					speed:   	this.options.speed/100,
					color: 	 	this.options.color,
					size: 	 	this.options.size,
					scale: 	 	this.options.scale,
					path: 	 	this.options.path
				}
				
				switch(this.options.shape.toLowerCase())
				{
					case 'path': /* Use polyline */
						var shape = new Path(point, pointOptions);
						break;
					default: /* Default top circle */
						var shape = new Shape(point, pointOptions);
				}
				
				canvas.append(shape.output());
				
				/* Queue shape */
				this.shapes.push(shape);
			}

			this.play((1/(this.options.speed/100))/this.options.points);
			
			return this;
		},
		points: function(x, y, a, b, angle, steps) 
		{
			if (steps == null) steps = 36;
			
			var points = [];
			
			// Angle is given by Degree Value
			var beta = -angle * (Math.PI / 180); //(Math.PI/180) converts Degree Value into Radians
			var sinbeta = Math.sin(beta);
			var cosbeta = Math.cos(beta);
			
			for (var i = 0, c = i + 360; i < c; i += 360 / steps) 
			{
				var alpha 	 = i * (Math.PI / 180) ;
				var sinalpha = Math.sin(alpha);
				var cosalpha = Math.cos(alpha);
				
				var X = x + (a * cosalpha * cosbeta - b * sinalpha * sinbeta);
				var Y = y + (a * cosalpha * sinbeta + b * sinalpha * cosbeta);


				points.push(
				{
					x: 		Math.floor(X),
					y: 		Math.floor(Y),
					angle: 	i
				});
			}
			
			return points;
		},
		play: function(speed)
		{
			for (i = 0, c = this.shapes.length; i < c; i++)
			{
				this.shapes[i].animate(speed * (this.shapes.length - 1));
			}
		},
		stop: function()
		{
			for (i = 0, c = this.shapes.length; i < c; i++)
			{
				this.shapes[i].stop().hide()
			}
		}
	});
	
	
	/* Special inherit method */
	var Coredraw = Core.inherit(function(options)
	{
		var vml = 
		[
			'shape',
			'rect', 
			'oval', 
			'circ', 
			'fill', 
			'stroke', 
			'imagedata', 
			'group',
			'textbox',
			'polyline',
			'arc',
			'path',
			'roundrect'
		];

		var shapes = {}, canvas = null, options = $.extend(
		{
			width:	200,
			height:	200
		}, options);
		
		
		/* Start transformations */
		if ($.browser.msie)
		{
			document.namespaces.add("v", "urn:schemas-microsoft-com:vml");
			
			/* Create dynamic stylesheet */
			var style = document.createStyleSheet();
			
			/* Add behaviour */
			$.each(vml,function() 
			{
				style.addRule('v\\:' + this,"position:absolute; display:block; behavior: url(#default#VML); antialias:true;");
			});
		}
		
		return {
			getCanvas: function()
			{
				if (null == canvas)
				{
					canvas = this.createCanvas();
				}
				return canvas;
			},
			createCanvas: function()
			{
				if (!$.browser.msie) /* Change behaviour */
				{
					var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
					
					svg.setAttribute("width", options.width);
					svg.setAttribute("height", options.height);
					
					/* Private options */
					svg.setAttribute("version", "1.2");
					svg.setAttribute("shape-rendering",	"geometricPrecision");
					svg.setAttribute("text-rendering",	"geometricPrecision")
					svg.setAttribute("image-rendering",	"optimizeQuality");
					
					svg.append = function(element)
					{
						this.appendChild(element);
					}
					
					svg.appendTo = function(element)
					{
						$(element).append(this);
					}
					
					return svg;
				}
				else /* Create empty canvas element for IE & initialise shapes */
				{
					/* Add shape behaviour for IE */
					return $('<div/>').css(
					{
						width: options.width,
						height: options.height
					});
				}
			},
			clear: function()
			{
				/* Remove all canvas elements */
				$(this.getCanvas()).empty();
				
				return this;
			},
			appendTo: function(element)
			{
				/* Append canvas to element */
				this.getCanvas().appendTo(element);
				
				return this;
			},
			loader: function(name, options)
			{
				var canvas = this.getCanvas();
				
				return (new AnimatedLoader(options)).create(canvas);
			},
			path: function(name, options)
			{
				var path = new Path(name, options);
				
				this.getCanvas().append(path.output());
				
				return path;
			}
		}
	});
	
	return {
		setup: function()
		{
			return this;
		},
		canvas: function(options)
		{
			return (new Coredraw(options));
		}
	}
})();