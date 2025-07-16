import { SelectValues } from "./SelectValues";
import { Includes } from "./Includes";

const TypeErrorConstructor = TypeError;

/**
 * The {@link TypeHelper} namespace provides utility functions and type utilities for performing runtime type checks.
 */
export namespace TypeHelper {
	/**
	 * Checks if a value is `null` or `undefined`.
	 *
	 * @param obj - The value to check.
	 * @returns `true` if the value is `null` or `undefined`, otherwise `false`.
	 */
	export function isNullable<T>(obj: T): obj is Extract<T, null | undefined> {
		return obj === null || obj === undefined;
	}

	/**
	 * Checks whether a value is of the specified type.
	 * @param obj - The value to check.
	 * @param type - The type to check against.
	 * @returns `true` if the value matches the given type, otherwise `false`.
	 */
	export function isType<T extends TypeResolvable>(obj: unknown, type: T): obj is ResolvedType<T> {
		if (typeof type === "string") {
			return (
				// Check whether typeof of the object is the same as the type string.
				typeof obj === type ||
				// Check if object is null for type "null"
				(type === "null" && obj === null) ||
				// Check if object is either null or undefined for type "nullable"
				(type === "nullable" && isNullable(obj)) ||
				// Check if object is iterable for type "iterable"
				(type === "iterable" && !isNullable((obj as any)[Symbol.iterator])) ||
				// Check if object is array for type "array"
				(type === "array" && Array.isArray(obj))
			);
		}

		return (
			// Check if the object is an instance of the specified class
			(typeof type === "function" && obj instanceof type) ||
			// For checking whether a numeric value is defined in the enum's members
			// does not work for flag enums
			(typeof type === "object" && Includes(obj, SelectValues(type as any)))
		);
	}

	/**
	 * Checks whether a value matches *any* of the specified types.
	 * @param obj - The value to check.
	 * @param type1 - The first type to check against.
	 * @param type2 - The second type to check against.
	 * @param type3 - A third type to check against.
	 * @returns `true` if the value matches at least one of the types, otherwise `false`.
	 */
	export function isAnyType<T1 extends TypeResolvable, T2 extends TypeResolvable, T3 extends TypeResolvable>(
		obj: unknown,
		type1: T1,
		type2: T2,
		type3?: T3,
	): obj is ResolvedType<T1> | ResolvedType<T2> | ResolvedType<T3> {
		return isType(obj, type1) || isType(obj, type2) || (!isNullable(type3) && isType(obj, type3));
	}

	/**
	 * Checks whether a value is an array and every item in it matches the specified type.
	 * @param object - The value to check.
	 * @param type - The type each item in the array should match.
	 * @returns `true` if the value is an array of the specified type, otherwise `false`.
	 */
	export function isTypeArray<T extends TypeResolvable>(object: unknown, type: T): object is ResolvedType<T>[] {
		if (!isType(object, "array")) {
			return false;
		}

		for (const item of object) {
			if (!isType(item, type)) {
				return false;
			}
		}

		return true;
	}

	/**
	 * Throws a {@link TypeErrorConstructor} if the given condition is `true`.
	 * @param condition - The condition to check.
	 * @param message - The error message to throw with.
	 * @throws {TypeErrorConstructor} If the condition is `true`.
	 */
	export function throwIf(condition: boolean, message: string): asserts condition is false {
		if (condition) {
			throw new TypeErrorConstructor(message);
		}
	}

	/**
	 * Throws a {@link TypeErrorConstructor} if the given object is `null` or `undefined`.
	 * @param obj - The object to check.
	 * @throws {TypeErrorConstructor} If the object is `null` or `undefined`.
	 */
	export function throwIfNullable<T>(obj: T): asserts obj is NonNullable<T> {
		if (isNullable(obj)) {
			throw new TypeErrorConstructor("Object is null or undefined.");
		}
	}

	/**
	 * Throws a {@link TypeErrorConstructor} if the given object is *not* `null` or `undefined`.
	 * @param obj - The object to check.
	 * @throws {TypeErrorConstructor} If the object is neither `null` nor `undefined`.
	 */
	export function throwIfNotNullable<T>(obj: T): asserts obj is Extract<T, null | undefined> {
		if (!isNullable(obj)) {
			throw new TypeErrorConstructor("Object is neither null nor undefined.");
		}
	}

	/**
	 * Throws a {@link TypeErrorConstructor} if the given object is `undefined`.
	 * @param obj - The object to check.
	 * @throws {TypeErrorConstructor} If the object is `undefined`.
	 */
	export function throwIfUndefined<T>(obj: T): asserts obj is Extract<T, undefined> {
		if (obj === undefined) {
			throw new TypeErrorConstructor("Object is undefined.");
		}
	}

	/**
	 * Throws a {@link TypeErrorConstructor} if the object is of the specified type.
	 * @param object - The object to check.
	 * @param type - The type to check against.
	 * @throws {TypeErrorConstructor} If the object is of the specified type.
	 */
	export function throwIfType<TObject, TType extends TypeResolvable>(
		object: TObject,
		type: TType,
	): asserts object is Exclude<TObject, ResolvedType<TType>> {
		if (isType(object, type)) {
			throw new TypeErrorConstructor("Object cannot be an instance of the specified type.");
		}
	}

