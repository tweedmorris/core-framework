var Dialog = (function()
{
	var dialog = null;
	
	return {
		getDialog: function()
		{
			if (null === dialog)
			{
				dialog = (function()
				{
					return {
						options: 
						{
							width: 600,
							height:400,
							speed: 850
						},
						state: 
						{
							width: 0,
							height: 0
						},
						visible: false,
						loading: false,
						dialog: null,
						window: function()
						{
							if (null === this.dialog)
							{
								var dialog = this.dialog = $('<div/>').addClass('dialog');
					
								var top = $('<div/>').addClass('top');
								var mid = $('<div/>').addClass('mid');
								var bot = $('<div/>').addClass('bot');
								var tlc = $('<div/>').addClass('tlc'); 
								var trc = $('<div/>').addClass('trc'); 
								var blc = $('<div/>').addClass('blc'); 
								var brc = $('<div/>').addClass('brc');
								
								var wrapper = $('<div/>');
								var content = $('<div/>').addClass('content');
								
								var close = $('<a/>').bind(
								{
									click: Core.delegate(this, this.close)
								}).addClass('dialog-control dialog-close').appendTo(top);
								
								
								/* Append parts */
								$.each([top,mid,bot], function()
								{
									$(this).appendTo(dialog);
								})
							
								/* Top corner(s) */
								$.each([tlc,trc], function()
								{
									$(this).addClass('corner').appendTo(top);
								})
								
								/* Bottom corner(s) */
								$.each([brc,blc], function()
								{
									$(this).addClass('corner').appendTo(bot);
								})
								
								wrapper.append(content).appendTo(mid);
								
								
								this.dialog.appendTo('body')
								
								/* .draggable(
								{
									handle: 'h2'
								});
								*/
							}
							
							return this.dialog;
						},
						addPreloader: function()
						{
							if (this.visible)
							{
								var preloader = $('<div/>').addClass('preloader').appendTo(this.dialog.find('.mid > div > div'));
							}
							
							return this;
						},
						hideControls: function()
						{
							this.dialog.find('.dialog-control').hide();
							
							return this;
						},
						showControls: function()
						{
							this.dialog.find('.dialog-control').show();
							
							return this;
						},
						removePreloader: function()
						{
							if (this.visible)
							{
								this.getContent().find('> .preloader').remove();
							}
							
							return this;
						},
						resize: function(width, height, callback)
						{
							this.state.width  = width;
							this.state.height = height;
							
							this.window().show().animate(
							{
								width: width,
								marginLeft: -(width/2),
								marginTop: -(height/2) + $(document).scrollTop()
							}, this.options.speed).find('.content').animate(
							{
								height: height
							}, this.options.speed, function()
							{
								setTimeout(callback, 100);
							});
							
							$(document).unbind('scroll').bind(
							{
								scroll: Core.delegate(this, this.scroll)
							});
						},
						content: function(content, adjust)
						{
							var adjust = adjust || false;
							
							this.getContent().html(content);
							
							if (adjust)
							{
								var images = [];
								
								var autosize = function()
								{
									var height = this.getContent().find('>div').height() + 10;

									this.resize(this.state.width, height, function()
									{
										/* Do something */
									});
								}
								
								/* Preload image(s) first */
								this.getContent().find('img').each(function()
								{
									images.push($(this).attr('src'));
								});
								
								if (images.length)
								{
									Core.preloader.queue(images).preload(Core.delegate(this, autosize));
								}
								else 
								{
									autosize.call(this);
								}
							}
							
							/* Dialog is initiated */
							this.loading = false;
							
							return this;
						},
						empty: function()
						{
							this.getContent().empty();
							
							return this;
						},
						open: function(width, height, callback)
						{
							if (!this.visible)
							{
								/* Disable multiple dialog instance(s) */
								this.visible = true;
								this.loading = true;
	
								this.empty().showControls().addPreloader().resize(width, height, callback);
							}
						},
						scroll: function()
						{
							this.window().css(
							{
								marginTop: -(this.state.height/2) + $(document).scrollTop()
							})
						},
						close: function()
						{
							if (!this.loading && this.visible)
							{
								this.empty().hideControls().removePreloader().resize(45,10, Core.delegate(this, function()
								{
									this.window().hide();
									
									/* Enable dialog */
									this.visible = false;
								}));
								
								$(document).unbind('scroll');
							}
						},
						getContent: function()
						{
							return this.window().find('.mid > div > div');
						}
					}	
				})();
			}
			
			return dialog;
		},
		preloader: function(show)
		{
			show = show || false;
			
			if (show)
			{
				this.getDialog().addPreloader();
			}
			else this.getDialog().removePreloader();
			
			return this;
		},
		open: function(width, height, callback)
		{
			this.getDialog().open(width, height, callback);
		},
		close: function()
		{
			this.getDialog().close();
		},
		confirm: function(message, config)
		{
			var config = $.extend(true,
			{
				width:400,
				height:100
			},config);
			
			var confirm = $('<div/>').addClass('confirm').html(message);
		
			this.getDialog().empty().resize(config.width,config.height, Core.delegate(this, function()
			{
				this.getDialog().content(confirm);
			}))
		}
	}
})()