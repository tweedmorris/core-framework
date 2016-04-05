# Introduction #

Core Framework provides handy cross-browser animated preloader. It can be placed inside any container: div, span etc.

# The problem #
Usually one uses animated **.gif** files for preloading indication. However **.gif** format has poor transparency support and when placed over gradients or images, the quality is very low.

Also, sometimes preloaders need to be flexible, bigger, customizable etc.

# The solution #
Imagine to have all these features without image at all. Core Framework provides SVG/VML base preloader, with full transparency support, fully customizable and platform independent.

# Features #
  1. SVG/VML based
  1. Full transparency support
  1. Adjustable speed
  1. Adjustable size
  1. Adjustable number of elements
  1. Adjustable radius of elements
  1. Controllable by JS ( stop(), play(), pause() etc )
  1. Recommended for AJAX based applications

# How to use? #


```
<script src="http://core-framework.googlecode.com/svn/trunk/core.js" type="text/javascript"></script>
```
Invoke loader:
```
Core.require(
{
	'plugins/draw' : ['plugins/svg']
}, function()
{	
	var canvas = Core.draw.canvas(
	{
		width:	500,
		height: 500
	}).appendTo('.canvas');
	
	var loader = canvas.loader(
	{
		path:	"M31.708,10.767c-1.081,0.186-2.648-0.006-3.479-0.352c1.726-0.143,2.895-0.928,3.344-1.992c-0.621,0.383-2.553,0.8-3.619,0.403c-0.053-0.251-0.11-0.49-0.17-0.705c-0.811-2.987-3.594-5.394-6.508-5.102c0.235-0.096,0.474-0.185,0.714-0.265c0.319-0.115,2.202-0.423,1.906-1.086c-0.251-0.586-2.551,0.44-2.985,0.576C21.484,2.028,22.43,1.659,22.532,1c-0.876,0.12-1.735,0.535-2.4,1.138c0.24-0.259,0.422-0.573,0.46-0.913C18.255,2.72,16.89,5.73,15.786,8.654c-0.867-0.842-1.637-1.504-2.326-1.874C11.526,5.744,9.212,4.66,5.581,3.31C5.47,4.513,6.175,6.112,8.207,7.175c-0.44-0.059-1.245,0.074-1.888,0.227c0.262,1.379,1.119,2.514,3.438,3.062c-1.06,0.07-1.608,0.313-2.104,0.833c0.483,0.958,1.663,2.085,3.781,1.854c-2.358,1.018-0.961,2.901,0.957,2.619C9.119,19.152,3.962,18.901,1,16.074c7.732,10.547,24.54,6.236,27.044-3.922C29.922,12.167,31.024,11.502,31.708,10.767z",	
		shape: 	"path",
		color:  "#3bceff",
		points: 5,
		radius: 10,
		angle: 	45,
		offset: 
		{
			top:	40,
			left:	40
		}
	})
})
```

**Browser support**
  * Internet Explorer 6.0+
  * Firefox 3+
  * Opera 9+
  * Chrome
  * Safari

Demo: [Animated Twitter SVG Loader](http://core-framework.googlecode.com/svn/examples/loader.html)