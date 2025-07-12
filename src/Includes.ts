/**
 * Checks whether a given value is included in an iterable.
 * Performs a strict equality check (`===`) against each element of the iterable.
 * @param obj - The value to search for.
 * @param iterable - The iterable to search within.
 * @returns `true` if the value is found in the iterable, otherwise `false`.
 * @example
 * Includes(2, [1, 2, 3]); // true
 * Includes("a", ["b", "c"]); // false
 */
export function Includes<T>(obj: T, iterable: Iterable<T>) {
	for (const value of iterable) {
		if (value === obj) return true;
	}

	return false;
}
