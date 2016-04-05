# Class Creation #

One of the primary goals of Core Framework is to simplify class definition. We recommend using Core.define() method as more secure approach, however one may define class like this:

```
var MyClass = Core.extend(
{
	name: 'Custom class with Core Framework',
	getName: function()
	{
		alert(this.name) /* Alerts: Custom class with Core Framework*/
	}
})

/* Inherit MyClass */
var MyChildClass = MyClass.extend(
{
	name:  'Custom inherited class with Core Framework'
});

var o = new MyChildClass();

o.getName(); /* Alerts Custom inherited class with Core Framework */
```