/* Define shape */
var Shape = Core.extend(
{
	shape: null,
	options: 
	{
		/* Override */
	},
	init: function(shape, options)
	{
		this.shape  = shape;
		this.options = options;
	}
});

/* Define oval */
var Oval = Shape.extend(
{
	
})


var Draw = (function()
{
	document.namespaces.add("v", "urn:schemas-microsoft-com:vml");
	
	var style = document.createStyleSheet();
	
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
		'textbox'
	];
	
	
	return {
		init: function()
		{
			$.each(shapes,function() 
			{
				style.addRule('v\\:' + this,"behavior: url(#default#VML); antialias:true");
			});
	
			return this;
		},
		addCircle: function(string)
		{
			alert(1);
			
			//var group = '<v:group id="secondsPointer" style="width:100px; height:100px; position: absolute; top: 0px; left: 0px;"></v:group>';
			var circle = new Oval();

			var loader = $('<v:oval></v:oval>').attr(
			{
				style: 'width:45px;height:45px; display:block; border:none;',
				fillcolor: 'black'
			})
			
			$('.canvas').css(
			{
				width:100,
				height:100,
				border: '1px solid #000'
			}).append(loader);
		}
	}
})();