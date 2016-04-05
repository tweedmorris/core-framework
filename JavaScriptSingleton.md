# JavaScript Singleton #
```
var Singleton = (function()
{
	/* Private methods */
	var find = function()
	{
		alert('Private method find()');
	}
	
	return {
		/* Public methods */
		get: function()
		{
			find();
		}
	}
})();
```


# Example #
Having our class defined as shown above, we can call public methods like this:
```
Singleton.get();
```
However, we can't call private method **find()** directly.