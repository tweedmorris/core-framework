# getMixin() #

In the current release, mixins override existing methods. We are planning a smart processor for mixins to allow one to choose how exactly to "mixin". For that reason CF allows you to call methods from mixins directly via the following code:

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
	drag: function()
	{
		alert('I am sortable');
	}
}));


Core.define('My.ui.element', Core.extend(
{
	test: function()
	{
		this.getMixin('draggable').drag();
	}
}).mixin(
{
	draggable: Draggable,
	sortable:  Sortable
}));
```