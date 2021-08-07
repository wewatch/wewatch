export type JsonPrimitive = string | number | boolean | null;
export type JsonMap = {
  [member: string]: JsonPrimitive | JsonArray | JsonMap;
};
export type JsonArray = Array<JsonPrimitive | JsonArray | JsonMap>;
export type Json = JsonPrimitive | JsonMap | JsonArray;

export const toCamel = (str: string): string =>
  str.replace(/([-_][a-z])/gi, ($1) =>
    $1.toUpperCase().replace("-", "").replace("_", ""),
  );

export const toSnake = (str: string): string =>
  str.replace(/\.?([A-Z])/g, (x, y) => `_${y.toLowerCase()}`).replace(/^_/, "");

export const isObject = (obj: Json): obj is JsonMap =>
  obj === Object(obj) && !Array.isArray(obj);

export const convert = (obj: Json, fn: (s: string) => string): Json => {
  if (isObject(obj)) {
    const n: { [key: string]: Json } = {};

    Object.keys(obj).forEach((k) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      n[fn(k)] = convert(obj[k]!, fn);
    });

    return n;
  }

  if (Array.isArray(obj)) {
    return obj.map((i) => convert(i, fn));
  }

  return obj;
};

export const snakeToCamel = (o: Json): Json => convert(o, toCamel);
export const camelToSnake = (o: Json): Json => convert(o, toSnake);

export const secondsToHHMMSS = (seconds: number): string => {
  const hh = Math.floor(seconds / 3600)
    .toString()
    .padStart(2, "0");
  const mm = Math.floor((seconds % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const ss = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");

  if (hh === "00") {
    return `${mm}:${ss}`;
  }

  return `${hh}:${mm}:${ss}`;
};
