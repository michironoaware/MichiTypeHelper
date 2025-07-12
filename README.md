# TypeHelper

Lightweight runtime type checking for JavaScript with full TypeScript
support and useful type inference for safer, clearer runtime code.

## Key Features
- **Runtime type checking** to improve code safety in JavaScript.
- **Full TypeScript support** with smart type inference for better type narrowing.
- **Built-in validation utilities** that simplify error handling and enforce correct types.
- **Environment agnostic**: works seamlessly in browsers, Node.js, Deno, and other JavaScript runtimes.
- **Lightweight and dependency-free**, ensuring minimal impact on your project.

## Installation
```shell
npm install michi-typehelper
```

## Usage


| Method Name | Description | Parameters | Returns / Throws |
|-------------|-------------|------------|------------------|
| `isNullable<T>(obj: T)` | Checks if a value is `null` or `undefined`. | `obj: T` — The value to check. | `true` if `obj` is `null` or `undefined`, otherwise `false`. |
| `isType<T extends TypeResolvable>(obj: unknown, type: T)` | Checks whether a value is of the specified type. | `obj: unknown` — Value to check. `type: T` — Type to check against. | `true` if `obj` matches the type, otherwise `false`. |
| `isAnyType<T1, T2, T3>(obj: unknown, type1: T1, type2: T2, type3?: T3)` | Checks if value matches *any* of the specified types. | `obj: unknown` `type1: T1`, `type2: T2`, `type3?: T3` | `true` if matches at least one type, otherwise `false`. |
| `isTypeArray<T>(object: unknown, type: T)` | Checks if value is an array where every item matches the specified type. | `object: unknown` `type: T` | `true` if array of specified type, otherwise `false`. |
| `throwIf(condition: boolean, message: string)` | Throws a `TypeError` if the condition is `true`. | `condition: boolean` `message: string` | Throws `TypeError` if `condition` is `true`. |
| `throwIfNullable<T>(obj: T)` | Throws if the object is `null` or `undefined`. | `obj: T` | Throws `TypeError` if `obj` is `null` or `undefined`. |
| `throwIfNotNullable<T>(obj: T)` | Throws if the object is *not* `null` or `undefined`. | `obj: T` | Throws `TypeError` if `obj` is neither `null` nor `undefined`. |
| `throwIfUndefined<T>(obj: T)` | Throws if the object is `undefined`. | `obj: T` | Throws `TypeError` if `obj` is `undefined`. |
| `throwIfType<TObject, TType>(object: TObject, type: TType)` | Throws if the object *is* of the specified type. | `object: TObject` `type: TType` | Throws `TypeError` if `object` is instance of `type`. |
| `throwIfNotType<T>(object: unknown, type: T)` | Throws if the object is *not* of the specified type. | `object: unknown` `type: T` | Throws `TypeError` if `object` is not of the given type. |
| `throwIfNotAnyType<T1, T2, T3>(obj: unknown, type1: T1, type2: T2, type3?: T3)` | Throws if object does not match any of the specified types. | `obj: unknown` `type1: T1`, `type2: T2`, `type3?: T3` | Throws `TypeError` if `obj` does not match any types. |
| `throwIfNotTypeArray<T>(obj: unknown, type: T)` | Throws if object is not an array or any item is not of the specified type. | `obj: unknown` `type: T` | Throws `TypeError` if not an array or if any item is not of expected type. |

### Type Checking
Use the TypeHelper.isType and related functions to verify the type of values at runtime.

### Type Guarding
Use assertion functions to ensure values meet expected types at runtime.
Multiple assertion functions are available to cover different type-checking scenarios.

```ts
import { TypeHelper } from "michi-typehelper";

function greet(name: unknown) {
	TypeHelper.throwIfNotType(name, "string");
	console.log(`Hello, ${name.toUpperCase()}!`);
}
```
This function throws if name is not a string, guaranteeing safe usage afterwards.

## Supported Types
The TypeHelper library supports a variety of runtime type checks. Types you can use in checks fall into these categories:

### 1. "typeof" strings:

You can check for JavaScript primitive types using their typeof string values:

| Type String   | Matches Values of Type |
|---------------|------------------------|
| `"string"`    | `string`               |
| `"number"`    | `number`               |
| `"bigint"`    | `bigint`               |
| `"boolean"`   | `boolean`              |
| `"symbol"`    | `symbol`               |
| `"undefined"` | `undefined`            |
| `"object"`    | Any non-`null` object  |
| `"function"`  | Any function           |

```ts
TypeHelper.isType("Hello World!", "string"); // true
```

### 2. Special type strings

These special strings represent more complex or combined types:

| Type String  | Matches Values of Type                        |
|--------------|-----------------------------------------------|
| `"null"`     | Exactly `null`                                |
| `"nullable"` | Either `null` or `undefined`                  |
| `"array"`    | Any JavaScript array (`Array<unknown>`)       |
| `"iterable"` | Any object implementing the iterable protocol |

```ts
TypeHelper.isType(undefined, "nullable"); // true
TypeHelper.isType({ prop1: "a", prop2: "b" }, "iterable"); // true
```

### 3. Class constructors

You can pass a class constructor to check if an object is an instance of that class:

```ts
class Animal {}
class Dog extends Animal {}

const dog = new Dog();

TypeHelper.isType(dog, Dog); // true
TypeHelper.isType(dog, Animal); // true
```

Supports any constructor function (including built-in classes and user-defined classes).

### 4. Enum-like objects

You can pass an object with string or number values (like TypeScript enums) to check if a value is a member of that enum:

```ts
enum HttpStatus {
	OK = 200,
	NotFound = 404,
	InternalError = 500,
}

TypeHelper.isType(200, HttpStatus); // true
TypeHelper.isType(0, HttpStatus); // false
```

> \[!NOTE]
> The enum-like object check verifies if a value matches one of the enum’s defined members.
However, it does not support flag enums (bitwise combinations),
as it only checks for exact matches within the enum values.