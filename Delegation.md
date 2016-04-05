# General information #

Method delegation has become inseparable part of our daily development activities. Main objective of CF is to provide as clean code as possible thus reducing time required for debugging and support. Most of the UI interactions with jQuery involve working with events and callbacks. However callback functions have private scope, which disables access to other methods of our class(es)

# JavaScript Delegate #

A delegate is a type that references a method. Once a delegate is assigned a method, it behaves exactly like that method. The delegate method can be used like any other method, with parameters and a return value


This can be explained best with the following example. Binding click listener with jQuery is simple as follows:





# Delegation with CF #

CF provides handy method: delegate() which allows for easy delegation of methods and callbacks. Each class that inherits **Core.Class** will have delegate() method available. JavaScript delegation can best be explained with the following example:

Assume there is a "click" listener binded to a button:

```
Core.define('My.ui', Core.Class.extend(
{
    bind: function()
    {
        $('.button').bind("click", function(event)
        {
            alert('Button was clicked');
        }
    }
})));

/* Create new instance of My.ui */
var ui = new My.ui();

/* Call bind method */
ui.bind();
```

In the example above, we have binded with jQuery an click event listener to element with class **.button**

The important part of the example is actually the callback closure. If we reference **this** inside our closer we will get access to the event target element because of the private scope of the callback, thus losing our class scope.

So far so good.

But let's assume that we are building OOP application and want to pass class method as callback of the binded click event.

Now, let's alter the click listener example and use the new delegation approach provided by CF:

```
Core.define('My.ui', Core.Class.extend(
{
    getTime: function()
    { 
       return (new Date()).getTime();
    }
    listeners:
    {
        click: function(event)
        {
            alert('Button clicked on ' + this.getTime());
        }
    }
    bind: function()
    {
        $('.button').bind("click", this.delegate(this, this.listeners.click))
    }
})));
```

In the example above, we are no longer using closure, but class method instead. The essential here is that the callback method does not loose scope and can call other methods of our class. Example: **this.getTime()** called from inside the listener method.

With CF's delegate() method, one can pass any scope to the delegated method.