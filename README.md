OO
==

An experiment on handling inheritance and constructors so that it makes sense

# The syntax

This is how you would define a type of object. Note that this is just like defining a constructor, though you 
get it in the nice object-syntax. Think of this as defining defaults for the objects you will later produce.

```javascript
var Person = OO.define({
  firstName: '',
  lastName: '',
  notesToSelf: [],
  gender: 'male',
  age: 30,
  getName: function () {
    return this.firstName + ' ' + this.lastName;
  }
});
```



When creating a person you can pass any properties you want to override. What is very important to notice here is
that any "complex objects" (objects and arrays) will be deep-cloned, so creating multiple instances will NOT share complex objects across.

```javascript
var me = Person.create({
  firstName: 'Christian',
  lastName: 'Alfoni'
});
console.log(me);
/*
  {
    firstName: 'Christian',
    lastName: 'Alfoni',
    age: 30,
    notesToSelf: [],
    gender: 'male'
  }
*/
```

When logging out this object you will see that all properties defined, except the methods are part of the instance, the methods are part of the prototype.

But if you want to, you can:
```javascript
var me = Person.create({
  firstName: 'Christian',
  lastName: 'Alfoni'
}, { inherit: true }); // Specifically tell it to inherit
console.log(me);
/*
  {
    firstName: 'Christian',
    lastName: 'Alfoni'
  }
*/
```
The rest of the properties are available on the prototype.

You can also extend an existing definition.
```javascript
var Employee = Person.extend({
  salary: {
    '2014': 0
  }
});
var somebodyElse = Employee.create({
  firstName: 'Ole',
  lastName: 'Hansen'
});
console.log(somebodyElse);
/*
  {
    firstName: 'Ole',
    lastName: 'Hansen',
    age: 30,
    notesToSelf: [],
    gender: 'male',
    salary: {
      '2014': 0
    }
  }
*/
```

# Why experimenting with this?
My first issue with this was with Backbone. The following code:
```javascript
Backbone.Model.extend({
  defaults: {
    someList: []
  }
})
```
Will give you problems. Since the array is a "complex object" it will be shared among all models.

I fell in love with the Backbone syntax. Describing constructors like an object makes a lot more sense to me, because that is how you will see them later and debug them. Using "extend" as a method for creating "sub-classes" also makes a lot more sense than "Employee.prototype = new Person" or "Employee.prototype = Object.create(Person.prototype)". Though it helps with Object.create, we still have the quirky constructor function that is very hard to understand.

I have also had quite a bit of experience with Angular JS lately and the way their "$scope" works. Even though it reflects scope inheritance, it really is just prototype inheritance on object properties. It really is a brilliant use of it and it says something about how javascript works. An instance is not necessarely a brand new copy of the "blueprint", there are inherited properties... the question is: "How should it be defined, what makes the most sense?"

If you are an experienced programmer, especially coming from a different language, I would be suprised if you got this far :-) I would expect a silent "douche" and going to other reads on the net. But this is the great thing about JavaScript, we can play around with it, challenge how we think and though this solution might not be your cup of tea... at least it tries to challenge a bit how we think.

# The goodies we get

### 1. The definition looks like the result
```javascript
var Me = OO.define({
  firstName: 'Christian',
  lastName: 'Alfoni'
});
console.log ( Me.create() );
/*
  {
    firstName: 'Christian',
    lastName: 'Alfoni'
  }
*/
```
### 2. Specifically ask for inheritance
```javascript
var Person = OO.define({
  firstName: 'Christian',
  lastName: 'Alfoni'
}, { inherit: true } );
var me = Person.create();
console.log (me);
/*
  {}
*/
console.log(me.__proto__);
/*
  {
    firstName: 'Christian',
    lastName: 'Alfoni'
  }
*/
```
### 3. Setting names gives correct instanceOf check
```javascript
var Person = OO.define('Person', {
  firstName: 'Christian',
  lastName: 'Alfoni'
}, { inherit: true } );
var me = Person.create();
console.log (me.is('Person')); // => true

var Employee = Person.extend('Employee', {
  id: 0
});
var meWorking = Employee.create();
console.log(meWorking.is('Person')); // => true
console.log(meWorking.is('Employee')); // => true
```
### 4. Can safely extend with own methods
```javascript
OO.instancePrototype.addFooBar = function () {
  this.foo = 'bar';
};
var Banana = OO.define({
  color: 'yellow'
});
var myBanana = Banana.create();
myBanana.addFooBar();
```

# Performance
I have not done any speed tests, but of course it will be slower than using constructors and object.create... but again. Most code out there are web applications and it is a lot more important to build code that is easy to understand and managable. jQuery is a good example of that. They do some pretty crazy stuff, and that is DOM related, the slowest part of our environment. So if you are not building a crazy huge app that has insanse amount of constructors, inheritance etc. I can not see it as a bottleneck.
