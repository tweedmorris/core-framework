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
		oval: null,
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
			color: 		'#ffffff'
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
		output: function()
		{
			if ($.browser.msie) /* Use VML */
			{
				this.oval = document.createElement('v:oval');
				
				this.oval.style.left 	= this.options.left;
				this.oval.style.top 	= this.options.top;
				this.oval.style.width 	= this.options.radius;
				this.oval.style.height 	= this.options.radius;
				
				this.oval.stroked 		= false;
				
				this.fill = document.createElement('v:fill');
		
				/* Full type */
				this.fill.type 		= 'solid';
				
				/* Fill color */
				this.fill.color 	= this.options.color;
				this.fill.opacity 	= this.options.opacity;
		
				this.oval.appendChild(this.fill);
				
				return this.oval;
			}
			else /* Use canvas */ 
			{
				this.oval = document.createElementNS("http://www.w3.org/2000/svg", "circle");
				
				this.oval.setAttribute("cx", 		this.options.left);
				this.oval.setAttribute("cy", 		this.options.top);
				this.oval.setAttribute("r", 		this.options.radius/2);
				this.oval.setAttribute("opacity", 	this.options.opacity);
				this.oval.setAttribute("fill", 		this.options.color);
				
				return this.oval;
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
			var opacity = this.oval.getAttribute("opacity");
			
			if (opacity >= this.options.speed)
			{
				this.oval.setAttribute("opacity", opacity - this.options.speed);
				
				setTimeout(this.delegate(this, this.fadeSVG), 10);
			}
			else 
			{
				this.oval.setAttribute("opacity",1);
				
				/* Continue fading */
				this.fadeSVG();
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
		'arc'
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
			/* Calculate loader offset */
			var offset = options.radius + options.size/2;
			
			/* Calculate points */
			var points = this.points(offset,offset,options.radius,options.radius,0,options.points), shapes = [], canvas = $(options.renderTo);
			
			
			var x = options.opacity/options.points, opacity = 0;
			
			for (var point in points)
			{
				var shape = new Shape(point, 
				{
					top: 	 points[point].y,
					left: 	 points[point].x,
					radius:  options.size,
					opacity: (opacity += x),
					speed:   options.speed/100
				});
				
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
					alpha: 	alpha
				});
			}
			
			return points;
		}
	}
})();