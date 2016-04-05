# Autoloading #

Core Framework implements smart system for dynamic inclusion of scripts. This is probably one of the greatest features of the framework because it allows greater resource control.


## 1. Autoload single script ##
```
Core.require("plugins.test", function()
{
	new Test().notify()
});
```

In the example above CF will try to load file: **plugins/test.js**. When loaded successfully, it will execute the callback function passed as second argument.

## Autoload array of scripts ##
Once can load array of scripts by passing the array to Core.require() method.
```
Core.require(['plugins.test', 'plugins.forms'], function()
{
	alert('All scripts loaded');
});
```

In the example above the library will load scripts as follows:
  1. plugins/test.js
  1. plugins/forms.js

## 3. Autoload map of scripts (several scripts at once) ##
One can load an entire map of files with their dependencies. Maps are passed as parameters to **Core.require()** method and are actually key:value paired JSON object. Essential with maps is that they provide dependent loading. They specify the script to be loaded and it's dependencies.


```
Core.require(
{
	'plugins/data'			: [],
	'plugins/animation'		: [],
	'plugins/element/input'		: ['plugins/element'],
	'plugins/element/select'	: ['plugins/element'],
	'plugins/element/checkbox'	: ['plugins/element'],
	'plugins/forms'			: []
	
}, function()
{
	alert('All scripts loaded');
});
```

In the example above, the library will load the scripts in the following sequence:
  1. plugins/data.js
  1. plugins/animation.js
  1. plugins/element.js
  1. plugins/element/input.js
  1. plugins/element/select.js
  1. plugins/element/checkbox.js
  1. plugins/element.forms.js

Not that plugins/element.js is loaded only once.

## 4. Script(s) path ##
In order to include scripts from specific path one must specify it via setConfig method:
```
/* Config autoloader */
Core.loader.setConfig(
{
	path: '../sandbox/scripts'
})
```