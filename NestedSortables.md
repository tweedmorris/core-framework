# Introduction #

Core Framework allows you to convert any ordered list into interactive sortables via drag and drop. Essential here is the ability to auto expand collapsed blocks on over, thus enabling the user to arrange even collapsed tree.

# Details #
Assume that you have the following hierarchy:
```
<ol class="sortable">
	<li>Products</li>
	<li>Training programs</li>
	<li>Sports equipment
		<ol>
			<li>Shows</li>
			<li>Clothes</li>
		</ol>
	</li>
</ol>
```

To transform this into nested sortable, one can use the following code:
```
Core.require('plugins.tree', function()
{
	$.widget('ui.tree', Tree);

	/* Apply widget */
	$('ol.sortable').tree(
	{
		folder: 'categories'
	});
})
```

Required CSS:
```
.ui-placeholder-wrapper { display:block; }
.ui-parent-collapsed > div a {  }
.ui-parent-collapsed > div a:hover {  }
.ui-parent-expanded > div a {  }
.ui-parent-expanded > div a:hover {  }
.ui-droppable-active a {  }
.placeholder { height:1px; line-height:1px; font-size:0px; visibility:hidden; }
.placeholder-active { visibility:visible; border:1px dashed #000; }
.ui-state-disabled { opacity:.4; }

```