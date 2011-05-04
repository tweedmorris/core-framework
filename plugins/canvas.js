var Canvas = (function()
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
	
	$.each(shapes,function() 
	{
		style.addRule('v\\:' + this,"behavior: url(#default#VML); antialias:true");
	});
	
	return {
		getText: function(string)
		{
			$('body').append('<v:oval style="width:150pt;height:50pt; display:block;" fillcolor="green"></v:oval>');
		}
	}
})();