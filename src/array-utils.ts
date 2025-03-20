import type { IntendedAny } from "./types";

export class ArrayUtils {
  static sortByDeterminedOrder<T extends object, R>(
    list: T[],
    callback: (value: T) => R,
    orderList: R[],
  ) {
    const right: T[] = [];
    const left = list
      .filter((a) => {
        if (!orderList.includes(callback(a))) {
          // When we don't have the item in the orderList, push
          // it to the right.
          right.push(a);
          return false;
        }
        return true;
      })
      .sort(
        (a, b) =>
          orderList.indexOf(callback(a)) - orderList.indexOf(callback(b)),
      );
    return [...left, ...right];
  }

  static mapReduce<T extends Record<string, IntendedAny>, R>(
    obj: T,
    callback: (
      value: T[keyof T],
      key: keyof T,
    ) => R | typeof this.SKIP_MAP_REDUCE,
  ): Record<keyof T, R> {
    return Object.entries(obj).reduce(
      (acc, [key, value]) => {
        const ret = callback(value as T[keyof T], key as keyof T);
        if (ret !== ArrayUtils.SKIP_MAP_REDUCE) {
          acc[key as keyof T] = ret;
        }
        return acc;
      },
      {} as unknown as Record<keyof T, R>,
    );
  }

  static readonly SKIP_MAP_REDUCE: unique symbol = Symbol("SKIP_MAP_REDUCE");
}
