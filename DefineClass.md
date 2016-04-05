# Defining class #

Class definition is done via Core.define() method. Example:
```
Core.define('My.personal.UI', Core.Class.extend(
{
    bind: function()
    {
        /* Method body */
    }
}));
```

Using the method above allows for easy class definition and dynamic namespace.<br /><br />
Note that both namespaces My and personal does not have to exist in order to define the class. CF will automatically check if namespace(s) exist and if not, they will be created automatically.