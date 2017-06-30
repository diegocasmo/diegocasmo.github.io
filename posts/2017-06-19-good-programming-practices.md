### A Short List of Programming Good Practices

Writing software is more than simply creating an application that fulfills its requirements; it has to be created to be maintainable, robust, verifiable, readable, among many other things. Because of this, we as developer need to constantly strive to learn and find new ways that can help create better code, and ultimately, a better software application.

The goal of this blog post is to list a few good programming practices than can improve your code. This list is not by any means exhaustive (there are entire books written about this very topic). That being said, I have focused on listing good programming practices that have had the greatest impact in the quality of the code I write.

### Test Driven Development (TDD)

Writing test first offers many advantages such as verifiability, regressions prevention, documentation, among others. But one of my favorites is that it introduces a "user" of the code that will be written.

A test itself can be thought as a user of some code that will eventually be written, and  as a result of it, writing code using the tests first approach enforces good design of code. This means that code written using TDD is usually better designed as writing the tests first forces the developer to write code that is easy to test, which is usually well designed code.

It's worth pointing out that TDD should be used together with Behavior Driven Development (BDD). TDD usually relies too much on the specific implementation a developer decided to use, BDD instead tests the behavior of the code. This is specially useful while refactoring, as you can still be able to tell if the new code correctly implements the required behavior of the old code without having to update any behavior tests at all.

### Use pure functions

A pure function is defined as a method which given the same input will always return the same output and depend in no external mutable state. Pure functions offer a variety of benefits such as no side effects, easy to test, easier to debug, among others.

To illustrate pure functions, let's consider the following example:

```
const numbers = [5, 3, 1]
const sortedNumbers = numbers.sort()
console.log(numbers) // [1, 3, 5]
console.log(sortedNumbers) // [1, 3, 5]
console.log(numbers === sortedNumbers) // true
```

The ``Array`` sort method is an impure function as it mutates the original array in which it's executed. This could lead to hard to find bugs as the application wouldn't necessarily always want to have the array of ``numbers`` in that particular order. A pure implementation in ``ES6`` would instead look like this:

```
function sortArray(arr, compareFunction = null) {
  return [...arr].sort(compareFunction)
}
const numbers = [5, 3, 1]
const sortedNumbers = sortArray(numbers, (a, b) => a - b)
console.log(numbers) // [5, 3, 1]
console.log(sortedNumbers) // [1, 3, 5]
console.log(numbers === sortedNumbers) // false
```

The example above does not mutate the ``numbers`` array anymore. In addition to that, it allows to pass an optional sort method to specify how to sort the array which makes the ``sortArray`` method more re-usable.

A related point to consider is to favor the use of functional programming. Functional programming is a declarative software programming paradigm and it avoids changing state and mutable data. There are many concepts to functional programming other than pure functions, but the use of it will enforce code that uses pure functions.

### Single source of truth (SSOT)

The concept of a single source of truth refers to the idea of storing the data of an application in only one place. Any other link to a specific piece of information is simply done by reference, and thus this approach can help to both avoid data synchronization issues and create a clearer separation of data v.s. the representation of it.

SSOT can also be applied to other endeavors outside software development such as an organization or product development.

### ``boolean`` variables should be named positively and contain ``is`` which implies ``true/false``

Naming ``boolean`` variables positively helps to avoid double negatives which are more complicated to understand. Consider the following example in English:

``You can't see no one in this crowd``

This sentence actually means you can see everyone in this crowd, but it's difficult to understand because it's written negatively. Let's now consider another example, but this time written in JavaScript:

```
const inactive = false
if (!inactive) {
  console.log('is active')
}
```

This piece of code can be easily improved by applying the concepts from above. First, let's add the word ``is`` to the name of the variable in order to imply ``true/false``, and finally let's rename it to ``active``, such that it's written positively:

```
const isActive = true
if (isAactive) {
  console.log('is active')
}
```

This modified version is far easier to understand and read than the one written negatively. Always favor naming ``boolean`` variables positively and include ``is`` to imply ``true/false``. With relatively low effort, this good practice will tremendously improve the readability of your code.

### Favor the verb-noun approach for naming methods

Naming things is one of those problems that have haunted software developers for quite a long time. That being said, there are a few tricks developers can use to alleviate this issue, and one that has worked good for me is the verb-noun approach for naming methods.

When naming a method, start by describing the action it will perform with a verb, such as ``get``, ``set``, ``transform``, or ``render``. After the action the method will perform has been specified, include a description of the value the method will return or update such as ``getInvestmentTotal(...args)``, ``renderHeader(...args)`` or ``saveUserAvatar(...args)``.

Using the verb-noun approach will help other developers to more clearly understand the code you have written and save time by not having to read the implementation of the method to understand what it does.

### Conclusion

In this blog post I have listed a few good programming practices that have helped me to improve the quality of the code I write. As mentioned in the introduction, there are entire books written about this topic, and thus I have limited myself to only list those good practices that have had the greatest impact for me as a developer.
