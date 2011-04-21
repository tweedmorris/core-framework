
/**
* Core.ui.forms
* @version 1.0.0
*/
Core.define('Core.forms', Core.extend(
{
	options: 
	{
		applyTo: null,
		theme:
		{
			options: 
			{
				limit: 		20,
				maxHeight: 	320
			},
			classes:
			{	
				arrow:	  	'ui-form-select-arrow',
				select:	  	'ui-form-select',
				selectOver: 'ui-form-select-over',
				selected: 	'ui-form-select-option-selected',
				dropdown: 	'ui-form-select-dropdown'
			},
			effect: 		'slide',
			timeout: 		300
		},
		speed:  			300
	},
	applyTheme: function()
	{
		if (this.options.applyTo)
		{
			var applyTo = $(this.options.applyTo);

			$('select',applyTo).add(':checkbox',applyTo).each(this.delegate(this, this.replace));
		}
	},
	replace: function(index, item)
	{	
		var element = item.tagName.toLowerCase();
		/* Replace element */
		return (new Core.element[element]($(item))).replace(
		{
			theme: this.options.theme
		});
	},
	init: function(options)
	{
		this.options = $.extend(true, {}, this.options, options);
	}
}));