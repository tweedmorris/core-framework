# Introduction #

Core.namespace.register() registers object within given namespace. It's sort of safe operation, because the functions checks if the namespace exists and if not it creates it automatically

# Example #
```
Core.namespace.register('My.personal.data', window, 
{
    name: 'Angel'
})

alert(My.personal.data.name); /* Outputs Angel */
```

Note that
```
My & My.personal
```
do not have to exists. If they don't exists, CF will create them automatically as object literals {}