/**
* Core.nested.tree
* @version 1.0.0
*/
Core.define('Core.tree', Core.tree.extend(
{
	history: new Core.tree.history(),
	options: 
	{
		items: 'li',
		draggable: 
		{
			handle: 			' > div',
	        addClasses: 		false,
	        helper: 			'clone',
	        zIndex: 			100,
	        opacity: 			.8,
	        refreshPositions: 	true
		},
		droppable: 
		{
			accept: 			'li',
	        tolerance: 			'pointer',
	        refreshPositions: 	true
		}
	},
	delegate: function(target, method, args) /* Javascript Delegate */
	{
		return (typeof method == "function") ? function() 
		{ 
			/* Override prototype */
			arguments.push = Array.prototype.push;
			
			/* Push additional arguments */
			for (var arg in args)
			{
				arguments.push(args[arg]);
			}
			return method.apply(target, arguments); 
		} : function()
		{
			return false;
		};
	},
	init: function(index, item)
	{
		/* Append placeholder(s) */
		var placeholder = $('<div/>').addClass('placeholder'), item = $(item);
		
		placeholder.prependTo(item).animate(
		{
			height:5
		}, 300);
		
		/* Check wether item has OL children */
		this.refresh();
	},
	drop: function(event, ui)
	{
		var li = $(event.target).parent();
		
		var child = !$(event.target).hasClass('placeholder');
		
		if (child && li.children('ol').length == 0) 
		{
			li.append('<ol/>');
		}
		
		if (child) 
		{
			li.addClass('ui-state-expanded').removeClass('ui-state-collapsed').children('ol').append(ui.draggable).show(200);
		}
		else 
		{
			li.before(ui.draggable);
		}
		
		$('ol.sortable li.ui-state-expanded').not(':has(li:not(.ui-draggable-dragging))').removeClass('ui-state-expanded');
		
		li.find('.placeholder').removeClass('placeholder-active').find('>div').removeClass('ui-droppable-active');
		
		
		this.clear(this.element);
		
		this.refresh();
		
		/* Commit changes to history stack */
		this.history.commit();
	},
	over: function(event, ui)
	{
		$(event.target).filter('div:not(.placeholder)').addClass('ui-droppable-active').parent().children('ol').show(200).each(function()
		{
			$(this).parent().addClass('ui-parent-expanded');
		});
		
        $(event.target).filter('.placeholder').addClass('placeholder-active');
	},
	out: function(event, ui)
	{
		$(event.target).filter('div').removeClass('ui-droppable-active');
        $(event.target).filter('.placeholder').removeClass('placeholder-active');
	},
	refresh: function()
	{
		this.element.find('ol:hidden').each(function()
		{
			$(this).parent().addClass('ui-parent-collapsed');
		});
		
		this.element.find('ol:visible').each(function()
		{
			$(this).parent().addClass('ui-parent-collapsed ui-parent-expanded');
		});
		
		return this;
	},
	clear: function(element) /* Clear empty UL/LI*/
	{
		element.find('ol').filter(function()
		{
			return $(this).children().size() == 0;
		}).remove();
		
		this.serialize();
	},
	log: function(event, ui)
	{
		var item = $(event.target);
		
		$(ui.helper).addClass("ui-draggable-helper");

		this.history.saveState(item)
	},
	undo: function(event)
	{
		 if (event.ctrlKey && (event.which == 122 || event.which == 26)) 
		 {
		 	this.history.restoreState();
		 	
			this.refresh();
		 }
	},
	toggle: function(event)
	{
		$(event.target).parents('li:first').toggleClass('ui-parent-expanded').children("ol").toggle(200);
		
		return false;
	},
	serialize: function()
	{
		return (new Core.tree.serialize()).serialize(this.element);
	},
	_create: function()
	{
		/* Extend draggable options */
		this.options.draggable = $.extend({}, this.options.draggable,
		{
			start: this.delegate(this, this.log),
			delay: 200
		});
		
		
		/* Extend droppable options */
		this.options.droppable = $.extend({}, this.options.droppable, 
		{
	        drop: 				this.delegate(this, this.drop),
	        over: 				this.delegate(this, this.over),
	        out: 				this.delegate(this, this.out)
		})
		
		/* Init */
		this.element.find(this.options.items)
				    .each(this.delegate(this, this.init))
				    .bind("click",this.delegate(this,this.toggle))
				    .draggable(this.options.draggable)
				    .end()
				    .find('div, .placeholder')
				    .droppable(this.options.droppable)
				    .disableSelection();
				    
	    $(document).bind('keypress', this.delegate(this, this.undo));
	    
	    this.serialize();
	}
}));

/* Define widget */
(function($)
{	
	/* Widget Namespace */
	$.core = $.core || {};
	
	/* Widget */
	$.widget("core.tree", Core.tree);
})(jQuery);