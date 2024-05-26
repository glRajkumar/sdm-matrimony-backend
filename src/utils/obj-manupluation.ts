type FilterObject<T, K extends keyof T> = {
  [P in K]: T[P];
};

export function filterByKeys<T extends object, K extends keyof T>(obj: T, keys: K[]): FilterObject<T, K> {
  const result = {} as FilterObject<T, K>;

  keys.forEach((key) => {
    if (key in obj) {
      result[key] = obj[key];
    }
  });

  return result;
}