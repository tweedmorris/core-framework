# Introduction #

CF provides mechanism for dynamic script loading. You can now load scripts on demand as well as get notified when all scripts are loaded. CF provides a handy **autoload()** method which can load an array of registered scripts. The method takes a callback function as parameter which is executed once all scripts are loaded successfully.

# Script loading with CF #

The following example demonstrates how to load scripts on demand with CF:

```
Core.loader.addScripts(
{
	'data' : [
		'plugins/view', 
		'plugins/browse'
	]
}).autoload(function()
{
	alert('All scripts loaded successfully');

        /* Execute your code here */
})
```

# How it works? #

In the example above, on autoload() call, CF will iterate through an array of registered scripts via **addScripts** method. Notice that the script extension (**.js**) is not provided.

**addScripts** method receives a JSON object with the following structure:

'script' : `[`'dependencies'`] `

In the example above, CF will try to load the following script in this sequence:
  1. plugins/view.js
  1. plugins/browse.js
  1. data.js