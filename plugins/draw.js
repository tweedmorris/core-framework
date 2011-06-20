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
			id: null,
			element: null,
			fill: null,
			options:
			{
				top:		0,
				left: 		0,
				width:  	0,
				height:	 	0,
				opacity: 	0,
				radius: 	0,
				speed: 		0.05,
				color: 		'#ffffff',
				angle: 		0
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
						width:		this.options.radius,
						height:		this.options.radius
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
						r: 			this.options.radius/2,
						opacity: 	this.options.opacity,
						fill: 		this.options.color
					});
					
				
					return this.element;
				}
			},
			animate: function(timeout)
			{
				setTimeout(this.delegate(this, $.browser.msie ? this.fade : this.fadeSVG), timeout);
			},
			fade: function()
			{
				if (this.fill.opacity >= this.options.speed)
				{
					this.fill.opacity -= this.options.speed;
					
					setTimeout(this.delegate(this, this.fade), 10);
				}
				else 
				{
					this.fill.opacity = 1;
					
					/* Continue fading */
					this.fade();
				}
			},
			fadeSVG: function()
			{
				var opacity = this.element.getAttribute("opacity");
				
				if (opacity >= this.options.speed)
				{
					this.element.setAttribute("opacity", opacity - this.options.speed);
					
					setTimeout(this.delegate(this, this.fadeSVG), 10);
				}
				else 
				{
					this.element.setAttribute("opacity",1);
					
					/* Continue fading */
					this.fadeSVG();
				}
			}
		});
		
		/* Rectangle shape */
		var Rectangle = Shape.extend(
		{
			output: function() /* Override only output */
			{
				if ($.browser.msie) /* Use VML */
				{
					this.element = document.createElement('v:roundrect');
					
					this.element.style.left     = this.options.left;
					this.element.style.top 	    = this.options.top;
					this.element.style.width 	= this.options.radius;
					this.element.style.height 	= this.options.radius/2;
					this.element.style.rotation = this.options.angle;
					
					this.element.arcsize		= 2;			
					this.element.stroked 		= false;
		
					
					this.fill = document.createElement('v:fill');
			
					/* Full type */
					this.fill.type 		= 'solid';
					
					/* Fill color */
					this.fill.color 	= this.options.color;
					this.fill.opacity 	= this.options.opacity;
			
					this.element.appendChild(this.fill);
					
					return this.element;
				}
				else /* Use canvas */ 
				{
					this.element = document.createElementNS("http://www.w3.org/2000/svg", "rect");

					this.element.setAttribute("rx", 		5);
					this.element.setAttribute("x", 			this.options.left);
					this.element.setAttribute("y", 			this.options.top);
					this.element.setAttribute("width", 		this.options.radius);
					this.element.setAttribute("height", 	this.options.radius/2);
					this.element.setAttribute("opacity", 	this.options.opacity);
					this.element.setAttribute("fill", 		this.options.color);
					this.element.setAttribute("transform", "rotate(" + this.options.angle + " " + (this.options.left+4) + " " + (this.options.top+4) + ")");
					
					return this.element;
				}
			}
		});
		
		var Polyline = Shape.extend(
		{
			output: function() /* Override only output */
			{
				var polyline = [];
					
				polyline.push([this.options.left, this.options.top].join(" "));
				polyline.push([this.options.left, this.options.top - 5].join(" "));
				polyline.push([this.options.left + this.options.size, this.options.top].join(" "));
				polyline.push([this.options.left, this.options.top + 5].join(" "));

				/* Join paths */
				polyline = polyline.join(',')
					
				if ($.browser.msie) /* Use VML */
				{
					this.element = document.createElement('v:polyline');
					
					this.element.style.left     = this.options.left;
					this.element.style.top 	    = this.options.top;
					this.element.style.rotation = this.options.angle;
					this.element.points			= polyline;	
					this.element.stroked 		= false;
		
					this.fill = document.createElement('v:fill');
			
					/* Full type */
					this.fill.type 		= 'solid';
					
					/* Fill color */
					this.fill.color 	= this.options.color;
					this.fill.opacity 	= this.options.opacity;
			
					this.element.appendChild(this.fill);
					
					return this.element;
				}
				else /* Use canvas */ 
				{
					this.element = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
					
					this.element.setAttribute("points", 	polyline);
					this.element.setAttribute("x", 			this.options.left);
					this.element.setAttribute("y", 			this.options.top);
					this.element.setAttribute("opacity", 	this.options.opacity);
					this.element.setAttribute("fill", 		this.options.color);
					this.element.setAttribute("transform", "rotate(" + this.options.angle + " " + (this.options.left) + " " + (this.options.top) + ")");
					
					return this.element;
				}
			}
		})
	
	
		/* Start transformations */
		if ($.browser.msie)
		{
			document.namespaces.add("v", "urn:schemas-microsoft-com:vml");
			
			/* Create dynamic stylesheet */
			var style = document.createStyleSheet();
		}
		
		var shapes = 
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
			'roundrect'
		];
		
		return {
			shapes:[],
			queue:[],
			svg:null,
			canvas:null,
			init: function()
			{
				if ($.browser.msie) /* Change behaviour */
				{
					$.each(shapes,function() 
					{
						style.addRule('v\\:' + this,"position:absolute; display:block; behavior: url(#default#VML); antialias:true;");
					});
				}
				else /* Create SVG */
				{
					this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
					this.svg.setAttribute("width", 100 + '%');
					this.svg.setAttribute("height",100 + '%');
					this.svg.setAttribute("version", "1.2");
					this.svg.setAttribute("baseProfile", "tiny");
				}
		
				return this;
			},
			loader: function(options)
			{
				/* Default options */
				options = $.extend(
				{
					size: 		8,
					radius: 	15,
					opacity:	1,
					points: 	8,
					speed: 		2,
					shape: 		'circle',
					color: 		'#000000'
				},options);
				
				/* Calculate loader offset */
				var offset = 20 + options.radius + options.size/2;
				
				/* Calculate points */
				var points = this.points(offset,offset,options.radius,options.radius,0,options.points), shapes = [], canvas = $(options.renderTo);
				
				var x = options.opacity/options.points, opacity = 0;
				
				for (var point in points)
				{
					var pointOptions = 
					{
						top: 	 points[point].y,
						left: 	 points[point].x,
						angle: 	 points[point].angle,
						radius:  options.size,
						opacity: (opacity += x),
						speed:   options.speed/100,
						color: 	 options.color,
						size: 	 options.size
					}
					
					switch(options.shape.toLowerCase())
					{
						case 'polyline': /* Use polyline */
							var shape = new Polyline(point, pointOptions);
							break;
							break;
						case 'rectangle': /* Use rectangle */
							var shape = new Rectangle(point, pointOptions);
							break;
						default: /* Default top circle */
							var shape = new Shape(point, pointOptions);
							break;
					}
					
					if ($.browser.msie)
					{
						canvas.append(shape.output());
					}
					else 
					{
						this.svg.appendChild(shape.output());
					}
					
					
					/* Queue shape */
					this.shapes.push(shape);
				}
				
				canvas.append(this.svg);
				
				/* Calculate speeds */
				this.play((1/(options.speed/100))/options.points);
				
			},
			play: function(speed)
			{
				while(this.shapes.length)
				{
					this.shapes.pop().animate(speed * (this.shapes.length - 1));
				}
			},
			points: function(x, y, a, b, angle, steps) 
			{
				if (steps == null) steps = 36;
				
				var points = [];
				
				// Angle is given by Degree Value
				var beta = -angle * (Math.PI / 180); //(Math.PI/180) converts Degree Value into Radians
				var sinbeta = Math.sin(beta);
				var cosbeta = Math.cos(beta);
				
				for (var i = 0; i < 360; i += 360 / steps) 
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
			}
		}
	})();