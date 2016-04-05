# Introduction #

Core Framework allows you to achieve class inheritance and have private data in the same time. This is done via the Core.inherit() method.

```
var Person = Core.inherit(function(name)
{
	/* Private name */
	var name = name;
	
	return {
		getName: function()
		{
			return name;
		}
	}
});

var Me = Person.inherit(function(name)
{
	this.parent(name); //Call parent constructor
	
	return {
		who: function()
		{
			return "I am " + this.getName();
		}
	}
});

var o = new Me("Core Framework");

alert(o.who());
```

**Important**: This type of inheritance is still a beta version. Use with caution.