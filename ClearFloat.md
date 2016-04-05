# Clear float #

Good (x)HTML practices involves reduction of the number of elements in the code. For that reason, we have prepared special cross-browser class which can be applied to any element containing floated elements.

```
.fix { position:relative; display:inline-block; }
.fix { zoom:1; display:block; }/* IE6 fix */
.fix:after { content:"."; display:block; height:0; clear:both; visibility:hidden; }
```

# Example usage #
```
<div class="content fix">
   <div style="float:left">Sidebar</div>
   <div style="float:left">Content</div>
</div>
```
In the example above there is no need for additional clearing div.