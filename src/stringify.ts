import flatten from "flat";

import { ParseSeperators } from "./types/XJSON";
import { SEPERATOR_SEGMENT, SEPERATOR_KEY_VALUE } from "./constants";

export function stringify(data: any, seperators?: ParseSeperators): string {
  if (!data) return "";

  const isTruthyArray = Array.isArray(data) && data.length;
  const isTruthyObject = typeof data === "object" && Object.keys(data).length;
  if (!isTruthyArray && !isTruthyObject) return "";

  const flatObject = flatten<any, any>(data);
  const { segment: segmentSeperator, keyValue: keyValueSeperator } = {
    segment: SEPERATOR_SEGMENT,
    keyValue: SEPERATOR_KEY_VALUE,
    ...seperators,
  };

  return Object.keys(flatObject)
    .map((key) => {
      let value = flatObject[key];
      if (value instanceof Date) value = value.toISOString();
      return [key, value].join(keyValueSeperator);
    })
    .join(segmentSeperator);
}
