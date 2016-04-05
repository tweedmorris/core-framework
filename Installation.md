# Installation #

Core Framework is easy to use. All you need is to include it in your projects.
  1. **Include directly from SVN**
```
<script type="text/javascript" src="http://core-framework.googlecode.com/svn/trunk/core.js"></script>
```
  1. **Include from local project files**
```
<script type="text/javascript" src="scripts/core.js"></script>
```
Note that you must download a copy of the source in local JavaScript file.
# Testing Installation #
Once included in the project, you can test the new available methods provided by CF:
```
Core.define('My.own.class',
{
    myMethod: function()
    {
        alert('It works')
    }
}

var ob = new My.own.class();
ob.myMethod() /* Alerts It works */

```