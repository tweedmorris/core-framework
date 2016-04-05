# Introduction #

CF's delegate() method allows for custom parameters to be passed. This comes very handy especially in conjunction with jQuery.


# Delegate parameters #

In our practice we use jQuery's methods like: $.each(), animate(), bind(), etc.  on a daily basis. In some cases, method delegation involves the need of some additional parameters to be passed. Best described with the following example:

```
Core.define('My.ui', Core.Class.extend(
{
    /**
    * Appends item to document's body
    */
    append: function(index, item)
    {
        $(item).appendTo(document.body)
    },
    /**
    * Adds some elements to the page (for the needs of the current example)
    */
    build: function()
    {
       $.each(
       [
           $('<a/>').html('Home'),
           $('<a/>').html('About us'),
           $('<a/>').html('Services'),
           $('<a/>').html('Contacts')
       ], this.delegate(this, this.append));
    }
}));
```

The example above will append 4 links to the document's body. It may seem dummy example but it shows perfectly how CF's delegation comes in handy.

jQuery's $.each() function passes 2 parameters by default: key, and item itself while iterating through the array. However in some cases we want to have additional parameters passed alongside these 2 parameters.

CF's delegate method allows for such action to be performed with ease. Let's modify the example above and pass some additional parameters.

```
Core.define('My.ui', Core.Class.extend(
{
    /**
    * Appends item to document's body
    */
    append: function(index, item, cls, title)
    {
        $(item).attr(
       { 
          title: title
       }).addClass(cls).appendTo(document.body)
    },
    /**
    * Adds some elements to the page (for the needs of the current example)
    */
    build: function()
    {
       $.each(
       [
           $('<a/>').html('Home'),
           $('<a/>').html('About us'),
           $('<a/>').html('Services'),
           $('<a/>').html('Contacts')
       ], this.delegate(this, this.append,["ui-menu-item", "Menu item"]));
    }
}));
```

Notice the additional parameters in the delegate. Additional parameters should be passed as array of parameters to allow for multiple parameters to be passed.