	/**
	 * Throws a {@link TypeErrorConstructor} if the object is not of the specified type.
	 * @param object - The object to check.
	 * @param type - The type to check against.
	 * @throws {TypeErrorConstructor} If the object is not of the specified type.
	 */
	export function throwIfNotType<T extends TypeResolvable>(
		object: unknown,
		type: T,
	): asserts object is ResolvedType<T> {
		if (!isType(object, type)) {
			throw new TypeErrorConstructor("Object is not an instance of the type expected.");
		}
	}

	/**
	 * Throws a {@link TypeErrorConstructor} if the object does not match any of the specified types.
	 * @param obj - The object to check.
	 * @param type1 - The first type to check against.
	 * @param type2 - The second type to check against.
	 * @param type3 - A third type to check against.
	 * @throws {TypeErrorConstructor} If the object does not match any of the types.
	 */
	export function throwIfNotAnyType<T1 extends TypeResolvable, T2 extends TypeResolvable, T3 extends TypeResolvable>(
		obj: unknown,
		type1: T1,
		type2: T2,
		type3?: T3,
	): asserts obj is ResolvedType<T1> | ResolvedType<T2> | ResolvedType<T3> {
		if (!isAnyType(obj, type1, type2, type3)) {
			throw new TypeErrorConstructor("Object is not an instance of the type expected.");
		}
	}

	/**
	 * Throws a {@link TypeErrorConstructor} if the object is not an array or if any item in the array
	 * is not of the specified type.
	 * @param obj - The object to check.
	 * @param type - The expected type of array items.
	 * @throws {TypeErrorConstructor} If the object is not an array or items are of an unexpected type.
	 */
	export function throwIfNotTypeArray<T extends TypeResolvable>(
		obj: unknown,
		type: T,
	): asserts obj is ResolvedType<T>[] {
		if (!isTypeArray(obj, type)) {
			throw new TypeErrorConstructor("Object is not an array or an item is of an unexpected type.");
		}
	}

	/**
	 * Represents a set of types that can be resolved and checked at runtime.
	 *
	 * This union type supports:
	 *
	 * - **Primitive type names**: JavaScript primitive types as strings.
	 *   - `"string"`: Matches values of type `string`
	 *   - `"number"`: Matches values of type `number`
	 *   - `"bigint"`: Matches values of type `bigint`
	 *   - `"boolean"`: Matches values of type `boolean`
	 *   - `"symbol"`: Matches values of type `symbol`
	 *   - `"undefined"`: Matches `undefined`
	 *   - `"object"`: Matches any non-null object
	 *   - `"function"`: Matches any function
	 *
	 * - **Special type names**:
	 *   - `"null"`: Matches exactly `null`
	 *   - `"nullable"`: Matches `null | undefined`
	 *   - `"array"`: Matches `Array<unknown>`
	 *   - `"iterable"`: Matches any object implementing the iterable protocol (e.g., arrays, sets, generators)
	 *
	 * - **Constructors (classes)**:
	 *   - Any class constructor (e.g., `Date`, `MyClass`) can be used to match against instances of that class.
	 *
	 * - **Enum-like objects**:
	 *   - An object with `string` or `number` values, e.g., a TypeScript enum. The resolved type will be the union of its values.
	 */
	// @formatter:off
	// prettier-ignore
	export type TypeResolvable =
		| "string"
		| "number"
		| "bigint"
		| "boolean"
		| "symbol"
		| "undefined"
		| "object"
		| "function"
		| "null"
		| "iterable"
		| "array"
		| "nullable"
		| (abstract new (...args: any[]) => any)
		| Record<string, string | number>;
	// @formatter:on

	/**
	 * Resolves a `TypeResolvable` into the actual TypeScript type it represents.
	 *
	 * Examples:
	 * - `"string"` → `string`
	 * - `"array"` → `readonly unknown[]`
	 * - `"nullable"` → `null | undefined`
	 * - `MyClass` → `MyClass`
	 * - `{ A: 1, B: 2 }` (TS enum) → `1 | 2`
	 *
	 * @typeParam T - The `TypeResolvable` to resolve.
	 */
	// @formatter:off
	// prettier-ignore
	export type ResolvedType<T> =
		T extends "string" ? string
		: T extends "number" ? number
		: T extends "bigint" ? bigint
		: T extends "boolean" ? boolean
		: T extends "symbol" ? symbol
		: T extends "undefined" ? undefined
		: T extends "object" ? object
		: T extends "function" ? Function
		: T extends "null" ? null
		: T extends "iterable" ? Iterable<unknown>
		: T extends "array" ? readonly unknown[]
		: T extends "nullable" ? null | undefined
		: T extends abstract new (...args: any[]) => infer R ? R
		: T extends Record<string, string | number> ? T[keyof T]
		: never;
	// @formatter:on
}
