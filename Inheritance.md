# Class Inheritance & Polymorphism #

There are multiple ways to achieve class inheritance in JavaScript. One of the primary goals of Core Framework (CF) is to simplify and unify class inheritance. Example of class inheritance with CF.

Lets assume that we have defined class Person:

```
Core.define('Person', Core.extend(
{
    name: 'Angel',
    getName: function()
    {
        return this.name;
    }
}));

var Me = new Person();

document.write(Me.getName()) //Outputs Angel
```

To extend Person class we can call the following code:

```
Core.define('Developer', Person.extend(
{
    name: 'Angel @ Creozon Team',
}));

var D = new Developer();

document.write(D.getName()) //Outputs Angel @ Creozon Team
```

As shown in the example, Developer class inherits method getName() from Person class.