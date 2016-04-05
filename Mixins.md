# Mixins #

In object-oriented programming languages, a mixin is a class that provides a certain functionality to be inherited by a subclass, while not meant for instantiation (the generation of objects of that class). Inheriting from a mixin is not a form of specialization but is rather a means of collecting functionality. A class may inherit most or all of its functionality from one or more mixins through multiple inheritance.


# Mixins in Core Framework (CF) #

Mixins in CF are passed uppon class definition. Class can implement multiple mixins.

```
Core.define('Draggable', Core.extend(
{
	drag: function()
	{
		alert('I am draggable');
	}
}));

Core.define('Sortable', Core.extend(
{
	sort: function()
	{
		alert('I am sortable');
	}
}));


Core.define('My.ui.element', Core.extend(
{
	test: function()
	{
		this.drag(); /* Alerts I am draggable */
		this.sort(); /* Alerts I am sortable */
	},
	mixins:
	{
		sortable: 	Sortable, 
		draggable: 	Draggable
	}
}));

var e = new My.ui.element();

e.test();
```

In the example above, we have defined our custom class and have passed 2 mixins to inherit from.

Core framework also allows for the class to be defined with the following construction:
```
Core.define('My.ui.element', Core.extend(
{
	test: function()
	{
		this.drag(); /* Alerts I am draggable */
		this.sort(); /* Alerts I am sortable */
	}
}).mixin(
{
	sortable:  Sortable,
	draggable: Draggable
}));
```