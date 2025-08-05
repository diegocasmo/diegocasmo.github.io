---
layout: post
title: Reducing Type Overhead with Lazy Evaluation in TypeScript
date: 2025-08-05
---

When working on large TypeScript codebases, it's easy to introduce performance issues through how types are written. One case we ran into involved building helper types over all API routes, which caused the type checker to slow down significantly.

The insight and solution presented here came from my teammate [José Mussa](https://x.com/josemussa), who identified the root cause and proposed the fix that made a real difference in our day-to-day development.

## The Problem

Suppose we define an API map like this:

``` ts
type ApiRoutes = {
  '/users': User[],
  '/posts': Post[],
  '/comments': Comment[]
};
```

Now we want to create a type that describes the shape of a `GET` response:

``` ts
type ApiGet = ApiResponse<keyof ApiRoutes>; // problematic
```

At a glance, this looks fine. But `keyof ApiRoutes` becomes `'/users' | '/posts' | '/comments'`, and TypeScript will attempt to resolve `ApiResponse` for every key in that union at once.

With only a few paths, this isn't a problem. But with hundreds of endpoints, this approach led to slow editor feedback and long type-checking times.

## The Fix

Instead of evaluating all possible paths up front, we changed the type to compute responses only for the path being used:

``` ts
type ApiGet<Path extends keyof ApiRoutes> = ApiResponse<Path>;
```

This change meant TypeScript would only resolve the types for the specific path we passed in. Since our [internal hooks](https://diegocasmo.github.io/2022-12-19-api-using-axios-react-query/) already received a path as a parameter, updating the generic definition was all it took to reduce the load.

## What to Avoid

If you're working with a large object and using `keyof` directly inside a type like this:

``` ts
type Something = Wrapper<keyof BigMap>;
```

Consider refactoring it to a generic form:

``` ts
type Something<K extends keyof BigMap> = Wrapper<K>;
```

This avoids building massive unions ahead of time and keeps the compiler focused.

## Summary

Evaluating wide unions too early can become expensive. Switching to lazy evaluation through generics is a simple way to keep TypeScript fast and predictable as the codebase grows.

Have you run into similar slowdowns in your project? What other strategies have worked for you when dealing with deep or wide types? Curious to hear how others are approaching this.
