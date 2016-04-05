# Widget #
jQuery Widget example with Core Framework
```
Core.jQuery.widget('ui.observer', Core.extend(
{
	options:
	{
		version: 1.0
	},
	observe: function()
	{
		this.element.data('Timestamp', new Date().getTime());
	},
	_create: function()
	{
		/* Bind simple click listener */
		this.element.bind('click',this.delegate(this, this.observe))
	}
}));
```
The example above will create simple widget **$.ui.obersver** which can be used like this:
```
$('ul > li').observer();
```