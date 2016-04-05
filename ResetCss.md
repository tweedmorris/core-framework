# CSS Reset #

Special CSS collection to reset differences across browsers.

```
/**
* Resets paddings, margins &fonts across browsers
* @version 1.0.0
* @copyright Creozon
*/

* { margin:0;  padding:0;  border:0}

html, body, h1, h2, h3, h4, h5, h6, form, select, input, textarea, p, ul, li { padding:0; margin:0; font-weight:normal; font-size:12px; }

html, body, div, span, applet, object, iframe, 
h1, h2, h3, h4, h5, h6, p, blockquote, pre, 
a, abbr, acronym, address, big, cite, code, 
del, dfn, em, font, img, ins, kbd, q, s, samp, 
small, strike, strong, sub, sup, tt, var, 
b, u, i, center, 
dl, dt, dd, ol, ul, li, 
fieldset, form, label, legend, 
table, caption, tbody, tfoot, thead, tr, th, td { margin:0; padding:0; border:0; outline:0; font-size:12px; vertical-align:baseline; background:transparent; font-size:12px; }

body { line-height:1; }

/* Reset lists */
ol, ul, li { list-style:none; }

blockquote, q { quotes:none; }

/* remember to define focus styles! */
:focus{ outline:0; }

ins { text-decoration:none }
del { text-decoration:line-through }

/* tables still need 'cellspacing="0"' in the markup */
table { border-collapse:collapse; border-spacing:0 }

/* Reset anchors & remove dashed borders */
a, a:hover, a:active, a:focus, img, img:active, img:focus, div:focus, div:active, input:active, input:focus { outline:0; text-decoration:none; }

input[type="text"], input[type="password"], textarea, select { outline:none; }

input::-moz-focus-inner{ border:0;  padding:0}

input.checkbox, input.radio{width:14px; height:14px; padding:0px; margin:0px; outline:none}

img{border:none}

/* Chrome fix */
textarea { resize:none }
```