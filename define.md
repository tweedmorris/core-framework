# Introduction #

Class definition in Core Framework is done using Core.define() method:

```
Core.define('my.application.MyClass',Core.extend(
{
	name: 'Custom class with Core Framework',
	getName: function()
	{
		alert(this.name) /* Alerts: Custom class with Core Framework*/
	}
}));
```

# Combined with inheritance #
```
Core.define('my.application.MyClass',Core.extend(
{
	name: 'Custom class with Core Framework',
	getName: function()
	{
		alert(this.name) /* Alerts: Custom class with Core Framework*/
	}
}));

/* Inherit MyClass */
Core.define('my.application.MyChildClass',my.application.MyClass.extend(
{
	name:  'Custom inherited class with Core Framework'
}));

var o = new my.application.MyChildClass();

o.getName(); /* Alerts Custom inherited class with Core Framework */
```