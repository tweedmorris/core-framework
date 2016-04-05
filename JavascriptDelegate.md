# Javascript Delegate #

Most of the user interaction involves events and event manipulation. Usually events in JavaScript are handled by closures with their own private scope. We found this unpractical in object oriented environment.

The idea is to be able to pass methods as event callbacks without losing scope (**this** will still point to our class scope, thus making the remaining methods available within the callback)

We want to go even further and pass additional arguments to the callback alongside the default arguments. It's good idea also to ensure that the delegated method exists.

Reusable JavaScript delegate:
```
function delegate(target, method, args)
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
}
```

In Core Framework you can use **Core.delegate()** method to achieve the same functionality. Every class defined with **Core.define()** or **Core.extend()** method will inherit **delegate()** method as well.

# Examples #
Some application of the delegation described above
## 1. setInterval() & setTimeout() ##
```
var MyClass = (function()
{
	name: "My Class",
	delegate: function(target, method, args)
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
	}
	notify: function()
	{
		setTimeout(this.delegate(this, this.send,['Sending notification after 1000ms timeout']),1000)
	},
	send: function(event, message)
	{
		alert(this.name + ':' + message) /* Alerts: "MyClass: Sending notification after 1000ms timeout" */
	}
})();

MyClass.notify(); /* Will call method MyClass.send() after 1000 ms timeout */
```
Take a look at the arguments passed to **setTimeout()** function. The first argument is actually the essential part of this example, it's a delegate to **MyClass.send()** method. Instead of passing nameless closure, we pass class method.

Note that the delegate passes the proper class scope and we can still call **this.name** inside our method.

The example also demonstrates how to pass additional arguments via delegation. In this particular example we are passing a simple message to be alerted from **MyClass.send()** method.

## 2. jQuery Ajax success callback ##


```
var MyClass = (function()
{
	name: "My Class",
	delegate: function(target, method, args)
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
	}
	handle: function(response)
        {
        },
        request: function()
        {
              $.ajax(
              {
	            type: 'POST',
	            url: url,
	            data: data,
	            success: this.delegate(this, this.handle)
              });
       }
})();
```