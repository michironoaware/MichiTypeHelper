/**
 * Generator function that yields the values of a given object.
 * @param obj - An object whose values will be iterated over.
 * @yields The values of the object's own enumerable string-keyed properties.
 * @example
 * const myEnum = { A: 1, B: 2, C: 3 };
 * for (const value of SelectValues(myEnum)) {
 *   console.log(value); // 1, then 2, then 3
 * }
 */
export function* SelectValues<TValue>(obj: Record<string, TValue>) {
	for (const key in obj) {
		yield obj[key];
	}
}
